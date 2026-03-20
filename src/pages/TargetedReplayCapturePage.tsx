export function TargetedReplayCapturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Targeted Replay Capture</h2>
        <p className="mt-1 text-sm text-gray-500">
          Capture session replays based on specific criteria — user properties, event properties, or
          events — instead of relying on random sampling alone.
        </p>
      </div>

      {/* Overview callout */}
      <div className="rounded-2xl border-2 border-callout-tip-border bg-callout-tip-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#8505;</span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Targeted Replay Capture (TRC) is a per-project feature. The Session Replay SDK fetches
              targeting rules from Amplitude's remote config service at session start and evaluates
              them at runtime to decide whether to capture.
            </p>
            <a
              href="https://amplitude.com/docs/session-replay/targeted-replay-capture"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amp-indigo hover:underline"
            >
              Official TRC documentation
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Prerequisites</h3>
        <ul className="space-y-3">
          <Bullet bold="Browser SDK Plugin only">
            TRC requires the{' '}
            <strong className="text-amp-blue">Session Replay Browser SDK Plugin</strong> at version{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
              @amplitude/plugin-session-replay-browser@1.22.0
            </code>{' '}
            or higher. The standalone SDK is <strong>not supported</strong>.
          </Bullet>
          <Bullet bold="Amplitude Browser Analytics SDK">
            Both the Amplitude Browser Analytics SDK and the Session Replay Plugin must be integrated
            — TRC relies on the analytics SDK to receive and evaluate user/event properties.
          </Bullet>
          <Bullet bold="Admin permissions">
            You must have the appropriate org/project permissions to manage Session Replay settings.
            See Amplitude's{' '}
            <a
              href="https://amplitude.com/docs/admin/account-management/user-roles-permissions#manage-session-replay-and-heatmap-settings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amp-indigo hover:underline"
            >
              user roles &amp; permissions docs
            </a>{' '}
            for details.
          </Bullet>
          <Bullet bold="Data must be sent">
            Events, event properties, and user properties used as targeting conditions must actually
            be captured and sent to Amplitude during the session — TRC cannot evaluate data it has
            not received.
          </Bullet>
        </ul>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-4">How TRC Works</h3>
        <p className="text-sm text-gray-700 mb-4">
          The SDK fetches targeting rules once at session start and applies them for the entire
          session. Capture begins only after a matching condition is met — there is no lookback
          period.
        </p>
        <div className="space-y-3">
          <Step number={1} title="Configuration">
            A targeting rule is configured in{' '}
            <strong>Settings &rarr; Organizational Settings &rarr; Session Replay Settings</strong>.
            Rules can target user properties, event properties, or specific events and are combined
            with OR logic.
          </Step>
          <Step number={2} title="SDK fetches config at session start">
            When a session begins, the SDK retrieves the current targeting configuration from
            Amplitude's remote config service.
          </Step>
          <Step number={3} title="Identify / track calls fire">
            As the user interacts, your app fires <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">identify</code> calls
            (carrying user properties) and <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">track</code> calls (carrying
            event properties / event names).
          </Step>
          <Step number={4} title="SDK evaluates the rule">
            Each call is evaluated against the targeting config. If the condition is not met, capture
            does not start. When the condition is met, recording begins immediately.
          </Step>
          <Step number={5} title="Replay is captured &amp; sent">
            Once triggered, session replay data is recorded and sent to Amplitude. Rule updates only
            affect new sessions — the configuration is locked for the duration of the current session.
          </Step>
        </div>
      </div>

      {/* Standalone not supported warning */}
      <div className="rounded-2xl border-2 border-callout-warning-border bg-callout-warning-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#9888;</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              <strong>Standalone SDK not supported.</strong> If your implementation uses the
              standalone Session Replay SDK instead of the Browser SDK Plugin, TRC will not work. You
              must migrate to the plugin-based setup to use this feature.
            </p>
          </div>
        </div>
      </div>

      {/* User Property targeting — new feature */}
      <div className="rounded-2xl border-2 border-amp-indigo/30 bg-amp-light p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block rounded-full bg-amp-indigo px-2.5 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wide">
            New
          </span>
          <h3 className="text-base font-semibold text-amp-blue">User Property Targeting</h3>
        </div>
        <p className="text-sm text-gray-700 mb-5">
          You can now target session replay capture based on{' '}
          <strong>user properties</strong> — for example, only capture sessions where{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">country = Canada</code>. This
          is useful for sampling specific segments, troubleshooting regional issues, or controlling
          replay volume.
        </p>

        {/* Visual flow diagram */}
        <div className="rounded-xl border border-amp-border bg-white p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Evaluation flow — user property targeting
          </p>

          {/* Config box */}
          <div className="flex flex-col items-center gap-0">
            <FlowBox color="indigo" label="TRC Rule configured in Amplitude" detail='e.g. country = "Canada"' />
            <Arrow />

            {/* Identify call */}
            <FlowBox color="gray" label="identify() call fires" detail="Sends user properties to Amplitude" />
            <Arrow />

            {/* Decision fork */}
            <div className="w-full max-w-md">
              <div className="rounded-lg border-2 border-amp-indigo/40 bg-amp-indigo/5 px-4 py-3 text-center">
                <p className="text-xs font-semibold text-amp-indigo uppercase tracking-wide">SDK evaluates rule</p>
                <p className="mt-0.5 text-xs text-gray-600">Does the user's property match the targeting condition?</p>
              </div>
            </div>

            {/* Two paths */}
            <div className="mt-3 w-full max-w-md grid grid-cols-2 gap-3">
              {/* No match */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="h-px w-6 bg-gray-300" />
                  No match
                  <span className="h-px w-6 bg-gray-300" />
                </div>
                <div className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold text-red-700">Session dropped</p>
                  <p className="mt-0.5 text-[11px] text-red-500">e.g. country = "USA"</p>
                  <p className="mt-1 text-[11px] text-red-500">No replay captured</p>
                </div>
              </div>

              {/* Match */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="h-px w-6 bg-gray-300" />
                  Match
                  <span className="h-px w-6 bg-gray-300" />
                </div>
                <div className="w-full rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-center">
                  <p className="text-xs font-semibold text-green-700">Capture triggered</p>
                  <p className="mt-0.5 text-[11px] text-green-600">e.g. country = "Canada"</p>
                  <p className="mt-1 text-[11px] text-green-600">
                    track() call fires on next page → replay begins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The gotcha */}
        <div className="mt-5 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-4">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
            Critical implementation detail
          </p>
          <p className="text-sm text-amber-900">
            The <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">identify()</code> call
            containing the targeting property{' '}
            <strong>must fire before</strong> TRC can evaluate whether to capture the session. If
            the identify call is missing, delayed, or does not include the targeted property (e.g.{' '}
            <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">country</code>), the replay
            will <strong>not</strong> trigger — even if the user belongs to the targeted segment.
          </p>
        </div>
      </div>

      {/* Setup requirements */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Setup Requirements</h3>
        <ul className="space-y-3">
          <Bullet bold="SDK Plugin ≥ 1.22.0">
            Install or upgrade{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
              @amplitude/plugin-session-replay-browser
            </code>{' '}
            to at least <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">1.22.0</code>.
          </Bullet>
          <Bullet bold="Configure rules in Amplitude">
            Go to <strong>Settings &rarr; Organizational Settings &rarr; Session Replay Settings</strong>,
            navigate to the Sampling section, and select <strong>Add Condition</strong>. Choose your
            targeting type (user property, event property, or event) and define the matching value.
          </Bullet>
          <Bullet bold="Fire identify() before page load">
            Ensure your{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">amplitude.identify()</code>{' '}
            call — with all user properties needed for targeting — fires as early as possible in the
            session, ideally before or immediately after SDK initialization.
          </Bullet>
          <Bullet bold="Verify properties are in the payload">
            Use your browser's Network tab to inspect the identify payload and confirm the targeting
            property (e.g. <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">country</code>)
            is present with the correct value.
          </Bullet>
          <Bullet bold="Confirm track calls follow">
            After the identify call sets a matching property, look for subsequent Amplitude network
            requests to verify that session replay track calls begin firing.
          </Bullet>
        </ul>
      </div>

      {/* Validation / testing */}
      <div className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-amp-blue mb-3">Testing Your Implementation</h3>
        <p className="text-sm text-gray-700 mb-4">
          Use your browser's Developer Tools to validate that TRC is working correctly:
        </p>
        <ol className="space-y-3 list-none">
          <ValidationStep number={1}>
            Open the <strong>Network tab</strong> in DevTools and filter for requests to{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">api2.amplitude.com</code> or
            your Amplitude endpoint.
          </ValidationStep>
          <ValidationStep number={2}>
            Trigger the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">identify()</code>{' '}
            call and inspect its payload. Confirm the targeting property (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">country: "Canada"</code>) is
            present.
          </ValidationStep>
          <ValidationStep number={3}>
            Navigate to a new page. Observe the subsequent network requests — you should see session
            replay track calls begin firing only after the matching identify call.
          </ValidationStep>
          <ValidationStep number={4}>
            Repeat with a non-matching property value (e.g.{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">country: "USA"</code>) and
            confirm that no replay track calls appear.
          </ValidationStep>
        </ol>
      </div>

      {/* Capture timing callout */}
      <div className="rounded-2xl border-2 border-callout-warning-border bg-callout-warning-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#9888;</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              <strong>No lookback period.</strong> Replay capture begins only{' '}
              <em>after</em> the targeting condition triggers. Events that occurred earlier in the
              session before the condition was met are not included in the recording. Design your
              identify calls accordingly.
            </p>
          </div>
        </div>
      </div>

      {/* Docs link */}
      <div className="rounded-xl bg-gradient-to-r from-amp-indigo to-amp-purple p-6 text-white text-center">
        <p className="text-lg font-semibold">Read the full TRC documentation</p>
        <p className="mt-1 text-sm text-indigo-100">
          Configuration steps, quota management, and advanced condition combinations.
        </p>
        <a
          href="https://amplitude.com/docs/session-replay/targeted-replay-capture"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
        >
          Amplitude Docs: Targeted Replay Capture
          <span aria-hidden="true">&rarr;</span>
        </a>
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

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amp-indigo text-xs font-bold text-white">
        {number}
      </span>
      <div className="text-sm text-gray-700">
        <strong className="text-amp-blue">{title}: </strong>
        {children}
      </div>
    </div>
  );
}

function ValidationStep({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amp-indigo/10 text-[11px] font-bold text-amp-indigo">
        {number}
      </span>
      <span>{children}</span>
    </li>
  );
}

function FlowBox({
  color,
  label,
  detail,
}: {
  color: 'indigo' | 'gray';
  label: string;
  detail: string;
}) {
  const border = color === 'indigo' ? 'border-amp-indigo bg-amp-indigo/5' : 'border-gray-300 bg-gray-50';
  const labelColor = color === 'indigo' ? 'text-amp-indigo' : 'text-gray-700';
  return (
    <div className={`w-full max-w-md rounded-lg border-2 ${border} px-4 py-3 text-center`}>
      <p className={`text-xs font-semibold ${labelColor}`}>{label}</p>
      <p className="mt-0.5 text-[11px] text-gray-500">{detail}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center my-1 text-gray-400">
      <div className="h-5 w-px bg-gray-300" />
      <svg className="h-3 w-3 -mt-1" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 10L1 4h10z" />
      </svg>
    </div>
  );
}
