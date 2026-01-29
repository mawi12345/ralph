import { useLayoutEffect, useRef } from "react";

type ElSize = {
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
};

const isOverflown = (el: ElSize) =>
  el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;

const resizeText = (
  el: HTMLElement,
  minSize = 10,
  maxSize = 512,
  step = 1,
  unit = "px",
) => {
  let i = minSize;
  let overflow = false;

  const parent = el.parentNode as HTMLElement | null;
  if (parent) {
    while (!overflow && i < maxSize) {
      el.style.fontSize = `${i}${unit}`;
      overflow = isOverflown(parent);

      if (!overflow) i += step;
    }

    // revert to last state where no overflow happened
    el.style.fontSize = `${i - step}${unit}`;
  }
};

interface Props {
  children: React.ReactNode;
}

export function AutoSizedText({ children }: Props) {
  const childRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const childElement = childRef.current; // This is `SizedChild`
    const parentElement = childRef.current?.parentElement; // This is the parent of `AutoSizedText`

    if (!childElement || !parentElement) {
      return undefined;
    }

    resizeText(childElement);

    const observer = new ResizeObserver((entries) => {
      resizeText(childElement);
    });

    observer.observe(parentElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="inline-block" ref={childRef}>
      {children}
    </div>
  );
}
