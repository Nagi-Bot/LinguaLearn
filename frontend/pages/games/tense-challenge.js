import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getTenseQuestions } from '../../lib/questions'

const BATCH_SIZE = 50

export default function TenseChallengePage() {
  const { addXp } = useApp()
  const [questions, setQuestions] = useState(() => getTenseQuestions(BATCH_SIZE))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [selected, setSelected] = useState(null)
  const [streak, setStreak] = useState(0)

  const loadMore = () => {
    setQuestions(prev => [...prev, ...getTenseQuestions(BATCH_SIZE)])
  }

  const handleAnswer = (index) => {
    if (selected !== null) return
    setSelected(index)

    if (index === questions[currentQ].correct) {
      const bonus = streak >= 2 ? streak * 2 : 0
      const points = 10 + bonus
      setScore(score + points)
      setStreak(streak + 1)
      setTotalCorrect(totalCorrect + 1)
      toast.success(`Correct! +${points} XP`)
    } else {
      toast.error(`Wrong! The answer is: ${questions[currentQ].forms[questions[currentQ].correct]}`)
      setStreak(0)
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1)
        setSelected(null)
      } else {
        loadMore()
        setCurrentQ(currentQ + 1)
        setSelected(null)
      }
    }, 1000)
  }

  const endGame = () => {
    addXp(score)
    setGameState('done')
  }

  const playAgain = () => {
    setQuestions(getTenseQuestions(BATCH_SIZE))
    setCurrentQ(0); setScore(0); setSelected(null); setStreak(0); setTotalCorrect(0)
    setGameState('playing')
  }

  if (gameState === 'done') {
    return (
      <RequireAuth>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Challenge Complete!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <p className="text-gray-600 mb-2">{totalCorrect} correct answers</p>
            <p className="text-gray-600 mb-6">XP saved to your account!</p>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={playAgain} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Play Again</button>
              <Link href="/dashboard" className="btn-primary">Dashboard</Link>
            </div>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  const q = questions[currentQ]
  if (!q) return null

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Question {currentQ + 1} · Endless Mode</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
              <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End</button>
            </div>
          </div>
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">{q.tense}</span>
            <h2 className="text-2xl font-display font-semibold mb-8">{q.sentence}</h2>
            <div className="grid grid-cols-2 gap-4">
              {q.forms.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`p-4 rounded-xl text-lg font-medium transition-all ${
                    selected === null
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                      : i === q.correct
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : selected === i
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
    </RequireAuth>
  )
}
