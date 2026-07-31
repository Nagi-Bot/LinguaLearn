import { useState } from 'react'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Key, Briefcase, Globe, Landmark, MessageCircle } from 'lucide-react'
import DynamicIcon from '../../components/DynamicIcon'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { getReadings } from '../../lib/learnContent'
import SEO from '../../components/SEO'

const iconMap = {
  key: Key, work: Briefcase, climate: Globe, museum: Landmark, communication: MessageCircle
}

export default function ReadingPage() {
  const { saveLearnProgress, loseHeart, user } = useApp()
  const [readings, setReadings] = useState(() => getReadings())
  const [activeReading, setActiveReading] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [completedReadings, setCompletedReadings] = useState([])
  const [hearts, setHearts] = useState(user?.hearts ?? 3)
  const [ended, setEnded] = useState(false)

  const startReading = (reading) => {
    setActiveReading(reading)
    setCurrentQuestion(0)
    setScore(0)
    setQuizDone(false)
    setSelectedAnswer(null)
  }

  const nextReading = () => {
    const others = readings.filter(r => r.id !== activeReading?.id)
    startReading(others[Math.floor(Math.random() * others.length)])
  }

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    if (index === activeReading.questions[currentQuestion].answer) {
      setScore(score + 1)
      toast.success('Correct!')
    } else {
      toast.error('Incorrect!')
      const newHearts = hearts - 1
      setHearts(newHearts)
      loseHeart()
      if (newHearts <= 0) {
        toast.error('No hearts left! Buy more in the Store', { duration: 3000 })
        setEnded(true)
        return
      }
    }
    setTimeout(() => {
      if (currentQuestion < activeReading.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizDone(true)
        if (!completedReadings.includes(activeReading.id)) {
          setCompletedReadings([...completedReadings, activeReading.id])
        }
        const finalScore = score + (index === activeReading.questions[currentQuestion].answer ? 1 : 0)
        saveLearnProgress('reading', activeReading.id, finalScore * 10)
        toast.success(`Reading Complete! Score: ${finalScore}/${activeReading.questions.length}`)
        toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      }
    }, 1000)
  }

  if (activeReading) {
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
                <button onClick={() => { setActiveReading(null); setEnded(false); setHearts(3) }} className="btn-secondary">Back to Readings</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
    if (quizDone) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 sm:p-12">
              <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Reading Complete!</h2>
              <div className="text-5xl font-display font-bold gradient-text my-4">{score}/{activeReading.questions.length}</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {score === activeReading.questions.length ? 'Perfect comprehension!' : 'Keep practicing!'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={nextReading} className="btn-primary">
                  Next Story <ChevronRight className="w-4 h-4 ml-1 inline" />
                </button>
                <button onClick={() => setActiveReading(null)} className="btn-secondary">All Stories</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setActiveReading(null)} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Readings
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={activeReading.icon} /></span>
              <div>
                <h2 className="text-2xl font-display font-bold">{activeReading.title}</h2>
                <span className="text-sm text-gray-500">{activeReading.level}</span>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {activeReading.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{paragraph.trim()}</p>
              ))}
            </div>
          </motion.div>

          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Question {currentQuestion + 1} of {activeReading.questions.length}</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold">❤️ {hearts}/3</span>
                <span className="text-sm text-primary-500 font-medium">Score: {score}</span>
              </div>
            </div>
            <p className="text-lg mb-4">{activeReading.questions[currentQuestion].q}</p>
            <div className="space-y-3">
              {activeReading.questions[currentQuestion].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                      : i === activeReading.questions[currentQuestion].answer
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : selectedAnswer === i
                          ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                          : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Reading Comprehension" description="Improve your English reading skills with engaging stories, articles, and comprehension exercises at various difficulty levels." keywords="english reading, reading comprehension, english stories, reading practice" url="/learn/reading" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Reading <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your reading comprehension with stories, articles, and comprehension tests.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading, i) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => startReading(reading)}
              className={`glass-card cursor-pointer ${completedReadings.includes(reading.id) ? 'border-secondary-500/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={reading.icon} /></span>
                {completedReadings.includes(reading.id) && <CheckCircle className="w-5 h-5 text-secondary-500" />}
              </div>
              <h3 className="text-lg font-display font-semibold mb-1">{reading.title}</h3>
              <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-3">{reading.level}</span>
              <p className="text-sm text-gray-500">{reading.questions.length} comprehension questions</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
