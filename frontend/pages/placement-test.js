import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Clock, Trophy, RotateCcw, Zap, ChevronRight, CheckCircle, XCircle, Target, ArrowRight, Lock, Sprout, BookOpen, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import RequireAuth from '../components/RequireAuth'
import { useApp } from '../context/AppContext'
import SEO from '../components/SEO'
import api from '../lib/api'

const TOTAL_QUESTIONS = 15

const FALLBACK_QUESTIONS = {
  beginner: [
    { question: "What is the capital of ___ United Kingdom?", options: ["a", "an", "the", "no article"], correct: 2, explanation: "Use 'the' before United Kingdom (a country with a political title)." },
    { question: "She ___ a teacher.", options: ["am", "is", "are", "be"], correct: 1, explanation: "'She' is third-person singular, so use 'is'." },
    { question: "I ___ to school every day.", options: ["go", "goes", "going", "went"], correct: 0, explanation: "Use base form 'go' with 'I' in present simple." },
    { question: "Choose the correct sentence:", options: ["He like pizza", "He likes pizza", "He liking pizza", "He liked pizza"], correct: 1, explanation: "Third-person singular 'he' takes 'likes' in present simple." },
    { question: "What color is the sky?", options: ["Green", "Blue", "Red", "Yellow"], correct: 1, explanation: "The sky appears blue during a clear day." },
    { question: "Complete: 'There ___ a book on the table.'", options: ["is", "are", "am", "be"], correct: 0, explanation: "Use 'is' with singular nouns: 'a book'." },
    { question: "Which word means the same as 'big'?", options: ["Small", "Large", "Tiny", "Short"], correct: 1, explanation: "'Large' is a synonym of 'big'." },
    { question: "___ you like ice cream?", options: ["Does", "Do", "Is", "Are"], correct: 1, explanation: "Use 'Do' with 'you' in questions." },
    { question: "The cat is ___ the table.", options: ["in", "on", "at", "under"], correct: 1, explanation: "Use 'on' for something resting on a surface." },
    { question: "We ___ happy yesterday.", options: ["was", "were", "are", "is"], correct: 1, explanation: "'We' takes 'were' in past tense." },
    { question: "What time is it? It's ___ o'clock.", options: ["twelve", "twelvth", "twelfth", "twelf"], correct: 0, explanation: "We say 'twelve o'clock' for 12:00." },
    { question: "She can ___ English well.", options: ["speaks", "spoke", "speak", "speaking"], correct: 2, explanation: "After modal 'can', use base form of verb." },
    { question: "Which is a fruit?", options: ["Carrot", "Apple", "Bread", "Rice"], correct: 1, explanation: "Apple is a fruit. Carrot is a vegetable." },
    { question: "My brother is ___ than me.", options: ["tall", "taller", "tallest", "more tall"], correct: 1, explanation: "Use comparative 'taller' when comparing two people." },
    { question: "I have ___ apple.", options: ["a", "an", "the", "some"], correct: 1, explanation: "Use 'an' before vowel sounds. 'Apple' starts with a vowel." },
  ],
  intermediate: [
    { question: "By the time we arrived, the movie ___.", options: ["already started", "has already started", "had already started", "was already starting"], correct: 2, explanation: "Use past perfect 'had started' for an action completed before another past action." },
    { question: "He is used ___ early in the morning.", options: ["to wake up", "to waking up", "wake up", "waking up"], correct: 1, explanation: "'Be used to' is followed by a gerund (verb + ing)." },
    { question: "I wish I ___ more time to study.", options: ["have", "had", "would have", "will have"], correct: 1, explanation: "Use past tense after 'wish' for unreal present situations." },
    { question: "The book ___ is on the table belongs to me.", options: ["who", "which", "whom", "whose"], correct: 1, explanation: "Use 'which' for things. The book which is on the table..." },
    { question: "She has been working here ___ 2019.", options: ["since", "for", "from", "in"], correct: 0, explanation: "Use 'since' with a specific point in time (2019)." },
    { question: "___ the weather was bad, we went for a walk.", options: ["Despite", "Although", "Because", "Since"], correct: 1, explanation: "'Although' introduces a contrasting idea." },
    { question: "I'd rather you ___ smoke inside.", options: ["don't", "didn't", "won't", "not"], correct: 1, explanation: "After 'I'd rather you', use past tense for present/future reference." },
    { question: "The company ___ 50 new employees last year.", options: ["took on", "took off", "took up", "took over"], correct: 0, explanation: "'Take on' means to hire or employ." },
    { question: "She speaks English ___ than before.", options: ["more fluently", "most fluently", "fluently", "fluent"], correct: 0, explanation: "Use 'more + adverb' for comparative forms of longer adverbs." },
    { question: "If I ___ you, I would accept the offer.", options: ["am", "was", "were", "be"], correct: 2, explanation: "In second conditionals, use 'were' for all subjects: 'If I were you...'" },
    { question: "The meeting has been postponed ___ next week.", options: ["on", "until", "in", "at"], correct: 1, explanation: "'Until' indicates something will happen at or before that time." },
    { question: "Not only ___ late, but she also forgot the documents.", options: ["she was", "was she", "she were", "were she"], correct: 1, explanation: "Inversion after 'Not only': auxiliary verb before subject." },
    { question: "He asked me where ___.", options: ["did I live", "do I live", "I lived", "I live"], correct: 2, explanation: "In reported questions, use statement word order and backshift tense." },
    { question: "This is the ___ interesting book I've ever read.", options: ["more", "most", "much", "very"], correct: 1, explanation: "Use 'most' for superlative: 'the most interesting'." },
    { question: "I'm looking forward ___ you at the party.", options: ["to see", "to seeing", "see", "seeing"], correct: 1, explanation: "'Look forward to' is followed by a gerund." },
  ],
  advanced: [
    { question: "Had it not been for her help, we ___ the project on time.", options: ["couldn't finish", "couldn't have finished", "can't finish", "can't have finished"], correct: 1, explanation: "Third conditional inverted: 'Had it not been...' = 'If it hadn't been...' Use 'couldn't have + past participle'." },
    { question: "The professor's explanation was ___ that everyone understood immediately.", options: ["so clear", "such clear", "so clearly", "such a clear"], correct: 0, explanation: "Use 'so + adjective + that' structure: 'so clear that...'" },
    { question: "___ the evidence, the jury found him not guilty.", options: ["In spite of", "Nevertheless", "However", "Although"], correct: 0, explanation: "'In spite of' is followed by a noun phrase. 'In spite of the evidence...'" },
    { question: "She has a tendency ___ things personally.", options: ["take", "to take", "taking", "taken"], correct: 1, explanation: "'Tendency' is followed by 'to + infinitive': 'tendency to take'." },
    { question: "The data ___ collected over a period of five years.", options: ["was", "were", "has been", "have been"], correct: 1, explanation: "'Data' is the plural of 'datum', so use 'were' (or 'have been')." },
    { question: "Seldom ___ such a moving performance.", options: ["I have seen", "have I seen", "I saw", "did I see"], correct: 1, explanation: "Negative adverbs like 'seldom' at the beginning require subject-auxiliary inversion." },
    { question: "Her research paper ___ by her supervisor before submission.", options: ["looked over", "was looked over", "was looking over", "looking over"], correct: 1, explanation: "Passive voice: 'was looked over by...'" },
    { question: "The implications of the decision ___ still being analyzed.", options: ["is", "are", "has", "have"], correct: 1, explanation: "Subject is 'implications' (plural), so use 'are'." },
    { question: "Were he to apologize, I ___ him.", options: ["forgive", "would forgive", "will forgive", "forgave"], correct: 1, explanation: "Inverted second conditional: 'Were he to apologize' = 'If he were to apologize'. Use 'would + base verb'." },
    { question: "The author's latest novel is ___ excellent read.", options: ["a", "an", "the", "no article"], correct: 1, explanation: "'Excellent' starts with a vowel sound, so use 'an'." },
    { question: "She was ___ the verge of tears after hearing the news.", options: ["on", "at", "in", "by"], correct: 0, explanation: "Collocation: 'on the verge of' means very close to." },
    { question: "It's high time ___ something about the situation.", options: ["we do", "we did", "we have done", "we will do"], correct: 1, explanation: "'It's high time' is followed by past tense (subjunctive): 'we did'." },
    { question: "The theory, ___ as groundbreaking, was met with skepticism.", options: ["regarding", "regarded", "to regard", "having regarded"], correct: 1, explanation: "Past participle phrase: 'regarded as groundbreaking' = 'which was regarded as groundbreaking'." },
    { question: "His speech was peppered ___ references to classical literature.", options: ["by", "with", "in", "from"], correct: 1, explanation: "'Peppered with' means filled or covered with many small things." },
    { question: "___ the company's financial troubles, the CEO resigned.", options: ["Due to", "Because", "Since", "As a result"], correct: 0, explanation: "'Due to' is followed by a noun phrase: 'Due to the company's financial troubles'." },
  ],
}

const LEVELS = [
  { id: 'beginner', label: 'Beginner', range: 'A1 - A2', description: 'Basic vocabulary, simple sentences, present tense', color: 'from-green-400 to-emerald-500', icon: 'Sprout' },
  { id: 'intermediate', label: 'Intermediate', range: 'B1 - B2', description: 'Complex sentences, past/future tenses, idioms', color: 'from-blue-400 to-indigo-500', icon: 'BookOpen' },
  { id: 'advanced', label: 'Advanced', range: 'C1 - C2', description: 'Nuanced grammar, academic vocabulary, phrasal verbs', color: 'from-purple-400 to-pink-500', icon: 'GraduationCap' },
]

function getCooldownInfo() {
  if (typeof window === 'undefined') return null
  try {
    const data = JSON.parse(localStorage.getItem('placement_test_cooldown') || 'null')
    if (!data) return null
    const elapsed = Date.now() - data.timestamp
    const remaining = 24 * 60 * 60 * 1000 - elapsed
    if (remaining <= 0) {
      localStorage.removeItem('placement_test_cooldown')
      return null
    }
    return { remaining, completedAt: new Date(data.timestamp) }
  } catch {
    return null
  }
}

function setCooldown() {
  localStorage.setItem('placement_test_cooldown', JSON.stringify({ timestamp: Date.now() }))
}

function formatTimeRemaining(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

function getRecommendation(score, selectedLevel) {
  const levelIndex = LEVELS.findIndex(l => l.id === selectedLevel)
  if (score <= 5) return { level: LEVELS[levelIndex], message: 'Keep practicing at this level to build a strong foundation.', color: 'text-blue-500' }
  if (score <= 10) {
    const nextLevel = LEVELS[Math.min(levelIndex + 1, LEVELS.length - 1)]
    return { level: nextLevel, message: 'You are ready for the next level! Great progress.', color: 'text-green-500' }
  }
  const advancedLevel = LEVELS[LEVELS.length - 1]
  return { level: advancedLevel, message: 'Outstanding! You are ready for advanced content.', color: 'text-purple-500' }
}

export default function PlacementTestPage() {
  const { submitGameScore, syncUser } = useApp()
  const [gameState, setGameState] = useState('start')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const [timer, setTimer] = useState(0)
  const [results, setResults] = useState(null)
  const [cooldown, setCooldownState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const info = getCooldownInfo()
    if (info) setCooldownState(info)
  }, [])

  useEffect(() => {
    let interval
    if (gameState === 'testing') {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])

  const fetchQuestions = useCallback(async (level) => {
    setLoading(true)
    try {
      const res = await api.post('/ai/placement-test', { level })
      const data = res.data
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions.slice(0, TOTAL_QUESTIONS))
        return
      }
    } catch {}
    const fallback = FALLBACK_QUESTIONS[level] || FALLBACK_QUESTIONS.beginner
    setQuestions(fallback.slice(0, TOTAL_QUESTIONS))
    setLoading(false)
    toast('Using offline questions', { icon: '📚' })
  }, [])

  const startTest = useCallback(async (level) => {
    setSelectedLevel(level)
    setGameState('testing')
    setCurrentQ(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswerFeedback(null)
    setTimer(0)
    setResults(null)
    await fetchQuestions(level)
  }, [fetchQuestions])

  const handleAnswer = useCallback((index) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)

    const isCorrect = index === questions[currentQ].correct
    if (isCorrect) {
      setScore(s => s + 1)
      toast.success('Correct!', { duration: 600 })
    } else {
      toast.error('Wrong!', { duration: 600 })
    }

    setAnswerFeedback({ correct: isCorrect, correctIndex: questions[currentQ].correct })

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1)
        setSelectedAnswer(null)
        setAnswerFeedback(null)
      } else {
        finishTest(isCorrect ? score + 1 : score)
      }
    }, 1500)
  }, [selectedAnswer, currentQ, questions, score])

  const finishTest = useCallback(async (finalScore) => {
    setSubmitting(true)
    try {
      const xpEarned = finalScore * 10
      await submitGameScore('placement-test', xpEarned)
    } catch {}
    const recommendation = getRecommendation(finalScore, selectedLevel)
    setResults({
      score: finalScore,
      total: questions.length,
      xpEarned: finalScore * 10,
      recommendation,
      selectedLevel,
      timeTaken: timer,
    })
    setCooldown()
    setGameState('results')
    setSubmitting(false)
  }, [selectedLevel, questions.length, timer, submitGameScore])

  const resetTest = () => {
    setGameState('start')
    setSelectedLevel(null)
    setQuestions([])
    setCurrentQ(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswerFeedback(null)
    setTimer(0)
    setResults(null)
    const info = getCooldownInfo()
    setCooldownState(info)
  }

  return (
    <RequireAuth>
      <SEO
        title="Placement Test"
        description="Take our English placement test to find your level. Get matched with lessons right for you."
        keywords="placement test, english level, beginner intermediate advanced"
        url="/placement-test"
      />

      {/* START SCREEN */}
      {gameState === 'start' && (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Placement Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find out your English level with our quick 15-question assessment.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Answer honestly to get the most accurate results. You'll receive a level recommendation and earn XP for correct answers.
            </p>

            {cooldown && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-center space-x-2 text-amber-700 dark:text-amber-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Test cooldown active. Try again in {formatTimeRemaining(cooldown.remaining)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (cooldown) {
                  toast.error('Please wait for the cooldown to expire.')
                  return
                }
                setGameState('level-select')
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!!cooldown}
            >
              {cooldown ? 'Cooldown Active' : 'Start Test'}
            </button>
          </motion.div>
        </div>
      )}

      {/* LEVEL SELECT */}
      {gameState === 'level-select' && (
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Choose Your Level</h2>
              <p className="text-gray-600 dark:text-gray-400">Select the level that best matches your current English ability</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {LEVELS.map((level, i) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startTest(level.id)}
                  disabled={loading}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all text-left group"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg`}>
                    {level.id === 'beginner' && <Sprout className="w-7 h-7 text-white" />}
                    {level.id === 'intermediate' && <BookOpen className="w-7 h-7 text-white" />}
                    {level.id === 'advanced' && <GraduationCap className="w-7 h-7 text-white" />}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${level.color} mb-3`}>
                    {level.range}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{level.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{level.description}</p>
                  <div className="flex items-center text-primary-500 dark:text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Start Test <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center mt-8">
              <button onClick={resetTest} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TESTING */}
      {gameState === 'testing' && (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? null : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Question {currentQ + 1} of {questions.length}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Target className="w-4 h-4 text-primary-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {score}/{currentQ + (selectedAnswer !== null ? 1 : 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-sm font-medium text-primary-600 dark:text-primary-400">
                      <Zap className="w-4 h-4" />
                      <span>{score * 10} XP</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
                      {questions[currentQ]?.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentQ]?.options?.map((opt, i) => {
                        let borderClass = 'border-gray-200 dark:border-gray-700'
                        let bgClass = 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                        let textClass = 'text-gray-800 dark:text-gray-200'

                        if (answerFeedback) {
                          if (i === answerFeedback.correctIndex) {
                            borderClass = 'border-green-500'
                            bgClass = 'bg-green-50 dark:bg-green-900/20'
                            textClass = 'text-green-700 dark:text-green-400'
                          } else if (selectedAnswer === i && !answerFeedback.correct) {
                            borderClass = 'border-red-500'
                            bgClass = 'bg-red-50 dark:bg-red-900/20'
                            textClass = 'text-red-700 dark:text-red-400'
                          } else {
                            bgClass = 'bg-gray-50 dark:bg-gray-800 opacity-50'
                          }
                        }

                        return (
                          <motion.button
                            key={i}
                            whileHover={!answerFeedback ? { scale: 1.02 } : {}}
                            whileTap={!answerFeedback ? { scale: 0.98 } : {}}
                            onClick={() => handleAnswer(i)}
                            disabled={selectedAnswer !== null}
                            className={`p-4 md:p-5 rounded-xl text-left font-medium border-2 transition-all ${borderClass} ${bgClass} ${textClass} disabled:cursor-not-allowed`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>

                    {answerFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 flex items-center justify-center space-x-2 text-sm font-medium ${
                          answerFeedback.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {answerFeedback.correct ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Correct! +10 XP</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            <span>Incorrect</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {gameState === 'results' && results && (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Test Complete!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Here are your results</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{results.score}/{results.total}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Score</div>
              </div>
              <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{results.xpEarned}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">XP Earned</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{Math.floor(results.timeTaken / 60)}:{String(results.timeTaken % 60).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Time</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recommended Level</p>
              <div className={`text-2xl font-bold mb-2 ${results.recommendation.color}`}>
                {results.recommendation.level.label}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({results.recommendation.level.range})</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{results.recommendation.message}</p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              {cooldown ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>Next test in {formatTimeRemaining(cooldown.remaining)}</span>
                </div>
              ) : (
                <button
                  onClick={resetTest}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  Retake Test
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </RequireAuth>
  )
}
