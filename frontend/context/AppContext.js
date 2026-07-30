import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import api from '../lib/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [theme, setTheme] = useState('light')
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
    initUser()
  }, [])

  const initUser = async () => {
    const token = Cookies.get('token')
    if (token) {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
        localStorage.setItem('lingua_user', JSON.stringify(res.data.user))
      } catch {
        const savedUser = localStorage.getItem('lingua_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }
    } else {
      const savedUser = localStorage.getItem('lingua_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setLoading(false)
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    setTheme(newMode ? 'dark' : 'light')
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      const { user: userData, token } = res.data
      Cookies.set('token', token, { expires: 30 })
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      setUser(userData)
      return { user: userData, token }
    } catch {
      const savedUser = localStorage.getItem('lingua_user')
      const parsed = savedUser ? JSON.parse(savedUser) : null
      if (parsed && parsed.email === email) {
        const userData = { ...parsed, id: parsed.id || parsed._id || Date.now().toString() }
        Cookies.set('token', 'local-token', { expires: 7 })
        setUser(userData)
        return { user: userData, token: 'local-token' }
      }
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('lingua_user_'))
      for (const key of allKeys) {
        try {
          const su = JSON.parse(localStorage.getItem(key))
          if (su.email === email) {
            localStorage.setItem('lingua_user', JSON.stringify(su))
            Cookies.set('token', 'local-token', { expires: 7 })
            setUser(su)
            return { user: su, token: 'local-token' }
          }
        } catch {}
      }
      throw { response: { data: { message: 'Account not found. Please sign up first.' } } }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { user: userData, token } = res.data
      Cookies.set('token', token, { expires: 30 })
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      localStorage.setItem('lingua_user_' + name, JSON.stringify(userData))
      setUser(userData)
      return { user: userData, token }
    } catch {
      const userData = {
        id: Date.now().toString(),
        name, email,
        xp: 0, level: 1, streak: 0, coins: 100, avatar: '', bio: ''
      }
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      localStorage.setItem('lingua_user_' + name, JSON.stringify(userData))
      Cookies.set('token', 'local-token', { expires: 7 })
      setUser(userData)
      return { user: userData, token: 'local-token' }
    }
  }

  const updateUser = async (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    if (updated.name) {
      localStorage.setItem('lingua_user_' + updated.name, JSON.stringify(updated))
    }
    try {
      const token = Cookies.get('token')
      if (token && token !== 'local-token') {
        await api.put('/auth/me', updates)
      }
    } catch {}
  }

  const addXp = async (amount) => {
    const oldLevel = user?.level || 1
    const newXp = (user?.xp || 0) + amount
    const newLevel = Math.floor(newXp / 500) + 1
    const newCoins = (user?.coins || 0) + Math.floor(amount / 10)
    const updated = { xp: newXp, level: newLevel, coins: newCoins }
    updateUser(updated)
    const stored = localStorage.getItem('lingua_leaderboard')
    const savedScores = stored ? JSON.parse(stored) : []
    const existing = savedScores.findIndex(s => s.name === user?.name)
    const entry = { name: user?.name, xp: newXp, level: newLevel, streak: user?.streak || 0 }
    if (existing >= 0) {
      savedScores[existing] = { ...savedScores[existing], ...entry }
    } else {
      savedScores.push(entry)
    }
    localStorage.setItem('lingua_leaderboard', JSON.stringify(savedScores))
    try {
      const token = Cookies.get('token')
      if (token && token !== 'local-token') {
        await api.post('/profile/xp', { amount })
      } else if (user?.name && user?.email) {
        await api.post('/auth/sync', { name: user.name, email: user.email, xp: newXp, level: newLevel, streak: user.streak || 0, coins: newCoins, avatar: user.avatar || '', bio: user.bio || '' })
      }
    } catch {}
    return { didLevelUp: newLevel > oldLevel, oldLevel, newLevel }
  }

  const googleAuth = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential })
      const { user: userData, token } = res.data
      Cookies.set('token', token, { expires: 30 })
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      setUser(userData)
      return { user: userData, token }
    } catch {
      const decoded = parseJwt(credentialResponse.credential)
      if (!decoded) throw { response: { data: { message: 'Google signup failed' } } }
      const existingUser = localStorage.getItem('lingua_user')
      const parsed = existingUser ? JSON.parse(existingUser) : null
      if (parsed && parsed.email === decoded.email) {
        const userData = { ...parsed, name: decoded.name || parsed.name, avatar: decoded.picture || parsed.avatar }
        Cookies.set('token', 'local-token', { expires: 7 })
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        setUser(userData)
        return { user: userData, token: 'local-token' }
      }
      const userData = {
        id: decoded.sub || Date.now().toString(),
        name: decoded.name || decoded.email.split('@')[0],
        email: decoded.email,
        avatar: decoded.picture || '',
        xp: 0, level: 1, streak: 0, coins: 100, bio: ''
      }
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      localStorage.setItem('lingua_user_' + userData.name, JSON.stringify(userData))
      Cookies.set('token', 'local-token', { expires: 7 })
      setUser(userData)
      return { user: userData, token: 'local-token' }
    }
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(base64))
    } catch { return null }
  }

  const logout = () => {
    Cookies.remove('token')
    localStorage.removeItem('lingua_user')
    setUser(null)
    router.push('/')
  }

  return (
    <AppContext.Provider value={{
      user, loading, darkMode, theme,
      login, register, googleAuth, logout, toggleDarkMode, setUser, updateUser, addXp
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
