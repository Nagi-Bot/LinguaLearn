import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import Link from 'next/link'
import {
  User, Zap, Trophy, Award, BookOpen, Medal,
  Calendar, Clock, Target, Star, Gem, BarChart3,
  Settings, Camera, Flame, CheckCircle, Info
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    coins: user?.coins || 0,
    lessonsCompleted: user?.lessonsCompleted || 0,
    accuracy: 0,
    totalTime: '0h',
    badges: 0,
    quizzesTaken: 0,
    wordsLearned: 0,
    joinDate: user?.joinDate || new Date(parseInt(user?.id || Date.now())).toLocaleDateString(),
    completedCourses: [],
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0]
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

  return (
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
                    <span className="font-semibold text-sm text-primary-700 dark:text-primary-300">{stats?.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-accent-50 dark:bg-accent-900/30">
                    <Flame className="w-3.5 h-3.5 text-accent-500" />
                    <span className="font-semibold text-sm text-accent-700 dark:text-accent-300">{stats?.streak || 0} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
                    <Trophy className="w-3.5 h-3.5 text-secondary-500" />
                    <span className="font-semibold text-sm text-secondary-700 dark:text-secondary-300">Level {stats?.level || 1}</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                    <Gem className="w-3.5 h-3.5 text-purple-500" />
                    <span className="font-semibold text-sm text-purple-700 dark:text-purple-300">{stats?.coins || 0} coins</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center md:justify-start">
                  <Calendar className="w-3 h-3 mr-1" /> Joined {stats.joinDate}
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
                    { icon: BookOpen, label: 'Lessons Completed', value: stats?.lessonsCompleted || 0, color: 'text-primary-500' },
                    { icon: Target, label: 'Accuracy', value: `${stats?.accuracy || 0}%`, color: 'text-secondary-500' },
                    { icon: Award, label: 'Badges Earned', value: stats?.badges || 0, color: 'text-accent-500' },
                    { icon: Gem, label: 'Coins Earned', value: stats?.coins || 0, color: 'text-yellow-500' },
                    { icon: Clock, label: 'Total Time', value: stats?.totalTime || '0h', color: 'text-primary-500' },
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
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Learning History</h2>
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <BookOpen className="w-10 h-10 mb-3" />
                  <p className="text-sm text-gray-500">No activity yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Play games and complete lessons to see your history here.</p>
                </div>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h2>
                <div className="flex items-end justify-between h-24 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-md" style={{ height: '4px' }} />
                      <span className="text-xs text-gray-400 mt-1.5">{day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">No activity this week</p>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-secondary-500" /> Completed Courses
                </h2>
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <BookOpen className="w-10 h-10 mb-3" />
                  <p className="text-sm text-gray-500">No courses completed yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Start learning to track your progress!</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Badges & Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Quick Learner', desc: 'Complete 5 lessons', icon: Zap, earned: false, color: 'text-yellow-500' },
                    { name: 'Streak Master', desc: '7-day streak', icon: Flame, earned: false, color: 'text-orange-500' },
                    { name: 'Grammar Pro', desc: 'Complete all grammar topics', icon: BookOpen, earned: false, color: 'text-primary-500' },
                    { name: 'Vocab Star', desc: 'Learn 50 words', icon: Star, earned: false, color: 'text-purple-500' },
                    { name: 'Game Champion', desc: 'Win 10 games', icon: Trophy, earned: false, color: 'text-accent-500' },
                    { name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: Award, earned: false, color: 'text-secondary-500' },
                    { name: 'Dedicated', desc: '30-day streak', icon: Medal, earned: false, color: 'text-cyan-500' },
                    { name: 'Writing Wizard', desc: 'Complete 10 writing exercises', icon: User, earned: false, color: 'text-pink-500' },
                  ].map((badge, i) => (
                    <div key={i} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 opacity-60">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <badge.icon className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{badge.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">Complete achievements to unlock badges!</p>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'statistics' && (
            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Statistics</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Grammar', pct: 0, color: 'bg-primary-500' },
                    { label: 'Vocabulary', pct: 0, color: 'bg-secondary-500' },
                    { label: 'Reading', pct: 0, color: 'bg-accent-500' },
                    { label: 'Writing', pct: 0, color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Overall Performance</h2>
                <div className="text-center p-6">
                  <div className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">--</div>
                  <p className="text-gray-500">No data yet</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                    <div className="text-2xl font-bold text-primary-500">0</div>
                    <div className="text-xs text-gray-500">Quizzes</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/30">
                    <div className="text-2xl font-bold text-secondary-500">0</div>
                    <div className="text-xs text-gray-500">Words</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}
