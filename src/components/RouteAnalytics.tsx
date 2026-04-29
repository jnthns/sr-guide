import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadGoogleTagManager, pushGtmEvent } from '../gtm';

export function RouteAnalytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    loadGoogleTagManager();
    pushGtmEvent('page_view', { page_path: pathname });
  }, [pathname]);

  return null;
}
