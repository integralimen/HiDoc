import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../../entities/user/model/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const returnTo = location.pathname + location.search + location.hash

    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    )
  }

  return <Outlet />
}
