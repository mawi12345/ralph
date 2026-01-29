import type { ReactNode } from "react";
import { AutoSizedText } from "./AutoSizedText.tsx";

export function Flashcard({
  front,
  children,
}: {
  front: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flashcard">
      <div className="flashcard-front a8">
        <div className="flashcard-content">
          <AutoSizedText>{front}</AutoSizedText>
        </div>
      </div>
      <div className="flashcard-back a8">
        <div className="flashcard-content">
          <AutoSizedText>{children}</AutoSizedText>
        </div>
      </div>
    </div>
  );
}
