export interface Release {
  date: string;
  title: string;
  body: string;
  tags?: string[];
  link?: { label: string; url: string };
}

/**
 * Add new releases at the top. They are displayed sorted by date (newest first).
 * Date format: YYYY-MM-DD
 */
export const releases: Release[] = [
  {
    date: '2026-04-09',
    title: 'Improved Replay Data Delivery',
    body: 'session-replay-browser@1.36.0 improves how replay data is delivered to Amplitude, enhancing reliability and reducing data loss under poor network conditions.',
    tags: ['web', 'reliability'],
    link: { label: 'Session Replay Browser SDK', url: 'https://github.com/amplitude/Amplitude-TypeScript/blob/main/packages/session-replay-browser/CHANGELOG.md' },
  },
  {
    date: '2026-03-26',
    title: 'Sampling Algorithm Updated to xxHash32',
    body: 'session-replay-browser@1.35.0 migrates session sampling from the Java hashCode algorithm to xxHash32, improving consistency across platforms. Also fixes a bug where the final scroll position on page leave was not captured.',
    tags: ['web', 'sampling', 'bug fix'],
  },
  {
    date: '2026-03-19',
    title: 'Attribute Masking Support',
    body: 'session-replay-browser@1.34.0 adds attribute masking functionality, allowing you to mask specific HTML attributes from being captured in replays — useful for hiding sensitive data that appears in element attributes rather than text content.',
    tags: ['web', 'privacy', 'masking'],
    link: { label: 'Manage Privacy Settings', url: 'https://amplitude.com/docs/session-replay/manage-privacy-settings-for-session-replay' },
  },
  {
    date: '2026-03-16',
    title: 'Opt-in Network Request & Response Body Capture',
    body: 'session-replay-browser@1.33.0 adds opt-in capture of request and response bodies for network events. Disabled by default — must be explicitly enabled in SDK config. Useful for debugging API interactions, but review your privacy settings before enabling.',
    tags: ['web', 'network', 'opt-in'],
    link: { label: 'Session Replay Network Config', url: 'https://amplitude.com/docs/session-replay/session-replay-plugin#network-config' },
  },
  {
    date: '2026-03-16',
    title: '[Beta] URL Matching Targeting Capture in Session Replay (Web)',
    body: 'Session Replay now supports URL matching targeting, so you can capture replays only on pages that match configured URL rules. Includes SDK updates in session-replay-browser and plugin-session-replay-browser, plus UI updates in the Session Replay Settings view. This means more precise replay coverage, less noise, and better privacy and cost control.',
    tags: ['web', 'beta', 'targeting', 'url matching'],
    link: { label: 'Session Replay Settings', url: 'https://amplitude.com/docs/session-replay/manage-privacy-settings-for-session-replay' },
  },
  {
    date: '2026-03-10',
    title: 'Unified SDK added as recommended integration method',
    body: 'The Amplitude Unified SDK is now featured as the recommended path for new Web and iOS implementations. It bundles Analytics, Session Replay, Experiment, and Guides & Surveys into a single package — no separate plugin installs required.',
    tags: ['web', 'ios', 'unified sdk'],
    link: { label: 'Unified SDK docs (Web)', url: 'https://amplitude.com/docs/sdks/analytics/browser/browser-unified-sdk' },
  },
  {
    date: '2026-03-09',
    title: 'Privacy controls restructured: Admin vs Developer',
    body: 'The Privacy & Masking page now clearly separates dashboard controls (no code required) from SDK controls (requires a deploy). A new ELI5 panel explains who does what, the effort involved, benefits, and tradeoffs of each approach.',
    tags: ['privacy', 'masking'],
  },
  {
    date: '2026-03-09',
    title: 'Documentation links added throughout the guide',
    body: 'Every callout card, setup note, checklist item, and debugging tip now includes links to the relevant Amplitude documentation page. Platform-level limitation callouts (Web, iOS, Android, React Native) persist across the source, setup, and debugging steps.',
    tags: ['docs', 'callouts'],
  },
  {
    date: '2026-03-09',
    title: 'Initial launch of the Session Replay Implementation Guide',
    body: 'An 8-step interactive wizard that adapts to your platform and analytics source. Covers setup, sampling, privacy, validation, and debugging with contextual callouts at every step.',
    tags: ['launch'],
  },
];
