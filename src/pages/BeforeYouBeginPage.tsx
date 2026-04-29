import { Link } from 'react-router-dom';

export function BeforeYouBeginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Before You Begin</h2>
        <p className="mt-1 text-sm text-gray-500">
          A few things to review before enabling Session Replay in production.
        </p>
      </div>

      {/* Session ID / Device ID */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-2">Verify your Session ID and Device ID</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Session Replay requires a valid <strong className="text-amp-blue">Session ID</strong> (Unix timestamp in milliseconds) and a stable <strong className="text-amp-blue">Device ID</strong> that remain constant for the entire session. If either changes mid-session or is invalid (e.g., -1), replays won't be captured correctly.
        </p>
        <Link
          to="/session-id-options"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
        >
          What options do I have?
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Masking — lead with why it matters */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Review your masking settings first</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Session Replay masks sensitive content <strong className="text-amp-blue">at capture time</strong> — before any data leaves the browser or device. This means masked data is never sent to Amplitude, which is great for privacy. But it also means masking can't be applied after the fact to replays that have already been recorded.
        </p>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          Take a few minutes to review your masking configuration before setting a sample rate above 0%. Amplitude gives you several layers of control:
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span><strong className="text-amp-blue">Dashboard masking levels</strong> — Conservative, Medium, or Light, configured in your project's Session Replay settings.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span><strong className="text-amp-blue">CSS classes</strong> — <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">amp-mask</code>, <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">amp-unmask</code>, and <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">amp-block</code> for element-level control.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
            <span><strong className="text-amp-blue">CSS selector blocking</strong> — use <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">privacyConfig.blockSelector</code> to block elements by selector at init time.</span>
          </li>
        </ul>
        <Link
          to="/privacy"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-amp-light px-3 py-1.5 text-sm font-semibold text-amp-indigo hover:bg-amp-border transition-colors"
        >
          View all privacy & masking options
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Deletion context — factual, not alarming */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">How replay data deletion works</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Session Replay data is tied to the events in a session. Deleting replays means deleting those events through the User Privacy API or DSAR API, which also removes the associated analytics history for that user. There isn't a way to delete just the replay recording while keeping the events.
        </p>
        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          This is the main reason it's worth getting masking right up front — it avoids a situation where the only way to remove captured PII is to erase a user's event history entirely.
        </p>
        <Link
          to="/deletion"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-amp-light px-3 py-1.5 text-sm font-semibold text-amp-indigo hover:bg-amp-border transition-colors"
        >
          View deletion methods & compliance
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* Sampling / quota */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-2">Start with a low sample rate</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Begin with a low sample rate (e.g., 10–25%) and verify that masking looks correct in the Amplitude UI before scaling up. This limits exposure if something is misconfigured and helps you stay within your monthly session quota.
        </p>
      </div>

      {/* Single instance */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-2">Ensure exactly one Amplitude instance</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Session Replay doesn't work correctly when multiple Amplitude instances are active on the same page or app. Before enabling SR, confirm there is only one instance initialized on pages where you want to capture replays.
        </p>
      </div>

      {/* Event property limit */}
      <div className="rounded-2xl border-2 border-callout-warning-border bg-callout-warning-bg p-6">
        <div className="flex gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#9888;</span>
          <div>
            <h3 className="text-sm font-bold text-amber-800">
              Check your event property count
            </h3>
            <p className="mt-2 text-sm text-amber-700 leading-relaxed">
              Amplitude projects have a <strong>2,000 event property limit</strong>. If your project is at or near this limit, new properties won't be indexed, which can impact your broader analytics. Check your property count in <strong>Data &gt; Properties</strong> before enabling Session Replay.
            </p>
          </div>
        </div>
      </div>

      {/* Ready to start */}
      <div className="rounded-xl bg-gradient-to-r from-amp-indigo to-amp-purple p-6 text-white text-center">
        <p className="text-lg font-semibold">Ready to start?</p>
        <p className="mt-1 text-sm text-indigo-100">
          Once you've reviewed masking and the items above, follow the full implementation guide.
        </p>
        <Link
          to="/guide"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
        >
          Go to the Full Guide
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
