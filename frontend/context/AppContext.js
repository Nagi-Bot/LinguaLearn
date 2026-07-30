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
    if (token && token !== 'local-token') {
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
        localStorage.setItem('lingua_user', JSON.stringify(res.data.user))
      } catch {
        const savedUser = localStorage.getItem('lingua_user')
        if (savedUser) setUser(JSON.parse(savedUser))
      }
    } else {
      const savedUser = localStorage.getItem('lingua_user')
      if (savedUser) setUser(JSON.parse(savedUser))
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
    } catch (err) {
      throw err
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { user: userData, token } = res.data
      Cookies.set('token', token, { expires: 30 })
      localStorage.setItem('lingua_user', JSON.stringify(userData))
      setUser(userData)
      return { user: userData, token }
    } catch (err) {
      throw err
    }
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
        xp: 0, level: 1, streak: 0, bestStreak: 0, coins: 100, diamonds: 100,
        badges: [], gameScores: {}, gameHistory: [], bio: '',
        gamesPlayed: 0, lessonsCompleted: 0, wordsLearned: 0, quizzesTaken: 0, totalGameScore: 0,
        weeklyActivity: [0, 0, 0, 0, 0, 0, 0]
      }
      localStorage.setItem('lingua_user', JSON.stringify(userData))
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

  const updateUser = async (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    try {
      const token = Cookies.get('token')
      if (token && token !== 'local-token') {
        await api.put('/auth/me', updates)
      }
    } catch {}
  }

  const addXp = async (amount, gameName = null) => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token' && gameName) {
      try {
        const res = await api.post('/games/submit', { game: gameName, score: amount, xpEarned: amount })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return {
          didLevelUp: res.data.levelUp,
          oldLevel: res.data.oldLevel,
          newLevel: res.data.newLevel,
          newBadges: res.data.newBadges || []
        }
      } catch {
        return addXpLocal(amount)
      }
    } else if (token && token !== 'local-token') {
      try {
        const res = await api.post('/profile/xp', { amount })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return {
          didLevelUp: res.data.levelUp,
          oldLevel: res.data.oldLevel,
          newLevel: res.data.newLevel,
          newBadges: res.data.newBadges || []
        }
      } catch {
        return addXpLocal(amount)
      }
    }
    return addXpLocal(amount)
  }

  const addXpLocal = (amount) => {
    const oldLevel = user?.level || 1
    const newXp = (user?.xp || 0) + amount
    const newLevel = Math.floor(newXp / 500) + 1
    const newCoins = (user?.coins || 0) + Math.floor(amount / 10)
    const newDiamonds = (user?.diamonds || 0) + (newLevel > oldLevel ? 30 : 0)
    const updated = {
      ...user,
      xp: newXp, level: newLevel, coins: newCoins, diamonds: newDiamonds,
      gamesPlayed: (user?.gamesPlayed || 0) + 1,
      totalGameScore: (user?.totalGameScore || 0) + amount
    }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    return { didLevelUp: newLevel > oldLevel, oldLevel, newLevel, newBadges: [] }
  }

  const submitGameScore = async (game, score) => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token') {
      try {
        const res = await api.post('/games/submit', { game, score, xpEarned: score })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return {
          didLevelUp: res.data.levelUp,
          oldLevel: res.data.oldLevel,
          newLevel: res.data.newLevel,
          newBadges: res.data.newBadges || [],
          user: userData
        }
      } catch {
        return { ...addXpLocal(score), user }
      }
    }
    return { ...addXpLocal(score), user }
  }

  const buyXp = async (diamonds) => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token') {
      try {
        const res = await api.post('/games/buy-xp', { diamonds })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return { success: true, xpAdded: res.data.xpAdded, levelUp: res.data.levelUp }
      } catch (err) {
        throw err
      }
    }
    throw { response: { data: { message: 'Login required' } } }
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
      login, register, googleAuth, logout, toggleDarkMode, setUser, updateUser, addXp, submitGameScore, buyXp
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
