import * as React from "react";

/** Touch screens have no hover. On them, mark the element `data-active` while it
    crosses the middle band of the screen so hover-only effects still play as
    you scroll past. `onLight` fires each time it lights up. */
export function useTouchLight<T extends HTMLElement>(onLight?: (el: T) => void) {
  const ref = React.useRef<T>(null);
  const cb = React.useRef(onLight);
  React.useLayoutEffect(() => {
    cb.current = onLight;
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        el.toggleAttribute("data-active", e.isIntersecting);
        if (e.isIntersecting) cb.current?.(el);
      },
      { rootMargin: "-38% 0px -38% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
