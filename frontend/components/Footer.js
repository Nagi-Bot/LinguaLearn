import Link from 'next/link'
import { Sparkles, BookOpen, Gamepad2, Mail, Globe, MessageCircle, Bot, Target, PenTool, Zap, ArrowUpRight, Book, Type, Volume2, MessageSquare, Headphones, GraduationCap, Sword, Puzzle, Brain, LayoutDashboard, Trophy, ShoppingCart, Info, Phone, Library, Languages } from 'lucide-react'

const linkGroups = [
  {
    title: 'Learn',
    links: [
      { href: '/learn/grammar', label: 'Grammar', icon: Book },
      { href: '/learn/vocabulary', label: 'Vocabulary', icon: Languages },
      { href: '/learn/reading', label: 'Reading', icon: BookOpen },
      { href: '/learn/writing', label: 'Writing', icon: PenTool },
      { href: '/learn/speaking', label: 'Speaking', icon: Volume2 },
      { href: '/learn/listening', label: 'Listening', icon: Headphones },
    ],
  },
  {
    title: 'AI Tools',
    links: [
      { href: '/ai-tutor', label: 'AI English Tutor', icon: Bot },
      { href: '/writing-feedback', label: 'Writing Feedback', icon: PenTool },
      { href: '/placement-test', label: 'Placement Test', icon: Target },
    ],
  },
  {
    title: 'Games',
    links: [
      { href: '/games/daily-challenge', label: 'Daily Challenge', icon: Zap },
      { href: '/games/grammar-battle', label: 'Grammar Battle', icon: Sword },
      { href: '/games/word-builder', label: 'Word Builder', icon: Type },
      { href: '/games/hangman', label: 'Hangman', icon: Gamepad2 },
      { href: '/games/memory-game', label: 'Memory Cards', icon: Brain },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { href: '/store', label: 'Store', icon: ShoppingCart },
      { href: '/about', label: 'About Us', icon: Info },
      { href: '/contact', label: 'Contact', icon: Phone },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">LinguaLearn</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed max-w-xs">
                Master English with AI-powered lessons, fun games, and personalized feedback.
              </p>
              <div className="flex gap-2.5">
                <a href="https://wa.me/923152814383" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 transition-all duration-200">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="https://hannanmoorad.com" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 hover:scale-110 transition-all duration-200">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="mailto:hannanmoorad17@gmail.com"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:scale-110 transition-all duration-200">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">{group.title}</h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {link.icon && <link.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} LinguaLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms</Link>
            <a href="https://hannanmoorad.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1">
              Crafted by HM Dev <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}