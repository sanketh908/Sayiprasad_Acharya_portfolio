# Sayiprasad Acharya — Portfolio Site

Personal portfolio site for Sayiprasad Acharya, showing artwork and certificates.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4**, laid out the way shadcn/ui expects.

## Getting started

Requires Node 22+.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build the static site into dist/
npm run preview   # serve the built dist/ locally
npm run lint      # lint with oxlint
```

## Project structure

```
public/
  art/        artwork images (full size), art/sm/ holds
  cert/       certificate images, cert/sm/ holds thumbnails
  me/         profile photos
src/
  App.tsx            root component
  main.tsx           entry point
  index.css          Tailwind entry and global styles
  components/ui/     shadcn-style components
  lib/utils.ts       the cn() class-merge helper
components.json      shadcn CLI config
vite.config.ts       Vite config (React and Tailwind plu
```

## Adding components

`components.json` points the shadcn CLI at `src/components/ui` and `@/lib/utils`:

```bash
npx shadcn@latest add <component>
```

Keep new UI components in `src/components/ui/`, because shadcn and 21st.dev components import from `@/components/ui/*`.

## Adding artwork or certificates

1. Resize the image for the web and put it in `public/art/` (or `public/cert/`).
2. Put a smaller copy with the same filename in the `sm/
3. Reference the image from the site content.

## Deployment

The site builds to plain static files in `dist/`, so any static host works (GitHub Pages, Netlify, Vercel and so on).

Two things to know:
- src/App.tsx on main is still the default Vite starter  (the art carousel, data.ts, and a GitHub Pages deployworkflow) is in the .claude/worktrees/redesign worktree, which also has its own README.
- When the redesign is merged into main, add the .github and the src/data.ts steps to this README
