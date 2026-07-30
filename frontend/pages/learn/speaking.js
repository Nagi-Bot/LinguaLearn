import { useState, useCallback } from 'react'
export const dynamic = 'force-dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, ArrowLeft, RotateCcw, Star, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'

const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'I would like to order a cup of coffee, please.',
  'She enjoys reading books about history and science.',
  'The weather is beautiful today, perfect for a walk.',
  'Can you help me with this math problem?',
  'He has been working at this company for five years.',
  'They went to the beach last weekend and had a great time.',
  'Learning a new language opens many doors in life.',
  'Please send me an email with the details.',
  'The meeting will start at three o\'clock in the afternoon.',
]

export default function SpeakingPage() {
  const { saveLearnProgress, loseHeart, hasHearts, user } = useApp()
  const [currentSentence, setCurrentSentence] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const [scores, setScores] = useState([])
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [hearts, setHearts] = useState(3)
  const [ended, setEnded] = useState(false)

  const speakSentence = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setSpokenText(transcript)

      const original = sentences[currentSentence].toLowerCase().replace(/[.,!?'"]/g, '')
      const spoken = transcript.toLowerCase().replace(/[.,!?'"]/g, '')

      const originalWords = original.split(/\s+/)
      const spokenWords = spoken.split(/\s+/)

      let correctWords = 0
      originalWords.forEach((word, i) => {
        if (spokenWords[i] === word) correctWords++
      })

      const accuracy = Math.round((correctWords / originalWords.length) * 100)
      const fluency = Math.min(100, Math.round(100 - Math.abs(originalWords.length - spokenWords.length) * 10))
      const overallScore = Math.round((accuracy * 0.6 + fluency * 0.4))

      const newScore = {
        original: sentences[currentSentence],
        spoken: transcript,
        accuracy,
        fluency,
        overallScore
      }

      setScores([...scores, newScore])
      setResult(newScore)

      if (overallScore < 50) {
        const newHearts = hearts - 1
        setHearts(newHearts)
        loseHeart()
        if (newHearts <= 0) {
          toast.error('No hearts left! Buy more in the Store', { duration: 3000 })
          setEnded(true)
          return
        }
      }

      if (currentSentence < sentences.length - 1) {
        setTimeout(() => {
          setCurrentSentence(currentSentence + 1)
          setSpokenText('')
          setResult(null)
        }, 2000)
      } else {
        setCompleted(true)
        const avgScore = Math.round([...scores, newScore].reduce((a, s) => a + s.overallScore, 0) / (scores.length + 1))
        saveLearnProgress('speaking', 'practice-session', avgScore)
        toast.success('Speaking practice complete! 🎉')
        toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      }
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      toast.error('Error with speech recognition. Please try again.')
    }

    recognition.start()
  }, [currentSentence, scores])

  const reset = () => {
    setCurrentSentence(0)
    setSpokenText('')
    setScores([])
    setCompleted(false)
    setResult(null)
  }

  if (ended) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-4xl">💔</span>
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/store" className="btn-primary">Visit Store</Link>
              <button onClick={() => { reset(); setEnded(false); setHearts(3) }} className="btn-secondary">Practice Again</button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (completed) {
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.overallScore, 0) / scores.length) : 0
    const avgAccuracy = scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.accuracy, 0) / scores.length) : 0
    const avgFluency = scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.fluency, 0) / scores.length) : 0

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
            <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-2">Practice Complete!</h2>
            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="text-center p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                <div className="text-3xl font-bold gradient-text">{avgScore}</div>
                <div className="text-xs text-gray-500">Overall</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary-50 dark:bg-secondary-900/20">
                <div className="text-3xl font-bold text-secondary-500">{avgAccuracy}%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20">
                <div className="text-3xl font-bold text-accent-500">{avgFluency}%</div>
                <div className="text-xs text-gray-500">Fluency</div>
              </div>
            </div>
            <button onClick={reset} className="btn-primary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Practice Again</button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            Speaking <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Read the sentence aloud and get instant pronunciation feedback.</p>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-8">
          {sentences.map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i === currentSentence ? 'gradient-bg text-white' :
              i < currentSentence ? 'bg-secondary-500 text-white' :
              'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {i < currentSentence ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
          ))}
          <span className="ml-2 text-sm font-semibold">❤️ {hearts}/3</span>
        </div>

        <motion.div key={currentSentence} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center mb-6">
          <p className="text-2xl font-display font-semibold mb-6">{sentences[currentSentence]}</p>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <button onClick={() => speakSentence(sentences[currentSentence])} className="btn-secondary p-4 rounded-xl" title="Listen">
              <Volume2 className="w-6 h-6" />
            </button>
            <button
              onClick={startListening}
              disabled={isListening}
              className={`p-6 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                  : 'gradient-bg text-white hover:shadow-xl'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          {isListening && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-500 font-medium">
              Listening... Speak now!
            </motion.p>
          )}

          {spokenText && !result && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-gray-500 italic">{spokenText}</p>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card p-6">
              <h3 className="font-semibold mb-3">Result</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <div className="text-2xl font-bold gradient-text">{result.overallScore}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                  <div className="text-2xl font-bold text-secondary-500">{result.accuracy}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                  <div className="text-2xl font-bold text-accent-500">{result.fluency}%</div>
                  <div className="text-xs text-gray-500">Fluency</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 mb-1">You said:</p>
                <p className="text-gray-700 dark:text-gray-300">{result.spoken}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
