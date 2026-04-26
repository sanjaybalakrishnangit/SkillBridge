import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lwc_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // Validate token on mount
  useEffect(() => {
    const token = localStorage.getItem('lwc_token')
    if (token) {
      getMe()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('lwc_user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('lwc_token')
          localStorage.removeItem('lwc_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginUser = (userData, token) => {
    localStorage.setItem('lwc_token', token)
    localStorage.setItem('lwc_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('lwc_token')
    localStorage.removeItem('lwc_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
