import type { ReactNode } from "react";

interface MindmapBranchProps {
  label: ReactNode;
  children?: ReactNode;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "teal";
}

export function MindmapBranch({
  label,
  children,
  color = "blue",
}: MindmapBranchProps) {
  return (
    <div className={`mindmap-branch mindmap-color-${color}`}>
      <div className="mindmap-branch-label">{label}</div>
      {children && <div className="mindmap-branch-children">{children}</div>}
    </div>
  );
}

interface MindmapNodeProps {
  label: ReactNode;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "teal";
}

export function MindmapNode({ label, color = "blue" }: MindmapNodeProps) {
  return (
    <div className={`mindmap-item mindmap-color-${color}`}>
      <span className="mindmap-item-label">{label}</span>
    </div>
  );
}

interface MindmapProps {
  title: ReactNode;
  children?: ReactNode;
}

export function Mindmap({ title, children }: MindmapProps) {
  return (
    <div className="mindmap-wrapper">
      <div className="mindmap-center">
        <div className="mindmap-center-node">{title}</div>
      </div>
      <div className="mindmap-branches">{children}</div>
    </div>
  );
}
