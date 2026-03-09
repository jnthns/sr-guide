import { Link } from 'react-router-dom';
import { setOrigination } from '../analytics';

export function HeatmapsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Heatmaps</h2>
        <p className="mt-1 text-sm text-gray-500">
          Visual, aggregate analysis of where users click, scroll, and engage on your web pages — built from Session Replay data.
        </p>
      </div>

      {/* Relationship to SR */}
      <div className="rounded-2xl border-2 border-callout-tip-border bg-callout-tip-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#8505;</span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Heatmaps are part of Amplitude Session Replay. They reuse replay data to generate aggregate visualizations, so you need Session Replay enabled before heatmaps will work.
            </p>
            <Link
              to="/"
              onClick={() => setOrigination('heatmaps: sr prerequisites')}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
            >
              Review Session Replay prerequisites
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Prerequisites &amp; Requirements</h3>
        <ul className="space-y-3">
          <Bullet bold="Web only">
            Heatmaps are currently available for web-based session replays only — not for iOS, Android, or React Native.
          </Bullet>
          <Bullet bold="Session Replay required">
            Session Replay must be enabled and capturing data for the pages you want to analyze.
          </Bullet>
          <Bullet bold="Minimum SDK versions">
            Session Replay Browser SDK Plugin <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">&ge; 1.7.0</code> or
            Standalone SDK <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">&ge; 1.14.0</code>.
            Older versions are not guaranteed to support Heatmaps.
          </Bullet>
          <Bullet bold="Browser device IDs">
            Heatmaps require Amplitude's default browser device identifiers from the Browser SDK. Device IDs sourced only from server-side SDKs or third-party ingestion are not supported.
          </Bullet>
          <Bullet bold="No extra event cost">
            Heatmap and Session Replay events do not count toward your metered event volume, so enabling Heatmaps won't consume standard analytics quotas.
          </Bullet>
        </ul>
      </div>

      {/* Sample rate impact */}
      <div className="rounded-2xl border-2 border-callout-warning-border bg-callout-warning-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#9888;</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Your Session Replay sample rate directly affects heatmap coverage. Lower sampling means fewer interactions to build heatmaps from, which can reduce completeness. There's no strict minimum required to generate a map, but higher sample rates produce more representative data.
            </p>
          </div>
        </div>
      </div>

      {/* Creating a heatmap */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Creating a Heatmap</h3>
        <p className="text-sm text-gray-700 mb-4">
          When you create a heatmap in Amplitude, you configure which pages to analyze and how to filter the data:
        </p>
        <ul className="space-y-3">
          <Bullet bold="URL targeting">
            Choose how to match pages: <strong className="text-amp-blue">Exact match</strong>, <strong className="text-amp-blue">Pattern match</strong>, <strong className="text-amp-blue">Contains</strong>, or <strong className="text-amp-blue">Starts with</strong>.
          </Bullet>
          <Bullet bold="Segment filters">
            Optionally narrow results by user properties or cohorts to focus on specific audiences.
          </Bullet>
          <Bullet bold="Device type">
            Select device types to analyze different viewport widths (e.g., desktop vs. mobile).
          </Bullet>
          <Bullet bold="Backgrounds">
            Heatmap backgrounds are generated from Session Replay session snapshots. Each heatmap can produce multiple backgrounds based on page states that generated the most interactions, so you can pick the one that best matches the variant you care about.
          </Bullet>
        </ul>
      </div>

      {/* Map types */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-4">Map Types</h3>
        <div className="space-y-4">
          <MapTypeCard
            title="Click Map"
            description="A color-coded overlay showing click intensity across the page. Warmer colors indicate higher concentration of clicks, helping you identify which areas attract the most interaction."
          />
          <MapTypeCard
            title="Selector Map"
            description="A wireframe view of clickable elements ranked by click count, down to the lowest interactive element. Useful for comparing the relative performance of buttons, links, and CTAs."
          />
          <MapTypeCard
            title="Scroll Map"
            description="Shows how many unique users reached each scroll depth and where the average fold line falls. Helps you understand whether important content is placed above or below the point where most users stop scrolling."
          />
        </div>
      </div>

      {/* Microscope panel */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Using the Microscope Panel</h3>
        <p className="text-sm text-gray-700 mb-3">
          On click and selector maps, the Microscope panel lets you drill into specific regions or elements:
        </p>
        <ul className="space-y-3">
          <Bullet>Inspect events that occurred in a selected region or on a specific element.</Bullet>
          <Bullet>Jump directly to associated session replays to see the full context of interactions.</Bullet>
          <Bullet>Create cohorts of users who interacted with a specific area or selector for downstream analysis.</Bullet>
        </ul>
      </div>

      {/* Retention & privacy */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Data Retention &amp; Privacy</h3>
        <ul className="space-y-3">
          <Bullet bold="Decoupled retention">
            Heatmap data is based on anonymized replay data and is not tied to the Session Replay retention period. Heatmaps can remain available even after individual replay recordings expire.
          </Bullet>
          <Bullet bold="Same privacy controls">
            Heatmaps fall under the same User Privacy API and DSAR API controls as core analytics and Session Replay. Any masking configured for Session Replay also applies to the data used in heatmaps.
          </Bullet>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://amplitude.com/docs/apis/analytics/user-privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
          >
            User Privacy API
            <span aria-hidden="true">&rarr;</span>
          </a>
          <a
            href="https://amplitude.com/docs/apis/analytics/ccpa-dsar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
          >
            DSAR API
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      {/* CTA back to SR guide */}
      <div className="rounded-xl bg-gradient-to-r from-amp-indigo to-amp-purple p-6 text-white text-center">
        <p className="text-lg font-semibold">Need to set up Session Replay first?</p>
        <p className="mt-1 text-sm text-indigo-100">
          Heatmaps require Session Replay to be capturing data. Follow the full implementation guide to get started.
        </p>
        <Link
          to="/guide"
          onClick={() => setOrigination('heatmaps: go to sr guide')}
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
        >
          Go to the Session Replay Guide
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}

function Bullet({ bold, children }: { bold?: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
      <span>
        {bold && <strong className="text-amp-blue">{bold}: </strong>}
        {children}
      </span>
    </li>
  );
}

function MapTypeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-amp-border p-4 bg-amp-light">
      <h4 className="text-sm font-semibold text-amp-blue">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
