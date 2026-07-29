import { motion } from 'framer-motion'
import Link from 'next/link'
import { useApp } from '../context/AppContext'
import XPProgressRing from '../components/XPProgressRing'
import {
  Zap, Flame, Trophy, Award, BookOpen, Target,
  TrendingUp, ChevronRight, Clock, Star, Gem,
  Brain, Gamepad2, Sparkles, Calendar, BarChart3,
  CheckCircle, ArrowRight, Medal, Crown,
  Languages, MessageSquare
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useApp()

  const stats = {
    xp: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    coins: user?.coins || 0,
    lessonsCompleted: user?.lessonsCompleted || 0,
    dailyGoal: 0,
    badges: 0,
    nextLevelXp: ((user?.level || 1)) * 500,
    accuracy: 0,
    totalTime: '0h'
  }

  const progressPercent = Math.min(100, (stats.xp / Math.max(1, stats.nextLevelXp)) * 100)

  const quickActions = [
    { icon: Brain, label: 'Continue Learning', href: '/learn/grammar', color: 'from-primary-500 to-primary-600', desc: 'Parts of Speech' },
    { icon: Gamepad2, label: 'Grammar Battle', href: '/games/grammar-battle', color: 'from-accent-500 to-accent-600', desc: 'Endless questions - earn XP' },
    { icon: Target, label: 'Practice Test', href: '/learn/grammar?quiz=true', color: 'from-secondary-500 to-secondary-600', desc: 'Test your knowledge' },
  ]

  const weeklyProgress = [
    { day: 'Mon', xp: 0 },
    { day: 'Tue', xp: 0 },
    { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 },
    { day: 'Fri', xp: 0 },
    { day: 'Sat', xp: 0 },
    { day: 'Sun', xp: 0 },
  ]

  const badges = [
    { name: 'Quick Learner', icon: Zap, color: 'text-yellow-500' },
    { name: 'Streak Master', icon: Flame, color: 'text-orange-500' },
    { name: 'Grammar Pro', icon: BookOpen, color: 'text-primary-500' },
    { name: 'Vocabulary Star', icon: Star, color: 'text-purple-500' },
    { name: 'Game Champion', icon: Trophy, color: 'text-accent-500' },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

          <motion.div variants={itemAnim} className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl font-bold text-white shadow-md overflow-hidden flex-shrink-0">
                  {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name || 'Learner'}!
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let's continue your learning journey</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-center px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/30">
                  <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">{stats?.xp || 0}</span>
                  </div>
                  <span className="text-xs text-gray-400">XP</span>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-accent-50 dark:bg-accent-900/30">
                  <div className="flex items-center space-x-1 text-accent-600 dark:text-accent-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{stats?.streak || 0}</span>
                  </div>
                  <span className="text-xs text-gray-400">Streak</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Trophy, label: 'Level', value: stats?.level || 0, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/30' },
              { icon: BookOpen, label: 'Lessons', value: stats?.lessonsCompleted || 0, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/30' },
              { icon: Gem, label: 'Coins', value: stats?.coins || 0, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
              { icon: Award, label: 'Badges', value: stats?.badges || 0, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} rounded-xl p-4 text-center`}>
                <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemAnim} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-8">
                <XPProgressRing xp={stats.xp} nextLevelXp={stats.nextLevelXp} level={stats.level} />
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Level Progress</h2>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{stats?.xp || 0} / {stats?.nextLevelXp || 1500} XP</span>
                    <span className="text-gray-400">{Math.round(progressPercent)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-1.5 text-primary-500" /> Weekly XP
                </h3>
                <div className="flex items-end justify-between h-20 gap-1">
                  {weeklyProgress.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-md" style={{ height: '4px' }} />
                      <span className="text-xs text-gray-400 mt-1.5">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{action.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-4 h-4 mr-2 text-primary-500" /> Your Badges
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {badges.map((badge, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <badge.icon className={`w-5 h-5 text-gray-400`} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2 text-primary-500" /> Daily Goal
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Today's Progress</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{stats?.dailyGoal || 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.dailyGoal || 0}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> No activity yet today</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemAnim}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Paths</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, title: 'Grammar', desc: 'Parts of Speech', href: '/learn/grammar', color: 'from-primary-500 to-primary-600' },
                { icon: Languages, title: 'Vocabulary', desc: 'Daily Words', href: '/learn/vocabulary', color: 'from-secondary-500 to-secondary-600' },
                { icon: MessageSquare, title: 'Reading', desc: 'Comprehension', href: '/learn/reading', color: 'from-accent-500 to-accent-600' },
              ].map((item, i) => (
                <Link key={i} href={item.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-400">0%</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="text-center pt-2 pb-8">
            <Link href="/learn/grammar" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
