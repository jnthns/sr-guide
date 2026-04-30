export const GTM_CONTAINER_ID = 'GTM-WTM5V2PL';

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    amplitude?: {
      setOptOut?: (enabled: boolean) => void;
    };
    dataLayer?: DataLayerEvent[];
  }
}

let isGtmTrackingMuted = false;

export function muteParentGtm() {
  muteGtmTracking();
}

export function muteGtmTracking() {
  isGtmTrackingMuted = true;
  window.amplitude?.setOptOut?.(true);
}

export function resumeGtmTracking() {
  isGtmTrackingMuted = false;
  window.amplitude?.setOptOut?.(false);
}

export function pushGtmEvent(event: string, properties: Record<string, unknown> = {}) {
  if (isGtmTrackingMuted) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...properties });
}

export function loadGoogleTagManager(containerId = GTM_CONTAINER_ID) {
  if (!containerId || containerId === 'GTM-REPLACE-ME') {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: 'gtm.js',
    'gtm.start': Date.now(),
  });

  const scriptId = `gtm-script-${containerId}`;
  if (document.getElementById(scriptId)) {
    return;
  }

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}
