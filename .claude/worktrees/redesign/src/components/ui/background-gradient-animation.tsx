import * as React from "react";

import { cn } from "@/lib/utils";

// Five soft colour fields drifting on long, out-of-phase loops, fused by an
// SVG goo filter, plus one field that trails the pointer. Every colour is an
// "r, g, b" string so it can be dropped straight into rgba().

export interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  /** Diameter of each colour field, any CSS length. @default "80%" */
  size?: string;
  blendingValue?: React.CSSProperties["mixBlendMode"];
  /** A field follows the pointer. @default true */
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  interactive = true,
  children,
  className,
  containerClassName,
}: BackgroundGradientAnimationProps) {
  const pointerRef = React.useRef<HTMLDivElement>(null);
  // Safari renders the url() goo filter as a hard edge, so it gets plain blur.
  const [isSafari] = React.useState(
    () =>
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  );
  // Touch screens skip the goo + 40px blur pass, which re-rasterises the whole
  // screen every frame. Wider, softer gradients give the same blurred look for
  // a fraction of the GPU time, and there is no pointer to follow.
  const [lite] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const follow = interactive && !lite;

  React.useEffect(() => {
    if (!follow) return;
    const el = pointerRef.current;
    if (!el) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, frame = 0;
    // Eases toward the pointer instead of snapping, so the field feels heavy.
    const tick = () => {
      cx += (tx - cx) / 20;
      cy += (ty - cy) / 20;
      el.style.transform = `translate(${Math.round(cx)}px, ${Math.round(cy)}px)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5)
        frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const onMove = (event: PointerEvent) => {
      const box = el.parentElement!.getBoundingClientRect();
      tx = event.clientX - box.left;
      ty = event.clientY - box.top;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [follow]);

  const field = (color: string) =>
    lite
      ? `radial-gradient(circle at center, rgba(${color}, 0.75) 0, rgba(${color}, 0.38) 26%, rgba(${color}, 0.1) 46%, rgba(${color}, 0) 62%) no-repeat`
      : `radial-gradient(circle at center, rgba(${color}, 0.8) 0, rgba(${color}, 0) 50%) no-repeat`;
  const placed = {
    width: size,
    height: size,
    top: `calc(50% - ${size} / 2)`,
    left: `calc(50% - ${size} / 2)`,
    mixBlendMode: blendingValue,
  } satisfies React.CSSProperties;

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{
        background: `linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
      }}
    >
      <svg aria-hidden className="hidden">
        <defs>
          <filter id="bga-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn(className)}>{children}</div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full",
          lite ? "" : isSafari ? "blur-2xl" : "[filter:url(#bga-goo)_blur(40px)]",
        )}
      >
        <div
          className="animate-first absolute origin-center opacity-100"
          style={{ ...placed, background: field(firstColor) }}
        />
        <div
          className="animate-second absolute origin-[calc(50%-400px)] opacity-100"
          style={{ ...placed, background: field(secondColor) }}
        />
        <div
          className="animate-third absolute origin-[calc(50%+400px)] opacity-100"
          style={{ ...placed, background: field(thirdColor) }}
        />
        <div
          className="animate-fourth absolute origin-[calc(50%-200px)] opacity-70"
          style={{ ...placed, background: field(fourthColor) }}
        />
        <div
          className="animate-fifth absolute origin-[calc(50%-800px)_calc(50%+800px)] opacity-100"
          style={{
            ...placed,
            width: `calc(${size} * 2)`,
            height: `calc(${size} * 2)`,
            top: `calc(50% - ${size})`,
            left: `calc(50% - ${size})`,
            background: field(fifthColor),
          }}
        />
        {follow ? (
          <div
            ref={pointerRef}
            className="absolute -top-1/2 -left-1/2 h-full w-full opacity-70"
            style={{
              background: field(pointerColor),
              mixBlendMode: blendingValue,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default BackgroundGradientAnimation;
