import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  Menu, X, BookOpen, GraduationCap, LogIn, User,
  Sun, Moon, ChevronDown, Trophy, Gamepad2, Home,
  LayoutDashboard, Sparkles, ShoppingCart, Bot, PenTool, Zap, Target
} from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdown, setDropdown] = useState(null)
  const { user, darkMode, toggleDarkMode, logout } = useApp()
  const router = useRouter()

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
    { href: '/learn/grammar', label: 'Learn', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/store', label: 'Store', icon: ShoppingCart, auth: true },
  ]

  const learnDropdown = [
    { href: '/learn/grammar', label: 'Grammar' },
    { href: '/learn/vocabulary', label: 'Vocabulary' },
    { href: '/learn/reading', label: 'Reading' },
    { href: '/learn/writing', label: 'Writing' },
    { href: '/learn/speaking', label: 'Speaking' },
    { href: '/learn/listening', label: 'Listening' },
  ]

  const gameDropdown = [
    { href: '/games/daily-challenge', label: 'Daily Challenge', icon: Zap },
    { href: '/games/grammar-battle', label: 'Grammar Battle' },
    { href: '/games/word-builder', label: 'Word Builder' },
    { href: '/games/sentence-builder', label: 'Sentence Builder' },
    { href: '/games/tense-challenge', label: 'Tense Challenge' },
    { href: '/games/memory-game', label: 'Memory Cards' },
    { href: '/games/hangman', label: 'Hangman' },
    { href: '/games/word-search', label: 'Word Search' },
    { href: '/games/fill-blank', label: 'Fill in Blanks' },
    { href: '/games/synonym-challenge', label: 'Synonym Challenge' },
    { href: '/games/antonym-challenge', label: 'Antonym Challenge' },
  ]

  const aiDropdown = [
    { href: '/ai-tutor', label: 'AI Tutor', icon: Bot },
    { href: '/writing-feedback', label: 'Writing Feedback', icon: PenTool },
    { href: '/placement-test', label: 'Placement Test', icon: Target },
  ]

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">LinguaLearn</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.auth && !user) return null
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Learn Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdown(dropdown === 'learn' ? null : 'learn')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/learn')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {dropdown === 'learn' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 glass rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden"
                  >
                    {learnDropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdown(null)}
                        className={`block px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-gray-700/50 ${
                          isActive(item.href) ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Games Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdown(dropdown === 'games' ? null : 'games')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/games')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Games</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {dropdown === 'games' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 glass rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden"
                  >
                    {gameDropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdown(null)}
                        className={`block px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-gray-700/50 ${
                          isActive(item.href) ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdown(dropdown === 'ai' ? null : 'ai')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/ai-tutor') || isActive('/writing-feedback') || isActive('/placement-test')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI Tools</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {dropdown === 'ai' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 glass rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden"
                  >
                    {aiDropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdown(null)}
                        className={`flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-gray-700/50 ${
                          isActive(item.href) ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all"
                >
                  <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user.name?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200/50 dark:border-gray-700/30"
          >
            <div className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
              {navLinks.map((link) => {
                if (link.auth && !user) return null
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(link.href)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Learn</p>
                {learnDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-lg ${
                      isActive(item.href) ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Games</p>
                {gameDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-lg ${
                      isActive(item.href) ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tools</p>
                {aiDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2.5 text-sm rounded-lg ${
                      isActive(item.href) ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              {user ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" /><span>Profile</span>
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false) }} className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-medium text-sm">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg gradient-bg text-white font-medium text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
