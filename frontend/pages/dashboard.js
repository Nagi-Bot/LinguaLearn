import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
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
    lessonsCompleted: user?.lessonsCompleted || Math.floor((user?.xp || 0) / 100),
    dailyGoal: Math.min(100, Math.floor(((user?.xp || 0) % 100))),
    badges: Math.floor((user?.level || 1) / 2) + 1,
    nextLevelXp: ((user?.level || 1)) * 500,
    accuracy: 87,
    totalTime: '12h 30m'
  }

  const progressPercent = Math.min(100, (stats.xp / Math.max(1, stats.nextLevelXp)) * 100)

  const quickActions = [
    { icon: Brain, label: 'Continue Learning', href: '/learn/grammar', color: 'from-primary-500 to-primary-600', desc: 'Parts of Speech' },
    { icon: Gamepad2, label: 'Grammar Battle', href: '/games/grammar-battle', color: 'from-accent-500 to-accent-600', desc: 'Endless questions - earn XP' },
    { icon: Target, label: 'Practice Test', href: '/learn/grammar?quiz=true', color: 'from-secondary-500 to-secondary-600', desc: 'Test your knowledge' },
  ]

  const weeklyProgress = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 200 },
    { day: 'Wed', xp: 80 },
    { day: 'Thu', xp: 250 },
    { day: 'Fri', xp: 180 },
    { day: 'Sat', xp: 90 },
    { day: 'Sun', xp: 0 },
  ]

  const badges = [
    { name: 'Quick Learner', icon: Zap, color: 'text-yellow-500' },
    { name: 'Streak Master', icon: Flame, color: 'text-orange-500' },
    { name: 'Grammar Pro', icon: BookOpen, color: 'text-primary-500' },
    { name: 'Vocabulary Star', icon: Star, color: 'text-purple-500' },
    { name: 'Game Champion', icon: Trophy, color: 'text-accent-500' },
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 mb-6 gradient-card"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user?.name?.charAt(0)?.toUpperCase() || 'U')}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Welcome back, {user?.name || 'Learner'}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Let's continue your learning journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold text-lg">{stats?.xp || 0}</span>
                </div>
                <span className="text-xs text-gray-500">XP Points</span>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                <div className="flex items-center space-x-1 text-accent-600 dark:text-accent-400">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-lg">{stats?.streak || 0}</span>
                </div>
                <span className="text-xs text-gray-500">Day Streak</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Trophy, label: 'Level', value: stats?.level || 0, color: 'text-accent-500' },
            { icon: BookOpen, label: 'Lessons Done', value: stats?.lessonsCompleted || 0, color: 'text-primary-500' },
            { icon: Gem, label: 'Coins', value: stats?.coins || 0, color: 'text-yellow-500' },
            { icon: Award, label: 'Badges', value: stats?.badges || 0, color: 'text-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Level Progress</h2>
              <span className="text-sm text-gray-500">{stats?.xp || 0} / {stats?.nextLevelXp || 1500} XP</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full gradient-bg rounded-full"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Level {stats?.level || 1}</span>
              <span className="text-sm text-gray-500">Level {Math.floor((stats?.level || 1) + 1)}</span>
            </div>

            {/* Weekly XP Chart */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-primary-500" /> Weekly XP
              </h3>
              <div className="flex items-end justify-between h-24 gap-1">
                {weeklyProgress.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(8, (day.xp / 250) * 100)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg max-h-full"
                      style={{ height: `${Math.max(8, (day.xp / 250) * 100)}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`glass-card p-4 bg-gradient-to-r ${action.color} text-white cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-8 h-8 opacity-90" />
                      <div>
                        <p className="font-semibold">{action.label}</p>
                        <p className="text-sm opacity-80">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-70" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Badges and Daily Goal */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
          >
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary-500" /> Your Badges
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {badges.map((badge, i) => (
                <div key={i} className="text-center group cursor-pointer" title={badge.name}>
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{badge.name}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card"
          >
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-500" /> Daily Goal
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Progress</span>
              <span className="text-sm font-semibold">{stats?.dailyGoal || 0}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.dailyGoal || 0}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> 15 min today</span>
              <span className="text-primary-500 font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> +20% vs yesterday
              </span>
            </div>
          </motion.div>
        </div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display font-semibold text-xl mb-4">Continue Learning</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, title: 'Grammar', desc: 'Parts of Speech', progress: 65, href: '/learn/grammar', color: 'from-primary-500 to-primary-600' },
              { icon: Languages, title: 'Vocabulary', desc: 'Daily Words', progress: 40, href: '/learn/vocabulary', color: 'from-secondary-500 to-secondary-600' },
              { icon: MessageSquare, title: 'Reading', desc: 'Comprehension', progress: 25, href: '/learn/reading', color: 'from-accent-500 to-accent-600' },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <motion.div whileHover={{ y: -4 }} className="glass-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-primary-500">{item.progress}%</span>
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`} style={{ width: `${item.progress}%` }} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Continue Learning CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link href="/learn/grammar" className="btn-primary inline-flex items-center">
            <BookOpen className="w-5 h-5 mr-2" /> Continue Learning
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
