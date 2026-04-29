import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import { plugin as engagementPlugin } from '@amplitude/engagement-browser';
import type { Event } from '@amplitude/analytics-core';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY as string | undefined;

let _origination: string | null = null;
let isInitialized = false;
let isOptedOut = false;

export function setOrigination(label: string) {
  _origination = label;
}

function originationEnrichment() {
  return {
    name: 'origination-enrichment',
    type: 'enrichment' as const,

    setup: async () => undefined,

    execute: async (event: Event): Promise<Event> => {
      if (event.event_type === '[Amplitude] Page Viewed' && _origination) {
        event.event_properties = {
          ...(event.event_properties ?? {}),
          origination: _origination,
        };
        _origination = null;
      }
      return event;
    },
  };
}

export function initAnalytics() {
  if (!API_KEY || isInitialized) return;

  const sessionReplay = sessionReplayPlugin({ sampleRate: 1 });
  amplitude.add(sessionReplay);
  amplitude.add(engagementPlugin());
  amplitude.add(originationEnrichment());

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

  isInitialized = true;
  if (isOptedOut) {
    amplitude.setOptOut(true);
  }
}

export function setAnalyticsOptOut(optOut: boolean) {
  isOptedOut = optOut;
  if (!API_KEY || !isInitialized) return;

  amplitude.setOptOut(optOut);
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!API_KEY || isOptedOut) return;
  amplitude.track(event, properties);
}
