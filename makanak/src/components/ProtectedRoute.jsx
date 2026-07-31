import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-3 bg-background px-4 text-foreground">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-[#38C481]"
          aria-hidden
        />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  if (!user) {
    const returnUrl = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
