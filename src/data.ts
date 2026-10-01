// Everything here comes from the two original sites (prasadarts and
// sayiprasadportfolio) or is read off the certificate images themselves.

const base = import.meta.env.BASE_URL;

type Medium = "pencil" | "paint";
// Ring order. The carousel faces index floor(n / 2) forward on load, so the
// lead piece (12) sits at index 8; colour works are spaced through the pencil.
const ART: [string, Medium][] = [
  ["16", "paint"], ["08", "pencil"], ["01", "pencil"], ["09", "pencil"],
  ["05", "paint"], ["15", "pencil"], ["04", "pencil"], ["02", "pencil"],
  ["12", "pencil"], ["11", "paint"], ["07", "pencil"], ["13", "pencil"],
  ["10", "pencil"], ["03", "paint"], ["14", "pencil"], ["06", "pencil"],
];

// `image` is a 720px copy: plenty for the ring (512px atlas cells) and the
// gallery grid. `full` is the 1600px original, loaded only in the lightbox.
export const artworks = ART.map(([file, medium]) => ({
  image: `${base}art/sm/${file}.jpg`,
  full: `${base}art/${file}.jpg`,
  title: medium === "pencil" ? "Pencil sketch" : "Painting",
  meta: medium === "pencil" ? "Graphite on paper" : "Colour on paper",
}));

export const certificates = [
  { file: "c6", title: "Canva Generative AI for Social Media Management", meta: "Udemy · Aug 2026" },
  { file: "c1", title: "Design Thinking for Beginners", meta: "Simplilearn SkillUp · Aug 2026" },
  { file: "c5", title: "Getting Started with Artificial Intelligence", meta: "IBM SkillsBuild · Jul 2026" },
  { file: "c8", title: "Canva Project: Social Media Post Creation", meta: "Infosys Springboard · Jul 2026" },
  { file: "c4", title: "Python Programming 01", meta: "Infosys Springboard · Apr 2026" },
  { file: "c3", title: "Internship Certificate", meta: "Primary Agricultural Credit Co-op Society, Nidle · May–Jun 2025" },
  { file: "c2", title: "Introduction to Artificial Intelligence", meta: "Infosys Springboard · Sep 2024" },
  { file: "c7", title: "Basics of Python", meta: "Infosys Springboard · Aug 2024" },
].map(({ file, ...rest }) => ({
  image: `${base}cert/sm/${file}.jpg`,
  full: `${base}cert/${file}.jpg`,
  ...rest,
}));

// Oldest first; the last entry is current.
export const education = [
  { stage: "School · SSLC", place: "Govt High School, Nidle", detail: "2022 · 81%" },
  { stage: "Pre-university · PUC", place: "SDM PU College, Ujire", detail: "2024 · PCMC · 77%" },
  { stage: "Now · BCA", place: "SDM Degree College, Ujire", detail: "From 2025" },
];

export const hobbies = [
  "Drawing", "Painting", "Designing", "Music", "Gaming", "Cricket",
  "Video editing", "Collecting old coins", "Agriculture",
];

export const email = "sayiprasad006@gmail.com";
