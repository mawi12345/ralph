import type { ReactNode } from "react";

export function Points({ children }: { children?: ReactNode }) {
  return <div className="points">{children}</div>;
}
