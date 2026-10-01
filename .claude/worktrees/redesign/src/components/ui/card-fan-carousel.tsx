import * as React from "react";

import { cn } from "@/lib/utils";

// Cards fanned on an arc like a hand of playing cards. The active card sits
// square and raised; the rest tilt away and drop with distance. On first view
// the deck springs open from a single stack. Hovering a card lifts it and
// nudges its neighbours apart. Arrows, dots, swipe and arrow keys page one card
// at a time, wrapping round.

export interface CardFanItem {
  image: string;
  title: string;
  meta?: string;
}

export interface CardFanCarouselProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: CardFanItem[];
  /** Card width / height. @default 1.414 (A-series landscape) */
  cardRatio?: number;
  /** Cards shown either side of the active one. @default 3 */
  reach?: number;
  /** Called when the already-active card is clicked. */
  onOpen?: (index: number) => void;
}

const SPREAD = 23; // % of a card width between neighbouring centres
const TILT = 9; // degrees per step from the centre
const DROP = 4.5; // % of a card height, grows with distance
const SHRINK = 0.05; // scale lost per step
const LIFT = 12; // % of a card height a hovered card rises
const PART = 16; // % of a card width neighbours step aside
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export function CardFanCarousel({
  items,
  cardRatio = 1.414,
  reach = 3,
  onOpen,
  className,
  ...props
}: CardFanCarouselProps) {
  const count = items.length;
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  // True only while the deck is springing open, so the stagger never slows
  // down hovering or paging.
  const [entering, setEntering] = React.useState(false);
  const rootRef = React.useRef<HTMLElement>(null);
  const swipe = React.useRef<number | null>(null);

  // Springs the deck open whenever it scrolls into view, and gathers it back
  // into a stack once it leaves, so every visit gets the entrance.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setOpen(entry.isIntersecting);
        setEntering(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!entering) return;
    const t = setTimeout(() => setEntering(false), 1000 + reach * 70);
    return () => clearTimeout(t);
  }, [entering, reach]);

  const go = (to: number) => setActive(((to % count) + count) % count);

  // Shortest signed distance round the ring, so the deck wraps both ways.
  const offset = (i: number) => {
    let o = i - active;
    if (o > count / 2) o -= count;
    if (o < -count / 2) o += count;
    return o;
  };

  const item = items[active];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      className={cn("relative w-full overflow-x-clip py-4 select-none", className)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(active + 1);
        else if (event.key === "ArrowLeft") go(active - 1);
        else return;
        event.preventDefault();
      }}
      {...props}
    >
      <div
        className="relative mx-auto w-[min(74vw,24rem,80svh)] touch-pan-y"
        style={{ aspectRatio: cardRatio }}
        onPointerDown={(event) => (swipe.current = event.clientX)}
        onPointerUp={(event) => {
          if (swipe.current === null) return;
          const dx = event.clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {items.map((card, i) => {
          const o = offset(i);
          const d = Math.abs(o);
          const shown = d <= reach;
          // A hovered card rises; the cards either side step away from it,
          // the nearest ones furthest.
          const h = hovered === null ? null : offset(hovered);
          const part =
            h === null || o === h
              ? 0
              : (Math.sign(o - h) * PART) / (1 + 0.35 * (Math.abs(o - h) - 1));
          const lift = h === o ? -LIFT : 0;
          const grow = (d === 0 ? 1.06 : 1 - d * SHRINK) + (h === o ? 0.04 : 0);
          const transform = open
            ? `translate(${o * SPREAD + part}%, ${Math.pow(d, 1.6) * DROP + lift}%) rotate(${o * TILT}deg) scale(${grow})`
            : `translate(0, 22%) rotate(${o * 1.5}deg) scale(0.8)`;
          return (
            <button
              key={card.image}
              type="button"
              tabIndex={o === 0 ? 0 : -1}
              aria-label={
                o === 0 ? `Open ${card.title}` : `Show ${card.title}`
              }
              aria-hidden={!shown}
              onClick={() => (o === 0 ? onOpen?.(i) : go(i))}
              // Mouse only: a tap would otherwise leave a card stuck raised.
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className={cn(
                "absolute inset-0 origin-bottom overflow-hidden rounded-2xl bg-white shadow-[0_28px_50px_-18px_rgb(10_8_6/0.75)] ring-1 ring-white/15 outline-none",
                "focus-visible:ring-accent focus-visible:ring-2",
                o === 0 ? "cursor-zoom-in" : "cursor-pointer",
              )}
              style={{
                transform,
                zIndex: count - d,
                opacity: shown ? 1 : 0,
                pointerEvents: shown ? "auto" : "none",
                transition: `transform ${open ? 1000 : 500}ms ${open ? SPRING : "ease-in"}, opacity 400ms ease`,
                transitionDelay: entering ? `${d * 70}ms` : "0ms",
              }}
            >
              <img
                src={card.image}
                alt=""
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>

      <div className="mt-[clamp(5rem,13vw,9rem)] flex flex-col items-center gap-5 text-center">
        <div aria-live="polite" className="min-h-[3.5rem]">
          <p className="text-foreground text-lg font-medium tracking-tight">
            {item?.title}
          </p>
          {item?.meta ? (
            <p className="text-muted-foreground mt-1 text-sm">{item.meta}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous certificate"
            onClick={() => go(active - 1)}
            className="border-border hover:bg-foreground/10 grid size-11 place-items-center rounded-full border transition-colors active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="flex items-center">
            {items.map((card, i) => (
              <button
                key={card.image}
                type="button"
                aria-label={`Go to ${card.title}`}
                aria-current={i === active}
                onClick={() => go(i)}
                className="grid h-11 w-5 place-items-center min-[360px]:w-6"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-500",
                    i === active ? "bg-accent w-4" : "bg-foreground/30 w-1.5",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next certificate"
            onClick={() => go(active + 1)}
            className="border-border hover:bg-foreground/10 grid size-11 place-items-center rounded-full border transition-colors active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default CardFanCarousel;
