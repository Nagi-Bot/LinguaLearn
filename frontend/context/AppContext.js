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
    const savedUser = localStorage.getItem('lingua_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

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
    const savedUser = localStorage.getItem('lingua_user')
    const parsed = savedUser ? JSON.parse(savedUser) : null

    if (parsed && parsed.email === email) {
      Cookies.set('token', 'local-token', { expires: 7 })
      setUser(parsed)
      return { user: parsed, token: 'local-token' }
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

  const register = async (name, email, password) => {
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      xp: 0,
      level: 1,
      streak: 0,
      coins: 100,
      avatar: ''
    }
    localStorage.setItem('lingua_user', JSON.stringify(userData))
    localStorage.setItem('lingua_user_' + name, JSON.stringify(userData))
    Cookies.set('token', 'local-token', { expires: 7 })
    setUser(userData)
    return { user: userData, token: 'local-token' }
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('lingua_user', JSON.stringify(updated))
    if (updated.name) {
      localStorage.setItem('lingua_user_' + updated.name, JSON.stringify(updated))
    }
  }

  const addXp = (amount) => {
    const newXp = (user?.xp || 0) + amount
    const newLevel = Math.floor(newXp / 500) + 1
    const newCoins = (user?.coins || 0) + Math.floor(amount / 10)
    updateUser({ xp: newXp, level: newLevel, coins: newCoins })
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
      login, register, logout, toggleDarkMode, setUser, updateUser, addXp
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
