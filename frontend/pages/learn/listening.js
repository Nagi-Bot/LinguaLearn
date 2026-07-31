import { useState, useRef } from 'react'

import { motion } from 'framer-motion'
import { Volume2, Headphones, ArrowLeft, CheckCircle, Play, Pause, Sun, UtensilsCrossed, Plane, Newspaper } from 'lucide-react'
import DynamicIcon from '../../components/DynamicIcon'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import SEO from '../../components/SEO'

const iconMap = {
  weather: Sun, restaurant: UtensilsCrossed, travel: Plane, news: Newspaper
}

const exercises = [
  {
    id: 1, title: 'Weather Report', level: 'Beginner', icon: 'weather',
    transcript: 'Good morning! Today will be sunny and warm. The temperature will reach 25 degrees Celsius. In the afternoon, there might be some clouds, but no rain expected. Perfect weather for outdoor activities!',
    questions: [
      { q: 'What will the weather be like?', options: ['Rainy', 'Sunny and warm', 'Snowy', 'Windy'], answer: 1 },
      { q: 'What is the expected temperature?', options: ['20°C', '25°C', '30°C', '15°C'], answer: 1 },
      { q: 'What might appear in the afternoon?', options: ['Rain', 'Snow', 'Clouds', 'Fog'], answer: 2 },
    ]
  },
  {
    id: 2, title: 'Restaurant Conversation', level: 'Intermediate', icon: 'restaurant',
    transcript: 'Customer: Hello, I\'d like to book a table for two tonight at 7 PM. Waiter: Certainly, sir. Indoor or outdoor seating? Customer: Outdoor, please. Waiter: Perfect. We have a table available on the terrace. May I have your name, please? Customer: Yes, it\'s Mr. Anderson. Waiter: Thank you, Mr. Anderson. We look forward to seeing you tonight.',
    questions: [
      { q: 'How many people is the booking for?', options: ['One', 'Two', 'Three', 'Four'], answer: 1 },
      { q: 'What type of seating do they want?', options: ['Indoor', 'Outdoor', 'Bar', 'Private room'], answer: 1 },
      { q: 'What is the customer\'s name?', options: ['Mr. Johnson', 'Mr. Anderson', 'Mr. Smith', 'Mr. Brown'], answer: 1 },
    ]
  },
  {
    id: 3, title: 'Travel Announcement', level: 'Advanced', icon: 'travel',
    transcript: 'Attention passengers. Flight BA249 to London Heathrow is now boarding at Gate 12. Business class passengers and families with young children may board first. Please have your boarding passes and passports ready. The flight time to London is approximately 7 hours and 30 minutes. We wish you a pleasant journey.',
    questions: [
      { q: 'Which flight is boarding?', options: ['BA249', 'BA429', 'BA924', 'BA942'], answer: 0 },
      { q: 'Who can board first?', options: ['All passengers', 'Business class and families', 'Only business class', 'Only families'], answer: 1 },
      { q: 'How long is the flight?', options: ['6 hours', '7 hours 30 min', '8 hours', '5 hours 30 min'], answer: 1 },
    ]
  },
  {
    id: 4, title: 'Daily News Summary', level: 'Intermediate', icon: 'news',
    transcript: 'In today\'s news: Scientists have discovered a new planet in a distant solar system. The planet is similar in size to Earth and may have liquid water. Meanwhile, the local community center is organizing a free coding workshop for teenagers next Saturday. Finally, the city library has announced extended weekend hours starting next month.',
    questions: [
      { q: 'What did scientists discover?', options: ['A new star', 'A new planet', 'A new galaxy', 'A new moon'], answer: 1 },
      { q: 'Who is the coding workshop for?', options: ['Children', 'Teenagers', 'Adults', 'Seniors'], answer: 1 },
      { q: 'What did the library announce?', options: ['New books', 'Extended hours', 'Closure', 'Discounts'], answer: 1 },
    ]
  },
]

export default function ListeningPage() {
  const { saveLearnProgress, loseHeart, user } = useApp()
  const [activeExercise, setActiveExercise] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [completedExercises, setCompletedExercises] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [hearts, setHearts] = useState(user?.hearts ?? 3)
  const [ended, setEnded] = useState(false)
  const synth = useRef(null)

  const speak = (text, callback) => {
    if ('speechSynthesis' in window) {
      if (synth.current) {
        window.speechSynthesis.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => { setIsPlaying(false); if (callback) callback() }
      synth.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const startExercise = (ex) => {
    setActiveExercise(ex)
    setCurrentQuestion(0)
    setScore(0)
    setQuizDone(false)
    setSelectedAnswer(null)
    setShowTranscript(false)
    speak(ex.transcript, () => {})
  }

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    if (index === activeExercise.questions[currentQuestion].answer) {
      setScore(score + 1)
      toast.success('Correct!')
    } else {
      toast.error('Incorrect! Try listening again.')
      const newHearts = hearts - 1
      setHearts(newHearts)
      loseHeart()
      if (newHearts <= 0) {
        toast.error('No hearts left! Buy more in the Store', { duration: 3000 })
        setEnded(true)
        return
      }
    }
    setTimeout(() => {
      if (currentQuestion < activeExercise.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizDone(true)
        if (!completedExercises.includes(activeExercise.id)) {
          setCompletedExercises([...completedExercises, activeExercise.id])
        }
        const finalScore = score + (index === activeExercise.questions[currentQuestion].answer ? 1 : 0)
        saveLearnProgress('listening', activeExercise.id, finalScore * 10)
        toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      }
    }, 1000)
  }

  if (activeExercise) {
    if (ended) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 sm:p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/store" className="btn-primary">Visit Store</Link>
                <button onClick={() => { setActiveExercise(null); setEnded(false); setHearts(3) }} className="btn-secondary">Back to Exercises</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
    if (quizDone) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 sm:p-12">
              <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Listening Complete!</h2>
              <div className="text-5xl font-display font-bold gradient-text my-4">{score}/{activeExercise.questions.length}</div>
              <button onClick={() => setActiveExercise(null)} className="btn-primary">Back to Exercises</button>
            </motion.div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setActiveExercise(null)} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={activeExercise.icon} /></span>
                <div>
                  <h2 className="text-xl font-display font-semibold">{activeExercise.title}</h2>
                  <span className="text-sm text-gray-500">{activeExercise.level}</span>
                </div>
              </div>
              <button
                onClick={() => speak(activeExercise.transcript)}
                className="btn-primary p-3 rounded-xl"
                title="Play Audio"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>

            <button onClick={() => setShowTranscript(!showTranscript)} className="text-sm text-primary-500 hover:underline mb-3 block">
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
            {showTranscript && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{activeExercise.transcript}</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Question {currentQuestion + 1} of {activeExercise.questions.length}</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold">❤️ {hearts}/3</span>
                <span className="text-sm text-primary-500 font-medium">Score: {score}</span>
              </div>
            </div>
            <p className="text-lg mb-4">{activeExercise.questions[currentQuestion].q}</p>
            <div className="space-y-3">
              {activeExercise.questions[currentQuestion].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                      : i === activeExercise.questions[currentQuestion].answer
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : selectedAnswer === i
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
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Listening Practice" description="Enhance your English listening skills with audio exercises, conversations, and dictation practice at various levels." keywords="english listening, listening exercises, audio practice, dictation" url="/learn/listening" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Listening <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your listening comprehension with audio conversations, news, and dictation exercises.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {exercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => startExercise(ex)}
              className={`glass-card cursor-pointer ${completedExercises.includes(ex.id) ? 'border-secondary-500/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={ex.icon} /></span>
                  <div>
                    <h3 className="text-lg font-display font-semibold">{ex.title}</h3>
                    <span className="text-xs text-gray-500">{ex.level}</span>
                  </div>
                </div>
                {completedExercises.includes(ex.id) && <CheckCircle className="w-5 h-5 text-secondary-500" />}
              </div>
              <p className="text-sm text-gray-500">{ex.questions.length} listening questions</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
