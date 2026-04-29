# GTM-Only Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Amplitude Browser SDK and replace all `track()` / `setOrigination()` calls with `pushGtmEvent()`, making GTM the sole analytics mechanism across all routes.

**Architecture:** `RouteAnalytics.tsx` becomes the single place GTM is loaded (once on mount) and `page_view` is pushed on every route change. All interaction events in components/pages swap from `analytics.ts` → `gtm.ts`. `analytics.ts` is deleted entirely.

**Tech Stack:** React 19, TypeScript, `gtm.ts` (`loadGoogleTagManager`, `pushGtmEvent`), GitHub Actions

---

### Task 1: Remove Amplitude packages and delete `analytics.ts`

**Files:**
- Modify: `package.json`
- Delete: `src/analytics.ts`
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Uninstall Amplitude packages**

```bash
npm uninstall @amplitude/analytics-browser @amplitude/plugin-session-replay-browser @amplitude/engagement-browser
```

Expected: those three entries disappear from `dependencies` in `package.json`. `node_modules` shrinks.

- [ ] **Step 2: Delete `src/analytics.ts`**

Delete the file `src/analytics.ts`. It exports `initAnalytics`, `setAnalyticsOptOut`, `setOrigination`, and `track` — all of which will be replaced or removed in subsequent tasks.

- [ ] **Step 3: Remove `VITE_AMPLITUDE_API_KEY` from the deploy workflow**

In `.github/workflows/deploy.yml`, remove the `env` block under the `npm run build` step:

```yaml
      - run: npm run build
```

(The `env:` key and `VITE_AMPLITUDE_API_KEY: ${{ secrets.VITE_AMPLITUDE_API_KEY }}` line beneath it should be removed entirely.)

- [ ] **Step 4: Verify build fails with expected errors**

```bash
npm run build
```

Expected: TypeScript errors about missing module `'../analytics'` and `'./analytics'` in several files. This confirms the old module is gone and the remaining tasks have clear targets.

---

### Task 2: Rewrite `RouteAnalytics.tsx`

**Files:**
- Modify: `src/components/RouteAnalytics.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadGoogleTagManager, pushGtmEvent } from '../gtm';

export function RouteAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    loadGoogleTagManager();
    pushGtmEvent('page_view', { page_path: pathname });
  }, [pathname]);

  return null;
}
```

`loadGoogleTagManager()` has its own dedup guard (`document.getElementById(scriptId)`), so calling it on every route change is safe — the script is injected only once. `page_view` fires on every navigation, including the initial load.

- [ ] **Step 2: Verify no TypeScript errors in this file**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep RouteAnalytics
```

Expected: no output (no errors in this file).

---

### Task 3: Update `App.tsx` — remove `setOrigination`

**Files:**
- Modify: `src/App.tsx`

`App.tsx` calls `setOrigination()` in three `onClick` handlers on the header title link, tab links, and nav links. Remove all of them.

- [ ] **Step 1: Remove the import**

Delete line 2:
```tsx
import { setOrigination } from './analytics';
```

- [ ] **Step 2: Remove the three `onClick` calls**

Header title link — remove the `onClick` prop entirely:
```tsx
<Link to="/" className="hover:text-indigo-200 transition-colors">
```

Tab links — remove the `onClick` prop:
```tsx
<Link
  key={tab.id}
  to={tab.defaultPath}
  className={`relative px-5 py-2.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'text-white'
      : 'text-indigo-300 hover:text-white'
  }`}
>
```

Nav links — remove the `onClick` prop:
```tsx
<Link
  key={to}
  to={to}
  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? accent
        ? 'bg-amp-indigo text-white'
        : 'bg-white/20 text-white'
      : accent
        ? 'bg-amp-indigo/40 text-indigo-100 hover:bg-amp-indigo/60 hover:text-white'
        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
  }`}
>
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep App
```

Expected: no errors in `App.tsx`.

---

### Task 4: Update `Wizard.tsx` — swap `track` → `pushGtmEvent`

**Files:**
- Modify: `src/components/Wizard.tsx`

- [ ] **Step 1: Replace the import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 2: Replace all `track()` calls**

`handlePlatformSelect`:
```tsx
pushGtmEvent('guide_platform_selected', { platform: p });
```

`handleSourceSelect`:
```tsx
pushGtmEvent('guide_source_selected', { platform, source: s });
pushGtmEvent('guide_method_resolved', { platform, source: s, method: resolved });
```

`handleContinue`:
```tsx
pushGtmEvent('guide_step_continued', {
  step_id: step.id,
  step_number: step.number,
  platform,
  source,
  method,
});
```
```tsx
pushGtmEvent('guide_completed', { platform, source, method });
```

`handleEditStep`:
```tsx
pushGtmEvent('guide_step_edited', { step_id: step.id, step_number: step.number });
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep Wizard
```

Expected: no errors.

---

### Task 5: Update components — `CalloutCard`, `CodeBlock`, `StepValidation`, `StepDebugging`

**Files:**
- Modify: `src/components/CalloutCard.tsx`
- Modify: `src/components/CodeBlock.tsx`
- Modify: `src/components/StepValidation.tsx`
- Modify: `src/components/StepDebugging.tsx`

#### `CalloutCard.tsx`

- [ ] **Step 1: Replace import**

Change:
```tsx
import { track, setOrigination } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 2: Replace the external link onClick**

```tsx
onClick={() => pushGtmEvent('callout_link_clicked', {
  callout_title: title,
  link_label: link.label,
  url: link.url,
  link_type: 'external',
})}
```

- [ ] **Step 3: Replace the internal link onClick**

Remove `setOrigination`. Keep only `pushGtmEvent`:
```tsx
onClick={() => {
  pushGtmEvent('callout_link_clicked', {
    callout_title: title,
    link_label: internalLink.label,
    destination: internalLink.to,
    link_type: 'internal',
  });
}}
```

#### `CodeBlock.tsx`

- [ ] **Step 4: Replace import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 5: Replace `track` call in `handleCopy`**

```tsx
pushGtmEvent('code_copied', { language });
```

#### `StepValidation.tsx`

- [ ] **Step 6: Replace import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 7: Replace `track` calls in `toggle`**

```tsx
pushGtmEvent('validation_check_toggled', {
  label: content.steps[index].label,
  checked: nowChecked,
  platform,
});
```
```tsx
pushGtmEvent('validation_completed', { platform });
```

#### `StepDebugging.tsx`

- [ ] **Step 8: Replace import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 9: Replace `track` call in `toggleSection`**

```tsx
pushGtmEvent('debugging_section_toggled', {
  section: debuggingContent.sections[index].heading,
  expanded: expanding,
});
```

- [ ] **Step 10: Verify components compile**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "CalloutCard|CodeBlock|StepValidation|StepDebugging"
```

Expected: no output.

---

### Task 6: Update pages — `SystemStatusPage`, `ValidationPage`, and `setOrigination`-only pages

**Files:**
- Modify: `src/pages/SystemStatusPage.tsx`
- Modify: `src/pages/ValidationPage.tsx`
- Modify: `src/pages/HeatmapsPage.tsx`
- Modify: `src/pages/DeletionPage.tsx`
- Modify: `src/pages/BeforeYouBeginPage.tsx`
- Modify: `src/pages/SessionIdOptionsPage.tsx`

#### `SystemStatusPage.tsx`

- [ ] **Step 1: Replace import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 2: Replace `track` call**

```tsx
onClick={() => pushGtmEvent('system_status_category_clicked', { category: cat.title })}
```

#### `ValidationPage.tsx`

- [ ] **Step 3: Replace import**

Change:
```tsx
import { track } from '../analytics';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 4: Replace `track` call**

```tsx
onClick={() => {
  setPlatform(opt.id as Platform);
  pushGtmEvent('platform_filter_changed', { platform: opt.id, page: 'validation' });
}}
```

#### `HeatmapsPage.tsx`, `DeletionPage.tsx`, `BeforeYouBeginPage.tsx`, `SessionIdOptionsPage.tsx`

These four pages only import and call `setOrigination()` — they have no `track()` calls. Since origination tracking is being dropped entirely (relying on GTM's built-in data), the fix is the same for all four:

- [ ] **Step 5: `HeatmapsPage.tsx`** — remove `import { setOrigination } from '../analytics';` and both `onClick={() => setOrigination(...)}` props on the two `Link` elements (lines 24 and 165).

- [ ] **Step 6: `DeletionPage.tsx`** — remove `import { setOrigination } from '../analytics';` and the `onClick={() => setOrigination('deletion: warning banner')}` prop on line 29.

- [ ] **Step 7: `BeforeYouBeginPage.tsx`** — remove `import { setOrigination } from '../analytics';` and all four `onClick={() => setOrigination(...)}` props (lines 22, 55, 74, 121).

- [ ] **Step 8: `SessionIdOptionsPage.tsx`** — remove `import { setOrigination } from '../analytics';` and the `onClick={() => setOrigination('session id options: back to guide')}` prop on line 159.

- [ ] **Step 9: Verify pages compile**

```bash
npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "SystemStatus|ValidationPage|Heatmaps|Deletion|BeforeYouBegin|SessionIdOptions"
```

Expected: no output.

---

### Task 7: Update `IframesPage.tsx` — remove redundant GTM load and `page_view`

**Files:**
- Modify: `src/pages/IframesPage.tsx`

`RouteAnalytics` now handles `loadGoogleTagManager()` and `page_view` for every route including `/iframes`. The `useEffect` in `IframesPage` should keep only `iframes_page_loaded`.

- [ ] **Step 1: Remove `loadGoogleTagManager` from the import**

Change:
```tsx
import { loadGoogleTagManager, pushGtmEvent } from '../gtm';
```
To:
```tsx
import { pushGtmEvent } from '../gtm';
```

- [ ] **Step 2: Replace the `useEffect`**

```tsx
useEffect(() => {
  pushGtmEvent('iframes_page_loaded', { gtm_initialized: true });
}, []);
```

---

### Task 8: Full build verification and commit

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: `✓ built in Xs` with no TypeScript errors. Zero references to `@amplitude` in the output bundle.

- [ ] **Step 2: Confirm no Amplitude references remain in source**

```bash
grep -r "amplitude" src/ --include="*.ts" --include="*.tsx" | grep -v "data/content.ts"
```

Expected: no output. (`data/content.ts` is excluded because it contains Amplitude SDK code snippets shown as documentation to users — those are intentional and should not be changed.)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "replace Amplitude SDK with GTM-only analytics"
```
