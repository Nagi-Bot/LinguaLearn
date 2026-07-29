import { useState, createElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, ArrowLeft, Sparkles,
  RotateCcw, Star, Volume2, Plus, CheckCircle, Eye,
  Calendar, RefreshCw, Zap, Lightbulb, Link, AlignLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

const catIcons = {
  'daily': Calendar,
  'synonyms': RefreshCw,
  'antonyms': Zap,
  'idioms': Lightbulb,
  'phrasal': Link,
  'collocations': AlignLeft,
}

const wordCategories = [
  {
    name: 'Daily Words', icon: 'daily',
    words: [
      { word: 'Beautiful', meaning: 'Pleasing the senses or mind aesthetically', example: 'The sunset was **beautiful**.' },
      { word: 'Important', meaning: 'Of great significance or value', example: 'This is an **important** meeting.' },
      { word: 'Different', meaning: 'Not the same as another or each other', example: 'They have **different** opinions.' },
      { word: 'Available', meaning: 'Able to be used or obtained', example: 'Is this seat **available**?' },
      { word: 'Significant', meaning: 'Sufficiently great or important', example: 'A **significant** improvement.' },
    ]
  },
  {
    name: 'Synonyms', icon: 'synonyms',
    words: [
      { word: 'Happy', meaning: 'Joyful, cheerful, delighted', example: 'She felt **happy** about the news.' },
      { word: 'Big', meaning: 'Large, huge, enormous, massive', example: 'A **big** house on the hill.' },
      { word: 'Smart', meaning: 'Intelligent, clever, bright, sharp', example: 'He is a **smart** student.' },
      { word: 'Fast', meaning: 'Quick, rapid, swift, speedy', example: 'A **fast** runner.' },
      { word: 'Strong', meaning: 'Powerful, mighty, robust, sturdy', example: 'A **strong** building.' },
    ]
  },
  {
    name: 'Antonyms', icon: 'antonyms',
    words: [
      { word: 'Hot', meaning: 'Cold (opposite)', example: 'The coffee is **hot**, but the ice cream is **cold**.' },
      { word: 'Light', meaning: 'Dark, heavy (opposites)', example: 'A **light** feather vs a **heavy** rock.' },
      { word: 'Rich', meaning: 'Poor (opposite)', example: 'The **rich** man helped the **poor**.' },
      { word: 'Easy', meaning: 'Difficult, hard (opposite)', example: 'An **easy** test vs a **difficult** one.' },
      { word: 'Begin', meaning: 'End, finish (opposite)', example: 'Let\'s **begin** the lesson and **end** with a quiz.' },
    ]
  },
  {
    name: 'Idioms', icon: 'idioms',
    words: [
      { word: 'Piece of cake', meaning: 'Something very easy', example: 'The exam was a **piece of cake**.' },
      { word: 'Break the ice', meaning: 'To initiate conversation in a social setting', example: 'He told a joke to **break the ice**.' },
      { word: 'Hit the nail on the head', meaning: 'To be exactly right', example: 'You **hit the nail on the head** with that analysis.' },
      { word: 'Under the weather', meaning: 'Feeling ill or sick', example: 'I\'m feeling a bit **under the weather** today.' },
      { word: 'Once in a blue moon', meaning: 'Very rarely', example: 'I visit my hometown **once in a blue moon**.' },
    ]
  },
  {
    name: 'Phrasal Verbs', icon: 'phrasal',
    words: [
      { word: 'Give up', meaning: 'To stop trying or quit', example: 'Don\'t **give up** on your dreams.' },
      { word: 'Look after', meaning: 'To take care of', example: 'She **looks after** her younger brother.' },
      { word: 'Put off', meaning: 'To postpone or delay', example: 'Don\'t **put off** your homework.' },
      { word: 'Run out of', meaning: 'To use up the supply of something', example: 'We\'ve **run out of** milk.' },
      { word: 'Turn down', meaning: 'To reject an offer', example: 'She **turned down** the job offer.' },
    ]
  },
  {
    name: 'Collocations', icon: 'collocations',
    words: [
      { word: 'Make a decision', meaning: 'To choose or decide', example: 'I need to **make a decision** soon.' },
      { word: 'Take a break', meaning: 'To rest briefly', example: 'Let\'s **take a break** for 10 minutes.' },
      { word: 'Do business', meaning: 'To engage in commercial activities', example: 'They **do business** with many countries.' },
      { word: 'Have a conversation', meaning: 'To talk with someone', example: 'We **had a conversation** about the project.' },
      { word: 'Pay attention', meaning: 'To focus or concentrate', example: 'Please **pay attention** to the lesson.' },
    ]
  },
]

export default function VocabularyPage() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentWord, setCurrentWord] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [learnedWords, setLearnedWords] = useState([])
  const [reviewMode, setReviewMode] = useState(false)

  const startCategory = (cat) => {
    setActiveCategory(cat)
    setCurrentWord(0)
    setShowMeaning(false)
    setReviewMode(false)
  }

  const nextWord = () => {
    if (currentWord < activeCategory.words.length - 1) {
      setCurrentWord(currentWord + 1)
      setShowMeaning(false)
    } else {
      toast.success('Category complete! 🎉')
      setReviewMode(true)
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
    if (reviewMode) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
              <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">{activeCategory.name} Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You reviewed {activeCategory.words.length} words. +{activeCategory.words.length * 5} XP earned!
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button onClick={() => { setCurrentWord(0); setShowMeaning(false); setReviewMode(false) }} className="btn-secondary">
                  <RotateCcw className="w-4 h-4 mr-2 inline" /> Review Again
                </button>
                <button onClick={() => setActiveCategory(null)} className="btn-primary">Back to Categories</button>
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

          <div className="flex items-center space-x-2 mb-8">
            {activeCategory.words.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i <= currentWord ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
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
