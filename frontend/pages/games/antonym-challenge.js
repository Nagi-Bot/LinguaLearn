import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getAntonymQuestions } from '../../lib/questions'

const BATCH_SIZE = 15

export default function AntonymChallengePage() {
  const { submitGameScore } = useApp()
  const [questions, setQuestions] = useState(() => getAntonymQuestions(BATCH_SIZE))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [gameDone, setGameDone] = useState(false)
  const [selected, setSelected] = useState(null)
  const [streak, setStreak] = useState(0)
  const [ending, setEnding] = useState(false)

  const loadMore = () => {
    setQuestions(prev => [...prev, ...getAntonymQuestions(BATCH_SIZE)])
  }

  const handleAnswer = (i) => {
    if (selected !== null) return
    setSelected(i)
    if (i === questions[currentQ].correct) {
      const pts = 10 + (streak >= 2 ? streak * 2 : 0)
      setScore(score + pts); setStreak(streak + 1); setTotalCorrect(totalCorrect + 1)
      toast.success(`+${pts} XP!`)
    } else {
      toast.error(`Antonym: ${questions[currentQ].options[questions[currentQ].correct]}`)
      setStreak(0)
    }
    setTimeout(() => {
      if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelected(null) }
      else { loadMore(); setCurrentQ(currentQ + 1); setSelected(null) }
    }, 1000)
  }

  const endGame = () => {
    if (ending) return
    setEnding(true)
    submitGameScore('antonym-challenge', score)
    setGameDone(true)
  }

  const playAgain = () => {
    setQuestions(getAntonymQuestions(BATCH_SIZE))
    setCurrentQ(0); setScore(0); setSelected(null); setStreak(0); setTotalCorrect(0); setGameDone(false); setEnding(false)
  }

  if (gameDone) return (
    <RequireAuth>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center"><Trophy className="w-10 h-10 text-white" /></div>
          <h2 className="text-3xl font-display font-bold mb-2">Challenge Complete!</h2>
          <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
          <p className="text-gray-600 mb-2">{totalCorrect} correct</p>
          <p className="text-gray-600 mb-6">XP saved!</p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={playAgain} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Play Again</button>
            <Link href="/dashboard" className="btn-primary">Dashboard</Link>
          </div>
        </motion.div>
      </div>
    </RequireAuth>
  )

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Question {currentQ + 1} · Endless</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
              <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End</button>
            </div>
          </div>
          <motion.div key={currentQ} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
            <p className="text-sm text-gray-500 mb-2">Find the antonym (opposite)</p>
            <h2 className="text-3xl font-display font-bold mb-8 text-primary-500">{questions[currentQ].word}</h2>
            <div className="grid grid-cols-2 gap-4">
              {questions[currentQ].options.map((opt, i) => (
                <motion.button key={i} whileHover={{ scale: 1.03 }} onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`p-4 rounded-xl text-lg font-medium transition-all ${
                    selected === null ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                    : i === questions[currentQ].correct ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                    : selected === i ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50'
                  }`}>{opt}</motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  )
}
