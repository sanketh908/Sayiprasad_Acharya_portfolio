import * as React from "react";

import { cn } from "@/lib/utils";
import { useTouchLight } from "@/hooks/use-touch-light";

// A ruled grid of features. Hovering a cell washes it with a soft gradient
// rising from its outer edge, stretches the accent tab beside the title and
// nudges the title along. Modelled on the "feature section with hover
// effects" pattern.

export interface Feature {
  title: string;
  icon: React.ReactNode;
  description?: string;
}

export function FeatureHoverGrid({
  features,
  columns = 3,
  className,
}: {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const rows = Math.ceil(features.length / columns);
  return (
    <ul
      className={cn(
        "relative grid grid-cols-1 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {features.map((f, i) => {
        const row = Math.floor(i / columns);
        const lastRow = row === rows - 1;
        return (
          <Cell
            key={f.title}
            f={f}
            index={i}
            columns={columns}
            row={row}
            lastRow={lastRow}
          />
        );
      })}
    </ul>
  );
}

function Cell({
  f,
  index: i,
  columns,
  row,
  lastRow,
}: {
  f: Feature;
  index: number;
  columns: number;
  row: number;
  lastRow: boolean;
}) {
  const ref = useTouchLight<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-reveal
      style={{ "--delay": `${(i % columns) * 90 + row * 60}ms` } as React.CSSProperties}
      className={cn(
        "group/feature border-border relative flex flex-col py-10 max-lg:border-b lg:border-r",
        i % columns === 0 && "lg:border-l",
        !lastRow && "lg:border-b",
      )}
    >
      {/* The wash rises from the outer edge: up from the top for the
          top row, down from the bottom otherwise. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full opacity-0 transition duration-300 group-lit/feature:opacity-100",
          row === 0
            ? "bg-gradient-to-t from-white/[0.07] to-transparent"
            : "bg-gradient-to-b from-white/[0.07] to-transparent",
        )}
      />
      <span className="text-muted-foreground group-lit/feature:text-accent relative z-10 mb-4 px-10 transition-colors duration-300 [&>svg]:size-7">
        {f.icon}
      </span>
      <span className="relative z-10 mb-2 px-10 text-lg font-medium">
        <span className="bg-foreground/20 group-lit/feature:bg-accent absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full transition-all duration-200 group-lit/feature:h-8" />
        <span className="inline-block transition duration-200 group-lit/feature:translate-x-2">
          {f.title}
        </span>
      </span>
      {f.description ? (
        <p className="text-muted-foreground relative z-10 max-w-xs px-10 text-sm">{f.description}</p>
      ) : null}
      <span aria-hidden className="text-muted-foreground/60 relative z-10 mt-auto px-10 pt-4 font-mono text-xs tabular-nums">
        {String(i + 1).padStart(2, "0")}
      </span>
    </li>
  );
}

export default FeatureHoverGrid;
