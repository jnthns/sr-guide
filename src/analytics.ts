import * as amplitude from '@amplitude/analytics-browser';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY as string | undefined;

export function initAnalytics() {
  if (!API_KEY) return;

  amplitude.init(API_KEY, {
    autocapture: {
      pageViews: true,
      sessions: false,
      attribution: false,
      fileDownloads: false,
      formInteractions: false,
      elementInteractions: false,
    },
  });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!API_KEY) return;
  amplitude.track(event, properties);
}
