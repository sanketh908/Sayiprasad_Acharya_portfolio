import * as React from "react";

import { cn } from "@/lib/utils";
import { clamp01, prefersReducedMotion, useScrub } from "@/hooks/use-scrub";

// A paragraph whose words surface one after another as it scrolls through the
// screen: each starts faint, low and soft-focused, and settles into place.
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  const shown = React.useRef(-1);
  const eased = React.useRef(0);
  // Per-word blur is a filter layer per word; phones get the rise and fade only.
  const soft = React.useRef(
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches,
  );

  const ref = useScrub<HTMLParagraphElement>((p, vh) => {
    const r = p.getBoundingClientRect();
    const want = clamp01((vh * 0.88 - r.top) / (r.height + vh * 0.35));
    eased.current = prefersReducedMotion() ? 1 : eased.current + (want - eased.current) * 0.12;
    const at = eased.current * words.length;
    if (Math.abs(at - shown.current) < 0.01) return; // nothing moved, skip the writes
    shown.current = at;
    p.querySelectorAll<HTMLElement>("[data-w]").forEach((w, i) => {
      const a = clamp01(at - i);
      w.style.opacity = (0.12 + 0.88 * a).toFixed(3);
      w.style.transform = `translateY(${(0.35 * (1 - a)).toFixed(3)}em)`;
      if (soft.current) w.style.filter = a >= 1 ? "" : `blur(${(4 * (1 - a)).toFixed(2)}px)`;
    });
  });

  return (
    <p ref={ref} className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span data-w className="inline-block" style={{ opacity: 0.12 }}>
            {w}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
