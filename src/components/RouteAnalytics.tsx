import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, setAnalyticsOptOut } from '../analytics';

const AMPLITUDE_DISABLED_PATHS = ['/iframes', '/iframe-local-test'];

function isAmplitudeDisabledPath(pathname: string) {
  return AMPLITUDE_DISABLED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function RouteAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldDisableAmplitude = isAmplitudeDisabledPath(pathname);
    setAnalyticsOptOut(shouldDisableAmplitude);

    if (!shouldDisableAmplitude) {
      initAnalytics();
    }
  }, [pathname]);

  return null;
}
