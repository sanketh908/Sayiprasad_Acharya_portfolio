import * as React from "react";

import { clamp01, prefersReducedMotion, useScrub } from "@/hooks/use-scrub";

export interface Step {
  stage: string;
  place: string;
  detail: string;
}

const SCRUB = 0.14; // how quickly the drawing catches up with the scroll
const backOut = (t: number) => {
  const s = 2;
  return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
};

// The line draws itself as you scroll. Each step's dot pops in, its text slides
// over from the left, and the dot turns into a check once the line has reached
// it. The last step is "now" and keeps a pulsing ring instead of a check.
export function EducationTimeline({ steps }: { steps: Step[] }) {
  const fill = React.useRef<HTMLSpanElement>(null);
  const items = React.useRef<(HTMLLIElement | null)[]>([]);
  const state = React.useRef({ line: 0, item: steps.map(() => 0) });

  const ref = useScrub<HTMLOListElement>((ol, vh) => {
    const still = prefersReducedMotion();
    const s = state.current;
    const r = ol.getBoundingClientRect();
    // Starts with the list's top at 70% of the screen, done when its bottom is at 60%.
    const line = clamp01((vh * 0.7 - r.top) / (r.height + vh * 0.1));
    s.line = still ? line : s.line + (line - s.line) * SCRUB;
    if (fill.current) fill.current.style.transform = `scaleY(${s.line.toFixed(4)})`;

    items.current.forEach((li, i) => {
      if (!li) return;
      const top = li.getBoundingClientRect().top;
      const want = clamp01((vh * 0.95 - top) / (vh * 0.33));
      const t = (s.item[i] = still ? want : s.item[i] + (want - s.item[i]) * SCRUB);
      const body = li.querySelector<HTMLElement>("[data-body]");
      const dot = li.querySelector<HTMLElement>("[data-dot]");
      if (body) {
        body.style.opacity = t.toFixed(3);
        body.style.transform = `translateX(${(-100 * (1 - t)).toFixed(1)}px)`;
      }
      if (dot) {
        dot.style.opacity = t.toFixed(3);
        dot.style.transform = `scale(${Math.max(0, backOut(t)).toFixed(3)})`;
      }
      li.toggleAttribute("data-lit", top < vh * 0.68);
    });
  });

  return (
    <ol ref={ref} className="relative pl-12">
      <span aria-hidden className="bg-border absolute top-3 bottom-3 left-[11px] w-0.5 rounded-full" />
      <span
        ref={fill}
        aria-hidden
        className="absolute top-3 bottom-3 left-[11px] w-0.5 origin-top rounded-full bg-gradient-to-b from-[#86a596] to-accent"
        style={{ transform: "scaleY(0)" }}
      />
      {steps.map((e, i) => {
        const now = i === steps.length - 1;
        return (
          <li
            key={e.stage}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="group/step relative pb-14 last:pb-0"
          >
            <span
              data-dot
              aria-hidden
              className={`border-border bg-background absolute top-0.5 -left-12 grid size-6 place-items-center rounded-full border-2 transition-colors duration-500 ${
                now
                  ? "group-data-[lit]/step:border-accent group-data-[lit]/step:shadow-[0_0_0_5px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
                  : "group-data-[lit]/step:border-[#86a596] group-data-[lit]/step:bg-[#86a596]"
              }`}
              style={{ opacity: 0 }}
            >
              {now ? (
                <span className="bg-accent size-2.5 scale-0 rounded-full transition-transform duration-500 group-data-[lit]/step:scale-100 motion-safe:group-data-[lit]/step:animate-pulse" />
              ) : (
                <svg viewBox="0 0 24 24" className="text-background size-3.5 opacity-0 transition-opacity duration-500 group-data-[lit]/step:opacity-100" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </span>
            <div data-body style={{ opacity: 0 }}>
              <p className={`font-mono text-xs tracking-[0.2em] uppercase ${now ? "text-accent" : "text-muted-foreground"}`}>
                {e.stage}
              </p>
              <p className="mt-2 text-[clamp(1.75rem,3.6vw,2.9rem)] leading-tight font-medium tracking-tight">{e.place}</p>
              <p className="text-muted-foreground mt-1">{e.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
