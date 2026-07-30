import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, BookOpen, Gamepad2, BarChart3, Shield,
  Settings, Trash2, Edit, Plus, Search, Star,
  Trophy, Activity, TrendingUp
} from 'lucide-react'
import SEO from '../components/SEO'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'analytics', label: 'Analytics', icon: Activity },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const adminStats = [
    { icon: Users, label: 'Total Users', value: '1,247', change: '+12%', color: 'from-primary-500 to-primary-600' },
    { icon: BookOpen, label: 'Total Lessons', value: '48', change: '+3', color: 'from-secondary-500 to-secondary-600' },
    { icon: Gamepad2, label: 'Active Games', value: '12', change: '+2', color: 'from-accent-500 to-accent-600' },
    { icon: Star, label: 'Avg Score', value: '87%', change: '+5%', color: 'from-purple-500 to-purple-600' },
  ]

  const recentUsers = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2 hours ago', status: 'active', xp: 15200 },
    { name: 'Michael Chen', email: 'michael@example.com', joined: '5 hours ago', status: 'active', xp: 12800 },
    { name: 'Emma Williams', email: 'emma@example.com', joined: '1 day ago', status: 'active', xp: 11400 },
    { name: 'James Rodriguez', email: 'james@example.com', joined: '2 days ago', status: 'inactive', xp: 9800 },
  ]

  if (activeTab === 'overview') {
    return (
      <>
        <SEO
          title="Admin"
          description="LinguaLearn admin panel."
          keywords="admin"
          url="/admin"
          noIndex={true}
        />
        <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center">
                <Shield className="w-7 h-7 mr-2 text-primary-500" /> Admin Panel
              </h1>
              <p className="text-gray-500">Manage your learning platform</p>
            </div>
            <span className="badge-primary">Admin</span>
          </div>

          <div className="flex space-x-1 mb-6 p-1 glass rounded-xl w-fit">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                    activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 hover:text-primary-500'
                  }`}>
                  <Icon className="w-4 h-4" /><span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {adminStats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xs text-secondary-500 font-medium mt-1">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card">
              <h2 className="font-display font-semibold text-lg mb-4">Recent Users</h2>
              <div className="space-y-3">
                {recentUsers.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>{user.status}</span>
                      <p className="text-xs text-gray-500 mt-1">{user.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: Plus, label: 'Add New Lesson', desc: 'Create grammar or vocabulary content', color: 'from-primary-500 to-primary-600' },
                  { icon: Users, label: 'Manage Users', desc: 'View, edit, or suspend user accounts', color: 'from-secondary-500 to-secondary-600' },
                  { icon: BarChart3, label: 'View Analytics', desc: 'Check platform performance metrics', color: 'from-accent-500 to-accent-600' },
                  { icon: Settings, label: 'Platform Settings', desc: 'Configure learning paths and rewards', color: 'from-purple-500 to-purple-600' },
                ].map((action, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 dark:from-gray-800 hover:from-primary-50 dark:hover:from-primary-900/20 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm">{action.label}</p>
                        <p className="text-xs text-gray-500">{action.desc}</p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Admin"
        description="LinguaLearn admin panel."
        keywords="admin"
        url="/admin"
        noIndex={true}
      />
      <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold flex items-center">
            <Shield className="w-7 h-7 mr-2 text-primary-500" /> Admin Panel
          </h1>
        </div>
        <div className="flex space-x-1 mb-6 p-1 glass rounded-xl w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 hover:text-primary-500'
                }`}>
                <Icon className="w-4 h-4" /><span>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-display font-semibold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
          <p className="text-gray-500">This section is under development. Full CRUD operations coming soon.</p>
        </div>
      </div>
    </div>
    </>
  )
}
