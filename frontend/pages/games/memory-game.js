import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getSynonymQuestions } from '../../lib/questions'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCards() {
  const syns = getSynonymQuestions(8)
  const pairs = syns.map((q, i) => ({ id: i, word: q.word, match: q.options[q.correct] }))
  const cards = pairs.flatMap((p, i) => [
    { id: i * 2, text: p.word, pairId: i, type: 'word' },
    { id: i * 2 + 1, text: p.match, pairId: i, type: 'match' },
  ])
  return shuffleArray(cards)
}

export default function MemoryGamePage() {
  const { addXp } = useApp()
  const [cards, setCards] = useState(createCards)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [checking, setChecking] = useState(false)

  const flipCard = (id) => {
    if (checking || flipped.includes(id) || matched.includes(id)) return
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)
    setMoves(moves + 1)

    if (newFlipped.length === 2) {
      setChecking(true)
      const [first, second] = newFlipped
      const card1 = cards.find(c => c.id === first)
      const card2 = cards.find(c => c.id === second)

      if (card1.pairId === card2.pairId) {
        setMatched([...matched, first, second])
        setScore(score + 10)
        toast.success('Matched! +10 XP')
        setFlipped([])
        setChecking(false)
        if (matched.length + 2 === cards.length) {
          setTimeout(() => {
            const newScore = score + 10
            addXp(newScore)
            setGameState('done')
          }, 500)
        }
      } else {
        setTimeout(() => {
          setFlipped([])
          setChecking(false)
        }, 1000)
      }
    }
  }

  const endGame = () => {
    addXp(score)
    setGameState('done')
  }

  const playAgain = () => {
    setCards(createCards())
    setFlipped([])
    setMatched([])
    setMoves(0)
    setScore(0)
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
            <h2 className="text-3xl font-display font-bold mb-2">Memory Complete!</h2>
            <div className="text-5xl font-display font-bold gradient-text my-4">{score} XP</div>
            <p className="text-gray-600 mb-2">Moves: {moves}</p>
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">Moves: {moves}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
              <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id)
              const isMatched = matched.includes(card.id)

              return (
                <motion.button
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-xl text-sm font-bold transition-all ${
                    isMatched
                      ? 'bg-secondary-100 dark:bg-secondary-900/30 border-2 border-secondary-500 text-secondary-700 dark:text-secondary-300'
                      : isFlipped
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'gradient-bg text-white hover:shadow-lg cursor-pointer'
                  }`}
                >
                  {isFlipped ? card.text : '?'}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
