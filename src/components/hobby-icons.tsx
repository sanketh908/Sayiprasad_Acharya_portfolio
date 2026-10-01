import type { ReactNode } from "react";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

// Line icons in the Lucide style, one per hobby.
export const hobbyIcons: Record<string, ReactNode> = {
  Drawing: icon("M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z M15 5l4 4"),
  Painting: icon("M12 22a10 10 0 1 1 10-10c0 2.5-2 3-3.5 3H16a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z M7.5 10.5h.01 M10.5 7.5h.01 M14.5 7.5h.01 M16.5 11h.01"),
  Designing: icon("M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"),
  Music: icon("M9 18V5l12-2v13 M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"),
  Gaming: icon("M6 12h4 M8 10v4 M15 13h.01 M18 11h.01 M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.6 6A3 3 0 0 0 5.1 18c.88 0 1.6-.55 2.07-1.24L8.5 15h7l1.33 1.76c.47.69 1.19 1.24 2.07 1.24a3 3 0 0 0 2.98-3.41l-.6-6A4 4 0 0 0 17.32 5z"),
  Cricket: icon("M4 20l3-3 M7 17l9-9a2.1 2.1 0 0 1 3 3l-9 9-3-3z M18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"),
  "Video editing": icon("M3 3h18v18H3z M7 3v18 M17 3v18 M3 7.5h4 M3 12h18 M3 16.5h4 M17 7.5h4 M17 16.5h4"),
  "Collecting old coins": icon("M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M18.09 10.37A6 6 0 1 1 10.34 18 M7 6h1v4 M16.71 13.88l.7.71-2.82 2.82"),
  Agriculture: icon("M7 20h10 M10 20c5.5-2.5.8-6.4 3-10 M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"),
};
