import * as React from "react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

// Native <dialog>: focus trap, Escape and top-layer stacking come free.
export function Lightbox({
  images,
  index,
  onChange,
}: {
  images: LightboxImage[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const swipe = React.useRef<number | null>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const step = (by: number) =>
    index !== null && onChange((index + by + images.length) % images.length);
  const image = index !== null ? images[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label={image?.alt}
      onClose={() => onChange(null)}
      onClick={(event) => event.target === ref.current && onChange(null)}
      // Swipe sideways to flip through on a phone.
      onPointerDown={(event) => (swipe.current = event.clientX)}
      onPointerUp={(event) => {
        if (swipe.current === null) return;
        const dx = event.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      className="m-auto max-h-none max-w-none bg-transparent p-0 text-foreground outline-none"
    >
      {image ? (
        <figure className="flex flex-col items-center gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-[78svh] max-w-[92vw] touch-pan-y rounded-lg object-contain shadow-2xl select-none"
            draggable={false}
          />
          <figcaption className="flex w-full max-w-[92vw] items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground font-mono tabular-nums">
              {String(index! + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <span className="truncate">{image.caption}</span>
            <span className="flex gap-2">
              {[
                ["Previous", -1, "M15 6l-6 6 6 6"],
                ["Next", 1, "M9 6l6 6-6 6"],
                ["Close", 0, "M6 6l12 12M18 6L6 18"],
              ].map(([label, by, d]) => (
                <button
                  key={label as string}
                  type="button"
                  aria-label={label as string}
                  onClick={() => (by ? step(by as number) : onChange(null))}
                  className="border-border hover:bg-foreground/10 grid size-11 place-items-center rounded-full border bg-background/60 transition-colors active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d={d as string} />
                  </svg>
                </button>
              ))}
            </span>
          </figcaption>
        </figure>
      ) : null}
    </dialog>
  );
}
