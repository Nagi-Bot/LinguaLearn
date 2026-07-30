import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getWordBuilderWords } from '../../lib/questions'

const BATCH_SIZE = 15
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const maxWrong = 6

export default function HangmanPage() {
  const { submitGameScore } = useApp()
  const [words, setWords] = useState(() => getWordBuilderWords(BATCH_SIZE))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [guessed, setGuessed] = useState([])
  const [wrong, setWrong] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('playing')

  const loadMore = () => {
    setWords(prev => [...prev, ...getWordBuilderWords(BATCH_SIZE)])
  }

  const currentWord = words[currentIdx]?.word || 'BEAUTIFUL'
  const revealed = currentWord.split('').map(l => guessed.includes(l) ? l : '_')

  const guessLetter = (letter) => {
    if (guessed.includes(letter) || gameState !== 'playing') return
    setGuessed([...guessed, letter])

    if (currentWord.includes(letter)) {
      const newRevealed = currentWord.split('').map(l => guessed.includes(l) || l === letter ? l : '_')
      if (!newRevealed.includes('_')) {
        const points = 20 - wrong * 2
        setScore(score + points)
        toast.success(`+${points} XP!`)
        setTimeout(nextWord, 1000)
      }
    } else {
      const newWrong = wrong + 1
      setWrong(newWrong)
      if (newWrong >= maxWrong) {
        toast.error(`The word was: ${currentWord}`)
        setTimeout(nextWord, 1500)
      }
    }
  }

  const nextWord = () => {
    if (currentIdx < words.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setGuessed([])
      setWrong(0)
    } else {
      loadMore()
      setCurrentIdx(currentIdx + 1)
      setGuessed([])
      setWrong(0)
    }
  }

  const endGame = () => {
    submitGameScore('hangman', score)
    setGameState('done')
  }

  const playAgain = () => {
    setWords(getWordBuilderWords(BATCH_SIZE))
    setCurrentIdx(0); setGuessed([]); setWrong(0); setScore(0)
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
            <h2 className="text-3xl font-display font-bold mb-2">Game Over!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
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

  return (
    <RequireAuth>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6">
            <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End Game</button>
            <span className="text-sm text-gray-500">Word {currentIdx + 1} · Endless</span>
            <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
          </div>

          <motion.div key={currentIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6">
            <p className="text-gray-500 mb-2">Hint: {words[currentIdx]?.hint}</p>
            <p className="text-sm text-gray-500 mb-4">Wrong: {wrong}/{maxWrong}</p>

            <div className="flex items-center justify-center space-x-2 mb-8">
              {revealed.map((l, i) => (
                <div key={i} className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${
                  l !== '_'
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 text-primary-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {l}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {alphabet.map(letter => {
                const used = guessed.includes(letter)
                const isCorrect = currentWord.includes(letter)
                return (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={used}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      used
                        ? isCorrect
                          ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-500 cursor-default'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-500 cursor-default'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-600'
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  )
}
