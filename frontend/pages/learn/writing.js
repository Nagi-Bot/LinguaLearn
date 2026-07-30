import { useState } from 'react'
export async function getServerSideProps() { return { props: {} } }
import { motion } from 'framer-motion'
import { PenTool, Send, Sparkles, AlertCircle, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import SEO from '../../components/SEO'

const prompts = [
  { title: 'Describe Your Dream Vacation', type: 'Paragraph', prompt: 'Write a paragraph describing your ideal vacation destination. Include details about the location, activities, and why you want to go there.' },
  { title: 'A Letter to Your Future Self', type: 'Email', prompt: 'Write a letter to yourself 10 years from now. What advice would you give? What do you hope you have achieved?' },
  { title: 'The Importance of Education', type: 'Essay', prompt: 'Write a short essay on why education is important. Include at least three main points with examples.' },
  { title: 'A Memorable Experience', type: 'Story', prompt: 'Tell a story about a memorable experience from your life. Describe what happened, how you felt, and what you learned.' },
  { title: 'Technology in Our Lives', type: 'Paragraph', prompt: 'Discuss how technology has changed the way we live and communicate. Mention both positive and negative aspects.' },
  { title: 'A Day in the Life', type: 'Story', prompt: 'Describe a typical day in your life from morning to night. Include details about your routines and activities.' },
]

export default function WritingPage() {
  const { saveLearnProgress, loseHeart, user } = useApp()
  const [activePrompt, setActivePrompt] = useState(null)
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [hearts, setHearts] = useState(user?.hearts ?? 3)
  const [ended, setEnded] = useState(false)

  const analyzeWriting = async () => {
    if (!text.trim()) {
      toast.error('Please write something first!')
      return
    }
    setAnalyzing(true)
    setTimeout(() => {
      const wordCount = text.trim().split(/\s+/).length
      const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
      const avgWordsPerSentence = sentences > 0 ? Math.round(wordCount / sentences) : 0

      const errors = []
      const suggestions = []
      const improvements = []
      const praises = []

      // Basic analysis
      if (wordCount < 30) {
        suggestions.push('Try to write at least 50 words for a more complete response.')
      }
      if (sentences < 3) {
        suggestions.push('Try to use more sentences to develop your ideas.')
      }
      if (avgWordsPerSentence > 25) {
        suggestions.push('Some sentences are quite long. Consider breaking them into shorter sentences.')
      } else if (avgWordsPerSentence < 5 && sentences > 1) {
        suggestions.push('Try combining some short sentences for better flow.')
      }

      // Check for common issues
      if (text.includes('  ')) {
        errors.push({ type: 'Spacing', msg: 'Remove extra spaces between words.' })
      }
      if (text[0] && text[0] === text[0].toLowerCase()) {
        errors.push({ type: 'Capitalization', msg: 'Start your writing with a capital letter.' })
      }
      if (!/[.!?]$/.test(text.trim())) {
        errors.push({ type: 'Punctuation', msg: 'End your writing with proper punctuation.' })
      }

      praises.push('Good effort! You have expressed your ideas clearly.')
      if (wordCount > 50) praises.push('Excellent length! You provided good detail.')
      if (sentences > 3) praises.push('Nice use of multiple sentences to develop your thoughts.')

      setFeedback({
        wordCount, sentences, avgWordsPerSentence,
        errors, suggestions, improvements, praises,
        score: Math.min(100, 60 + (wordCount > 50 ? 10 : 0) + (sentences > 3 ? 10 : 0) + (errors.length === 0 ? 20 : 0))
      })
      const finalScore = Math.min(100, 60 + (wordCount > 50 ? 10 : 0) + (sentences > 3 ? 10 : 0) + (errors.length === 0 ? 20 : 0))
      saveLearnProgress('writing', activePrompt.title, finalScore)
      toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      setAnalyzing(false)
    }, 1500)
  }

  const reset = () => {
    setActivePrompt(null)
    setText('')
    setFeedback(null)
  }

  if (activePrompt) {
    if (ended) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/store" className="btn-primary">Visit Store</Link>
                <button onClick={() => { reset(); setEnded(false); setHearts(3) }} className="btn-secondary">Back to Prompts</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={reset} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Prompts
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <PenTool className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-primary-500 font-medium">{activePrompt.type}</span>
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">{activePrompt.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{activePrompt.prompt}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing here..."
              rows={10}
              className="input-field resize-none mb-4 text-base"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{text.trim().split(/\s+/).filter(w => w).length} words</span>
                <span className="text-sm font-semibold">❤️ {hearts}/3</span>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setText('')} className="btn-secondary"><RotateCcw className="w-4 h-4 mr-2 inline" /> Clear</button>
                <button onClick={analyzeWriting} disabled={analyzing} className="btn-primary">
                  {analyzing ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2 inline" /> Analyze Writing</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {feedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary-500" /> AI Feedback
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">{feedback.score}/100</div>
                  <span className="text-xs text-gray-500">Writing Score</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <div className="font-bold">{feedback.wordCount}</div>
                  <div className="text-xs text-gray-500">Words</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <div className="font-bold">{feedback.sentences}</div>
                  <div className="text-xs text-gray-500">Sentences</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <div className="font-bold">{feedback.avgWordsPerSentence}</div>
                  <div className="text-xs text-gray-500">Avg W/S</div>
                </div>
              </div>

              {feedback.praises.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-secondary-600 dark:text-secondary-400 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Strengths
                  </h4>
                  {feedback.praises.map((p, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-400 ml-5 mb-1">• {p}</p>
                  ))}
                </div>
              )}

              {feedback.errors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-500 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Corrections
                  </h4>
                  {feedback.errors.map((e, i) => (
                    <div key={i} className="flex items-start space-x-2 mb-2 text-sm">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 whitespace-nowrap">{e.type}</span>
                      <span className="text-gray-600 dark:text-gray-400">{e.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {feedback.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-primary-600 dark:text-primary-400 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" /> Suggestions
                  </h4>
                  {feedback.suggestions.map((s, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-400 ml-5 mb-1">• {s}</p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Writing Practice" description="Practice English writing with AI-powered feedback on essays, paragraphs, emails, and creative writing exercises." keywords="english writing, writing practice, essay writing, AI writing feedback" url="/learn/writing" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Writing <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your writing with AI-powered feedback on grammar, style, and vocabulary.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {prompts.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setActivePrompt(p)}
              className="glass-card cursor-pointer"
            >
              <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-3">{p.type}</span>
              <h3 className="text-lg font-display font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{p.prompt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
