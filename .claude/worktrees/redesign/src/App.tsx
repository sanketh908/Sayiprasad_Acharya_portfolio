import * as React from "react";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { CardFanCarousel } from "@/components/ui/card-fan-carousel";
import { MoltenRingCarousel } from "@/components/ui/molten-ring-carousel";
import { Lightbox, type LightboxImage } from "@/components/lightbox";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { skills } from "@/components/skill-logos";
import { FeatureHoverGrid } from "@/components/ui/feature-hover-grid";
import { EducationTimeline } from "@/components/education-timeline";
import { ScrollWords } from "@/components/scroll-words";
import { hobbyIcons } from "@/components/hobby-icons";
import { artworks, certificates, education, email, hobbies } from "@/data";

const base = import.meta.env.BASE_URL;

const NAV = [
  ["About", "#about"],
  ["Work", "#work"],
  ["Certificates", "#certificates"],
  ["Contact", "#contact"],
] as const;

const artImages: LightboxImage[] = artworks.map((a, i) => ({
  src: a.full,
  alt: `${a.title} ${i + 1} by Sayiprasad Acharya`,
  caption: `${a.title} · ${a.meta}`,
}));
const certImages: LightboxImage[] = certificates.map((c) => ({
  src: c.full,
  alt: `${c.title} certificate`,
  caption: `${c.title} · ${c.meta}`,
}));

function useMedia(query: string) {
  const [match, setMatch] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const read = () => setMatch(mq.matches);
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, [query]);
  return match;
}

// Marks [data-reveal] elements as seen once, so CSS can settle them in.
function useReveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }),
      { threshold: 0.15 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function SectionHead({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <header data-reveal className="mb-10 grid gap-3 md:mb-14 md:grid-cols-[10rem_1fr] md:items-end">
      <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">{index}</span>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight">{title}</h2>
        {note ? <p className="text-muted-foreground max-w-xs text-sm">{note}</p> : null}
      </div>
    </header>
  );
}

// True while the element is on screen. Used to mount the ring only while it is
// seen: it stops drawing off screen, and its entrance plays on every visit.
function useInView<T extends Element>(threshold = 0.2) {
  const ref = React.useRef<T>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

// Big section label whose letters rise one after another into place.
function SubHead({ children, sticky = true }: { children: string; sticky?: boolean }) {
  return (
    <h3
      data-reveal
      aria-label={children}
      className={`rise font-serif text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.05] tracking-tight ${sticky ? "md:sticky md:top-28 md:self-start" : ""}`}
    >
      {[...children].map((ch, i) => (
        <span key={i} aria-hidden className="rise__clip">
          <span className="rise__ch" style={{ "--i": i } as React.CSSProperties}>
            {ch === " " ? "\u00a0" : ch}
          </span>
        </span>
      ))}
    </h3>
  );
}

export default function App() {
  useReveal();
  const small = useMedia("(max-width: 640px)");
  const touch = useMedia("(hover: none)");
  const [artOpen, setArtOpen] = React.useState<number | null>(null);
  const [certOpen, setCertOpen] = React.useState<number | null>(null);
  const [showAll, setShowAll] = React.useState(false);
  const [ringRef, ringSeen] = useInView<HTMLDivElement>(0.25);

  return (
    <>
      {/* The whole page sits on one slow, living gradient, dimmed by a scrim
          so the artwork stays the brightest thing on screen. */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <BackgroundGradientAnimation
          containerClassName="h-full w-full"
          gradientBackgroundStart="rgb(22, 19, 17)"
          gradientBackgroundEnd="rgb(30, 20, 24)"
          firstColor="190, 98, 58"
          secondColor="118, 38, 66"
          thirdColor="52, 58, 118"
          fourthColor="36, 94, 102"
          fifthColor="150, 110, 66"
          pointerColor="206, 132, 84"
          size="85%"
        />
        <div className="bg-background/40 absolute inset-0" />
      </div>

      <a href="#work" className="bg-foreground text-background sr-only z-50 rounded px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to work
      </a>

      <header className="fixed inset-x-0 top-0 z-40">
        <nav className="mx-auto flex max-w-[88rem] items-center justify-center px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:justify-between sm:px-8">
          <a href="#top" className="font-serif text-2xl leading-none italic max-sm:hidden" aria-label="Sayiprasad Acharya, back to top">
            SA
          </a>
          <ul className="border-border bg-background/50 flex items-center gap-1 rounded-full border px-1.5 py-1 text-sm backdrop-blur-md">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:bg-foreground/10 block rounded-full px-2.5 py-3 text-[13px] transition-colors min-[380px]:px-3 min-[380px]:text-sm sm:px-4">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top">
        {/* ---------------------------------------------------------------- hero */}
        <section className="mx-auto grid min-h-[100dvh] max-w-[88rem] items-center gap-12 px-4 pt-28 pb-16 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p data-reveal className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
              Hello, I'm
            </p>
            <h1 data-reveal style={{ "--delay": "80ms" } as React.CSSProperties} className="mt-4 font-serif text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.88] tracking-[-0.02em]">
              Sayiprasad
              <br />
              <span className="italic">Acharya</span>
            </h1>
            <p data-reveal style={{ "--delay": "160ms" } as React.CSSProperties} className="mt-8 max-w-xl text-[clamp(1.35rem,2.6vw,2rem)] leading-snug tracking-tight">
              Hand-drawn pencil sketches, paintings and graphic &amp; UI/UX design.
            </p>
            <p data-reveal style={{ "--delay": "240ms" } as React.CSSProperties} className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              I create creative designs and user-friendly digital experiences.
            </p>
            <div data-reveal style={{ "--delay": "320ms" } as React.CSSProperties} className="mt-10">
              <a
                href="#work"
                className="bg-foreground text-background hover:bg-accent inline-flex h-12 items-center gap-3 rounded-full px-6 text-sm font-medium transition-colors active:translate-y-px"
              >
                See the artwork
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>

          <figure data-reveal style={{ "--delay": "200ms" } as React.CSSProperties} className="relative mx-auto w-full max-w-[26rem]">
            <div className="overflow-hidden rounded-t-[12rem] rounded-b-2xl ring-1 ring-white/15">
              <img
                src={`${base}me/portrait.jpg`}
                alt="Portrait of Sayiprasad Acharya"
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
              />
            </div>
            <figcaption className="text-muted-foreground mt-4 flex justify-between font-mono text-xs tracking-wider uppercase">
              <span>BCA student · Artist</span>
              <span>Ujire, Karnataka</span>
            </figcaption>
          </figure>
        </section>

        {/* --------------------------------------------------------------- about */}
        <section id="about" className="mx-auto max-w-[88rem] px-4 py-[clamp(4rem,10vw,8rem)] sm:px-8">
          <SectionHead index="01 / About" title="About me" />
          <div className="grid gap-6 md:grid-cols-[10rem_1fr]">
            <div className="hidden md:block" />
            <div className="max-w-3xl space-y-6 text-[clamp(1.35rem,2.4vw,1.9rem)] leading-snug tracking-tight">
              <ScrollWords text="Hi, I'm Sayiprasad Acharya, a BCA student at SDM Degree College, Ujire. I'm a pencil sketch artist, UI/UX designer and web developer." />
              <ScrollWords
                className="text-muted-foreground"
                text="I work in HTML, CSS and JavaScript, design in Figma and Canva, and love creating creative, interactive and visually attractive websites. Away from the screen I make realistic pencil artworks and paintings."
              />
            </div>
          </div>

          <div className="mt-[clamp(5rem,12vw,9rem)] grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
            <SubHead>Education</SubHead>
            <EducationTimeline steps={education} />
          </div>

          <div className="mt-[clamp(5rem,12vw,9rem)] grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
            <SubHead>Skills</SubHead>
            <ul className="flex flex-wrap gap-3">
              {skills.map((s, i) => (
                <li key={s.name} data-reveal style={{ "--delay": `${i * 50}ms` } as React.CSSProperties}>
                  <LiquidGlassButton icon={s.logo} label={s.name} glow={s.color} />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-[clamp(5rem,12vw,9rem)]">
            <SubHead sticky={false}>Hobbies</SubHead>
            <FeatureHoverGrid
              className="mt-10 md:mt-14"
              features={hobbies.map((h) => ({ title: h, icon: hobbyIcons[h] }))}
            />
          </div>
        </section>

        {/* ---------------------------------------------------------------- work */}
        <section id="work" className="py-[clamp(4rem,10vw,8rem)]">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
            <SectionHead
              index="02 / Work"
              title="Sketchbook"
              note={touch
                ? `${artworks.length} pieces in graphite and colour. Swipe sideways to turn the ring, or tap a card to bring it forward.`
                : `${artworks.length} pieces in graphite and colour. Drag or scroll the ring to turn it, or click a card to bring it forward.`}
            />
          </div>
          <div data-reveal className="mx-auto max-w-[88rem] px-4 sm:px-8">
            <div ref={ringRef} className="border-border h-[min(82svh,52rem)] overflow-hidden rounded-3xl border bg-black/20">
              {ringSeen ? (
              <MoltenRingCarousel
                items={artworks}
                className="h-full bg-transparent max-sm:[&>div]:hidden"
                arc={small ? 4 : 1.05}
                cardSize={small ? 0.46 : 0.17}
                cardRatio={0.76}
                fuse={0.09}
              />
              ) : null}
            </div>
          </div>

          <div className="mx-auto mt-14 flex max-w-[88rem] flex-col items-center px-4 sm:px-8">
            <button
              type="button"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
              className="bg-foreground text-background hover:bg-accent inline-flex h-16 items-center gap-4 rounded-full px-10 text-lg font-medium shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 active:translate-y-px sm:h-[4.5rem] sm:px-12 sm:text-xl"
            >
              {showAll ? "Hide the full gallery" : `View all ${artworks.length} works`}
              <svg viewBox="0 0 24 24" className={`size-5 transition-transform duration-500 ${showAll ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showAll ? (
              <ul className="mt-14 w-full columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3">
                {artworks.map((a, i) => (
                  <li
                    key={a.image}
                    className="fly-in break-inside-avoid"
                    // Each tile starts somewhere different: drifted sideways and
                    // tipped, alternating direction, then settles as it scrolls in.
                    style={{
                      "--fx": `${(i % 2 ? 1 : -1) * (40 + (i * 37) % 60)}px`,
                      "--fr": `${(i % 2 ? 1 : -1) * (4 + (i * 13) % 7)}deg`,
                    } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      onClick={() => setArtOpen(i)}
                      className="group focus-visible:ring-accent block w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none focus-visible:ring-2"
                      aria-label={`Open ${artImages[i].alt}`}
                    >
                      <img
                        src={a.image}
                        alt={artImages[i].alt}
                        loading="lazy"
                        className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {/* -------------------------------------------------------- certificates */}
        <section id="certificates" className="py-[clamp(4rem,10vw,8rem)]">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
            <SectionHead
              index="03 / Learning"
              title="Certificates"
              note={`Courses and an internship, newest first. ${touch ? "Swipe through, tap" : "Click"} the front card to read it in full.`}
            />
          </div>
          <div data-reveal>
            <CardFanCarousel items={certificates} onOpen={setCertOpen} aria-label="Certificates" />
          </div>
        </section>

        {/* ------------------------------------------------------------- contact */}
        <section id="contact" className="mx-auto max-w-[88rem] px-4 pt-[clamp(4rem,10vw,8rem)] pb-16 sm:px-8">
          <div data-reveal className="border-border border-t pt-12">
            <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">04 / Contact</p>
            <h2 className="mt-6 max-w-4xl font-serif text-[clamp(2.75rem,8vw,7rem)] leading-[0.92] tracking-tight">
              Let's talk.
            </h2>
            <a
              href={`mailto:${email}`}
              className="group mt-10 inline-flex min-h-11 items-center gap-4 py-2 text-[clamp(1.1rem,3vw,2rem)] tracking-tight"
            >
              <span className="decoration-accent underline decoration-1 underline-offset-[0.25em] transition-[text-decoration-color] group-hover:decoration-foreground">
                {email}
              </span>
              <svg viewBox="0 0 24 24" className="size-[0.9em] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <footer className="text-muted-foreground mx-auto flex max-w-[88rem] justify-between px-4 pb-[max(2rem,env(safe-area-inset-bottom))] font-mono text-xs sm:px-8">
        <span>© 2026 SAI_ARTS</span>
        <a href="#top" className="hover:text-foreground -my-3 py-3">Back to top</a>
      </footer>

      <Lightbox images={artImages} index={artOpen} onChange={setArtOpen} />
      <Lightbox images={certImages} index={certOpen} onChange={setCertOpen} />
    </>
  );
}
