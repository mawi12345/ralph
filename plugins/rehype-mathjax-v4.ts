/**
 * Custom rehype plugin for MathJax 4
 * Based on rehype-mathjax but updated for MathJax 4 API changes
 */
import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";
import type { Root, Element, ElementContent, Text } from "hast";

import { mathjax } from "@mathjax/src/js/mathjax.js";
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import { SVG } from "@mathjax/src/js/output/svg.js";

// Base packages - these are enough for most math content
// In MathJax 4, AllPackages was removed, so we specify packages manually
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js";
import "@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js";

interface LiteElement {
  kind: string;
  attributes: Record<string, string>;
  children: (LiteElement | LiteText)[];
}

interface LiteText {
  value: string;
}

interface MathJaxDocument {
  convert(value: string, options: { display: boolean }): LiteElement;
}

interface MathJaxHandler {
  // Handler instance
}

interface SVGOutput {
  styleSheet(document: MathJaxDocument): LiteElement;
}

// Convert MathJax's lite element to hast element
function fromLiteElement(liteElement: LiteElement): Element {
  const children: ElementContent[] = [];

  for (const node of liteElement.children) {
    if ("value" in node) {
      children.push({ type: "text", value: node.value } as Text);
    } else {
      children.push(fromLiteElement(node));
    }
  }

  return {
    type: "element",
    tagName: liteElement.kind,
    properties: { ...liteElement.attributes },
    children,
  };
}

// Get text content from a hast element
function toText(node: Element): string {
  let result = "";
  visit(
    { type: "root", children: [node] },
    "text",
    (textNode: { value: string }) => {
      result += textNode.value;
    }
  );
  return result;
}

export interface RehypeMathjaxOptions {
  tex?: {
    packages?: string[];
    [key: string]: unknown;
  };
}

/**
 * Rehype plugin to render math with MathJax 4 (SVG output)
 */
export default function rehypeMathjax(options: RehypeMathjaxOptions = {}) {
  // Default packages to use (base is always included)
  const packages = options.tex?.packages ?? [
    "base",
    "ams",
    "newcommand",
    "noundefined",
    "boldsymbol",
  ];

  const tex = new TeX({
    packages,
    ...options.tex,
  });

  const svg = new SVG({
    fontCache: "none",
  });

  const adaptor = liteAdaptor();
  const handler: MathJaxHandler = RegisterHTMLHandler(adaptor);

  const mjDocument: MathJaxDocument = mathjax.document("", {
    InputJax: tex,
    OutputJax: svg,
  });

  let styleSheet: Element | null = null;

  return (tree: Root) => {
    let hasMath = false;

    // Find and transform math elements
    visitParents(tree, "element", (node: Element, ancestors) => {
      const classes = Array.isArray(node.properties?.className)
        ? node.properties.className
        : [];

      if (!classes.includes("math") || !classes.includes("math-display") && !classes.includes("math-inline")) {
        // Check for language-math class (from remark-math)
        const isInlineMath = classes.includes("math-inline");
        const isDisplayMath = classes.includes("math-display");

        if (!isInlineMath && !isDisplayMath) {
          return;
        }
      }

      const isDisplay = classes.includes("math-display");
      const value = toText(node);

      if (!value) return;

      hasMath = true;

      try {
        const liteElement = mjDocument.convert(value, { display: isDisplay });
        const element = fromLiteElement(liteElement);

        // Replace the node content with the rendered math
        node.tagName = element.tagName;
        node.properties = element.properties;
        node.children = element.children;

        // Add display class for styling
        if (isDisplay) {
          node.properties.className = ["math-display-rendered"];
        } else {
          node.properties.className = ["math-inline-rendered"];
        }
      } catch (error) {
        // On error, keep the original content
        console.error("MathJax render error:", error);
      }
    });

    // Add stylesheet if there's math content
    if (hasMath && !styleSheet) {
      try {
        const liteStyleSheet = (svg as SVGOutput).styleSheet(mjDocument);
        styleSheet = fromLiteElement(liteStyleSheet);
        // Remove the id to avoid duplicates
        if (styleSheet.properties) {
          delete styleSheet.properties.id;
        }
      } catch {
        // Ignore stylesheet errors
      }
    }

    // Insert stylesheet at the beginning of the document
    if (styleSheet && hasMath) {
      const head = findHead(tree);
      if (head) {
        head.children.unshift(styleSheet);
      } else {
        // If no head, insert at the beginning of body or root
        tree.children.unshift(styleSheet);
      }
    }
  };
}

function findHead(tree: Root): Element | null {
  let head: Element | null = null;
  visit(tree, "element", (node: Element) => {
    if (node.tagName === "head") {
      head = node;
      return false; // Stop visiting
    }
  });
  return head;
}
