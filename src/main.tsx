import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { initAnalytics } from './analytics'
import App from './App'
import { Wizard } from './components/Wizard'
import { BeforeYouBeginPage } from './pages/BeforeYouBeginPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { DeletionPage } from './pages/DeletionPage'
import { ValidationPage } from './pages/ValidationPage'
import { SessionIdOptionsPage } from './pages/SessionIdOptionsPage'

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
        { path: 'session-id-options', element: <SessionIdOptionsPage /> },
      ],
    },
  ],
  {
    basename: '/session-replay-guide',
  },
)

initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
