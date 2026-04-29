import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { Wizard } from './components/Wizard'
import { BeforeYouBeginPage } from './pages/BeforeYouBeginPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { DeletionPage } from './pages/DeletionPage'
import { ValidationPage } from './pages/ValidationPage'
import { SessionIdOptionsPage } from './pages/SessionIdOptionsPage'
import { HeatmapsPage } from './pages/HeatmapsPage'
import { SystemStatusPage } from './pages/SystemStatusPage'
import { ReleasesPage } from './pages/ReleasesPage'
import { TargetedReplayCapturePage } from './pages/TargetedReplayCapturePage'
import { IframesPage } from './pages/IframesPage'
import { LocalIframeTestPage } from './pages/LocalIframeTestPage'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <BeforeYouBeginPage /> },
        { path: 'guide', element: <Wizard /> },
        { path: 'privacy', element: <PrivacyPage /> },
        { path: 'deletion', element: <DeletionPage /> },
        { path: 'validation', element: <ValidationPage /> },
        { path: 'system-status', element: <SystemStatusPage /> },
        { path: 'session-id-options', element: <SessionIdOptionsPage /> },
        { path: 'heatmaps', element: <HeatmapsPage /> },
        { path: 'targeted-replay-capture', element: <TargetedReplayCapturePage /> },
        { path: 'releases', element: <ReleasesPage /> },
        { path: 'iframes', element: <IframesPage /> },
      ],
    },
    {
      path: '/iframe-local-test',
      element: <LocalIframeTestPage />,
    },
  ],
  {
    basename: '/sr-guide',
  },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
