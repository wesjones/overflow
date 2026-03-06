import { useEffect, useRef, type RefObject } from "react";

export function useResizer(
  ref: RefObject<HTMLElement | null>,
  onResize: () => void
) {
  const callbackRef = useRef(onResize);
  useEffect(() => {
    callbackRef.current = onResize;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => callbackRef.current());
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
