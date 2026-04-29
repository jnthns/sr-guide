import { Outlet, Link, useLocation } from 'react-router-dom';
import { setOrigination } from './analytics';
import { RouteAnalytics } from './components/RouteAnalytics';

const tabs = [
  {
    id: 'session-replay',
    label: 'Session Replay',
    defaultPath: '/',
    navItems: [
      { to: '/', label: 'Before You Begin', accent: true },
      { to: '/guide', label: 'Full Guide', accent: false },
      { to: '/privacy', label: 'Privacy & Masking', accent: false },
      { to: '/deletion', label: 'Data Deletion', accent: false },
      { to: '/validation', label: 'Validation', accent: false },
      { to: '/system-status', label: 'System Status', accent: false },
      { to: '/targeted-replay-capture', label: 'Targeted Capture', accent: false },
    ],
  },
  {
    id: 'heatmaps',
    label: 'Heatmaps',
    defaultPath: '/heatmaps',
    navItems: [
      { to: '/heatmaps', label: 'Overview', accent: false },
    ],
  },
  {
    id: 'releases',
    label: 'Releases',
    defaultPath: '/releases',
    navItems: [
      { to: '/releases', label: 'All Releases', accent: false },
    ],
  },
  {
    id: 'iframes',
    label: 'Iframes',
    defaultPath: '/iframes',
    navItems: [
      { to: '/iframes', label: 'Overview', accent: false },
    ],
  },
];

function getActiveTabId(pathname: string) {
  if (pathname.startsWith('/heatmaps')) return 'heatmaps';
  if (pathname.startsWith('/releases')) return 'releases';
  if (pathname.startsWith('/iframes')) return 'iframes';
  return 'session-replay';
}

function AmplitudeLogo() {
  return (
    <svg viewBox="0 0 506 506" fill="currentColor" className="h-8 w-8 shrink-0" aria-hidden="true">
      <path d="M225.48,116.24c-1.38-1.82-2.95-2.78-4.7-2.78c-1.44,0-2.75.64-3.6,1.19c-13.26,10.42-31.4,54.53-46.27,112.67l13.16.15c26,.29,52.84.6,79.38,1.01c-6.99-26.63-13.61-49.45-19.67-67.88C234.92,133.67,228.94,121.61,225.48,116.24z" />
      <path d="M254.99,4.15c-137.52,0-249,111.48-249,249c0,137.52,111.48,249,249,249s249-111.48,249-249C503.99,115.63,392.51,4.15,254.99,4.15z M434.04,257.67c-.02.02-.04.03-.06.05c-.27.22-.54.42-.83.62c-.09.06-.18.13-.28.19c-.19.12-.39.24-.58.35c-.18.11-.36.21-.54.31c-.01.01-.02.01-.03.02c-1.83.96-3.92,1.51-6.13,1.51c-.18,0-117.95,0-117.95,0c.94,3.91,1.97,8.35,3.09,13.18c6.46,27.91,23.64,102.06,41.88,102.06l.36.01l.2-.03l.35,0c14.25,0,21.52-20.6,37.46-65.74l.19-.55c2.56-7.25,5.45-15.43,8.58-24.08l.8-2.21l.01,0c.81-2.16,2.89-3.7,5.34-3.7c3.15,0,5.71,2.56,5.71,5.71c0,.57-.09,1.12-.24,1.64l0,0l-.66,2.22c-1.66,5.37-3.43,12.69-5.47,21.16c-9.5,39.37-23.85,98.85-60.67,98.85l-.27,0c-23.79-.19-38.03-38.22-44.11-54.46c-11.37-30.37-19.97-62.73-28.27-94.07H163.34l-22.54,72.14l-.33-.26c-2.06,3.24-5.68,5.32-9.67,5.32c-6.29,0-11.44-5.12-11.47-11.41l.02-.39l1.36-8.16c3.11-18.54,6.84-37.78,11.1-57.23H85.97l-.17-.17c-8.32-1.2-14.71-8.54-14.71-17.1c0-8.39,5.94-15.54,14.12-16.99c.75-.1,2.27-.23,5.36-.23c.66,0,1.4,0,2.23.02c14.53.25,29.95.48,46.86.7c23.93-97.24,51.65-146.6,82.4-146.74c32.99,0,57.47,75.12,77.06,148.61l.08.29c40.25.81,83.15,1.98,124.86,4.97l1.75.16c.67.01,1.33.08,1.97.18l.24.02c.07.01.14.03.21.05c.04.01.07.02.11.02c6.07,1.22,10.57,6.54,10.57,12.94C438.91,251.55,437.01,255.24,434.04,257.67z" />
    </svg>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const activeTabId = getActiveTabId(pathname);
  const activeTab = tabs.find((t) => t.id === activeTabId)!;

  return (
    <div className="min-h-screen">
      <RouteAnalytics />
      <header className="bg-amp-blue text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AmplitudeLogo />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <Link to="/" className="hover:text-indigo-200 transition-colors" onClick={() => setOrigination('header title')}>
                    Implementation Guide
                  </Link>
                </h1>
                <p className="mt-0.5 text-sm text-indigo-200">
                  Set up Amplitude's experience analytics for your platform.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-200">
              Updated {new Date(__BUILD_TIME__).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="mt-5 flex gap-1 border-b border-white/10">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <Link
                  key={tab.id}
                  to={tab.defaultPath}
                  onClick={() => setOrigination(`tab: ${tab.label}`)}
                  className={`relative px-5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-amp-blue/80 border-t border-white/5">
          <nav className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-2">
            {activeTab.navItems.map(({ to, label, accent }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOrigination(`nav: ${label}`)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? accent
                        ? 'bg-amp-indigo text-white'
                        : 'bg-white/20 text-white'
                      : accent
                        ? 'bg-amp-indigo/40 text-indigo-100 hover:bg-amp-indigo/60 hover:text-white'
                        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
