import { track } from '../analytics';

const validationCategories = [
  {
    title: 'Remote Configuration Validation',
    status: 'info' as const,
    description:
      'Checks that the remote Session Replay configuration is correct for your project — including whether session replay is enabled, the sample rate is set, and mobile capture is turned on (if applicable).',
  },
  {
    title: 'Analytics Event Data Validation',
    status: 'success' as const,
    description:
      'Verifies that events are being received with valid session IDs and device IDs. Flags events with missing or invalid session IDs (e.g., -1) that would prevent replay linkage.',
  },
  {
    title: 'Session Replay Ingestion Validation',
    status: 'error' as const,
    description:
      'Monitors replay data ingestion in real time. Shows whether replay payloads are being received, and surfaces any that are blocked or throttled.',
  },
  {
    title: 'Session Replay Data Connection Validation',
    status: 'error' as const,
    description:
      'Confirms that captured replays can be linked back to analytics events. Detects mismatches between replay data and event data (e.g., device ID or session ID drift).',
  },
];

const diagnosticCharts = [
  {
    title: 'Throttling',
    description:
      'Shows when and how often replay ingestion is being throttled. Use this to identify whether your replay volume is exceeding rate limits.',
  },
  {
    title: 'Quota Monitoring',
    description:
      'Tracks your monthly Session Replay usage against your plan quota. Helps you avoid hitting the cap unexpectedly.',
  },
  {
    title: 'Invalid Session IDs',
    description:
      'Surfaces events and replays with session IDs that are missing, -1, or non-timestamp values — the most common cause of replays failing to appear.',
  },
];

const statusIcon: Record<string, string> = {
  info: '?',
  success: '\u2713',
  error: '!',
};

const statusColor: Record<string, { bg: string; border: string; icon: string }> = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-600' },
};

export function SystemStatusPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">System Status</h2>
        <p className="mt-1 text-sm text-gray-500">
          The System Status page in Amplitude runs automated checks on your Session Replay setup and
          provides diagnostic charts to help you identify and resolve issues.
        </p>
      </div>

      {/* How to access */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue">How to access</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          Navigate to <strong>Users &amp; Sessions &gt; Session Replays &gt; Gear Icon &gt; System Status</strong>.
          This page is available to all users, but some configuration changes require admin access.
        </p>
      </div>

      {/* Validation categories */}
      <div>
        <h3 className="text-base font-semibold text-amp-blue mb-3">Validation Checks</h3>
        <p className="text-sm text-gray-500 mb-4">
          System Status runs four automated validation checks. Each reports a status and expands to show details.
        </p>
        <div className="space-y-3">
          {validationCategories.map((cat) => {
            const colors = statusColor[cat.status];
            return (
              <button
                key={cat.title}
                onClick={() => track('system_status_category_clicked', { category: cat.title })}
                className={`w-full rounded-xl border ${colors.border} ${colors.bg} p-4 text-left transition-colors hover:shadow-sm cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colors.icon}`}
                  >
                    {statusIcon[cat.status]}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{cat.title}</h4>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnostic charts */}
      <div>
        <h3 className="text-base font-semibold text-amp-blue mb-3">Diagnostic Charts</h3>
        <p className="text-sm text-gray-500 mb-4">
          In addition to validation checks, System Status provides diagnostic charts that give
          visibility into your replay pipeline.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {diagnosticCharts.map((chart) => (
            <div
              key={chart.title}
              className="rounded-xl border border-amp-border bg-white p-5 shadow-sm"
            >
              <h4 className="text-sm font-semibold text-amp-blue">{chart.title}</h4>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{chart.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-2xl border-2 border-callout-tip-border bg-callout-tip-bg p-6">
        <div className="flex gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#128161;</span>
          <div>
            <h3 className="text-sm font-bold text-emerald-800">When to use System Status</h3>
            <ul className="mt-2 text-sm text-emerald-700 leading-relaxed space-y-1 list-disc list-inside">
              <li>After initial setup — to verify everything is connected end-to-end.</li>
              <li>When replays stop appearing — to diagnose whether the issue is ingestion, linkage, or configuration.</li>
              <li>Proactively — to monitor quota usage and catch throttling before it impacts coverage.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
