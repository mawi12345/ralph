import type { ReactNode } from "react";

export function Points({ children }: { children?: ReactNode }) {
  return <span className="points">{children}</span>;
}
