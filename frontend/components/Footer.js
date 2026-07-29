import Link from 'next/link'
import { Sparkles, BookOpen, Gamepad2, Mail, Globe, MessageCircle } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    'Learn': [
      { href: '/learn/grammar', label: 'Grammar' },
      { href: '/learn/vocabulary', label: 'Vocabulary' },
      { href: '/learn/reading', label: 'Reading' },
      { href: '/learn/writing', label: 'Writing' },
      { href: '/learn/speaking', label: 'Speaking' },
      { href: '/learn/listening', label: 'Listening' },
    ],
    'Games': [
      { href: '/games/grammar-battle', label: 'Grammar Battle' },
      { href: '/games/word-builder', label: 'Word Builder' },
      { href: '/games/sentence-builder', label: 'Sentence Builder' },
      { href: '/games/memory-game', label: 'Memory Game' },
      { href: '/games/hangman', label: 'Hangman' },
    ],
    'Company': [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  }

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">LinguaLearn</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Master English grammar, vocabulary, and more with interactive lessons and AI-powered learning.
            </p>
            <div className="flex space-x-3">
              <a href="https://wa.me/923152814383" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 transition-all"
                title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://hannanmoorad.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 transition-all"
                title="HM Dev">
                <Globe className="w-4 h-4" />
              </a>
              <a href="mailto:hannanmoorad17@gmail.com"
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all"
                title="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-gray-900 dark:text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} LinguaLearn. All rights reserved. Made with ❤️ for learners worldwide.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Crafted by <a href="https://hannanmoorad.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">HM Dev</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
