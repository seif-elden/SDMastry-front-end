import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import AnalyticsPage from '@/pages/app/AnalyticsPage'
import BadgesPage from '@/pages/app/BadgesPage'
import SettingsPage from '@/pages/app/SettingsPage'
import AttemptPage from './pages/AttemptPage.tsx'
import RoadmapPage from './pages/RoadmapPage'
import TopicDetailPage from './pages/TopicDetailPage'
import useAuthStore from '@/store/useAuthStore'

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

function PublicOnlyRoute() {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/roadmap" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/roadmap" replace />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/roadmap',
        element: <RoadmapPage />,
      },
      {
        path: '/topics/:slug',
        element: <TopicDetailPage />,
      },
      {
        path: '/topics/:slug/attempts/:attemptId',
        element: <AttemptPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/badges',
        element: <BadgesPage />,
      },
    ],
  },
])
