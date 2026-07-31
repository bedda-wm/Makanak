import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    const res = await apiFetch('/auth/me')
    const data = await res.json().catch(() => ({}))
    if (data?.authenticated && data.user) {
      setUser(data.user)
      return data
    }
    setUser(null)
    return data
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refreshAuth()
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [refreshAuth])

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshAuth,
      logout,
    }),
    [user, loading, refreshAuth, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
