import * as React from "react";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Runs `frame` on every animation frame while `ref` is on or near screen, so
    scroll-linked effects can ease toward their targets (a GSAP-style scrub)
    without a listener running for the whole page. */
export function useScrub<T extends Element>(
  frame: (el: T, vh: number) => void,
) {
  const ref = React.useRef<T>(null);
  const cb = React.useRef(frame);
  React.useLayoutEffect(() => {
    cb.current = frame;
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      cb.current(el, window.innerHeight);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
