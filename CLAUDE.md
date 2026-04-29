# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A read-only interactive guide for installing Amplitude Session Replay and Heatmaps. Users follow a multi-step wizard to get platform-specific setup instructions, code snippets, and validation checklists. There are no forms, user input fields, or data submission — everything is informational.

## Commands

- `npm run dev` — Start Vite dev server (http://localhost:5173)
- `npm run build` — Type-check with tsc then build to `dist/`
- `npm run lint` — ESLint on ts/tsx files
- `npm run preview` — Preview production build locally

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS v4 via `@tailwindcss/vite` plugin; custom theme vars in `index.css` (`--color-amp-blue`, `--color-amp-indigo`, `--color-amp-purple`, `--color-callout-*`)
- React Router v7 (client-side SPA); router basename is `/sr-guide/` (GitHub Pages repo name)
- Deployed to GitHub Pages; `VITE_AMPLITUDE_API_KEY` injected via GitHub Actions secret

## Architecture

### Data-Driven Wizard

The core pattern: UI components are content-agnostic. All content lives in `src/data/` and is looked up via deterministic functions — add new platforms/methods by editing data files, not components.

**State lives in `Wizard.tsx`** as three `useState` values: `platform`, `source`, `method`. Selecting a platform clears source/method; selecting a source calls `resolveMethod(platform, source)` to deterministically set method.

**Data flow:**
1. `flowchart.ts` — `platforms[]`, `sources[]`, `methodMap` (platform:source → `ImplementationMethod`), `resolveMethod()`, `getSourcesForPlatform()`
2. `content.ts` — `setupContent` lookup table keyed by `ImplementationMethod`, each entry has `installCommands[]`, `codeSnippet`, `language`, `notes[]`
3. `callouts.ts` — `callouts[]` with `steps[]`, `platforms[]`, `sources[]` filter arrays; `getCalloutsForStep(stepId, platform, source)` returns matching `CalloutCard`s
4. `types.ts` — discriminated unions for `Platform`, `AnalyticsSource`, `ImplementationMethod`

### Routing (`App.tsx` / `main.tsx`)

- `/` → `BeforeYouBeginPage` (landing)
- `/guide` → `Wizard` component (8-step interactive flow)
- All other routes → static documentation pages (`*Page.tsx`)
- Layout width: `max-w-7xl` for `/iframes`, `max-w-4xl` elsewhere
- `404.html` is a copy of `index.html` at build time for GitHub Pages SPA compatibility

### Analytics (`analytics.ts`, `gtm.ts`, `RouteAnalytics.tsx`)

- Amplitude Browser SDK v2 + Session Replay plugin + Engagement plugin
- `originationEnrichment` plugin tags every event with how the user navigated there (e.g., `"nav: Full Guide"`)
- `initAnalytics()` is called on route change via `RouteAnalytics.tsx`; skipped on `/iframes` and `/iframe-local-test`
- Separate GTM integration in `gtm.ts` (`GTM-WTM5V2PL`)
- Wizard events: `guide_platform_selected`, `guide_source_selected`, `guide_method_resolved`, `guide_step_continued`, `guide_completed`

## Conventions

- Functional components with hooks; `*Page.tsx` suffix for page-level components
- Strict TypeScript (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)
- All handlers in `Wizard.tsx` wrapped in `useCallback`; `goToStep()` uses `scrollIntoView({ behavior: 'smooth' })`
- This is a **read-only guide** — never add forms, inputs, or data collection features
- Code snippets in `content.ts` are documentation content shown to users, not application logic
- Commits go directly to `main` (no PR branches required for this repo)
