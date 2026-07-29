import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import Link from 'next/link'
import {
  User, Zap, Trophy, Award, BookOpen, Medal,
  Calendar, Clock, Target, Star, Gem, BarChart3,
  Settings, Camera, Flame, CheckCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    coins: user?.coins || 0,
    lessonsCompleted: user?.lessonsCompleted || Math.floor((user?.xp || 0) / 100),
    accuracy: 87,
    totalTime: '12h 30m',
    badges: Math.floor((user?.level || 1) / 2) + 1,
    quizzesTaken: Math.floor((user?.xp || 0) / 50),
    wordsLearned: Math.floor((user?.xp || 0) / 10),
    joinDate: user?.joinDate || new Date(parseInt(user?.id || Date.now())).toLocaleDateString(),
    completedCourses: (user?.xp || 0) > 200 ? ['Grammar Basics'] : [],
    weeklyActivity: [85, 92, 78, 95, 88, 70, 45]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 mb-6 gradient-card">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
            <div className="relative mb-4 md:mb-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
              ) : (
                <div className="w-24 h-24 gradient-bg rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <Link href="/edit-profile" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all cursor-pointer">
                <Camera className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-display font-bold">{user?.name || 'Learner'}</h1>
              <p className="text-gray-500">{user?.email || 'learner@example.com'}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold">{stats?.xp || 0} XP</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                  <Flame className="w-4 h-4 text-accent-500" />
                  <span className="font-semibold">{stats?.streak || 0} day streak</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                  <Trophy className="w-4 h-4 text-secondary-500" />
                  <span className="font-semibold">Level {stats?.level || 1}</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Gem className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">{stats?.coins || 0} coins</span>
                </div>
              </div>
            </div>
            <Link href="/edit-profile" className="mt-4 md:mt-0 btn-secondary"><Settings className="w-4 h-4 mr-2 inline" /> Edit Profile</Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 p-1 glass rounded-xl w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 hover:text-primary-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4">Quick Stats</h2>
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, label: 'Lessons Completed', value: stats?.lessonsCompleted || 0, color: 'text-primary-500' },
                    { icon: Target, label: 'Accuracy', value: `${stats?.accuracy || 0}%`, color: 'text-secondary-500' },
                    { icon: Award, label: 'Badges Earned', value: stats?.badges || 0, color: 'text-accent-500' },
                    { icon: Medal, label: 'Quizzes Taken', value: stats?.quizzesTaken || 0, color: 'text-purple-500' },
                    { icon: BookOpen, label: 'Words Learned', value: stats?.wordsLearned || 0, color: 'text-cyan-500' },
                    { icon: Clock, label: 'Total Time', value: stats?.totalTime || '0h', color: 'text-primary-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4">Learning History</h2>
                <div className="space-y-3">
                  {[
                    { action: 'Completed Grammar: Parts of Speech', date: '2 hours ago', type: 'lesson' },
                    { action: 'Earned "Quick Learner" badge', date: 'Yesterday', type: 'achievement' },
                    { action: 'Completed Vocabulary: Daily Words', date: '2 days ago', type: 'lesson' },
                    { action: 'Won Grammar Battle (850 XP)', date: '3 days ago', type: 'game' },
                    { action: '7-day streak achieved!', date: '5 days ago', type: 'streak' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.type === 'lesson' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' :
                        item.type === 'achievement' ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600' :
                        item.type === 'game' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                        'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600'
                      }`}>
                        {item.type === 'lesson' ? <BookOpen className="w-4 h-4" /> :
                         item.type === 'achievement' ? <Award className="w-4 h-4" /> :
                         item.type === 'game' ? <Trophy className="w-4 h-4" /> :
                         <Flame className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4">Weekly Activity</h2>
                <div className="flex items-end justify-between h-24 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg"
                        style={{ height: `${(stats?.weeklyActivity?.[i] || 50)}%`, maxHeight: '100%' }}
                      />
                      <span className="text-xs text-gray-500 mt-1">{day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Minutes of learning per day</p>
              </div>

              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-secondary-500" /> Completed Courses
                </h2>
                {stats?.completedCourses?.length > 0 ? (
                  <div className="space-y-2">
                    {stats.completedCourses.map((course, i) => (
                      <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                        <CheckCircle className="w-4 h-4 text-secondary-500" />
                        <span className="text-sm font-medium">{course}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No courses completed yet. Start learning!</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card">
              <h2 className="font-display font-semibold text-lg mb-6">Badges & Achievements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Quick Learner', desc: 'Complete 5 lessons', icon: Zap, earned: true, color: 'text-yellow-500' },
                  { name: 'Streak Master', desc: '7-day streak', icon: Flame, earned: true, color: 'text-orange-500' },
                  { name: 'Grammar Pro', desc: 'Complete all grammar topics', icon: BookOpen, earned: true, color: 'text-primary-500' },
                  { name: 'Vocab Star', desc: 'Learn 50 words', icon: Star, earned: true, color: 'text-purple-500' },
                  { name: 'Game Champion', desc: 'Win 10 games', icon: Trophy, earned: false, color: 'text-accent-500' },
                  { name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: Award, earned: false, color: 'text-secondary-500' },
                  { name: 'Dedicated', desc: '30-day streak', icon: Medal, earned: false, color: 'text-cyan-500' },
                  { name: 'Writing Wizard', desc: 'Complete 10 writing exercises', icon: User, earned: false, color: 'text-pink-500' },
                ].map((badge, i) => (
                  <div key={i} className={`text-center p-4 rounded-xl ${
                    badge.earned ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                  }`}>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      badge.earned ? 'gradient-bg' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <badge.icon className={`w-7 h-7 ${badge.earned ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4">Learning Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Grammar</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Vocabulary</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full bg-secondary-500 rounded-full" style={{ width: '45%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Reading</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full bg-accent-500 rounded-full" style={{ width: '30%' }} /></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Writing</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} /></div>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <h2 className="font-display font-semibold text-lg mb-4">Overall Performance</h2>
                <div className="text-center p-6">
                  <div className="text-6xl font-display font-bold gradient-text mb-2">{stats?.accuracy || 0}%</div>
                  <p className="text-gray-500">Average Quiz Score</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                    <div className="text-2xl font-bold text-primary-500">{stats?.quizzesTaken || 0}</div>
                    <div className="text-xs text-gray-500">Quizzes</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/20">
                    <div className="text-2xl font-bold text-secondary-500">{stats?.wordsLearned || 0}</div>
                    <div className="text-xs text-gray-500">Words</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
