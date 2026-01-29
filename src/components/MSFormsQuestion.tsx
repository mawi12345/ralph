import type { ReactNode } from "react";

export function MSFormsQuestion({ children }: { children?: ReactNode }) {
  return (
    <div className="ms-forms-question">
      {children}
      <p>ANSWER: A</p>
    </div>
  );
}
