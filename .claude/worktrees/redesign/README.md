# Sayiprasad Acharya — portfolio

A redesign of `prasadarts` and `sayiprasadportfolio`, merged into one site.
Vite + React + TypeScript + Tailwind CSS v4, laid out the way shadcn/ui expects.

```bash
npm install
npm run dev      # local preview
npm run build    # static site in dist/
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`
(in the repo settings, set Pages → Source to "GitHub Actions").

## Layout

- `src/components/ui/`: shadcn-style components
  - `molten-ring-carousel.tsx`: the artwork ring (WebGL2)
  - `background-gradient-animation.tsx`: the animated page background
  - `card-fan-carousel.tsx`: the certificate fan
- `src/lib/utils.ts`: the `cn()` helper every shadcn component imports
- `src/data.ts`: all the content (artworks, certificates, education, skills)
- `public/art`, `public/cert`, `public/me`: images, resized for the web

`components.json` points the shadcn CLI at these paths, so
`npx shadcn@latest add <component>` lands new components in `src/components/ui`
and resolves `@/lib/utils`. Keep that folder: shadcn and 21st.dev components are
written against the `@/components/ui/*` import path, so pasting them in elsewhere
breaks their imports.

## Adding work

Drop a resized image in `public/art/` and add a row to `ART` in `src/data.ts`.
Certificates work the same way, with `public/cert/` and the `certificates` list.
