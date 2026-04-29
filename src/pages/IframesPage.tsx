import { useEffect, useState } from 'react';
import { loadGoogleTagManager, pushGtmEvent } from '../gtm';

const LOCAL_IFRAME_SRC = `${import.meta.env.BASE_URL}iframe-local-test`;
const EXTERNAL_IFRAME_URL = 'https://example.com';

export function IframesPage() {
  const [isExternalIframeActivated, setIsExternalIframeActivated] = useState(false);

  useEffect(() => {
    loadGoogleTagManager();
  }, []);

  function activateExternalIframe() {
    pushGtmEvent('iframe_amplitude_init', {
      iframe_type: 'external',
      trigger_source: 'parent_activation_overlay',
    });
    setIsExternalIframeActivated(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amp-blue">Iframe Testing</h2>
        <p className="mt-1 text-sm text-gray-500">
          Test Guides and Surveys behavior when GTM initializes on the parent page,
          inside a same-origin iframe after click, and around an external iframe boundary.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-callout-tip-border bg-callout-tip-bg px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true">&#8505;</span>
          <div className="space-y-1 text-sm text-blue-800">
            <p className="font-medium">
              This route loads GTM on the parent page and opts this app out of Amplitude tracking.
            </p>
            <p>
              The local iframe pushes <code className="rounded bg-white/60 px-1 py-0.5 text-xs">iframe_amplitude_init</code>
              {' '}inside its own document on first click. The external iframe uses a parent
              activation overlay because cross-origin iframe contents cannot be modified here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IframeCard
          title="Local controlled iframe"
          description="Same-origin iframe content served by this app. Click anywhere inside the iframe to push iframe_amplitude_init into the iframe dataLayer and request iframe GTM initialization."
        >
          <iframe
            title="Local controlled Guides and Surveys iframe test"
            src={LOCAL_IFRAME_SRC}
            className="h-[520px] w-full rounded-xl border border-amp-border bg-white"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </IframeCard>

        <IframeCard
          title="External iframe"
          description="Cross-origin iframe for comparison. Use the activation overlay to push iframe_amplitude_init on the parent dataLayer before interacting with the external content."
        >
          <div className="relative">
            <iframe
              title="External iframe test"
              src={EXTERNAL_IFRAME_URL}
              className="h-[520px] w-full rounded-xl border border-amp-border bg-white"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {!isExternalIframeActivated && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-amp-blue/80 p-6 text-center text-white">
                <div className="max-w-sm">
                  <p className="text-sm font-semibold">External iframe interaction is paused</p>
                  <p className="mt-2 text-sm text-indigo-100">
                    Click below to push <code className="rounded bg-white/10 px-1 py-0.5 text-xs">iframe_amplitude_init</code>
                    {' '}to the parent dataLayer, then interact with the external iframe.
                  </p>
                  <button
                    type="button"
                    onClick={activateExternalIframe}
                    className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amp-blue transition-colors hover:bg-indigo-100"
                  >
                    Activate external iframe
                  </button>
                </div>
              </div>
            )}
          </div>
        </IframeCard>
      </div>
    </div>
  );
}

function IframeCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-amp-blue">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </section>
  );
}
