import * as React from "react";

import { cn } from "@/lib/utils";
import { useTouchLight } from "@/hooks/use-touch-light";

// A pane of liquid glass holding a logo. On hover the logo lights up in its own
// colour and that light spreads out from the point of contact the way light
// runs through a drop of water: a soft bloom that swells to fill the pane, with
// a bright meniscus ring rippling ahead of it.

export interface LiquidGlassButtonProps
  extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.ReactNode;
  label: string;
  /** Any CSS colour; the light the pane gives off. */
  glow: string;
}

export function LiquidGlassButton({
  icon,
  label,
  glow,
  className,
  style,
  ...props
}: LiquidGlassButtonProps) {
  // Each entry restarts the ripple by remounting it.
  const [drop, setDrop] = React.useState(0);
  // On touch the light starts from the centre as the pane crosses mid-screen.
  const ref = useTouchLight<HTMLDivElement>((el) => {
    el.style.setProperty("--x", "50%");
    el.style.setProperty("--y", "50%");
    setDrop((d) => d + 1);
  });

  const place = (event: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - box.left}px`);
    el.style.setProperty("--y", `${event.clientY - box.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerEnter={(event) => {
        place(event);
        setDrop((d) => d + 1);
      }}
      onPointerMove={place}
      className={cn(
        "group/glass relative isolate flex items-center gap-3 overflow-hidden rounded-2xl px-5 py-3.5",
        // The glass: frosted, faintly tinted, lit along its top edge and
        // shadowed along its bottom like a thick lens.
        "border border-white/15 bg-white/[0.06] backdrop-blur-xl backdrop-saturate-150",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.28),inset_0_-1px_0_rgb(0_0_0/0.25),inset_0_0_18px_rgb(255_255_255/0.05),0_10px_30px_-12px_rgb(0_0_0/0.6)]",
        "transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "lit:-translate-y-0.5 lit:border-[color-mix(in_oklab,var(--glow)_55%,white_10%)]",
        "lit:shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-1px_0_rgb(0_0_0/0.25),0_0_28px_-6px_var(--glow),0_14px_34px_-14px_rgb(0_0_0/0.7)]",
        className,
      )}
      style={{ "--glow": glow, "--x": "50%", "--y": "50%", ...style } as React.CSSProperties}
      {...props}
    >
      {/* The bloom: grows from the contact point until it fills the pane. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-[var(--y)] left-[var(--x)] -z-10 size-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full opacity-0 transition-[scale,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-lit/glass:scale-100 group-lit/glass:opacity-100"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--glow) 55%, transparent) 0%, color-mix(in oklab, var(--glow) 18%, transparent) 30%, transparent 60%)",
        }}
      />
      {/* The meniscus: one bright ring running out ahead of the bloom. */}
      {drop ? (
        <span
          key={drop}
          aria-hidden
          className="pointer-events-none absolute top-[var(--y)] left-[var(--x)] -z-10 size-[220%] rounded-full motion-safe:animate-[glass-ripple_1100ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
          style={{
            boxShadow:
              "inset 0 0 0 1.5px color-mix(in oklab, var(--glow) 80%, white), inset 0 0 22px color-mix(in oklab, var(--glow) 45%, transparent)",
          }}
        />
      ) : null}
      {/* Specular highlight riding the top of the glass. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.09] via-transparent to-white/[0.03]"
      />

      <span
        className="grid size-7 shrink-0 place-items-center text-foreground/85 transition-[color,filter] duration-500 group-lit/glass:text-[color-mix(in_oklab,var(--glow)_78%,white)] group-lit/glass:[filter:drop-shadow(0_0_6px_var(--glow))_drop-shadow(0_0_14px_var(--glow))] [&>svg]:size-full"
      >
        {icon}
      </span>
      <span className="text-[0.95rem] font-medium tracking-tight">{label}</span>
    </div>
  );
}

export default LiquidGlassButton;
