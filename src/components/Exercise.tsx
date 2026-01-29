import type { ReactNode } from "react";

export function Exercise({ children }: { children?: ReactNode }) {
  return <div className="exercise">{children}</div>;
}
