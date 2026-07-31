import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Heart, Clock, RotateCcw, CheckCircle, XCircle, BookOpen, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import api from '../../lib/api'
import { getDailyChallengeQuestions } from '../../lib/questions'
import SEO from '../../components/SEO'

const TOTAL_QUESTIONS = 10
const TIME_LIMIT = 30
const XP_PER_CORRECT = 10

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export default function DailyChallengePage() {
  const { submitGameScore } = useApp()
  const [gameState, setGameState] = useState('loading')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalWrong, setTotalWrong] = useState(0)
  const [timer, setTimer] = useState(TIME_LIMIT)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [ending, setEnding] = useState(false)

  useEffect(() => {
    const todayKey = `dailyChallenge_${getTodayKey()}`
    const saved = localStorage.getItem(todayKey)
    if (saved) {
      setGameState('done')
      const data = JSON.parse(saved)
      setScore(data.score)
      setTotalCorrect(data.totalCorrect)
      setTotalWrong(data.totalWrong)
      setBestStreak(data.bestStreak)
      setHearts(data.hearts)
      return
    }
    fetchQuestions()
  }, [])

  useEffect(() => {
    let interval
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 0.1), 100)
    } else if (timer <= 0 && gameState === 'playing') {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [gameState, timer])

  const fetchQuestions = async () => {
    try {
      const res = await api.post('/ai/daily-challenge')
      const data = res.data?.questions || res.data
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data)
        setGameState('playing')
        return
      }
    } catch {}
    setQuestions(getDailyChallengeQuestions(TOTAL_QUESTIONS))
    setGameState('playing')
    toast('Using offline questions')
  }

  const handleTimeUp = () => {
    toast.error("Time's up!")
    setStreak(0)
    setTotalWrong((p) => p + 1)
    nextQuestion()
  }

  const endGame = useCallback(async () => {
    if (ending) return
    setEnding(true)
    setGameState('results')
    const todayKey = `dailyChallenge_${getTodayKey()}`
    localStorage.setItem(
      todayKey,
      JSON.stringify({ score, totalCorrect, totalWrong, bestStreak, hearts })
    )
    await submitGameScore('daily-challenge', score)
  }, [ending, score, totalCorrect, totalWrong, bestStreak, hearts, submitGameScore])

  const nextQuestion = useCallback(() => {
    if (currentQ < TOTAL_QUESTIONS - 1) {
      setCurrentQ((p) => p + 1)
      setTimer(TIME_LIMIT)
      setSelectedAnswer(null)
    } else {
      endGame()
    }
  }, [currentQ, endGame])

  const handleAnswer = useCallback((index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    const question = questions[currentQ]
    const correct = question.correct ?? question.answer ?? index

    if (index === correct) {
      const streakBonus = streak >= 2 ? streak * 2 : 0
      const points = XP_PER_CORRECT + streakBonus
      setScore((p) => p + points)
      setStreak((p) => {
        const next = p + 1
        if (next > bestStreak) setBestStreak(next)
        return next
      })
      setTotalCorrect((p) => p + 1)
      toast.success(`Correct! +${points} XP`)
    } else {
      toast.error('Wrong answer!')
      setStreak(0)
      setTotalWrong((p) => p + 1)
      setHearts((p) => {
        const next = p - 1
        if (next <= 0) setTimeout(endGame, 500)
        return next
      })
    }
    setTimeout(nextQuestion, 1000)
  }, [selectedAnswer, currentQ, questions, streak, bestStreak, nextQuestion, endGame])

  const handleRetry = () => {
    toast('Come back tomorrow for a new challenge!')
  }

  if (gameState === 'loading') {
    return (
      <RequireAuth>
        <SEO
          title="Daily Challenge"
          description="Take on today's English challenge! 10 mixed questions on grammar, vocabulary, and more. Earn XP and climb the leaderboard."
          keywords="daily challenge, english quiz, daily quiz, earn XP"
          url="/games/daily-challenge"
        />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center max-w-md"
          >
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-display font-bold mb-2">Daily Challenge</h2>
            <p className="text-gray-600 dark:text-gray-400">Generating your daily challenge...</p>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  if (gameState === 'done') {
    const nextMidnight = new Date()
    nextMidnight.setDate(nextMidnight.getDate() + 1)
    nextMidnight.setHours(0, 0, 0, 0)
    const [dh, dm] = [Math.floor((nextMidnight - Date.now()) / 3600000), Math.floor(((nextMidnight - Date.now()) % 3600000) / 60000)]
    return (
      <RequireAuth>
        <SEO title="Daily Challenge" description="Today's challenge completed!" keywords="daily challenge" url="/games/daily-challenge" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Today's Challenge Complete!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Great job! Come back tomorrow for a new challenge.</p>
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center"><p className="text-2xl font-bold text-green-500">{totalCorrect}</p><p className="text-sm text-gray-500">Correct</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-red-500">{totalWrong}</p><p className="text-sm text-gray-500">Wrong</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-amber-500">{bestStreak}</p><p className="text-sm text-gray-500">Best Streak</p></div>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 mb-6">
              <div className="flex items-center justify-center gap-2 text-violet-700 dark:text-violet-400">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Next challenge in {dh}h {dm}m</span>
              </div>
            </div>
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
              Go to Dashboard <Zap className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  if (gameState === 'results') {
    const streakBonus = bestStreak >= 3 ? bestStreak * 5 : 0
    return (
      <RequireAuth>
        <SEO
          title="Daily Challenge"
          description="Take on today's English challenge! 10 mixed questions on grammar, vocabulary, and more. Earn XP and climb the leaderboard."
          keywords="daily challenge, english quiz, daily quiz, earn XP"
          url="/games/daily-challenge"
        />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">
              {hearts <= 0 ? 'Game Over!' : 'Challenge Complete!'}
            </h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{totalCorrect}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{totalWrong}</p>
                <p className="text-sm text-gray-500">Wrong</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-500">{bestStreak}</p>
                <p className="text-sm text-gray-500">Best Streak</p>
              </div>
            </div>
            {streakBonus > 0 && (
              <p className="text-sm text-accent-500 mb-4">+{streakBonus} XP streak bonus!</p>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Come back tomorrow for a new challenge!
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={handleRetry} className="btn-secondary">
                <RotateCcw className="w-4 h-4 mr-2 inline" /> Play Again
              </button>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  if (!questions[currentQ]) return null
  const question = questions[currentQ]
  const options = question.options || []
  const correctIdx = question.correct ?? question.answer ?? 0
  const timePercent = (timer / TIME_LIMIT) * 100

  return (
    <RequireAuth>
      <SEO
        title="Daily Challenge"
        description="Take on today's English challenge! 10 mixed questions on grammar, vocabulary, and more. Earn XP and climb the leaderboard."
        keywords="daily challenge, english quiz, daily quiz, earn XP"
        url="/games/daily-challenge"
      />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQ + 1} / {TOTAL_QUESTIONS}
            </span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${
                      i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-1 font-bold gradient-text">
                <Zap className="w-4 h-4" /> {score} XP
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              animate={{ width: `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${timer < 5 ? 'bg-red-500' : 'bg-accent-500'}`}
              animate={{ width: `${timePercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                {question.category || question.type || 'Mixed'}
              </span>
              <div className="flex items-center space-x-1 text-sm">
                <Clock
                  className={`w-4 h-4 ${timer < 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                />
                <span className={timer < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}>
                  {Math.ceil(timer)}s
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-display font-semibold mb-8 text-center">{question.question}</h2>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => {
                const label = ['A', 'B', 'C', 'D'][i]
                return (
                  <motion.button
                    key={i}
                    whileHover={selectedAnswer === null ? { scale: 1.03 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={`p-5 rounded-xl text-left font-medium transition-all flex items-center space-x-3 min-w-0 ${
                      selectedAnswer === null
                        ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                        : i === correctIdx
                          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-400'
                          : selectedAnswer === i
                            ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400'
                            : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {label}
                    </span>
                    <span className="break-words min-w-0">{typeof opt === 'string' ? opt : opt.text || opt}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  )
}
