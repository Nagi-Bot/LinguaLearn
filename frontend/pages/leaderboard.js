import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Flame, BookOpen, Medal, Award, Crown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '../context/AppContext'

export default function LeaderboardPage() {
  const { user } = useApp()
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const handler = () => setRefreshKey(k => k + 1)
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const allUsers = useMemo(() => {
    const stored = localStorage.getItem('lingua_leaderboard')
    const savedScores = stored ? JSON.parse(stored) : []

    let storedUsers = []
    try {
      const keys = Object.keys(localStorage)
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith('lingua_user_')) {
          try {
            const data = JSON.parse(localStorage.getItem(keys[i]))
            if (data) storedUsers.push(data)
          } catch {}
        }
      }
    } catch {}

    let list = []

    if (user) {
      const userEntry = { name: user.name, xp: user.xp || 0, level: user.level || 1, streak: user.streak || 0, avatar: user.avatar || '', isYou: true, color: 'from-primary-500 to-primary-600' }
      list.push(userEntry)
    }

    for (let i = 0; i < storedUsers.length; i++) {
      const su = storedUsers[i]
      if (!list.find(u => u.name === su.name)) {
        list.push({ name: su.name, xp: su.xp || 0, level: su.level || 1, streak: su.streak || 0, avatar: su.avatar || '' })
      }
    }

    for (let i = 0; i < savedScores.length; i++) {
      const s = savedScores[i]
      const existing = list.find(u => u.name === s.name)
      if (existing) {
        if (s.xp > existing.xp) { existing.xp = s.xp; existing.level = s.level; existing.streak = s.streak || existing.streak }
      } else {
        list.push({ name: s.name, xp: s.xp, level: s.level, streak: s.streak || 0 })
      }
    }

    list.sort((a, b) => b.xp - a.xp)
    return list.slice(0, 15)
  }, [user, refreshKey])

  const getRankIcon = (rank) => {
    if (rank === 0) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 1) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-amber-700" />
    return null
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            <Trophy className="w-8 h-8 inline mr-2 text-accent-500" />
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Top English learners this week</p>
        </div>

        <div className="flex items-end justify-center gap-4 mb-8">
          {[0, 1, 2].map((pos, idx) => {
            const i = idx === 0 ? 1 : idx === 1 ? 0 : 2
            if (!allUsers[i]) return null
            const u = allUsers[i]
            const heights = ['h-32', 'h-40', 'h-28']
            const orders = ['order-1', 'order-2', 'order-3']
            const rankIcons = [<Medal key="m1" className="w-6 h-6 text-gray-300" />, <Crown key="c" className="w-8 h-8 text-yellow-400" />, <Medal key="m2" className="w-6 h-6 text-amber-700" />]
            return (
              <div key={i} className={`${orders[idx]} flex flex-col items-center`}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${u.color || 'from-primary-500 to-primary-600'} flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg overflow-hidden`}>
                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name.charAt(0)}
                </div>
                <p className="font-semibold text-sm">{u.name.split(' ')[0]}{u.isYou ? ' (You)' : ''}</p>
                <div className={`w-24 ${heights[idx]} rounded-t-xl bg-gradient-to-b ${u.color || 'from-primary-500/50 to-primary-600/50'} flex items-center justify-center mt-2`}>
                  <div className="text-center">
                    <div className="flex justify-center">{rankIcons[idx]}</div>
                    <div className="text-white font-bold text-lg">{u.xp.toLocaleString()}</div>
                    <div className="text-white text-xs">XP</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-card overflow-hidden">
          {allUsers.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-4 ${
                i < allUsers.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
              } ${i < 3 ? 'bg-gradient-to-r from-primary-50/50 dark:from-primary-900/10' : ''} ${u.isYou ? 'bg-primary-500/10 dark:bg-primary-500/20 ring-2 ring-primary-500' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 text-center font-bold text-lg">
                  {getRankIcon(i) || <span className="text-gray-400">#{i + 1}</span>}
                </div>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.color || 'from-primary-500 to-primary-600'} flex items-center justify-center text-white font-bold overflow-hidden`}>
                  {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{u.name} {u.isYou && <span className="text-primary-500 text-xs">(you)</span>}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center"><Zap className="w-3 h-3 mr-1" /> Level {u.level}</span>
                    <span className="flex items-center"><Flame className="w-3 h-3 mr-1" /> {u.streak} days</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold gradient-text">{u.xp.toLocaleString()}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className="btn-secondary"><ArrowLeft className="w-4 h-4 mr-2 inline" /> Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
