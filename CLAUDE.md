# Session Replay Validator Guide

## What This Is

A read-only interactive guide for installing Amplitude Session Replay and Heatmaps. Users follow a multi-step wizard to get platform-specific setup instructions, code snippets, and validation checklists. There are no forms, user input fields, or data submission — everything is informational.

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS v4 (utility-first, custom palette: `amp-blue`, `amp-indigo`, `amp-purple`, `amp-border`)
- React Router v7 (client-side SPA routing)
- Deployed to GitHub Pages at `/session-replay-guide/`

## Project Layout

- `src/components/` — Reusable UI components (Wizard, CodeBlock, Step* components, CalloutCard, Tile)
- `src/pages/` — Page-level components (`*Page.tsx` suffix)
- `src/data/` — Content and configuration (types, code snippets, callouts, flowchart routing, releases)
- `src/analytics.ts` — Amplitude SDK initialization and event tracking
- `src/App.tsx` — Main layout with header tabs and routing
- `src/main.tsx` — Router setup and app entry point

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check with tsc then build to `dist/`
- `npm run lint` — ESLint on ts/tsx files
- `npm run preview` — Preview production build locally

## Conventions

- Functional components with hooks, no class components
- PascalCase for components, `*Page.tsx` suffix for pages
- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- Central type definitions in `src/data/types.ts`
- Content separated from components: snippets in `content.ts`, warnings/tips in `callouts.ts`, routing logic in `flowchart.ts`
- Analytics tracking via `track(eventName, properties)` calls on user interactions

## Important Context

- This is a **read-only guide** — never add forms, inputs, or data collection features
- Code snippets shown to users are documentation content in `src/data/content.ts`, not application logic
- The wizard state (platform, source, method) drives which content is displayed
- SPA routing requires `404.html` copy during build for GitHub Pages compatibility
- `VITE_AMPLITUDE_API_KEY` env var is used for the guide's own analytics, injected via GitHub Actions secret
