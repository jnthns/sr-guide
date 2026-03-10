import type { Platform, AnalyticsSource, ImplementationMethod, PlatformOption, SourceOption, MethodInfo } from './types';

export const platforms: PlatformOption[] = [
  {
    id: 'web',
    label: 'Web',
    description: 'JavaScript applications running in the browser',
  },
  {
    id: 'ios',
    label: 'iOS',
    description: 'Native iOS apps (SwiftUI, UIKit)',
  },
  {
    id: 'android',
    label: 'Android',
    description: 'Native Android apps (Kotlin, XML Views)',
  },
  {
    id: 'react-native',
    label: 'React Native',
    description: 'Cross-platform React Native apps',
  },
];

export const sources: SourceOption[] = [
  // Web sources
  {
    id: 'amplitude-browser-sdk',
    label: 'Amplitude Browser SDK',
    description: 'Using the Browser 2.0 SDK (@amplitude/analytics-browser)',
    platforms: ['web'],
  },
  {
    id: 'maintenance-js-sdk',
    label: 'Maintenance JS SDK',
    description: 'Using the legacy/maintenance JavaScript SDK',
    platforms: ['web'],
  },
  {
    id: 'gtm',
    label: 'Google Tag Manager',
    description: 'Amplitude installed via GTM template',
    platforms: ['web'],
  },
  {
    id: 'segment',
    label: 'Segment',
    description: 'Using Segment as your analytics provider',
    platforms: ['web'],
  },
  {
    id: 'third-party',
    label: 'Other 3rd Party',
    description: 'mParticle, RudderStack, or other analytics providers',
    platforms: ['web'],
  },
  {
    id: 'http-api-warehouse',
    label: 'HTTP API / Data Warehouse',
    description: 'Sending events via HTTP API, S3, or Snowflake',
    platforms: ['web'],
  },
  // iOS sources
  {
    id: 'amplitude-swift-sdk',
    label: 'Amplitude Swift SDK',
    description: 'Using the current iOS Swift SDK',
    platforms: ['ios'],
  },
  {
    id: 'maintenance-ios-sdk',
    label: 'Maintenance iOS SDK',
    description: 'Using the legacy/maintenance iOS SDK',
    platforms: ['ios'],
  },
  {
    id: 'ios-third-party',
    label: '3rd Party Analytics',
    description: 'Using a third-party analytics provider on iOS',
    platforms: ['ios'],
  },
  // Android sources
  {
    id: 'amplitude-kotlin-sdk',
    label: 'Amplitude Kotlin SDK',
    description: 'Using the current Android Kotlin SDK',
    platforms: ['android'],
  },
  {
    id: 'maintenance-android-sdk',
    label: 'Maintenance Android SDK',
    description: 'Using the legacy/maintenance Android SDK',
    platforms: ['android'],
  },
  {
    id: 'android-third-party',
    label: '3rd Party Analytics',
    description: 'Using a third-party analytics provider on Android',
    platforms: ['android'],
  },
  // React Native sources
  {
    id: 'amplitude-rn-sdk',
    label: 'Amplitude RN SDK',
    description: 'Using the Amplitude React Native SDK',
    platforms: ['react-native'],
  },
  {
    id: 'segment-rn',
    label: 'Segment (React Native)',
    description: 'Using Segment with React Native',
    platforms: ['react-native'],
  },
];

export const methodMap: Record<string, ImplementationMethod> = {
  'web:amplitude-browser-sdk': 'browser-plugin',
  'web:maintenance-js-sdk': 'standalone-sr-sdk-legacy',
  'web:gtm': 'gtm-plugin',
  'web:segment': 'standalone-sr-sdk-segment',
  'web:third-party': 'standalone-sr-sdk',
  'web:http-api-warehouse': 'standalone-sr-sdk-warehouse',
  'ios:amplitude-swift-sdk': 'ios-plugin',
  'ios:maintenance-ios-sdk': 'ios-middleware',
  'ios:ios-third-party': 'ios-standalone-sdk',
  'android:amplitude-kotlin-sdk': 'android-plugin',
  'android:maintenance-android-sdk': 'android-middleware',
  'android:android-third-party': 'android-standalone-sdk',
  'react-native:amplitude-rn-sdk': 'rn-plugin',
  'react-native:segment-rn': 'rn-segment-plugin',
};

export const methods: Record<ImplementationMethod, MethodInfo> = {
  'browser-plugin': {
    id: 'browser-plugin',
    label: 'Session Replay Plugin',
    description:
      'The recommended approach for Browser SDK users. The plugin attaches to your existing Amplitude instance and handles replay capture, session ID management, and property forwarding automatically.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-plugin',
  },
  'standalone-sr-sdk': {
    id: 'standalone-sr-sdk',
    label: 'Standalone Session Replay SDK',
    description:
      'A standalone SDK for capturing replays when using a third-party analytics provider. You manage device ID and session ID synchronization between your analytics provider and this SDK.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-standalone-sdk',
  },
  'standalone-sr-sdk-segment': {
    id: 'standalone-sr-sdk-segment',
    label: 'Standalone SR SDK + Segment Middleware',
    description:
      'Uses the standalone Session Replay SDK alongside Segment source middlewares to keep session IDs in sync and append replay properties to all track calls.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-standalone-sdk',
  },
  'standalone-sr-sdk-legacy': {
    id: 'standalone-sr-sdk-legacy',
    label: 'Standalone SR SDK (Legacy JS SDK)',
    description:
      'The legacy JS SDK is not compatible with the Session Replay Plugin. You must use the standalone SDK and manually forward replay properties on every logEvent call.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-standalone-sdk',
  },
  'gtm-plugin': {
    id: 'gtm-plugin',
    label: 'Session Replay Plugin via GTM',
    description:
      'Uses the Browser SDK GTM template with a separate Custom HTML tag to load and attach the Session Replay plugin. The GTM template alone is not enough.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-plugin',
  },
  'standalone-sr-sdk-warehouse': {
    id: 'standalone-sr-sdk-warehouse',
    label: 'Standalone SR SDK + Data Warehouse Events',
    description:
      'The standalone SDK captures replays client-side while your events flow through HTTP API or data warehouse. Ensure your events include matching device_id and session_id values.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-standalone-sdk',
  },
  'ios-plugin': {
    id: 'ios-plugin',
    label: 'iOS Session Replay Plugin',
    description:
      'The recommended approach for iOS Swift SDK users. The plugin attaches to your Amplitude instance and handles replay capture automatically.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-ios-plugin',
  },
  'ios-middleware': {
    id: 'ios-middleware',
    label: 'iOS Session Replay Middleware',
    description:
      'For users on the legacy/maintenance iOS SDK. Uses middleware to integrate Session Replay with the older SDK.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-ios-plugin',
  },
  'ios-standalone-sdk': {
    id: 'ios-standalone-sdk',
    label: 'iOS Standalone SR SDK',
    description:
      'For iOS apps using a third-party analytics provider. You manage device ID and session ID synchronization manually.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-ios-standalone-sdk',
  },
  'android-plugin': {
    id: 'android-plugin',
    label: 'Android Session Replay Plugin',
    description:
      'The recommended approach for Android Kotlin SDK users. The plugin attaches to your Amplitude instance and handles replay capture automatically.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-android-plugin',
  },
  'android-middleware': {
    id: 'android-middleware',
    label: 'Android Session Replay Middleware',
    description:
      'For users on the legacy/maintenance Android SDK. Uses middleware to integrate Session Replay with the older SDK.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-android-plugin',
  },
  'android-standalone-sdk': {
    id: 'android-standalone-sdk',
    label: 'Android Standalone SR SDK',
    description:
      'For Android apps using a third-party analytics provider. You manage device ID and session ID synchronization manually.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-android-standalone',
  },
  'rn-plugin': {
    id: 'rn-plugin',
    label: 'React Native SR Plugin',
    description:
      'The Session Replay plugin for React Native wraps the native iOS and Android SR SDKs. Currently in beta.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-react-native-sdk-plugin',
  },
  'rn-segment-plugin': {
    id: 'rn-segment-plugin',
    label: 'React Native SR + Segment Plugin',
    description:
      'Uses the official RN Segment SR plugin with Amplitude Session plugin and Segment\'s Amplitude (Actions) destination.',
    docsUrl: 'https://amplitude.com/docs/session-replay/session-replay-react-native-sdk-plugin',
  },
};

export function resolveMethod(
  platform: Platform,
  source: AnalyticsSource,
): ImplementationMethod | null {
  const key = `${platform}:${source}`;
  return methodMap[key] ?? null;
}

export function getSourcesForPlatform(platform: Platform): SourceOption[] {
  return sources.filter((s) => s.platforms.includes(platform));
}
