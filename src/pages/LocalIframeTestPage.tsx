import { useCallback, useState } from 'react';
import { loadGoogleTagManager, pushGtmEvent } from '../gtm';

export function LocalIframeTestPage() {
  const [hasInitializedGtm, setHasInitializedGtm] = useState(false);

  const initializeIframeGtm = useCallback(() => {
    if (hasInitializedGtm) return;

    pushGtmEvent('iframe_amplitude_init', {
      iframe_type: 'local_controlled',
      trigger_source: 'iframe_click',
    });
    loadGoogleTagManager();
    setHasInitializedGtm(true);
  }, [hasInitializedGtm]);

  return (
    <main
      onClick={initializeIframeGtm}
      className="min-h-screen bg-white p-6 text-gray-800"
      data-testid="local-iframe-test-page"
    >
      <div className="mx-auto max-w-2xl space-y-5" data-testid="local-iframe-test-content">
        <div data-testid="local-iframe-test-header">
          <p className="text-xs font-semibold uppercase tracking-wide text-amp-indigo" data-testid="local-iframe-test-eyebrow">
            Local controlled iframe
          </p>
          <h1 className="mt-1 text-2xl font-bold text-amp-blue" data-testid="local-iframe-test-title">
            Guides and Surveys iframe test surface
          </h1>
          <p className="mt-2 text-sm text-gray-600" data-testid="local-iframe-test-description">
            GTM is intentionally not loaded until the first click inside this iframe.
            That click pushes <code className="rounded bg-gray-100 px-1 py-0.5 text-xs" data-testid="local-iframe-test-event-name">iframe_amplitude_init</code>
            {' '}to this iframe&apos;s <code className="rounded bg-gray-100 px-1 py-0.5 text-xs" data-testid="local-iframe-test-data-layer-name">dataLayer</code>.
          </p>
        </div>

        <div className="rounded-xl border border-amp-border bg-amp-light p-4" data-testid="local-iframe-gtm-status-card">
          <p className="text-sm font-semibold text-amp-blue" data-testid="local-iframe-gtm-status-label">Iframe GTM status</p>
          <p className="mt-1 text-sm text-gray-600" data-testid="local-iframe-gtm-status-message">
            {hasInitializedGtm
              ? 'iframe_amplitude_init has been pushed and iframe GTM initialization has been requested.'
              : 'Waiting for the first click inside this iframe.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2" data-testid="local-iframe-action-grid">
          <button
            type="button"
            className="rounded-lg bg-amp-indigo px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amp-purple"
            data-testid="local-iframe-primary-cta"
          >
            Primary iframe CTA
          </button>
          <button
            type="button"
            className="rounded-lg border border-amp-border px-4 py-3 text-sm font-semibold text-amp-blue transition-colors hover:bg-amp-light"
            data-testid="local-iframe-secondary-action"
          >
            Secondary iframe action
          </button>
        </div>

        <div className="rounded-xl border border-dashed border-amp-border p-4" data-testid="local-iframe-guide-render-target">
          <h2 className="text-sm font-semibold text-amp-blue" data-testid="local-iframe-guide-render-target-title">Guide render target</h2>
          <p className="mt-1 text-sm text-gray-600" data-testid="local-iframe-guide-render-target-description">
            Use this region to inspect whether a Guides and Surveys plugin renders inside
            the iframe instead of the parent document.
          </p>
        </div>
      </div>
    </main>
  );
}
