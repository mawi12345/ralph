import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin to automatically number headings similar to pandoc's --number-sections
 * Numbers headings hierarchically (e.g., 1, 1.1, 1.2, 2, 2.1, etc.)
 */
export default function rehypeNumberHeadings() {
  return (tree: Root) => {
    const counters = [0, 0, 0, 0, 0, 0]; // Counters for h1-h6

    visit(tree, 'element', (node: Element) => {
      // Check if the node is a heading (h1-h6)
      const match = node.tagName.match(/^h([1-6])$/);
      if (!match) return;

      const level = parseInt(match[1], 10);
      const index = level - 1;

      // Increment counter for current level
      counters[index]++;

      // Reset all deeper level counters
      for (let i = index + 1; i < counters.length; i++) {
        counters[i] = 0;
      }

      // Build the section number (e.g., "1.2.3")
      const sectionNumber = counters.slice(0, level)
        .filter(c => c > 0)
        .join('.');

      // Prepend the section number to the heading content
      if (node.children && node.children.length > 0) {
        // Add section number as a text node at the beginning
        node.children.unshift({
          type: 'element',
          tagName: 'span',
          properties: { className: ['section-number'] },
          children: [
            {
              type: 'text',
              value: `${sectionNumber} `
            }
          ]
        });
      }
    });
  };
}
