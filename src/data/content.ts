import type { ImplementationMethod, SetupContent, ContentItem } from './types';

export const setupContent: Record<ImplementationMethod, SetupContent> = {
  'browser-plugin': {
    installCommands: [
      'npm install @amplitude/plugin-session-replay-browser --save',
    ],
    language: 'javascript',
    codeSnippet: `import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

// Create and install the Session Replay plugin
const sessionReplayTracking = sessionReplayPlugin({
  sampleRate: 0.5, // 50% of sessions — adjust as needed
});
amplitude.add(sessionReplayTracking);

// Your existing initialization logic
amplitude.init(API_KEY);`,
    notes: [
      {
        text: 'Minimum Browser SDK version is 1.9.1. Only the Browser 2.0 SDK is compatible with the plugin.',
        link: { label: 'Browser SDK docs', url: 'https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2' },
      },
      'The plugin automatically manages Session Replay IDs on all tracked events.',
      {
        text: 'Not required to track session start/end events separately.',
      },
      {
        text: 'See all available configuration options in the plugin README.',
        link: { label: 'Plugin configuration', url: 'https://github.com/amplitude/Amplitude-TypeScript/tree/main/packages/plugin-session-replay-browser#configuration' },
      },
    ],
  },

  'standalone-sr-sdk': {
    installCommands: [
      'npm install @amplitude/session-replay-browser --save',
    ],
    language: 'javascript',
    codeSnippet: `import * as sessionReplay from '@amplitude/session-replay-browser';
import thirdPartyAnalytics from 'your-analytics-provider';

const AMPLITUDE_API_KEY = 'your-api-key';

// Initialize Session Replay with device and session IDs from your provider
await sessionReplay.init(AMPLITUDE_API_KEY, {
  deviceId: thirdPartyAnalytics.getDeviceId(),
  sessionId: thirdPartyAnalytics.getSessionId(), // must be Unix timestamp
  sampleRate: 0.5,
}).promise;

// When session ID changes, update the SR SDK
thirdPartyAnalytics.onNewSession((newSessionId) => {
  sessionReplay.setSessionId(newSessionId);
});

// Add SR properties to every event you send
const sessionReplayProperties = sessionReplay.getSessionReplayProperties();
thirdPartyAnalytics.track(eventName, {
  ...eventProperties,
  ...sessionReplayProperties,
});`,
    notes: [
      'You must call getSessionReplayProperties() and include the result on every event you want to be replayable.',
      {
        text: 'deviceId and sessionId must match what your analytics provider sends to Amplitude.',
        link: { label: 'Standalone SDK docs', url: 'https://amplitude.com/docs/session-replay/session-replay-standalone-sdk' },
      },
    ],
  },

  'standalone-sr-sdk-segment': {
    installCommands: [
      'npm install @amplitude/session-replay-browser js-cookie --save',
    ],
    language: 'javascript',
    codeSnippet: `import * as sessionReplay from '@amplitude/session-replay-browser';
import Cookies from 'js-cookie';

const AMPLITUDE_API_KEY = 'your-api-key';

// Generate or retrieve a persistent session ID
const getOrCreateSessionId = () => {
  let sessionId = Cookies.get('analytics_session_id');
  if (!sessionId || sessionId === '0') {
    sessionId = String(Date.now());
    Cookies.set('analytics_session_id', sessionId);
  }
  return Number(sessionId);
};

// Initialize after Segment is ready
analytics.ready(async () => {
  const user = await analytics.user();
  const sessionId = getOrCreateSessionId();
  const deviceId = user.anonymousId();

  await sessionReplay.init(AMPLITUDE_API_KEY, {
    sessionId,
    deviceId,
    sampleRate: 1,
  }).promise;
});

// Middleware 1: Sync session IDs from Amplitude integration
analytics.addSourceMiddleware(({ payload, next }) => {
  const storedSessionId = getOrCreateSessionId();
  const amplitudeIntegration =
    payload.obj.integrations?.['Actions Amplitude'] ||
    payload.obj.integrations?.['Amplitude'];
  const nextSessionId = amplitudeIntegration?.session_id || 0;
  if (nextSessionId && storedSessionId < nextSessionId) {
    Cookies.set('analytics_session_id', String(nextSessionId));
    sessionReplay.setSessionId(nextSessionId);
  }
  next(payload);
});

// Middleware 2: Append SR properties to all track calls
analytics.addSourceMiddleware(({ payload, next }) => {
  if (payload.type() === 'track') {
    const srProps = sessionReplay.getSessionReplayProperties();
    payload.obj.properties = {
      ...payload.obj.properties,
      ...srProps,
    };
  }
  next(payload);
});`,
    notes: [
      'Both middlewares are required. The first keeps session IDs in sync; the second attaches replay properties.',
      {
        text: 'Recommend updating to Amplitude Actions destination in Segment for more reliable session stitching via session_id.',
        link: { label: 'Amplitude (Actions) destination', url: 'https://segment.com/docs/connections/destinations/catalog/actions-amplitude/' },
      },
      {
        text: 'With Segment Cloud mode, use time-based session definitions. With Actions, use default session definitions.',
        link: { label: 'Segment source middleware docs', url: 'https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/middleware/' },
      },
    ],
  },

  'standalone-sr-sdk-legacy': {
    installCommands: [
      'npm install @amplitude/session-replay-browser --save',
    ],
    language: 'javascript',
    codeSnippet: `import * as sessionReplay from '@amplitude/session-replay-browser';

const AMPLITUDE_API_KEY = 'your-api-key';

// Initialize SR SDK using legacy JS SDK's session and device IDs
window.amplitude.getInstance().onInit(() => {
  sessionReplay.init(AMPLITUDE_API_KEY, {
    deviceId: window.amplitude.getInstance().options.deviceId,
    sessionId: window.amplitude.getInstance().getSessionId(),
  });
});

// Update session ID when a new session starts
window.amplitude.getInstance().onNewSessionStart((client) => {
  sessionReplay.setSessionId(client.getSessionId());
});

// Attach SR properties to every logEvent call
const sessionReplayProperties = sessionReplay.getSessionReplayProperties();
window.amplitude.getInstance().logEvent(eventName, {
  ...eventProperties,
  ...sessionReplayProperties,
});`,
    notes: [
      'The legacy JS SDK is NOT compatible with the Session Replay Plugin — you must use the standalone SDK.',
      {
        text: 'Amplitude recommends migrating to the Browser 2.0 SDK and using the plugin instead.',
        link: { label: 'Migration guide', url: 'https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#migrate-from-maintenance-sdk' },
      },
      'You must manually attach getSessionReplayProperties() to every logEvent call.',
    ],
  },

  'gtm-plugin': {
    installCommands: [],
    language: 'html',
    codeSnippet: `<!-- Step 1: Use the Amplitude Browser SDK GTM template for init -->
<!-- (Configure via GTM UI with your API key) -->

<!-- Step 2: Add a Custom HTML tag with the SR plugin -->
<script src="https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.13.2-min.js.gz"></script>
<script>
  const sessionReplayTracking = window.sessionReplay.plugin({
    sampleRate: 0.5,
  });
  window.amplitude.add(sessionReplayTracking);
</script>

<!-- Step 3: Add a separate flush tag (fires on page unload) -->
<script>
  window.amplitude.flush();
</script>`,
    notes: [
      {
        text: 'The GTM Browser SDK template alone does NOT include Session Replay — you must add a separate Custom HTML tag.',
        link: { label: 'GTM setup guide', url: 'https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#google-tag-manager' },
      },
      'Set the SR Custom HTML tag to fire after the Amplitude init tag.',
      'Add a flush tag that fires on the "Window Unloaded" or "Page Visibility" trigger to ensure replays are sent.',
      {
        text: 'Use the latest SR plugin version from the changelog.',
        link: { label: 'SR Plugin changelog', url: 'https://github.com/amplitude/Amplitude-TypeScript/blob/main/packages/plugin-session-replay-browser/CHANGELOG.md' },
      },
    ],
  },

  'standalone-sr-sdk-warehouse': {
    installCommands: [
      'npm install @amplitude/session-replay-browser --save',
    ],
    language: 'javascript',
    codeSnippet: `import * as sessionReplay from '@amplitude/session-replay-browser';

const AMPLITUDE_API_KEY = 'your-api-key';

// Initialize the standalone SR SDK client-side
await sessionReplay.init(AMPLITUDE_API_KEY, {
  deviceId: 'your-device-id',
  sessionId: Date.now(), // Unix timestamp
  sampleRate: 0.5,
}).promise;

// In your data warehouse / event table, add this property:
// Column: [Amplitude] Session Replay ID
// Value:  deviceId + "/" + sessionId
//
// Example row:
// | Event         | Device ID                            | Session ID    | [Amplitude] Session Replay ID                    |
// | Signed Up     | 9ec2ef9a-4bf3-41dc-86e3-8acec92ad1c1 | 1739559241974 | 9ec2ef9a-4bf3-41dc-86e3-8acec92ad1c1/1739559241974 |`,
    notes: [
      'You must still run the SR SDK client-side to capture DOM changes. The warehouse path only controls how events reach Amplitude.',
      {
        text: 'The [Amplitude] Session Replay ID value is deviceId/sessionId (slash-separated).',
        link: { label: 'HTTP API v2 reference', url: 'https://amplitude.com/docs/apis/analytics/http-v2' },
      },
      'Only include this property on events within sessions you want replayable — each counts toward monthly quota.',
    ],
  },

  'ios-plugin': {
    installCommands: [
      '// Swift Package Manager\n.package(url: "https://github.com/amplitude/AmplitudeSessionReplay-iOS", .branch("main"))\n.product(name: "AmplitudeSwiftSessionReplayPlugin", package: "AmplitudeSessionReplay")',
      '// CocoaPods\npod \'AmplitudeSessionReplay\', :git => \'https://github.com/amplitude/AmplitudeSessionReplay-iOS.git\'\npod \'AmplitudeSwiftSessionReplayPlugin\', :git => \'https://github.com/amplitude/AmplitudeSessionReplay-iOS.git\'',
    ],
    language: 'swift',
    codeSnippet: `import AmplitudeSwift
import AmplitudeSwiftSessionReplayPlugin

let amplitude = Amplitude(
    configuration: Configuration(apiKey: API_KEY)
)

// Create and install Session Replay Plugin
// Recording begins automatically
amplitude.add(
    plugin: AmplitudeSwiftSessionReplayPlugin(sampleRate: 1.0)
)`,
    notes: [
      {
        text: 'Requires iOS Swift SDK version 1.9.0 or higher.',
        link: { label: 'iOS Swift SDK docs', url: 'https://amplitude.com/docs/sdks/analytics/ios/unified-sdk' },
      },
      {
        text: 'Use the latest version of the Session Replay plugin above 0.0.11.',
        link: { label: 'GitHub releases', url: 'https://github.com/amplitude/AmplitudeSessionReplay-iOS/releases' },
      },
      'Supports SwiftUI and UIKit.',
    ],
  },

  'ios-middleware': {
    installCommands: [
      '// Swift Package Manager\n.package(url: "https://github.com/amplitude/AmplitudeSessionReplay-iOS", .branch("main"))\n.product(name: "AmplitudeiOSSessionReplayMiddleware", package: "AmplitudeSessionReplay")',
      '// CocoaPods\npod \'AmplitudeSessionReplay\', :git => \'https://github.com/amplitude/AmplitudeSessionReplay-iOS.git\'\npod \'AmplitudeiOSSessionReplayMiddleware\', :git => \'https://github.com/amplitude/AmplitudeSessionReplay-iOS.git\'',
    ],
    language: 'swift',
    codeSnippet: `import Amplitude
import AmplitudeiOSSessionReplayMiddleware

let amplitude = Amplitude.instance()
amplitude.defaultTracking.sessions = true

// Create and install Session Replay middleware
amplitude.addEventMiddleware(
    AmplitudeiOSSessionReplayMiddleware(sampleRate: 0.1)
)
amplitude.initializeApiKey(API_KEY)`,
    notes: [
      'For the legacy/maintenance iOS SDK only.',
      'Session ID and Device ID must match those sent as event properties to Amplitude.',
      {
        text: 'You must track sessions with a timestamp and inform the SDK when it changes.',
        link: { label: 'iOS SR middleware docs', url: 'https://amplitude.com/docs/session-replay/session-replay-ios-plugin' },
      },
    ],
  },

  'ios-standalone-sdk': {
    installCommands: [
      '// Swift Package Manager\n.package(url: "https://github.com/amplitude/AmplitudeSessionReplay-iOS", .branch("main"))\n.product(name: "AmplitudeSessionReplay", package: "AmplitudeSessionReplay")',
    ],
    language: 'swift',
    codeSnippet: `import AmplitudeSessionReplay
import ThirdPartyAnalytics

let sessionReplay = SessionReplay(
    apiKey: AMPLITUDE_API_KEY,
    deviceId: DEVICE_ID,
    sessionId: SESSION_ID,
    sampleRate: 0.1
)

// Track an event with session replay properties
var eventProperties = event.eventProperties ?? [:]
eventProperties.merge(
    sessionReplay.additionalEventProperties
) { (current, _) in current }
event.eventProperties = eventProperties
ThirdPartyAnalytics.track(event)

// Keep IDs in sync when they change
sessionReplay.sessionId = ThirdPartyAnalytics.getSessionId()
sessionReplay.deviceId = ThirdPartyAnalytics.getDeviceId()

// Always flush before app exit
sessionReplay.flush()`,
    notes: [
      {
        text: 'You are responsible for keeping deviceId and sessionId in sync between your analytics provider and the SR SDK.',
        link: { label: 'iOS standalone SDK docs', url: 'https://amplitude.com/docs/session-replay/session-replay-ios-standalone-sdk' },
      },
      'Session ID and Device ID passed to the SR SDK must match those sent as event properties.',
      'Always call flush() before app exit (applicationWillResignActive).',
    ],
  },

  'android-plugin': {
    installCommands: [
      'implementation("com.amplitude:analytics-android:[1.16.7, 2.0.0]")\nimplementation("com.amplitude:plugin-session-replay-android:[latest-version]")',
    ],
    language: 'kotlin',
    codeSnippet: `import com.amplitude.android.Amplitude
import com.amplitude.android.Configuration
import com.amplitude.android.plugins.SessionReplayPlugin

val amplitude = Amplitude(Configuration(
    apiKey = API_KEY,
    context = applicationContext,
    defaultTracking = DefaultTrackingOptions(sessions = true),
))

// Create and install Session Replay Plugin
val sessionReplayPlugin = SessionReplayPlugin(sampleRate = 1.0)
amplitude.add(sessionReplayPlugin)

// Send replay data to the server
amplitude.flush()`,
    notes: [
      {
        text: 'Use the latest version of the Session Replay plugin above 0.15.2.',
        link: { label: 'Maven Central versions', url: 'https://central.sonatype.com/artifact/com.amplitude/plugin-session-replay-android' },
      },
      {
        text: 'Requires the Android Kotlin SDK.',
        link: { label: 'Android Kotlin SDK docs', url: 'https://amplitude.com/docs/sdks/analytics/android/android-kotlin-sdk' },
      },
      'defaultTracking sessions must be set to true.',
    ],
  },

  'android-middleware': {
    installCommands: [
      'implementation("com.amplitude:middleware-session-replay-android:[latest-version]")\nimplementation("com.amplitude:android-sdk:[2.40.1,3.0.0]")',
    ],
    language: 'kotlin',
    codeSnippet: `import com.amplitude.api.Amplitude
import com.amplitude.api.SessionReplayMiddleware

// Initialize the maintenance Amplitude SDK
val amplitude = Amplitude.getInstance()
    .initialize(this, AMPLITUDE_API_KEY)
    .setFlushEventsOnClose(true)

// Create and add Session Replay middleware
val sessionReplayMiddleware = SessionReplayMiddleware(
    amplitude, sampleRate = 1.0
)
amplitude.addEventMiddleware(sessionReplayMiddleware)

// Track events as normal
amplitude.logEvent("Event Name")
amplitude.uploadEvents()

// Always flush replay data before app exit (onPause)
// override fun Activity.onPause() {
//     sessionReplayMiddleware.flush()
// }`,
    notes: [
      'For the legacy/maintenance Android SDK (version 2.40.1+) only.',
      {
        text: 'Use the latest version of the middleware above 0.15.2.',
        link: { label: 'Maven Central versions', url: 'https://central.sonatype.com/artifact/com.amplitude/middleware-session-replay-android' },
      },
      'setFlushEventsOnClose(true) is recommended, or call flush() manually.',
      'Always flush middleware in onPause to prevent replay data loss.',
    ],
  },

  'android-standalone-sdk': {
    installCommands: [
      'implementation("com.amplitude:session-replay-android:0.15.2")',
    ],
    language: 'kotlin',
    codeSnippet: `import com.amplitude.android.sessionreplay.SessionReplay
import com.example.ThirdPartyAnalytics

val sessionReplay = SessionReplay(
    apiKey = "api-key",
    context = applicationContext,
    deviceId = "device-id",
    sessionId = Date().time,
    sampleRate = 1.0,
)

// Track events with session replay properties
val sessionReplayProperties = sessionReplay.getSessionReplayProperties()
ThirdPartyAnalytics.track(
    eventName,
    eventProperties + sessionReplayProperties
)

// Keep IDs in sync when they change
sessionReplay.sessionId = ThirdPartyAnalytics.getSessionId()
sessionReplay.deviceId = ThirdPartyAnalytics.getDeviceId()

// Always flush before app exit
sessionReplay.flush()`,
    notes: [
      {
        text: 'You are responsible for keeping deviceId and sessionId in sync between your analytics provider and the SR SDK.',
        link: { label: 'Android standalone SDK docs', url: 'https://amplitude.com/docs/session-replay/session-replay-android-standalone' },
      },
      'Use the latest version above 0.15.2.',
      'Always call flush() in onPause to prevent replay data loss.',
    ],
  },

  'rn-plugin': {
    installCommands: [
      'npm install @amplitude/session-replay-react-native --save',
    ],
    language: 'typescript',
    codeSnippet: `import { init, add } from '@amplitude/analytics-react-native';
import { SessionReplayPlugin } from '@amplitude/session-replay-react-native';

// Initialize Amplitude React Native SDK
init(API_KEY);

// Add Session Replay plugin
const sessionReplayPlugin = new SessionReplayPlugin({
  sampleRate: 0.5,
});
add(sessionReplayPlugin);`,
    notes: [
      {
        text: 'React Native Session Replay is currently in beta.',
        link: { label: 'React Native SR docs', url: 'https://amplitude.com/docs/session-replay/session-replay-react-native-sdk-plugin' },
      },
      'Wraps the native iOS and Android SR SDKs.',
      'WebViews, Skia-rendered views, and hardware-accelerated content may not be captured.',
    ],
  },

  'rn-segment-plugin': {
    installCommands: [
      'npm install @amplitude/session-replay-react-native --save',
    ],
    language: 'typescript',
    codeSnippet: `// Use the official RN Segment SR plugin with Amplitude Session plugin
// and Segment's Amplitude (Actions) destination.
//
// Ensure there is NO separate Amplitude RN SDK init —
// two parallel pipelines will break SR linkage or cause duplication.

import { createClient } from '@segment/analytics-react-native';
import { AmplitudeSessionPlugin } from '@segment/analytics-react-native-plugin-amplitude-session';

const segmentClient = createClient({ writeKey: SEGMENT_WRITE_KEY });

// Add Amplitude session plugin to Segment
segmentClient.add({ plugin: new AmplitudeSessionPlugin() });

// Follow Segment's docs for the SR integration`,
    notes: [
      'Do NOT initialize both the Amplitude RN SDK and a separate native Amplitude SDK.',
      {
        text: 'Use Segment\'s Amplitude (Actions) destination for the most reliable setup.',
        link: { label: 'Amplitude (Actions) destination', url: 'https://segment.com/docs/connections/destinations/catalog/actions-amplitude/' },
      },
      {
        text: 'React Native SR is in beta and inherits native SDK limitations.',
        link: { label: 'React Native SR docs', url: 'https://amplitude.com/docs/session-replay/session-replay-react-native-sdk-plugin' },
      },
    ],
  },
};

export const samplingContent = {
  title: 'Sampling Configuration',
  intro:
    'By default, 0% of sessions are captured for replay. You must configure a sample rate to begin collecting replays.',
  sections: [
    {
      heading: 'Setting a Sample Rate',
      items: [
        'Set sampleRate in your SDK/plugin initialization (e.g., sampleRate: 0.5 for 50%).',
        {
          text: 'The remote sample rate in Session Replay Settings (set by project Admins) overrides any rate you set in code.',
          link: { label: 'Session Replay settings', url: 'https://amplitude.com/docs/session-replay#sample-rate' },
        },
        'Remote sample rate changes may take a few minutes to take effect.',
      ] as ContentItem[],
    },
    {
      heading: 'Estimating a Reasonable Rate',
      items: [
        'Use charts (User Sessions, top events) to understand your session volume.',
        'Calculate: monthly quota / average monthly sessions = sample rate. For example, if your quota is 1M and you average 4M sessions, start at 0.25 (25%).',
        'Starting at 10-25% and adjusting up is a safe approach.',
        'Implement SR on the pages/flows that matter most, not blanket site-wide.',
      ] as ContentItem[],
    },
    {
      heading: 'Quota and Billing',
      items: [
        'Sessions over your provisioned monthly quota will not be ingested or stored.',
        'Quota resets on the 1st of every month.',
        'Sessions sampled out are never ingested — no cost incurred.',
        {
          text: 'Check your current usage in Plans & Billing under Org Settings.',
          link: { label: 'Session Replay pricing', url: 'https://amplitude.com/docs/session-replay#pricing' },
        },
      ] as ContentItem[],
    },
  ],
};

export const privacyContent = {
  title: 'Privacy Controls',
  intro:
    'Amplitude provides multiple layers of privacy control for Session Replay. Masking happens at capture time — masked data is never sent to Amplitude and cannot be recovered.',
  sections: [
    {
      heading: 'Dashboard Masking Levels',
      items: [
        'Conservative: All text and inputs are masked by default.',
        'Medium: Inputs are masked; other text is visible.',
        'Light: Only inputs are masked.',
        {
          text: 'Configure in your project\'s Session Replay settings.',
          link: { label: 'Privacy settings docs', url: 'https://amplitude.com/docs/session-replay/manage-privacy-settings-for-session-replay' },
        },
      ] as ContentItem[],
    },
    {
      heading: 'CSS Class-Based Controls',
      items: [
        'amp-mask: Add to non-input elements to mask their text content (converts to asterisks). Children are also masked.',
        'amp-unmask: Add to input elements to unmask them (inputs are masked by default).',
        'amp-block: Add to non-text elements (e.g., div containers) to replace them with a placeholder of the same dimensions.',
        {
          text: 'See the full list of CSS privacy classes and examples.',
          link: { label: 'SR privacy controls reference', url: 'https://amplitude.com/docs/session-replay/manage-privacy-settings-for-session-replay#css-class-based-controls' },
        },
      ] as ContentItem[],
    },
    {
      heading: 'CSS Selector Blocking',
      body: 'Use the privacyConfig option to block elements by CSS selector:',
      code: `sessionReplay.init(AMPLITUDE_API_KEY, {
  sampleRate: 0.01,
  privacyConfig: {
    blockSelector: ['.sensitive-class', '#payment-form']
  }
});`,
    },
    {
      heading: 'Compliance and Data Retention',
      items: [
        {
          text: 'User Privacy API: Deletion requests delete all session replays for selected users.',
          link: { label: 'User Privacy API docs', url: 'https://amplitude.com/docs/apis/analytics/user-privacy' },
        },
        {
          text: 'DSAR API: Deletes event and property history by time range.',
          link: { label: 'DSAR API docs', url: 'https://amplitude.com/docs/apis/analytics/ccpa-dsar' },
        },
        'Default replay data retention is 30-90 days (configurable by plan, max 12 months).',
        'Session Replay data is deleted on project deletion.',
        {
          text: 'SR does not use cookies — data is stored in IndexedDB and aggressively cleaned up.',
          link: { label: 'Cookie management docs', url: 'https://amplitude.com/docs/sdks/analytics/browser/browser-sdk-2#cookie-management' },
        },
      ] as ContentItem[],
    },
    {
      heading: 'Controlling Replay with Feature Flags',
      items: [
        {
          text: 'Create a feature flag targeting control/treatment variants.',
          link: { label: 'Amplitude Experiment docs', url: 'https://amplitude.com/docs/feature-experiment' },
        },
        'For treatment users, disable the plugin or SDK (e.g., amplitude.remove() or sessionReplay.shutdown()).',
        'Flag evaluation must happen immediately on app launch to prevent replays accurately.',
        'Alternatively, disable the plugin/SDK on specific pages that should always be restricted.',
      ] as ContentItem[],
    },
  ],
};

export interface ValidationStep {
  label: string;
  detail: string;
  link?: { label: string; url: string };
}

export const validationContent = {
  title: 'Validation Checklist',
  web: {
    heading: 'Web Validation',
    steps: [
      {
        label: 'Check the plugin is active',
        detail: 'Open browser console and run: window.amplitude, window.sessionReplay, or window.sessionReplayTracking. Verify objects exist.',
      },
      {
        label: 'Verify Session ID',
        detail: 'Run window.amplitude.getSessionId() in the console. Confirm it returns a Unix timestamp (not -1 or undefined).',
      },
      {
        label: 'Inspect network requests',
        detail: 'Open the Network tab and look for requests to the SR ingestion endpoint. Successful requests return 200 status.',
        link: { label: 'SR troubleshooting guide', url: 'https://amplitude.com/docs/sdks/sdk-debugging' },
      },
      {
        label: 'Use the Event Explorer extension',
        detail: 'Install the Amplitude Event Explorer Chrome Extension. Trigger events and confirm each carries [Amplitude] Session Replay ID, device_id, and session_id.',
        link: { label: 'Get the extension', url: 'https://chromewebstore.google.com/detail/amplitude-event-explorer/acehfjhnmhbmgkedjmjlobpgdicnhkbp' },
      },
      {
        label: 'Check the Ingestion Monitor',
        detail: 'Go to Users & Sessions > Session Replays > Gear Icon > Ingestion Monitor. Look for any blocked or throttled requests.',
      },
      {
        label: 'Validate in a Segmentation chart',
        detail: 'Create a chart grouping Any Event by Session ID. If you see -1, session IDs are not being tracked properly.',
      },
    ] as ValidationStep[],
  },
  mobile: {
    heading: 'Mobile Validation',
    steps: [
      {
        label: 'Check the Ingestion Monitor',
        detail: 'Go to Users & Sessions > Session Replays > Gear Icon > Ingestion Monitor. Confirm replays are being received.',
      },
      {
        label: 'Trigger at least one event',
        detail: 'Mobile SDKs must send at least one event with a valid Session Replay ID within a session. A session with only replay data but zero events will not appear.',
      },
      {
        label: 'Verify session and device IDs',
        detail: 'Look up your test user/device in Amplitude. Confirm events have consistent session_id and device_id throughout the session.',
      },
      {
        label: 'Check sample rate',
        detail: 'Confirm your sample rate is above 0% in both the SDK config and the remote Session Replay Settings (Admin only).',
        link: { label: 'Session Replay settings', url: 'https://amplitude.com/docs/session-replay#sample-rate' },
      },
      {
        label: 'Test flush behavior',
        detail: 'Background the app and bring it back. Verify that replay data was flushed before backgrounding (check Ingestion Monitor for new data).',
      },
    ] as ValidationStep[],
  },
};

export interface DebuggingItem {
  text: string;
  link?: { label: string; url: string };
}

export const debuggingContent = {
  title: 'Gotchas & Debugging',
  sections: [
    {
      heading: 'No Replays Showing Up',
      items: [
        { text: 'Is Session Replay enabled for the project? Check in Session Replay Settings.' },
        { text: 'Is the sample rate above 0%? The remote rate overrides your code — check the Admin Settings page.' },
        { text: 'Are there CSP or network errors? Check the browser console for Amplitude Logger warnings/errors and the Network tab for failed requests.' },
        { text: 'Are Session IDs present? Group Any Event by Session ID in a Segmentation chart. If -1, session IDs are not being tracked.' },
        {
          text: 'Have you exceeded your monthly quota? Check Plans & Billing in Org Settings.',
          link: { label: 'Session Replay pricing', url: 'https://amplitude.com/docs/session-replay#pricing' },
        },
      ] as DebuggingItem[],
    },
    {
      heading: 'Events Exist but No Playable Replays',
      items: [
        {
          text: 'Is [Amplitude] Session Replay ID present on events? Check via Event Explorer or User Lookup.',
          link: { label: 'Event Explorer extension', url: 'https://chromewebstore.google.com/detail/amplitude-event-explorer/acehfjhnmhbmgkedjmjlobpgdicnhkbp' },
        },
        { text: 'Are session/device IDs changing mid-session? Look up the user and inspect event-by-event consistency.' },
        {
          text: 'Has the project hit the 2,000 event property limit? New properties (including Session Replay ID) won\'t be indexed.',
          link: { label: 'Data governance best practices', url: 'https://amplitude.com/docs/data/data-planning-playbook' },
        },
        { text: 'For Segment: are both middlewares installed? Missing either one breaks the linkage.' },
      ] as DebuggingItem[],
    },
    {
      heading: 'Web-Specific Limitations',
      items: [
        { text: 'Canvas, WebGL, Lottie animations, and cross-origin iframes cannot be captured.' },
        { text: '<object> tags (Flash, Silverlight, Java) are not supported, except <object type="image">.' },
        { text: 'Assets requiring authentication (fonts, CSS, images) will appear broken in replays.' },
        { text: 'Session Replay does not stitch replays across multiple Amplitude projects.' },
        {
          text: 'Only standard session definitions are supported (not custom).',
          link: { label: 'SR known limitations', url: 'https://amplitude.com/docs/session-replay/session-replay-plugin#known-limitations' },
        },
      ] as DebuggingItem[],
    },
    {
      heading: 'Mobile-Specific Limitations',
      items: [
        {
          text: 'Android: WebView, MapView, and Canvas Views cannot be captured.',
          link: { label: 'Android limitations', url: 'https://amplitude.com/docs/session-replay/session-replay-android-plugin#known-limitations' },
        },
        {
          text: 'iOS: Out-of-process views (SFSafariViewController), AVPlayerLayer, MKMapView, and WKWebView cannot be captured.',
          link: { label: 'iOS limitations', url: 'https://amplitude.com/docs/session-replay/session-replay-ios-plugin#known-limitations' },
        },
        { text: 'Replays may not appear due to: lack of connectivity, failed flush on app exit, no events in the session, or sampling.' },
        { text: 'Jetpack Compose support is in Alpha.' },
      ] as DebuggingItem[],
    },
    {
      heading: 'GTM-Specific Issues',
      items: [
        { text: 'Using GTM blocklist blocks ALL Amplitude tags, not just Session Replay.' },
        { text: 'To block SR on specific pages while keeping event tracking, use: window.amplitude.remove(\'@amplitude/plugin-session-replay-browser\')' },
        {
          text: 'Ensure the SR Custom HTML tag fires after the Amplitude init tag.',
          link: { label: 'GTM tag sequencing docs', url: 'https://support.google.com/tagmanager/answer/6238868' },
        },
      ] as DebuggingItem[],
    },
  ],
};
