import type { ReactNode } from "react";

interface MindmapNodeProps {
  label: ReactNode;
  children?: ReactNode;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "teal";
  defaultOpen?: boolean;
}

export function MindmapNode({
  label,
  children,
  color = "blue",
  defaultOpen = false,
}: MindmapNodeProps) {
  const colorClasses = {
    blue: "mindmap-node-blue",
    green: "mindmap-node-green",
    orange: "mindmap-node-orange",
    purple: "mindmap-node-purple",
    red: "mindmap-node-red",
    teal: "mindmap-node-teal",
  };

  if (!children) {
    return (
      <div className={`mindmap-leaf ${colorClasses[color]}`}>
        <span className="mindmap-leaf-label">{label}</span>
      </div>
    );
  }

  return (
    <details className={`mindmap-node ${colorClasses[color]}`} open={defaultOpen}>
      <summary className="mindmap-summary">{label}</summary>
      <div className="mindmap-children">{children}</div>
    </details>
  );
}

interface MindmapProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function Mindmap({ title, children, defaultOpen = true }: MindmapProps) {
  return (
    <div className="mindmap-container">
      <details className="mindmap-root" open={defaultOpen}>
        <summary className="mindmap-root-title">{title}</summary>
        <div className="mindmap-content">{children}</div>
      </details>
    </div>
  );
}
