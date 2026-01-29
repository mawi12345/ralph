import { useContext, useLayoutEffect, useRef, type JSX } from "react";
import { RouteContext } from "../RouteContext.ts";

function createHeading(level: number) {
  return function Heading({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const route = useContext(RouteContext);

    useLayoutEffect(() => {
      if (ref.current) {
        const content = ref.current.textContent
          .trim()
          .replace(/[\d\.]+/g, "")
          .trim();
        const span = ref.current.getElementsByTagName("span").item(0);
        if (span) {
          span.classList.add(`cursor-copy`);
          span.addEventListener("click", () => {
            navigator.clipboard.writeText(
              `Seite ${route.name}.mdx Überschrift "${content}"`,
            );
          });
        }
      }
    }, []);

    if (level === 1) {
      return <h1 ref={ref}>{children}</h1>;
    }
    if (level === 2) {
      return <h2 ref={ref}>{children}</h2>;
    }
    if (level === 3) {
      return <h3 ref={ref}>{children}</h3>;
    }
    if (level === 4) {
      return <h4 ref={ref}>{children}</h4>;
    }
    if (level === 5) {
      return <h5 ref={ref}>{children}</h5>;
    }
    if (level === 6) {
      return <h6 ref={ref}>{children}</h6>;
    }
  };
}

export const h1 = createHeading(1);
export const h2 = createHeading(2);
export const h3 = createHeading(3);
export const h4 = createHeading(4);
export const h5 = createHeading(5);
export const h6 = createHeading(6);

export const headings = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
};
