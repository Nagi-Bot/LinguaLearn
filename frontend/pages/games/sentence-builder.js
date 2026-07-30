import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getSentenceBuilderPuzzles } from '../../lib/questions'
import SEO from '../../components/SEO'

const BATCH_SIZE = 15

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function SentenceBuilderPage() {
  const { submitGameScore } = useApp()
  const [puzzles, setPuzzles] = useState(() => getSentenceBuilderPuzzles(BATCH_SIZE))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [shuffled, setShuffled] = useState([])
  const [built, setBuilt] = useState([])
  const [available, setAvailable] = useState([])
  const [score, setScore] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [streak, setStreak] = useState(0)
  const [ending, setEnding] = useState(false)

  useEffect(() => {
    if (puzzles[currentIdx]) startNewPuzzle(currentIdx)
  }, [currentIdx, puzzles])

  const loadMore = () => {
    setPuzzles(prev => [...prev, ...getSentenceBuilderPuzzles(BATCH_SIZE)])
  }

  const startNewPuzzle = (idx) => {
    const p = puzzles[idx]
    if (!p) return
    setShuffled(shuffleArray(p.words))
    setAvailable(shuffleArray(p.words))
    setBuilt([])
  }

  const addWord = (word, index) => {
    setBuilt([...built, word])
    setAvailable(available.filter((_, i) => i !== index))
  }

  const removeWord = (index) => {
    const word = built[index]
    setBuilt(built.filter((_, i) => i !== index))
    setAvailable([...available, word])
  }

  const checkSentence = () => {
    const guessed = built.join(' ')
    const correct = puzzles[currentIdx].sentence

    if (guessed === correct) {
      const bonus = streak >= 2 ? streak * 2 : 0
      const points = 10 + bonus
      setScore(score + points)
      setStreak(streak + 1)
      setTotalCorrect(totalCorrect + 1)
      toast.success(`Perfect! +${points} XP`)
      setTimeout(() => {
        if (currentIdx < puzzles.length - 1) {
          setCurrentIdx(currentIdx + 1)
        } else {
          loadMore()
          setCurrentIdx(currentIdx + 1)
        }
      }, 1000)
    } else {
      toast.error('Not quite right! Try again.')
      setStreak(0)
    }
  }

  const skip = () => {
    if (currentIdx < puzzles.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setStreak(0)
    } else {
      loadMore()
      setCurrentIdx(currentIdx + 1)
      setStreak(0)
    }
  }

  const endGame = () => {
    if (ending) return
    setEnding(true)
    submitGameScore('sentence-builder', score)
    setGameState('done')
  }

  const playAgain = () => {
    setPuzzles(getSentenceBuilderPuzzles(BATCH_SIZE))
    setCurrentIdx(0); setScore(0); setStreak(0); setTotalCorrect(0); setEnding(false)
    setGameState('playing')
    startNewPuzzle(0)
  }

  if (gameState === 'done') {
    return (
      <RequireAuth>
        <SEO title="Sentence Builder Game" description="Arrange words to form correct English sentences. Practice sentence structure and grammar while having fun." keywords="sentence builder, english sentence game, grammar exercise, word order" url="/games/sentence-builder" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">All Complete!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <p className="text-gray-600 mb-2">{totalCorrect} sentences</p>
            <p className="text-gray-600 mb-6">XP saved!</p>
            <div className="flex items-center justify-center space-x-4">
              <button onClick={playAgain} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Play Again</button>
              <Link href="/dashboard" className="btn-primary">Dashboard</Link>
            </div>
          </motion.div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <SEO title="Sentence Builder Game" description="Arrange words to form correct English sentences. Practice sentence structure and grammar while having fun." keywords="sentence builder, english sentence game, grammar exercise, word order" url="/games/sentence-builder" />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6">
            <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End Game</button>
            <span className="text-sm text-gray-500">Sentence {currentIdx + 1} · Endless</span>
            <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
          </div>

          <motion.div key={currentIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6">
            <div className="min-h-[60px] flex flex-wrap items-center justify-center gap-2 mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600">
              {built.map((word, i) => (
                <motion.button
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => removeWord(i)}
                  className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all"
                >
                  {word}
                </motion.button>
              ))}
              {built.length === 0 && <span className="text-gray-400 text-sm">Click words below to build the sentence</span>}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {available.map((word, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addWord(word, i)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm font-medium border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all"
                >
                  {word}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button onClick={checkSentence} disabled={built.length === 0} className="btn-primary">Check</button>
              <button onClick={skip} className="btn-accent">Skip</button>
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  )
}
