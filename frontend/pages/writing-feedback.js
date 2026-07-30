import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
  RotateCcw,
  BookOpen,
  PenTool,
  Mail,
  Briefcase,
  Lightbulb,
} from 'lucide-react'
import toast from 'react-hot-toast'
import SEO from '../components/SEO'
import RequireAuth from '../components/RequireAuth'
import api from '../lib/api'

const WRITING_TYPES = [
  { value: 'essay', label: 'Essay', icon: BookOpen },
  { value: 'paragraph', label: 'Paragraph', icon: FileText },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'creative', label: 'Creative Writing', icon: PenTool },
  { value: 'business', label: 'Business Letter', icon: Briefcase },
]

const SAMPLE_TEXT = `Technology has fundamentally transformed the way we live, work, and communicate. From the moment we wake up to the sound of our smartphone alarms to the instant we check our social media feeds before bed, technology permeates every aspect of our daily lives.

In the education sector, digital tools have revolutionized traditional teaching methods. Students can now access vast libraries of information with just a few clicks, collaborate with peers across the globe through video conferencing, and receive personalized learning experiences powered by artificial intelligence.

However, this rapid technological advancement also brings significant challenges. Privacy concerns, digital addiction, and the widening digital divide between those with and without access to technology are issues that society must address. We need to strike a balance between embracing innovation and protecting our fundamental rights and well-being.

In conclusion, while technology offers tremendous benefits, it is our responsibility to use it wisely and ensure that its advantages are accessible to all members of society.`

function renderMarkdown(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let inList = false
  let listItems = []

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm">$1</code>')
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim()

    if (trimmed === '') {
      flushList()
      return
    }

    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h4 key={i} className="text-base font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(4)) }} />
      )
    } else if (trimmed.startsWith('## ')) {
      flushList()
      elements.push(
        <h3 key={i} className="text-lg font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(3)) }} />
      )
    } else if (trimmed.startsWith('# ')) {
      flushList()
      elements.push(
        <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true
      listItems.push(trimmed.slice(2))
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushList()
      const content = trimmed.replace(/^\d+\.\s/, '')
      elements.push(
        <div key={i} className="flex items-start space-x-2 mb-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
            {trimmed.match(/^(\d+)/)[1]}
          </span>
          <span className="text-gray-700 dark:text-gray-300 pt-0.5" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
        </div>
      )
    } else if (trimmed.startsWith('---')) {
      flushList()
      elements.push(<hr key={i} className="my-4 border-gray-200 dark:border-gray-700" />)
    } else {
      flushList()
      elements.push(
        <p key={i} className="mb-2 text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      )
    }
  })

  flushList()
  return elements
}

function ScoreBadge({ label, score, maxScore = 10, color }) {
  const percentage = (score / maxScore) * 100
  let barColor = 'bg-red-500'
  if (percentage >= 80) barColor = 'bg-green-500'
  else if (percentage >= 60) barColor = 'bg-yellow-500'
  else if (percentage >= 40) barColor = 'bg-orange-500'

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-28">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color || barColor}`}
        />
      </div>
      <span className="text-sm font-bold text-gray-800 dark:text-white w-12 text-right">{score}/{maxScore}</span>
    </div>
  )
}

export default function WritingFeedbackPage() {
  const [text, setText] = useState('')
  const [writingType, setWritingType] = useState('essay')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze.')
      return
    }
    if (text.trim().length < 20) {
      toast.error('Please enter at least 20 characters for meaningful feedback.')
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const res = await api.post('/ai/writing-feedback', {
        text: text.trim(),
        type: writingType,
      })
      setFeedback(res.data.feedback || res.data)
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze writing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setFeedback(null)
    setWritingType('essay')
  }

  const handleSample = () => {
    setText(SAMPLE_TEXT)
    setWritingType('essay')
    toast.success('Sample essay loaded!')
  }

  return (
    <RequireAuth>
      <SEO
        title="AI Writing Feedback"
        description="Get instant AI-powered feedback on your English writing. Grammar corrections, style suggestions, and scoring."
        keywords="writing feedback, grammar check, AI writing, english correction"
        url="/writing-feedback"
      />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">AI Writing</span> Feedback
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Paste your writing and get instant AI-powered corrections, scores, and suggestions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-display font-semibold flex items-center">
                    <PenTool className="w-5 h-5 mr-2 text-primary-500" />
                    Your Writing
                  </h2>
                  <button
                    onClick={handleSample}
                    className="text-sm text-primary-500 hover:text-primary-600 flex items-center space-x-1 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load Sample</span>
                  </button>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your essay, paragraph, email, or any English text here for AI-powered feedback..."
                  rows={14}
                  className="input-field resize-none w-full text-sm leading-relaxed"
                />

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>{charCount.toLocaleString()} characters</span>
                    <span>{wordCount.toLocaleString()} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`font-medium ${text.trim().length < 20 && text.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {text.trim().length < 20 && text.length > 0 ? 'Min 20 characters' : 'Ready'}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium mb-2">Writing Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {WRITING_TYPES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setWritingType(value)}
                        className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          writingType === value
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Analyzing...' : 'Analyze Writing'}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-6 sticky top-8">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent-500" />
                  AI Feedback
                </h2>

                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16"
                    >
                      <div className="relative mb-4">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        <Sparkles className="w-5 h-5 text-accent-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        AI is analyzing your writing...
                      </p>
                    </motion.div>
                  ) : feedback ? (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {feedback.overallScore !== undefined && (
                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl p-4 text-center">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Overall Score</p>
                          <div className="flex items-center justify-center space-x-2">
                            <Star className="w-7 h-7 text-accent-500" />
                            <span className="text-4xl font-display font-bold gradient-text">
                              {feedback.overallScore}
                            </span>
                            <span className="text-lg text-gray-400">/10</span>
                          </div>
                        </div>
                      )}

                      {feedback.scores && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Score Breakdown</h3>
                          {Object.entries(feedback.scores).map(([key, value]) => (
                            <ScoreBadge
                              key={key}
                              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                              score={typeof value === 'number' ? value : parseInt(value) || 0}
                            />
                          ))}
                        </div>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {renderMarkdown(
                            typeof feedback === 'string'
                              ? feedback
                              : typeof feedback.content === 'string'
                              ? feedback.content
                              : typeof feedback.feedback === 'string'
                              ? feedback.feedback
                              : JSON.stringify(feedback, null, 2)
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Lightbulb className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                        Enter your writing on the left and click <strong>Analyze Writing</strong> to get AI-powered feedback.
                      </p>
                      <div className="mt-6 space-y-2 text-xs text-gray-400 dark:text-gray-500">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span>Grammar & spelling corrections</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span>Style & clarity suggestions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span>Overall scoring & improvement tips</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
