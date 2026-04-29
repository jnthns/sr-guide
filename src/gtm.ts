export const GTM_CONTAINER_ID = 'GTM-WTM5V2PL';

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

let isParentMuted = false;

export function muteParentGtm() {
  isParentMuted = true;
}

export function pushGtmEvent(event: string, properties: Record<string, unknown> = {}) {
  if (isParentMuted) return;
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
