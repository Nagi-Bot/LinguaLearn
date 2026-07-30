import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getWordBuilderWords } from '../../lib/questions'

const BATCH_SIZE = 15

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WordBuilderPage() {
  const { submitGameScore } = useApp()
  const [words, setWords] = useState(() => getWordBuilderWords(BATCH_SIZE))
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [shuffled, setShuffled] = useState([])
  const [selected, setSelected] = useState([])
  const [score, setScore] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (words[currentWordIdx]) resetWord()
  }, [currentWordIdx, words])

  const loadMore = () => {
    setWords(prev => [...prev, ...getWordBuilderWords(BATCH_SIZE)])
  }

  const resetWord = () => {
    setShuffled(shuffleArray(words[currentWordIdx].word.split('')))
    setSelected([])
  }

  const selectLetter = (index) => {
    if (selected.includes(index)) return
    setSelected([...selected, index])
  }

  const unselectLetter = () => {
    setSelected(selected.slice(0, -1))
  }

  const checkAnswer = () => {
    const guessed = selected.map(i => shuffled[i]).join('')
    const correct = words[currentWordIdx].word

    if (guessed === correct) {
      const bonus = streak >= 2 ? streak * 2 : 0
      const points = 10 + bonus
      setScore(score + points)
      setStreak(streak + 1)
      setTotalCorrect(totalCorrect + 1)
      toast.success(`Correct! +${points} XP`)
      setTimeout(() => {
        if (currentWordIdx < words.length - 1) {
          setCurrentWordIdx(currentWordIdx + 1)
        } else {
          loadMore()
          setCurrentWordIdx(currentWordIdx + 1)
        }
      }, 1000)
    } else {
      toast.error('Not quite right!')
      setStreak(0)
    }
  }

  const skipWord = () => {
    if (currentWordIdx < words.length - 1) {
      setCurrentWordIdx(currentWordIdx + 1)
      setStreak(0)
    } else {
      loadMore()
      setCurrentWordIdx(currentWordIdx + 1)
      setStreak(0)
    }
  }

  const endGame = () => {
    submitGameScore('word-builder', score)
    setGameState('done')
  }

  const playAgain = () => {
    setWords(getWordBuilderWords(BATCH_SIZE))
    setCurrentWordIdx(0); setScore(0); setStreak(0); setTotalCorrect(0)
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
            <h2 className="text-3xl font-display font-bold mb-2">All Done!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <p className="text-gray-600 mb-2">{totalCorrect} words built</p>
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

  const currentWord = words[currentWordIdx]
  if (!currentWord) return null
  const selectedWord = selected.map(i => shuffled[i]).join('')

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6">
            <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End Game</button>
            <span className="text-sm text-gray-500">Word {currentWordIdx + 1} · Endless</span>
            <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={currentWordIdx} className="glass-card p-8 mb-6">
            <p className="text-lg text-gray-500 mb-6">Hint: {currentWord.hint}</p>

            <div className="flex items-center justify-center space-x-2 mb-8 min-h-[60px]">
              {Array.from({ length: currentWord.word.length }).map((_, i) => (
                <div key={i} className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  selected[i] !== undefined
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 border-dashed'
                }`}>
                  {selected[i] !== undefined ? shuffled[selected[i]] : ''}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {shuffled.map((letter, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => selectLetter(i)}
                  disabled={selected.includes(i)}
                  className={`w-12 h-14 rounded-xl text-xl font-bold transition-all ${
                    selected.includes(i)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
                  }`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button onClick={unselectLetter} disabled={selected.length === 0} className="btn-secondary">Undo</button>
              <button onClick={checkAnswer} disabled={selected.length !== currentWord.word.length} className="btn-primary">Check</button>
              <button onClick={skipWord} className="btn-accent">Skip</button>
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  )
}
