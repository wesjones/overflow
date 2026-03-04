import { useEffect, useRef, type RefObject } from "react";

export function useResizer(
  ref: RefObject<HTMLElement | null>,
  onResize: (maxWidth: number, currentWidth: number) => void
) {
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observe = () => {
      callbackRef.current(element.scrollWidth, element.clientWidth);
    };
    const observer = new ResizeObserver(observe);

    observer.observe(element);
    observe(); // Trigger initial measurement

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}