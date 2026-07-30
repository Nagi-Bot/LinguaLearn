import { useState, createElement } from 'react'
export async function getServerSideProps() { return { props: {} } }
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import {
  BookOpen, CheckCircle, ChevronRight, ArrowLeft,
  Sparkles, RotateCcw, Star, Zap, Award,
  Library, Clock, FileText, Repeat, MessageCircle,
  CheckSquare, Box, GitBranch, MapPin, GitMerge, Type
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'

const topicIcons = {
  'parts-of-speech': Library,
  'tenses': Clock,
  'articles': FileText,
  'voice': Repeat,
  'speech': MessageCircle,
  'agreement': CheckSquare,
  'modals': Box,
  'conditionals': GitBranch,
  'prepositions': MapPin,
  'conjunctions': GitMerge,
}

const topics = [
  {
    id: 1, title: 'Parts of Speech', description: 'Nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, interjections',
    icon: 'parts-of-speech', lessons: [
      { title: 'Nouns', content: 'Nouns are words that name people, places, things, or ideas.', examples: ['The **cat** sat on the mat.', '**London** is a beautiful city.', '**Honesty** is the best policy.'] },
      { title: 'Verbs', content: 'Verbs describe actions, occurrences, or states of being.', examples: ['She **runs** every morning.', 'They **are** happy.', 'He **wrote** a letter.'] },
      { title: 'Adjectives', content: 'Adjectives describe or modify nouns and pronouns.', examples: ['The **red** car is fast.', 'She is a **brilliant** student.', 'It was a **sunny** day.'] },
    ]
  },
  {
    id: 2, title: 'Tenses', description: 'Present, Past, Future - Simple, Continuous, Perfect, Perfect Continuous',
    icon: 'tenses', lessons: [
      { title: 'Present Simple', content: 'Used for habits, general truths, and repeated actions.', examples: ['I **eat** breakfast at 7 AM.', 'The sun **rises** in the east.', 'She **works** in a bank.'] },
      { title: 'Past Simple', content: 'Used for completed actions in the past.', examples: ['I **visited** Paris last year.', 'She **finished** her homework.', 'They **went** to the cinema.'] },
      { title: 'Future Simple', content: 'Used for actions that will happen in the future.', examples: ['I **will call** you tomorrow.', 'She **will arrive** at 5 PM.', 'They **will complete** the project.'] },
    ]
  },
  {
    id: 3, title: 'Articles', description: 'Definite (the) and Indefinite (a, an) articles usage',
    icon: 'articles', lessons: [
      { title: 'Indefinite Articles (A/An)', content: 'Used with non-specific singular countable nouns.', examples: ['She is **a** teacher.', 'I ate **an** apple.', 'He is **an** honest man.'] },
      { title: 'Definite Article (The)', content: 'Used with specific nouns, unique things, and superlatives.', examples: ['**The** sun is bright.', 'She is **the** best student.', 'Close **the** door, please.'] },
    ]
  },
  {
    id: 4, title: 'Active & Passive Voice', description: 'Understanding active and passive constructions',
    icon: 'voice', lessons: [
      { title: 'Active Voice', content: 'The subject performs the action.', examples: ['**The cat** chased the mouse.', '**She** wrote the letter.', '**The team** won the match.'] },
      { title: 'Passive Voice', content: 'The subject receives the action.', examples: ['The mouse **was chased by the cat**.', 'The letter **was written by her**.', 'The match **was won**.'] },
    ]
  },
  {
    id: 5, title: 'Direct & Indirect Speech', description: 'Reporting what someone said',
    icon: 'speech', lessons: [
      { title: 'Direct Speech', content: 'Quoting the exact words spoken.', examples: ['She said, **"I am happy"**.', 'He asked, **"Where are you going?"**'] },
      { title: 'Indirect Speech', content: 'Reporting speech without quoting exactly.', examples: ['She said **that she was happy**.', 'He asked **where I was going**.'] },
    ]
  },
  {
    id: 6, title: 'Subject-Verb Agreement', description: 'Matching subjects with correct verb forms',
    icon: 'agreement', lessons: [
      { title: 'Basic Rules', content: 'Singular subjects take singular verbs; plural subjects take plural verbs.', examples: ['**She runs** every day.', '**They run** every day.', '**The dog barks** loudly.'] },
    ]
  },
  {
    id: 7, title: 'Modals', description: 'Can, could, may, might, must, shall, should, will, would',
    icon: 'modals', lessons: [
      { title: 'Modal Verbs', content: 'Auxiliary verbs that express necessity, possibility, permission, or ability.', examples: ['You **must** finish your work.', 'She **can** speak French.', '**May** I come in?'] },
    ]
  },
  {
    id: 8, title: 'Conditionals', description: 'Zero, First, Second, Third conditionals',
    icon: 'conditionals', lessons: [
      { title: 'Conditional Sentences', content: 'Sentences expressing conditions and results.', examples: ['**If** it rains, I **will** stay home.', '**If** I were rich, I **would** travel.'] },
    ]
  },
  {
    id: 9, title: 'Prepositions', description: 'In, on, at, for, since, with, by, to, from, etc.',
    icon: 'prepositions', lessons: [
      { title: 'Prepositions of Time & Place', content: 'Words showing relationships between nouns and other words.', examples: ['She is **in** the room.', 'The meeting is **at** 3 PM.', 'I have worked here **for** 5 years.'] },
    ]
  },
  {
    id: 10, title: 'Conjunctions', description: 'And, but, or, so, because, although, while, etc.',
    icon: 'conjunctions', lessons: [
      { title: 'Coordinating & Subordinating', content: 'Words that connect clauses or sentences.', examples: ['I like tea **and** coffee.', 'She is tired **but** happy.', 'He stayed **because** it was raining.'] },
    ]
  },
]

const quizQuestions = [
  { question: 'Which is a correct sentence?', options: ['She go to school', 'She goes to school', 'She going school', 'She go school'], correct: 1 },
  { question: 'Choose the correct article: "___ apple a day keeps the doctor away."', options: ['A', 'An', 'The', 'None'], correct: 1 },
  { question: 'What is the past tense of "write"?', options: ['Writed', 'Wrote', 'Written', 'Writes'], correct: 1 },
  { question: 'Which sentence is in passive voice?', options: ['The cat ate the fish', 'The fish was eaten by the cat', 'The cat eats fish', 'The cat is eating'], correct: 1 },
  { question: 'Choose the correct modal: "You ___ finish your homework before playing."', options: ['can', 'might', 'must', 'could'], correct: 2 },
]

export default function GrammarPage() {
  const { saveLearnProgress, loseHeart, hasHearts, user } = useApp()
  const [activeTopic, setActiveTopic] = useState(null)
  const [activeLesson, setActiveLesson] = useState(0)
  const [quizActive, setQuizActive] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [completedTopics, setCompletedTopics] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [hearts, setHearts] = useState(3)
  const [ended, setEnded] = useState(false)

  const startTopic = (topic) => {
    setActiveTopic(topic)
    setActiveLesson(0)
    setQuizActive(false)
    setQuizDone(false)
    setShowQuiz(false)
  }

  const nextLesson = () => {
    if (activeLesson < activeTopic.lessons.length - 1) {
      setActiveLesson(activeLesson + 1)
    }
  }

  const prevLesson = () => {
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1)
    }
  }

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1)
      toast.success('Correct! 🎉')
    } else {
      toast.error('Incorrect!')
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
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizDone(true)
        if (!completedTopics.includes(activeTopic?.id)) {
          setCompletedTopics([...completedTopics, activeTopic?.id])
        }
        const finalScore = score + (index === quizQuestions[currentQuestion].correct ? 1 : 0)
        saveLearnProgress('grammar', activeTopic?.id, finalScore * 10)
        toast.success(`Quiz Complete! Score: ${finalScore}/${quizQuestions.length}`)
        toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      }
    }, 1000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setQuizDone(false)
    setSelectedAnswer(null)
    setQuizActive(false)
    setShowQuiz(false)
  }

  const goBack = () => {
    if (showQuiz) {
      setShowQuiz(false)
      setQuizActive(false)
    } else if (activeTopic) {
      setActiveTopic(null)
      setActiveLesson(0)
    }
  }

  if (activeTopic && showQuiz) {
    if (ended) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <button onClick={goBack} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to {activeTopic.title}
            </button>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card text-center p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/store" className="btn-primary">Visit Store</Link>
                <button onClick={goBack} className="btn-secondary">Back to Topics</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={goBack} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to {activeTopic.title}
          </button>
          {quizDone ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card text-center p-12">
              <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h2>
              <div className="text-6xl font-display font-bold gradient-text my-4">{score}/{quizQuestions.length}</div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {score === quizQuestions.length ? 'Perfect score! You\'re a grammar expert! 🏆' :
                 score >= quizQuestions.length * 0.7 ? 'Great job! Keep practicing! ⭐' :
                 'Good effort! Review the lessons and try again! 💪'}
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">+{score * 10} XP</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <button onClick={resetQuiz} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Try Again</button>
                <button onClick={() => { setActiveTopic(null); resetQuiz() }} className="btn-primary">Back to Topics</button>
              </div>
            </motion.div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold">❤️ {hearts}/3</span>
                    <span className="text-sm font-semibold text-primary-500">Score: {score}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }} />
                </div>
              </div>
              <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
                <h3 className="text-xl font-display font-semibold mb-6">{quizQuestions[currentQuestion].question}</h3>
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                        selectedAnswer === null
                          ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                          : i === quizQuestions[currentQuestion].correct
                            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-700 dark:text-green-300'
                            : selectedAnswer === i
                              ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-300'
                              : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50'
                      }`}
                    >
                      <span className="inline-block w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 text-center leading-8 mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeTopic) {
    const lesson = activeTopic.lessons[activeLesson]
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={goBack} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Topics
          </button>

          <div className="flex items-center space-x-2 mb-6">
            {activeTopic.lessons.map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i === activeLesson ? 'gradient-bg text-white' :
                i < activeLesson ? 'bg-secondary-500 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {i < activeLesson ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
            ))}
          </div>

          <motion.div key={activeLesson} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                {topicIcons[activeTopic.icon] && createElement(topicIcons[activeTopic.icon], { className: 'w-6 h-6 text-primary-600 dark:text-primary-400' })}
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{lesson.title}</h2>
                <p className="text-gray-500 text-sm">{activeTopic.title}</p>
              </div>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{lesson.content}</p>

            <h3 className="font-semibold mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-primary-500" /> Examples
            </h3>
            <div className="space-y-3 mb-8">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                  <p className="text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{
                    __html: ex.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-600 dark:text-primary-400">$1</strong>')
                  }} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prevLesson} disabled={activeLesson === 0} className="btn-secondary" disabled={activeLesson === 0}>
                Previous
              </button>
              <div className="flex space-x-3">
                <button onClick={() => setShowQuiz(true)} className="btn-accent">
                  <Zap className="w-4 h-4 mr-2 inline" /> Take Quiz
                </button>
                {activeLesson < activeTopic.lessons.length - 1 ? (
                  <button onClick={nextLesson} className="btn-primary">
                    Next <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </button>
                ) : (
                  <button onClick={() => setShowQuiz(true)} className="btn-primary">
                    Complete <Award className="w-4 h-4 ml-1 inline" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Grammar Lessons" description="Master English grammar with interactive lessons on tenses, parts of speech, articles, active-passive voice, conditionals, modals, and more." keywords="english grammar lessons, learn tenses, parts of speech, conditionals, modals, grammar exercises" url="/learn/grammar" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            English <span className="gradient-text">Grammar</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Master English grammar with comprehensive lessons, examples, and interactive quizzes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => startTopic(topic)}
              className={`glass-card cursor-pointer relative overflow-hidden group ${
                completedTopics.includes(topic.id) ? 'border-secondary-500/50' : ''
              }`}
            >
              {completedTopics.includes(topic.id) && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5 text-secondary-500" />
                </div>
              )}
              <div className="w-12 h-12 mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                {topicIcons[topic.icon] && createElement(topicIcons[topic.icon], { className: 'w-6 h-6 text-primary-600 dark:text-primary-400' })}
              </div>
              <h3 className="text-lg font-display font-semibold mb-1">{topic.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{topic.description}</p>
              <div className="flex items-center text-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                {topic.lessons.length} lessons <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
