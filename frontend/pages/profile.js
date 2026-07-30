import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import Link from 'next/link'
import api from '../lib/api'
import {
  User, Zap, Trophy, Award, BookOpen, Medal,
  Calendar, Clock, Target, Star, BarChart3,
  Settings, Camera, Flame, CheckCircle, Gamepad2,
  Diamond, TrendingUp
} from 'lucide-react'
import SEO from '../components/SEO'

const BADGE_INFO = {
  quick_learner: { name: 'Quick Learner', icon: Zap, color: 'text-yellow-500', desc: 'Complete 5 lessons', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  streak_master: { name: 'Streak Master', icon: Flame, color: 'text-orange-500', desc: '7-day streak', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  game_champion: { name: 'Game Champion', icon: Trophy, color: 'text-accent-500', desc: 'Play 10 games', bg: 'bg-accent-100 dark:bg-accent-900/30' },
  vocab_star: { name: 'Vocab Star', icon: Star, color: 'text-purple-500', desc: 'Learn 50 words', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  quiz_master: { name: 'Quiz Master', icon: Target, color: 'text-primary-500', desc: 'Take 10 quizzes', bg: 'bg-primary-100 dark:bg-primary-900/30' },
  dedicated: { name: 'Dedicated', icon: Medal, color: 'text-cyan-500', desc: '30-day streak', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  high_scorer: { name: 'High Scorer', icon: Award, color: 'text-secondary-500', desc: '1000+ total score', bg: 'bg-secondary-100 dark:bg-secondary-900/30' },
  gaming_legend: { name: 'Gaming Legend', icon: TrendingUp, color: 'text-pink-500', desc: '50 games played', bg: 'bg-pink-100 dark:bg-pink-900/30' },
}

const GAME_NAMES = {
  'grammar-battle': 'Grammar Battle',
  'hangman': 'Hangman',
  'word-builder': 'Word Builder',
  'fill-blank': 'Fill the Blank',
  'memory-game': 'Memory Cards',
  'sentence-builder': 'Sentence Builder',
  'tense-challenge': 'Tense Challenge',
  'synonym-challenge': 'Synonym Challenge',
  'antonym-challenge': 'Antonym Challenge',
  'word-search': 'Word Search',
}

export default function ProfilePage() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [gameHistory, setGameHistory] = useState([])
  const [gameScores, setGameScores] = useState({})

  useEffect(() => {
    loadGameHistory()
  }, [])

  const loadGameHistory = async () => {
    try {
      const token = document.cookie.includes('token')
      if (!token) return
      const res = await api.get('/games/history')
      setGameHistory(res.data.gameHistory || [])
      setGameScores(res.data.gameScores || {})
    } catch {}
  }

  const stats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    bestStreak: user?.bestStreak || 0,
    diamonds: user?.diamonds || 0,
    lessonsCompleted: user?.lessonsCompleted || 0,
    gamesPlayed: user?.gamesPlayed || 0,
    totalGameScore: user?.totalGameScore || 0,
    wordsLearned: user?.wordsLearned || 0,
    quizzesTaken: user?.quizzesTaken || 0,
    badges: user?.badges || [],
    weeklyActivity: user?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
    joinDate: user?.joinDate || null,
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  }
  const itemAnim = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 }
  }

  const maxWeeklyXp = Math.max(...stats.weeklyActivity, 1)

  return (
    <>
      <SEO
        title="Profile"
        description="View your LinguaLearn profile with learning stats, game history, badges, and achievements."
        keywords="user profile, learning history, achievements"
        url="/profile"
        noIndex={true}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

          <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
              <div className="relative mb-4 md:mb-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-4xl font-bold text-white shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <Link href="/edit-profile" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all">
                  <Camera className="w-4 h-4 text-gray-500" />
                </Link>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'Learner'}</h1>
                <p className="text-gray-500 text-sm">{user?.email || 'learner@example.com'}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                    <Zap className="w-3.5 h-3.5 text-primary-500" />
                    <span className="font-semibold text-sm text-primary-700 dark:text-primary-300">{stats.xp} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-accent-50 dark:bg-accent-900/30">
                    <Flame className="w-3.5 h-3.5 text-accent-500" />
                    <span className="font-semibold text-sm text-accent-700 dark:text-accent-300">{stats.streak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
                    <Trophy className="w-3.5 h-3.5 text-secondary-500" />
                    <span className="font-semibold text-sm text-secondary-700 dark:text-secondary-300">Level {stats.level}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30">
                    <Diamond className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="font-semibold text-sm text-cyan-700 dark:text-cyan-300">{stats.diamonds} diamonds</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center md:justify-start">
                  <Calendar className="w-3 h-3 mr-1" /> Joined {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'} · Best streak: {stats.bestStreak} days
                </p>
              </div>
              <Link href="/edit-profile" className="mt-4 md:mt-0 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center">
                <Settings className="w-4 h-4 mr-2" /> Edit Profile
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="flex space-x-1 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                    activeTab === tab.id ? 'bg-primary-500 text-white shadow-md' : 'text-gray-500 hover:text-primary-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </motion.div>

          {activeTab === 'overview' && (
            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, label: 'Lessons Completed', value: stats.lessonsCompleted, color: 'text-primary-500' },
                    { icon: Gamepad2, label: 'Games Played', value: stats.gamesPlayed, color: 'text-secondary-500' },
                    { icon: Zap, label: 'Total Game Score', value: stats.totalGameScore, color: 'text-accent-500' },
                    { icon: Award, label: 'Badges Earned', value: stats.badges.length, color: 'text-purple-500' },
                    { icon: Diamond, label: 'Diamonds', value: stats.diamonds, color: 'text-cyan-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Games</h2>
                {gameHistory.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {gameHistory.slice(-10).reverse().map((g, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{GAME_NAMES[g.game] || g.game}</p>
                          <p className="text-xs text-gray-400">{new Date(g.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary-500">{g.score} pts</p>
                          <p className="text-xs text-gray-400">+{g.xpEarned} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Gamepad2 className="w-10 h-10 mb-3" />
                    <p className="text-sm text-gray-500">No games played yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Play games to see your history here.</p>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h2>
                <div className="flex items-end justify-between h-24 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md"
                        style={{ height: `${Math.max(4, (stats.weeklyActivity[i] / maxWeeklyXp) * 80)}px` }}
                      />
                      <span className="text-xs text-gray-400 mt-1.5">{day}</span>
                      <span className="text-xs text-gray-500">{stats.weeklyActivity[i] || 0}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-secondary-500" /> Best Game Scores
                </h2>
                {Object.keys(gameScores).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(gameScores).map(([game, score]) => (
                      <div key={game} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{GAME_NAMES[game] || game}</span>
                        <span className="font-semibold text-primary-500">{score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-gray-400">
                    <Trophy className="w-10 h-10 mb-2" />
                    <p className="text-sm">No scores recorded yet.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Badges & Achievements ({stats.badges.length}/{Object.keys(BADGE_INFO).length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(BADGE_INFO).map(([key, badge]) => {
                    const earned = stats.badges.includes(key)
                    return (
                      <div key={key} className={`text-center p-4 rounded-xl ${earned ? badge.bg : 'bg-gray-50 dark:bg-gray-700/50 opacity-50'}`}>
                        <div className={`w-14 h-14 mx-auto mb-3 rounded-xl ${earned ? badge.bg : 'bg-gray-200 dark:bg-gray-600'} flex items-center justify-center`}>
                          <badge.icon className={`w-7 h-7 ${earned ? badge.color : 'text-gray-400'}`} />
                        </div>
                        <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{badge.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
                        {earned && <p className="text-xs text-green-500 font-medium mt-1">Earned!</p>}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'statistics' && (
            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Game Statistics</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Total Games', value: stats.gamesPlayed, icon: Gamepad2, color: 'bg-secondary-500' },
                    { label: 'Total Score', value: stats.totalGameScore, icon: Zap, color: 'bg-primary-500' },
                    { label: 'Quizzes Taken', value: stats.quizzesTaken, icon: Target, color: 'bg-accent-500' },
                    { label: 'Words Learned', value: stats.wordsLearned, icon: Star, color: 'bg-purple-500' },
                    { label: 'Lessons Done', value: stats.lessonsCompleted, icon: BookOpen, color: 'bg-green-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Currency</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/30">
                    <Diamond className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.diamonds}</div>
                    <div className="text-xs text-gray-500">Diamonds</div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-center">
                  <p className="text-xs text-gray-500">10 Diamonds = 50 XP</p>
                  <p className="text-xs text-gray-500 mt-1">Level up reward: +30 Diamonds</p>
                </div>
              </motion.div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
    </>
  )
}
