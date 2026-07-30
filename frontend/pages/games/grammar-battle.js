import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, Trophy, RotateCcw, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import Celebration from '../../components/Celebration'
import { useApp } from '../../context/AppContext'
import { getGrammarBattleQuestions } from '../../lib/questions'
import SEO from '../../components/SEO'

const BATCH_SIZE = 15
const TIME_LIMIT = 15

export default function GrammarBattlePage() {
  const { submitGameScore, user } = useApp()
  const [questions, setQuestions] = useState(() => getGrammarBattleQuestions(BATCH_SIZE))
  const [gameState, setGameState] = useState('start')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timer, setTimer] = useState(TIME_LIMIT)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [combo, setCombo] = useState(0)
  const [celebration, setCelebration] = useState({ show: false, xpEarned: 0, oldLevel: 1, newLevel: 1 })
  const [ending, setEnding] = useState(false)

  useEffect(() => {
    let interval
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 0.1), 100)
    } else if (timer <= 0 && gameState === 'playing') {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [gameState, timer])

  const loadMore = () => {
    setQuestions(prev => [...prev, ...getGrammarBattleQuestions(BATCH_SIZE)])
  }

  const handleTimeUp = () => {
    toast.error('Time\'s up!')
    setStreak(0)
    nextQuestion()
  }

  const nextQuestion = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setTimer(TIME_LIMIT)
      setSelectedAnswer(null)
    } else {
      loadMore()
      setCurrentQ(currentQ + 1)
      setTimer(TIME_LIMIT)
      setSelectedAnswer(null)
    }
  }, [currentQ, questions.length])

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)

    if (index === questions[currentQ].correct) {
      const streakBonus = Math.floor(streak / 3) * 5
      const points = 10 + streakBonus + Math.floor(timer)
      setScore(score + points)
      setStreak(streak + 1)
      setCombo(combo + 1)
      if (streak + 1 > bestStreak) setBestStreak(streak + 1)
      toast.success(`+${points} XP!`, { duration: 800 })
    } else {
      setStreak(0)
      setCombo(0)
      toast.error('Wrong answer!', { duration: 800 })
    }

    setTimeout(nextQuestion, 1000)
  }

  const startGame = () => {
    setGameState('playing')
    setCurrentQ(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setTimer(TIME_LIMIT)
    setSelectedAnswer(null)
    setCombo(0)
    setEnding(false)
    setQuestions(getGrammarBattleQuestions(BATCH_SIZE))
  }

  const endGame = async () => {
    if (ending) return
    setEnding(true)
    const oldLevel = user?.level || 1
    const result = await submitGameScore('grammar-battle', score)
    setGameState('done')
    setTimeout(() => setCelebration({ show: true, xpEarned: score, oldLevel, newLevel: result?.newLevel || oldLevel }), 300)
  }

  if (gameState === 'start') {
    return (
      <RequireAuth>
        <SEO title="Grammar Battle Game" description="Test your English grammar in an exciting battle game. Answer grammar questions, compete against others, and earn XP rewards." keywords="grammar game, english grammar quiz, grammar battle, earn XP" url="/games/grammar-battle" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Grammar Battle</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Choose the correct answer before time runs out!</p>
            <p className="text-sm text-gray-500 mb-6">Endless questions · 15 seconds each · Bonus for speed</p>
            <button onClick={startGame} className="btn-primary text-lg px-10 py-4">Start Battle!</button>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  if (gameState === 'done') {
    return (
      <RequireAuth>
        <SEO title="Grammar Battle Game" description="Test your English grammar in an exciting battle game. Answer grammar questions, compete against others, and earn XP rewards." keywords="grammar game, english grammar quiz, grammar battle, earn XP" url="/games/grammar-battle" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Battle Complete!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Best Streak: {bestStreak}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{score} XP saved to your account!</p>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={startGame} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Play Again</button>
              <Link href="/dashboard" className="btn-primary">Dashboard</Link>
            </div>
          </motion.div>
        </div>
        <Celebration
          show={celebration.show}
          xpEarned={celebration.xpEarned}
          oldLevel={celebration.oldLevel}
          newLevel={celebration.newLevel}
          onClose={() => setCelebration(p => ({ ...p, show: false }))}
        />
      </RequireAuth>
    )
  }

  if (!questions[currentQ]) return null
  const question = questions[currentQ]
  const timePercent = (timer / TIME_LIMIT) * 100

  return (
    <RequireAuth>
      <SEO title="Grammar Battle Game" description="Test your English grammar in an exciting battle game. Answer grammar questions, compete against others, and earn XP rewards." keywords="grammar game, english grammar quiz, grammar battle, earn XP" url="/games/grammar-battle" />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">Question {currentQ + 1} · Endless Mode</span>
              <div className="flex items-center space-x-2 mt-1">
                <Zap className="w-4 h-4 text-accent-500" />
                <span className="font-bold gradient-text">{score} XP</span>
                {streak >= 2 && <span className="text-sm text-accent-500">{streak}x Streak</span>}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={endGame} className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-sm font-medium hover:bg-red-200">End Game</button>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-lg font-bold">
                  <Clock className={`w-5 h-5 ${timer < 5 ? 'text-red-500 animate-pulse' : 'text-primary-500'}`} />
                  <span className={timer < 5 ? 'text-red-500' : ''}>{Math.ceil(timer)}s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${timer < 5 ? 'bg-red-500' : 'bg-primary-500'}`}
              animate={{ width: `${timePercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
            <h2 className="text-2xl font-display font-semibold mb-6 text-center">{question.question}</h2>
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`p-5 rounded-xl text-lg font-medium transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                      : i === question.correct
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700'
                        : selectedAnswer === i
                          ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700'
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
    </RequireAuth>
  )
}
