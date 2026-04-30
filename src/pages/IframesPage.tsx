import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { muteParentGtm, pushGtmEvent, resumeGtmTracking } from '../gtm';

const LOCAL_IFRAME_SRC = `${import.meta.env.BASE_URL}iframe-local-test`;
const EXTERNAL_IFRAME_URL = 'https://example.com';
const EXTERNAL_IFRAME_INTERACTION_EVENT = 'external_iframe_interaction';
type ActiveIframe = 'local_controlled' | 'external' | null;

export function IframesPage() {
  const [isExternalIframeActivated, setIsExternalIframeActivated] = useState(false);
  const [activeIframe, setActiveIframe] = useState<ActiveIframe>(null);
  const localIframeRef = useRef<HTMLIFrameElement>(null);
  const externalIframeWrapperRef = useRef<HTMLDivElement>(null);

  const pauseParentTracking = useCallback((iframeType: Exclude<ActiveIframe, null>) => {
    setActiveIframe(iframeType);
    window.setTimeout(() => muteParentGtm(), 0);
  }, []);

  const resumeParentTracking = useCallback((triggerSource: string) => {
    if (!activeIframe) return;

    if (activeIframe === 'local_controlled') {
      localIframeRef.current?.contentWindow?.postMessage(
        { type: 'iframe_tracking_inactive' },
        window.location.origin,
      );
    }

    resumeGtmTracking();
    pushGtmEvent('parent_tracking_resumed', {
      previous_iframe_type: activeIframe,
      trigger_source: triggerSource,
    });
    setActiveIframe(null);
  }, [activeIframe]);

  const handleParentPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!activeIframe) return;

    const target = e.target;
    if (!(target instanceof Node)) return;

    const activeIframeElement = activeIframe === 'local_controlled'
      ? localIframeRef.current
      : externalIframeWrapperRef.current;

    if (activeIframeElement?.contains(target)) return;

    resumeParentTracking('parent_pointer_down');
  }, [activeIframe, resumeParentTracking]);

  useEffect(() => {
    pushGtmEvent('iframes_page_loaded', { gtm_initialized: true });

    const handleMessage = (e: MessageEvent) => {
      if (e.source !== localIframeRef.current?.contentWindow) return;

      if (e.data?.type === 'iframe_amplitude_init') {
        pushGtmEvent('iframe_amplitude_init', {
          iframe_type: e.data.iframe_type ?? 'local_controlled',
          trigger_source: e.data.trigger_source ?? 'iframe_click',
        });
        pushGtmEvent('iframe_active', { source: 'local_iframe' });
        pauseParentTracking('local_controlled');
        return;
      }

      if (e.data?.type === 'iframe_active') {
        pushGtmEvent('iframe_active', { source: 'local_iframe' });
        pauseParentTracking('local_controlled');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      resumeGtmTracking();
    };
  }, [pauseParentTracking]);

  function activateExternalIframe(e?: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) {
    e?.stopPropagation();

    resumeGtmTracking();
    pushGtmEvent(EXTERNAL_IFRAME_INTERACTION_EVENT, {
      iframe_type: 'external',
      trigger_source: 'parent_activation_overlay',
    });
    pushGtmEvent('iframe_active', { source: 'external_iframe' });
    pauseParentTracking('external');
    setIsExternalIframeActivated(true);
  }

  function prepareExternalIframeActivation(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    muteParentGtm();
  }

  return (
    <div className="space-y-6" data-testid="iframes-page" onPointerDownCapture={handleParentPointerDown}>
      <div data-testid="iframes-page-header">
        <h2 className="text-xl font-bold text-amp-blue" data-testid="iframes-page-title">Iframe Testing</h2>
        <p className="mt-1 text-sm text-gray-500" data-testid="iframes-page-description">
          Test Guides and Surveys behavior when GTM initializes on the parent page,
          inside a same-origin iframe after click, and around an external iframe boundary.
        </p>
      </div>

      <div
        className="rounded-2xl border-2 border-callout-tip-border bg-callout-tip-bg px-5 py-4"
        data-testid="iframes-page-info-callout"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg shrink-0" aria-hidden="true" data-testid="iframes-page-info-icon">&#8505;</span>
          <div className="space-y-1 text-sm text-blue-800">
            <p className="font-medium" data-testid="iframes-page-info-summary">
              This route loads GTM on the parent page and opts this app out of Amplitude tracking.
            </p>
            <p data-testid="iframes-page-info-detail">
              The local iframe pushes <code className="rounded bg-white/60 px-1 py-0.5 text-xs" data-testid="iframes-page-local-event-name">iframe_amplitude_init</code>
              {' '}inside its own document on first click. The external iframe pushes <code className="rounded bg-white/60 px-1 py-0.5 text-xs" data-testid="iframes-page-external-event-name">{EXTERNAL_IFRAME_INTERACTION_EVENT}</code>
              {' '}from the parent activation overlay because cross-origin iframe contents cannot be modified here.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2" data-testid="iframes-debug-grid">
        <IframeCard
          title="Local controlled iframe"
          description="Same-origin iframe content served by this app. Click anywhere inside the iframe to push iframe_amplitude_init into the iframe dataLayer and request iframe GTM initialization."
          testId="local-iframe-card"
        >
          <iframe
            ref={localIframeRef}
            title="Local controlled Guides and Surveys iframe test"
            src={LOCAL_IFRAME_SRC}
            className="h-[520px] w-full rounded-xl border border-amp-border bg-white"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            data-testid="local-controlled-iframe"
          />
        </IframeCard>

        <IframeCard
          title="External iframe"
          description={`Cross-origin iframe for comparison. Click the activation overlay to push ${EXTERNAL_IFRAME_INTERACTION_EVENT} on the parent dataLayer before interacting with the external content.`}
          testId="external-iframe-card"
        >
          <div ref={externalIframeWrapperRef} className="relative" data-testid="external-iframe-wrapper">
            <iframe
              title="External iframe test"
              src={EXTERNAL_IFRAME_URL}
              className="h-[520px] w-full rounded-xl border border-amp-border bg-white"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              data-testid="external-iframe"
            />
            {!isExternalIframeActivated && (
              <div
                role="button"
                tabIndex={0}
                onPointerDown={prepareExternalIframeActivation}
                onClick={activateExternalIframe}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateExternalIframe(e);
                  }
                }}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-amp-blue/80 p-6 text-center text-white"
                data-testid="external-iframe-activation-overlay"
              >
                <div className="max-w-sm" data-testid="external-iframe-activation-content">
                  <p className="text-sm font-semibold" data-testid="external-iframe-activation-title">External iframe interaction is paused</p>
                  <p className="mt-2 text-sm text-indigo-100" data-testid="external-iframe-activation-description">
                    Click below to push <code className="rounded bg-white/10 px-1 py-0.5 text-xs" data-testid="external-iframe-event-name">{EXTERNAL_IFRAME_INTERACTION_EVENT}</code>
                    {' '}to the parent dataLayer, then interact with the external iframe.
                  </p>
                  <span
                    className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-amp-blue transition-colors"
                    data-testid="external-iframe-activate-button"
                  >
                    Activate external iframe
                  </span>
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
  testId,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <section className="rounded-2xl border border-amp-border bg-white p-6 shadow-sm" data-testid={testId}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-amp-blue" data-testid={`${testId}-title`}>{title}</h3>
        <p className="mt-1 text-sm text-gray-600" data-testid={`${testId}-description`}>{description}</p>
      </div>
      {children}
    </section>
  );
}
