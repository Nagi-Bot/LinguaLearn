import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RequireAuth from '../../components/RequireAuth'
import { useApp } from '../../context/AppContext'
import { getSynonymQuestions } from '../../lib/questions'
import SEO from '../../components/SEO'

const gridSize = 10

function generateGrid() {
  const syns = getSynonymQuestions(8)
  const wordList = syns.map(q => q.word.toUpperCase())
  const size = gridSize
  const grid = Array.from({ length: size }, () => Array(size).fill(''))
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      grid[r][c] = letters[Math.floor(Math.random() * letters.length)]
    }
  }

  wordList.forEach(word => {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 100) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * (size - word.length))
      let canPlace = true
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
          canPlace = false
          break
        }
      }
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i]
        }
        placed = true
      }
      attempts++
    }
  })

  return { grid, words: wordList }
}

export default function WordSearchPage() {
  const { submitGameScore } = useApp()
  const [gameData, setGameData] = useState(() => generateGrid())
  const [grid, setGrid] = useState(gameData.grid)
  const [wordList, setWordList] = useState(gameData.words.map(w => ({ word: w, found: false })))
  const [selected, setSelected] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [selectionStart, setSelectionStart] = useState(null)
  const [ending, setEnding] = useState(false)

  const handleCellClick = (row, col) => {
    if (gameState !== 'playing') return

    if (selectionStart === null) {
      setSelectionStart({ row, col })
      setSelected([{ row, col }])
    } else {
      const newSelected = [...selected, { row, col }]
      setSelected(newSelected)

      const word = newSelected.map(s => grid[s.row][s.col]).join('')
      const found = wordList.find(w => w.word === word && !foundWords.includes(w.word))
      if (found) {
        setFoundWords([...foundWords, found.word])
        const points = 15
        const newScore = score + points
        setScore(newScore)
        toast.success(`Found "${found.word}"! +${points} XP`)
        setSelected([])
        setSelectionStart(null)

        if (foundWords.length + 1 === wordList.length) {
          setScore(newScore)
          setTimeout(() => {
            submitGameScore('word-search', newScore)
            setGameState('done')
          }, 500)
        }
      }
    }
  }

  const clearSelection = () => {
    setSelected([])
    setSelectionStart(null)
  }

  const endGame = () => {
    if (ending) return
    setEnding(true)
    submitGameScore('word-search', score)
    setGameState('done')
  }

  const playAgain = () => {
    const data = generateGrid()
    setGrid(data.grid)
    setWordList(data.words.map(w => ({ word: w, found: false })))
    setSelected([])
    setFoundWords([])
    setScore(0)
    setSelectionStart(null)
    setEnding(false)
    setGameState('playing')
  }

  if (gameState === 'done') {
    return (
      <RequireAuth>
        <SEO title="Word Search Game" description="Find hidden English words in the puzzle grid. Improve your word recognition and spelling while having fun." keywords="word search, word puzzle, find words, spelling game" url="/games/word-search" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">All Words Found!</h2>
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
      <SEO title="Word Search Game" description="Find hidden English words in the puzzle grid. Improve your word recognition and spelling while having fun." keywords="word search, word puzzle, find words, spelling game" url="/games/word-search" />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {wordList.map((w, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${
                    foundWords.includes(w.word)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 line-through'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {w.word}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">Click first letter then last letter to select a word</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 font-bold gradient-text"><Zap className="w-4 h-4" /> {score} XP</div>
              <button onClick={endGame} className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium">End</button>
            </div>
          </div>

          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selected.some(s => s.row === r && s.col === c)
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square rounded text-sm font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary-500 text-white scale-110'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {cell}
                  </motion.button>
                )
              })
            )}
          </div>

          {selected.length > 0 && (
            <div className="text-center mt-4">
              <button onClick={clearSelection} className="text-sm text-gray-500 hover:text-primary-500">Clear Selection</button>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}
