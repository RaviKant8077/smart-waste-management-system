import { createContext, useContext, useEffect, useState, useRef } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const inactivityTimeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  // Auto-logout after 5 minutes of inactivity
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes

  const resetInactivityTimer = () => {
    lastActivityRef.current = Date.now()
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }
    if (user) {
      inactivityTimeoutRef.current = setTimeout(() => {
        logout()
      }, INACTIVITY_TIMEOUT)
    }
  }

  const handleActivity = () => {
    resetInactivityTimer()
  }

  useEffect(() => {
    // Check for stored token and tab-specific session on mount
    const token = localStorage.getItem('jwt_token')
    const tabSessionId = sessionStorage.getItem('tab_session_id')

    if (token && tabSessionId) {
      // Check if session is still valid (not expired)
      const sessionExpiry = localStorage.getItem('session_expiry')
      if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
        // Session expired, clear everything
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('session_id')
        localStorage.removeItem('session_expiry')
        sessionStorage.removeItem('tab_session_id')
        setLoading(false)
        return
      }

      // attempt to fetch current user on mount
      async function fetchMe() {
        try {
          const res = await client.get('/api/auth/me')
          setUser(res.data)
          resetInactivityTimer()
        } catch (e) {
          // Token might be invalid, remove it
          localStorage.removeItem('jwt_token')
          localStorage.removeItem('session_id')
          localStorage.removeItem('session_expiry')
          sessionStorage.removeItem('tab_session_id')
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
      fetchMe()
    } else {
      // No tab session found, even if token exists, don't auto-login
      setLoading(false)
    }

    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Check for tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, pause timer
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current)
        }
      } else {
        // Tab is visible again, reset timer
        resetInactivityTimer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
    }
  }, [])

  async function login(credentials) {
    const res = await client.post('/api/auth/login', credentials)
    // Store the JWT token
    if (res.data?.token) {
      localStorage.setItem('jwt_token', res.data.token)
      // Create a unique session ID and expiry
      const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const sessionExpiry = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      localStorage.setItem('session_id', sessionId)
      localStorage.setItem('session_expiry', sessionExpiry.toString())
      // Create tab-specific session ID
      const tabSessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('tab_session_id', tabSessionId)
    }
    // backend may return user info in body; if not, /api/auth/me will provide it
    if (res.data?.user) setUser(res.data.user)
    else {
      try {
        const me = await client.get('/api/auth/me')
        setUser(me.data)
      } catch (e) {
        // ignore
      }
    }
    // Return the response data, let the component handle navigation
    return res.data
  }

  async function register(payload) {
    const res = await client.post('/api/auth/register', payload)
    // Store the JWT token if provided
    if (res.data?.token) {
      localStorage.setItem('jwt_token', res.data.token)
    }
    return res.data
  }

  async function logout() {
    try {
      await client.post('/api/auth/logout')
    } catch (e) {
      // ignore
    }
    // Clear stored token and user state
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('session_id')
    localStorage.removeItem('session_expiry')
    sessionStorage.removeItem('tab_session_id')
    setUser(null)
    // Clear inactivity timer
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }
  }

  const value = { user, loading, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
