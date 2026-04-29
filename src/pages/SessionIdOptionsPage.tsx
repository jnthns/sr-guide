import { Link } from 'react-router-dom';

export function SessionIdOptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Session ID Options</h2>
        <p className="mt-1 text-sm text-gray-500">
          Session Replay needs a session ID to link replays to events. Here are the approaches available depending on how your analytics pipeline works.
        </p>
      </div>

      {/* Option 1: Unix timestamp */}
      <div className="rounded-2xl border-2 border-amp-indigo/20 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amp-indigo text-white text-sm font-bold">1</span>
          <div>
            <h3 className="text-base font-semibold text-amp-blue">Send Session ID as a Unix timestamp</h3>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Recommended</span>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              The standard approach. Set your session ID to a Unix timestamp in milliseconds (e.g., <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">Date.now()</code>) at the start of each session. This is what Amplitude's own SDKs do by default.
            </p>
            <div className="mt-3 rounded-lg bg-amp-light p-4">
              <p className="text-sm font-medium text-amp-blue mb-2">Why this is recommended</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Works with Amplitude's default session definition out of the box.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Session-based charts (Journeys, Pathfinder, User Sessions) work correctly because they depend on timestamp-based session boundaries.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Session Replay links directly to the specific session in which events occurred.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>If you're using Amplitude's Browser SDK, iOS SDK, or Android SDK, this is already handled for you.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Option 2: Custom property + custom session definition */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-amp-blue text-sm font-bold">2</span>
          <div>
            <h3 className="text-base font-semibold text-amp-blue">Send a unique property as Session ID + custom session definition</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              If your analytics pipeline already has its own concept of a session (e.g., a UUID or internal session token), you can send that as the session ID and change your Amplitude project's session definition to match.
            </p>
            <div className="mt-3 rounded-lg bg-amp-light p-4">
              <p className="text-sm font-medium text-amp-blue mb-2">How it works</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Send your custom session identifier as an event property on every event.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>In <strong className="text-amp-blue">Amplitude project settings</strong>, change the session definition to use that property as the session grouping key.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Amplitude will group events into sessions based on matching values of your custom property.</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 rounded-lg border border-callout-warning-border bg-callout-warning-bg p-4">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Trade-off:</strong> Changing the session definition is a project-wide setting that affects all users and charts. Session-based features (Journeys, Pathfinder) will use your custom property instead of timestamps, which may change how sessions appear across the product. Make sure your team is aligned before making this change.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Option 3: Time-based session definition */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-amp-blue text-sm font-bold">3</span>
          <div>
            <h3 className="text-base font-semibold text-amp-blue">Use Amplitude's time-based session definition</h3>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              If you can't send a session ID at all, you can switch to Amplitude's time-based session definition. Amplitude will automatically group events into sessions based on inactivity gaps — sessions end after 30 or 60 minutes of no events (configurable in project settings).
            </p>
            <div className="mt-3 rounded-lg bg-amp-light p-4">
              <p className="text-sm font-medium text-amp-blue mb-2">When to use this</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>Your analytics pipeline (e.g., Segment Cloud mode, warehouse imports) doesn't send session IDs.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>You want a quick path to getting Session Replay working without changing your instrumentation.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amp-indigo" />
                  <span>The inactivity timeout (30 or 60 min) is a reasonable approximation of your session boundaries.</span>
                </li>
              </ul>
            </div>
            <div className="mt-3 rounded-lg border border-callout-warning-border bg-callout-warning-bg p-4">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Trade-off:</strong> With time-based sessions, Amplitude assigns sessions retroactively based on event timing. This means you can't correlate a specific replay to a specific event within the session as precisely. Session boundaries may also differ from what your own analytics defines as a "session."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary / comparison */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-amp-blue mb-4">Quick Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amp-border text-left">
                <th className="pb-2 pr-4 font-semibold text-amp-blue">Approach</th>
                <th className="pb-2 pr-4 font-semibold text-amp-blue">Session Charts</th>
                <th className="pb-2 pr-4 font-semibold text-amp-blue">Replay Linking</th>
                <th className="pb-2 font-semibold text-amp-blue">Effort</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-amp-border/50">
                <td className="py-2.5 pr-4 font-medium text-amp-blue">Unix timestamp</td>
                <td className="py-2.5 pr-4">Full support</td>
                <td className="py-2.5 pr-4">Precise</td>
                <td className="py-2.5">Varies by pipeline</td>
              </tr>
              <tr className="border-b border-amp-border/50">
                <td className="py-2.5 pr-4 font-medium text-amp-blue">Custom property</td>
                <td className="py-2.5 pr-4">Uses custom grouping</td>
                <td className="py-2.5 pr-4">Precise</td>
                <td className="py-2.5">Settings change required</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-amp-blue">Time-based</td>
                <td className="py-2.5 pr-4">Inactivity-based</td>
                <td className="py-2.5 pr-4">Approximate</td>
                <td className="py-2.5">No code changes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/guide"
          className="inline-flex items-center gap-1 rounded-lg bg-amp-light px-4 py-2 text-sm font-semibold text-amp-indigo hover:bg-amp-border transition-colors"
        >
          &larr; Back to Full Guide
        </Link>
        <a
          href="https://amplitude.com/docs/data/sources/instrument-track-sessions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-amp-light px-4 py-2 text-sm font-semibold text-amp-indigo hover:bg-amp-border transition-colors"
        >
          Session definition docs
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
