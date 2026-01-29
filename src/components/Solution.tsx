import type { ReactNode } from "react";

export function Solution({ children }: { children?: ReactNode }) {
  return <span className="solution">{children}</span>;
}
