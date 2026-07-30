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
    if (newMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { user: userData, token } = res.data
    Cookies.set('token', token, { expires: 30 })
    localStorage.setItem('lingua_user', JSON.stringify(userData))
    setUser(userData)
    return { user: userData, token }
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { user: userData, token } = res.data
    Cookies.set('token', token, { expires: 30 })
    localStorage.setItem('lingua_user', JSON.stringify(userData))
    setUser(userData)
    return { user: userData, token }
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
      const userData = {
        id: decoded.sub || Date.now().toString(),
        name: decoded.name || decoded.email.split('@')[0],
        email: decoded.email, avatar: decoded.picture || '',
        xp: 0, level: 1, streak: 0, bestStreak: 0, diamonds: 100, hearts: 3, maxHearts: 3,
        badges: [], gameScores: {}, gameHistory: [], bio: '', learnProgress: {},
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
      if (token && token !== 'local-token') await api.put('/auth/me', updates)
    } catch {}
  }

  const syncUser = (userData) => {
    setUser(userData)
    localStorage.setItem('lingua_user', JSON.stringify(userData))
  }

  const hasHearts = () => {
    if (!user) return false
    if (user.hearts > 0) return true
    if (user.heartRefillAt && new Date() >= new Date(user.heartRefillAt)) {
      const updated = { ...user, hearts: user.maxHearts || 3, heartRefillAt: null }
      setUser(updated)
      localStorage.setItem('lingua_user', JSON.stringify(updated))
      return true
    }
    return false
  }

  const loseHeart = async () => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token') {
      try {
        const res = await api.post('/learn/lose-heart')
        const updated = { ...user, hearts: res.data.hearts, heartRefillAt: res.data.heartRefillAt }
        setUser(updated)
        localStorage.setItem('lingua_user', JSON.stringify(updated))
        return res.data.hearts
      } catch {}
    }
    if (user && user.hearts > 0) {
      const newHearts = user.hearts - 1
      const updated = { ...user, hearts: newHearts, heartRefillAt: newHearts === 0 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : user.heartRefillAt }
      setUser(updated)
      localStorage.setItem('lingua_user', JSON.stringify(updated))
      return newHearts
    }
    return 0
  }

  const submitGameScore = async (game, score) => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token') {
      try {
        const res = await api.post('/games/submit', { game, score, xpEarned: score })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return { didLevelUp: res.data.levelUp, oldLevel: res.data.oldLevel, newLevel: res.data.newLevel, newBadges: res.data.newBadges || [], user: userData }
      } catch {
        return { ...addXpLocal(score), user }
      }
    }
    return { ...addXpLocal(score), user }
  }

  const addXpLocal = (amount) => {
    const oldLevel = user?.level || 1
    const newXp = (user?.xp || 0) + amount
    const newLevel = Math.floor(newXp / 500) + 1
    const newDiamonds = (user?.diamonds || 0) + (newLevel > oldLevel ? 30 : 0)
    const updated = { ...user, xp: newXp, level: newLevel, diamonds: newDiamonds, gamesPlayed: (user?.gamesPlayed || 0) + 1, totalGameScore: (user?.totalGameScore || 0) + amount }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    return { didLevelUp: newLevel > oldLevel, oldLevel, newLevel, newBadges: [] }
  }

  const saveLearnProgress = async (module, itemId, score = 10) => {
    const token = Cookies.get('token')
    if (token && token !== 'local-token') {
      try {
        const res = await api.post('/learn/progress', { module, itemId, score, xpEarned: score })
        const userData = res.data.user
        setUser(userData)
        localStorage.setItem('lingua_user', JSON.stringify(userData))
        return { didLevelUp: res.data.levelUp, newLevel: res.data.newLevel, user: userData }
      } catch {}
    }
    const oldLevel = user?.level || 1
    const newXp = (user?.xp || 0) + score
    const newLevel = Math.floor(newXp / 500) + 1
    const newDiamonds = (user?.diamonds || 0) + 2 + (newLevel > oldLevel ? 30 : 0)
    const lp = user?.learnProgress || {}
    if (!lp[module]) lp[module] = { completed: [], score: 0, totalXp: 0 }
    if (!lp[module].completed.includes(itemId)) lp[module].completed.push(itemId)
    lp[module].totalXp = (lp[module].totalXp || 0) + score
    const updated = { ...user, xp: newXp, level: newLevel, diamonds: newDiamonds, lessonsCompleted: (user?.lessonsCompleted || 0) + 1, learnProgress: lp }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    return { didLevelUp: newLevel > oldLevel, newLevel, user: updated }
  }

  const buyHearts = async (amount = 1) => {
    const res = await api.post('/learn/buy-hearts', { amount })
    const updated = { ...user, hearts: res.data.hearts, diamonds: res.data.diamonds }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    return updated
  }

  const buyXp = async (diamonds) => {
    const res = await api.post('/learn/buy-xp', { diamonds })
    setUser(res.data.user)
    localStorage.setItem('lingua_user', JSON.stringify(res.data.user))
    return res.data
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
      login, register, googleAuth, logout, toggleDarkMode, setUser, updateUser, syncUser,
      submitGameScore, saveLearnProgress, hasHearts, loseHeart, buyHearts, buyXp
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) return { user: null, darkMode: false, toggleDarkMode: () => {}, logout: () => {}, syncUser: () => {}, submitGameScore: () => {}, saveLearnProgress: () => {}, loseHeart: () => {}, hasHearts: true, buyHearts: () => {}, buyXp: () => {} }
  return ctx
}
