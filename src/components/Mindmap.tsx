import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface MindmapData {
  name: string;
  color?: string;
  children?: MindmapData[];
}

interface MindmapProps {
  data: MindmapData;
  width?: number;
  height?: number;
}

type NodeWithToggle = d3.HierarchyPointNode<MindmapData> & {
  _children?: d3.HierarchyPointNode<MindmapData>[];
};

export function Mindmap({ data, width = 700, height = 500 }: MindmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(data) as NodeWithToggle;

    // Store initial children for toggle
    root.descendants().forEach((d) => {
      const node = d as NodeWithToggle;
      node._children = node.children as NodeWithToggle[] | undefined;
    });

    const treeLayout = d3.tree<MindmapData>().size([innerHeight, innerWidth]);

    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      red: { bg: "#fee2e2", border: "#f87171", text: "#991b1b" },
      orange: { bg: "#ffedd5", border: "#fb923c", text: "#9a3412" },
      blue: { bg: "#dbeafe", border: "#60a5fa", text: "#1e40af" },
      green: { bg: "#d1fae5", border: "#34d399", text: "#065f46" },
      purple: { bg: "#f3e8ff", border: "#a78bfa", text: "#6b21a8" },
      teal: { bg: "#ccfbf1", border: "#2dd4bf", text: "#115e59" },
      indigo: { bg: "#e0e7ff", border: "#818cf8", text: "#3730a3" },
    };

    const defaultColor = { bg: "#e0e7ff", border: "#818cf8", text: "#3730a3" };

    function getColor(d: d3.HierarchyPointNode<MindmapData> | undefined) {
      if (!d) return defaultColor;
      const color = d.data.color || "indigo";
      return colorMap[color] || defaultColor;
    }

    function update(source: d3.HierarchyPointNode<MindmapData>) {
      const duration = 400;
      const treeData = treeLayout(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      // Normalize depth
      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });

      // Nodes
      const node = g
        .selectAll<SVGGElement, d3.HierarchyPointNode<MindmapData>>("g.node")
        .data(nodes, (d) => d.data.name);

      // Enter nodes
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", `translate(${source.y},${source.x})`)
        .style("cursor", (d) => {
          const node = d as NodeWithToggle;
          return node.children || node._children ? "pointer" : "default";
        })
        .on("click", (_event, d) => {
          const node = d as NodeWithToggle;
          if (node.children) {
            node._children = node.children as NodeWithToggle[];
            node.children = undefined;
          } else if (node._children) {
            node.children = node._children;
            node._children = undefined;
          }
          update(d);
        });

      // Node rectangles
      nodeEnter
        .append("rect")
        .attr("rx", (d) => (d.depth === 0 ? 25 : 8))
        .attr("ry", (d) => (d.depth === 0 ? 25 : 8))
        .attr("x", (d) => -(d.depth === 0 ? 60 : 50))
        .attr("y", -18)
        .attr("width", (d) => (d.depth === 0 ? 120 : 100))
        .attr("height", 36)
        .attr("fill", (d) => getColor(d).bg)
        .attr("stroke", (d) => getColor(d).border)
        .attr("stroke-width", 2)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

      // Node text
      nodeEnter
        .append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .attr("fill", (d) => getColor(d).text)
        .style("font-size", (d) => (d.depth === 0 ? "14px" : "12px"))
        .style("font-weight", (d) => (d.depth === 0 ? "bold" : "600"))
        .text((d) => d.data.name);

      // Expand/collapse indicator
      nodeEnter
        .filter((d) => {
          const node = d as NodeWithToggle;
          return Boolean(node.children || node._children);
        })
        .append("circle")
        .attr("class", "toggle-indicator")
        .attr("cx", (d) => (d.depth === 0 ? 60 : 50) + 8)
        .attr("cy", 0)
        .attr("r", 8)
        .attr("fill", (d) => getColor(d).border)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      nodeEnter
        .filter((d) => {
          const node = d as NodeWithToggle;
          return Boolean(node.children || node._children);
        })
        .append("text")
        .attr("class", "toggle-text")
        .attr("x", (d) => (d.depth === 0 ? 60 : 50) + 8)
        .attr("y", 4)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text((d) => (d.children ? "−" : "+"));

      // Update
      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select(".toggle-text")
        .text((d) => ((d as NodeWithToggle).children ? "−" : "+"));

      // Exit
      node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", `translate(${source.y},${source.x})`)
        .remove();

      // Links
      const link = g
        .selectAll<SVGPathElement, d3.HierarchyPointLink<MindmapData>>("path.link")
        .data(links, (d) => d.target.data.name);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 2)
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o } as d3.HierarchyPointLink<MindmapData>);
        });

      linkEnter
        .merge(link)
        .transition()
        .duration(duration)
        .attr("d", diagonal);

      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o } as d3.HierarchyPointLink<MindmapData>);
        })
        .remove();
    }

    function diagonal(d: d3.HierarchyPointLink<MindmapData>) {
      return `M${d.source.y},${d.source.x}
              C${(d.source.y + d.target.y) / 2},${d.source.x}
               ${(d.source.y + d.target.y) / 2},${d.target.x}
               ${d.target.y},${d.target.x}`;
    }

    // Initial render
    const treeData = treeLayout(root);
    update(treeData);
  }, [data, width, height]);

  return (
    <div className="mindmap-d3-container">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
