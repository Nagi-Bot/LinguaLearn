import { useState, createElement } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, ArrowLeft, Sparkles,
  Volume2, CheckCircle, Eye,
  Calendar, RefreshCw, Zap, Lightbulb, Link as LinkIcon, AlignLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { getVocabularyCategories } from '../../lib/learnContent'
import SEO from '../../components/SEO'

const catIcons = {
  'daily': Calendar,
  'synonyms': RefreshCw,
  'antonyms': Zap,
  'idioms': Lightbulb,
  'phrasal': Link,
  'collocations': AlignLeft,
}

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const wordCategories = getVocabularyCategories()

export default function VocabularyPage() {
  if (typeof window === 'undefined') return null
  const { saveLearnProgress, loseHeart, user } = useApp()
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentWord, setCurrentWord] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [learnedWords, setLearnedWords] = useState([])
  const [reviewMode, setReviewMode] = useState(false)
  const [hearts, setHearts] = useState(user?.hearts ?? 3)
  const [ended, setEnded] = useState(false)

  const startCategory = (cat) => {
    setActiveCategory(cat)
    setCurrentWord(0)
    setShowMeaning(false)
    setReviewMode(false)
  }

  const refillCategory = () => {
    const fresh = getVocabularyCategories().find((c) => c.name === activeCategory.name) || activeCategory
    setActiveCategory({ ...fresh, words: shuffleArr(fresh.words) })
    setCurrentWord(0)
    setShowMeaning(false)
    setReviewMode(false)
    toast.success('Fresh set unlocked! Keep going!')
  }

  const nextWord = () => {
    if (currentWord < activeCategory.words.length - 1) {
      const newHearts = hearts - 1
      setHearts(newHearts)
      loseHeart()
      if (newHearts <= 0) {
        toast.error('No hearts left! Buy more in the Store', { duration: 3000 })
        setEnded(true)
        return
      }
      setCurrentWord(currentWord + 1)
      setShowMeaning(false)
    } else {
      toast.success('Category complete! 🎉')
      saveLearnProgress('vocabulary', activeCategory.name, activeCategory.words.length * 5)
      toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      refillCategory()
    }
  }

  const markLearned = () => {
    const word = activeCategory.words[currentWord].word
    if (!learnedWords.includes(word)) {
      setLearnedWords([...learnedWords, word])
      toast.success('Added to learned words!')
    }
    nextWord()
  }

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  if (activeCategory) {
    if (ended) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 sm:p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/store" className="btn-primary">Visit Store</Link>
                <button onClick={() => { setActiveCategory(null); setEnded(false); setHearts(3) }} className="btn-secondary">Back to Categories</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }

    const word = activeCategory.words[currentWord]
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setActiveCategory(null)} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Categories
          </button>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2 flex-1">
              {activeCategory.words.map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i <= currentWord ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
            <span className="ml-3 text-sm font-semibold">❤️ {hearts}/3</span>
          </div>

          <motion.div key={currentWord} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              {catIcons[activeCategory.icon] && createElement(catIcons[activeCategory.icon], { className: 'w-7 h-7 text-primary-600 dark:text-primary-400' })}
            </div>
            <p className="text-sm text-gray-500 mb-2">{activeCategory.name}</p>
            <h2 className="text-3xl font-display font-bold mb-4">{word.word}</h2>

            <AnimatePresence>
              {showMeaning && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{word.meaning}</p>
                  <p className="text-gray-500 italic" dangerouslySetInnerHTML={{
                    __html: word.example.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-600 dark:text-primary-400">$1</strong>')
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center space-x-4 mb-6">
              <button onClick={() => speakWord(word.word)} className="btn-secondary p-3 rounded-xl">
                <Volume2 className="w-5 h-5" />
              </button>
              {!showMeaning && (
                <button onClick={() => setShowMeaning(true)} className="btn-accent">
                  <Eye className="w-4 h-4 mr-2 inline" /> Show Meaning
                </button>
              )}
            </div>

            {showMeaning && (
              <div className="flex items-center justify-center space-x-4">
                <button onClick={markLearned} className="btn-primary">
                  <CheckCircle className="w-4 h-4 mr-2 inline" /> Got it!
                </button>
                <button onClick={nextWord} className="btn-secondary">
                  Skip <ChevronRight className="w-4 h-4 ml-1 inline" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Vocabulary Builder" description="Expand your English vocabulary with daily words, synonyms, antonyms, idioms, phrasal verbs, and collocations." keywords="english vocabulary, learn words, synonyms, antonyms, idioms, phrasal verbs" url="/learn/vocabulary" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            English <span className="gradient-text">Vocabulary</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expand your vocabulary with daily words, synonyms, idioms, phrasal verbs, and collocations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => startCategory(cat)}
              className="glass-card cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                {catIcons[cat.icon] && createElement(catIcons[cat.icon], { className: 'w-6 h-6 text-primary-600 dark:text-primary-400' })}
              </div>
              <h3 className="text-lg font-display font-semibold mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{cat.words.length} words</p>
              <div className="flex items-center text-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Start Learning <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
