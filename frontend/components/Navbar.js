import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import {
  Menu, X, BookOpen, GraduationCap, LogIn, User,
  Sun, Moon, ChevronDown, Trophy, Gamepad2, Home,
  LayoutDashboard, Sparkles, ShoppingCart, Bot, PenTool, Target,
  Book, Volume2, MessageSquare, Headphones, Globe, Type
} from 'lucide-react'

const learnItems = [
  { href: '/learn/grammar', label: 'Grammar', icon: Book },
  { href: '/learn/vocabulary', label: 'Vocabulary', icon: Type },
  { href: '/learn/reading', label: 'Reading', icon: BookOpen },
  { href: '/learn/writing', label: 'Writing', icon: PenTool },
  { href: '/learn/speaking', label: 'Speaking', icon: Volume2 },
  { href: '/learn/listening', label: 'Listening', icon: Headphones },
]

const gameItems = [
  { href: '/games/daily-challenge', label: 'Daily Challenge', icon: Target },
  { href: '/games/grammar-battle', label: 'Grammar Battle', icon: GraduationCap },
  { href: '/games/word-builder', label: 'Word Builder', icon: Type },
  { href: '/games/sentence-builder', label: 'Sentence Builder', icon: MessageSquare },
  { href: '/games/hangman', label: 'Hangman', icon: Gamepad2 },
  { href: '/games/memory-game', label: 'Memory Cards', icon: Sparkles },
]

const aiItems = [
  { href: '/ai-tutor', label: 'AI Tutor', icon: Bot, desc: 'Chat with your AI English teacher' },
  { href: '/writing-feedback', label: 'Writing Feedback', icon: PenTool, desc: 'Get instant grammar & style corrections' },
  { href: '/placement-test', label: 'Placement Test', icon: Target, desc: 'Find your English level' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const { user, darkMode, toggleDarkMode, logout } = useApp()
  const router = useRouter()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setIsOpen(false)
  }, [router.pathname])

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/')

  const DropdownMenu = ({ items, wide }) => (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 ${wide ? 'w-64' : 'w-48'} bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden`}
    >
      <div className="py-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <div>
              <div className="font-medium">{item.label}</div>
              {item.desc && <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>}
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  )

  const NavButton = ({ onClick, active, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  )

  const NavLink = ({ href, children, active }) => (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="LinguaLearn" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">LinguaLearn</span>
          </Link>

          <div ref={dropdownRef} className="hidden md:flex items-center gap-0.5">
            <div className="relative">
              <NavButton
                onClick={() => setOpenDropdown(openDropdown === 'learn' ? null : 'learn')}
                active={isActive('/learn')}
              >
                <BookOpen className="w-4 h-4" />
                Learn
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'learn' ? 'rotate-180' : ''}`} />
              </NavButton>
              <AnimatePresence>
                {openDropdown === 'learn' && <DropdownMenu items={learnItems} />}
              </AnimatePresence>
            </div>

            <div className="relative">
              <NavButton
                onClick={() => setOpenDropdown(openDropdown === 'games' ? null : 'games')}
                active={isActive('/games')}
              >
                <Gamepad2 className="w-4 h-4" />
                Games
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'games' ? 'rotate-180' : ''}`} />
              </NavButton>
              <AnimatePresence>
                {openDropdown === 'games' && <DropdownMenu items={gameItems} />}
              </AnimatePresence>
            </div>

            <div className="relative">
              <NavButton
                onClick={() => setOpenDropdown(openDropdown === 'ai' ? null : 'ai')}
                active={isActive('/ai-tutor') || isActive('/writing-feedback') || isActive('/placement-test')}
              >
                <Bot className="w-4 h-4" />
                AI Tools
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'ai' ? 'rotate-180' : ''}`} />
              </NavButton>
              <AnimatePresence>
                {openDropdown === 'ai' && <DropdownMenu items={aiItems} wide />}
              </AnimatePresence>
            </div>

            {user && (
              <NavLink href="/dashboard" active={isActive('/dashboard')}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
            )}

            <NavLink href="/leaderboard" active={isActive('/leaderboard')}>
              <Trophy className="w-4 h-4" />
              Leaderboard
            </NavLink>

            {user && (
              <NavLink href="/store" active={isActive('/store')}>
                <ShoppingCart className="w-4 h-4" />
                Store
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : (user.name?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log in</Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-sm transition-all">Sign up free</Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
              <MobileSection title="Learn">
                {learnItems.map((item) => (
                  <MobileLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </MobileLink>
                ))}
              </MobileSection>
              <MobileSection title="Games">
                {gameItems.map((item) => (
                  <MobileLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </MobileLink>
                ))}
              </MobileSection>
              <MobileSection title="AI Tools">
                {aiItems.map((item) => (
                  <MobileLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)} onClick={() => setIsOpen(false)}>
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </MobileLink>
                ))}
              </MobileSection>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                {user && <MobileLink href="/dashboard" icon={LayoutDashboard} active={isActive('/dashboard')} onClick={() => setIsOpen(false)}>Dashboard</MobileLink>}
                <MobileLink href="/leaderboard" icon={Trophy} active={isActive('/leaderboard')} onClick={() => setIsOpen(false)}>Leaderboard</MobileLink>
                {user && <MobileLink href="/store" icon={ShoppingCart} active={isActive('/store')} onClick={() => setIsOpen(false)}>Store</MobileLink>}
              </div>
              {user ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <MobileLink href="/profile" icon={User} onClick={() => setIsOpen(false)}>Profile</MobileLink>
                  <button onClick={() => { logout(); setIsOpen(false) }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogIn className="w-4 h-4 rotate-180" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Log in</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm shadow-sm">Sign up free</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function MobileSection({ title, children }) {
  return (
    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="space-y-0.5 mt-0.5">{children}</div>
    </div>
  )
}

function MobileLink({ href, icon: Icon, children, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {children}
    </Link>
  )
}