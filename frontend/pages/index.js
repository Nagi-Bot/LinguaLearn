import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useApp } from '../context/AppContext'
import XPProgressRing from '../components/XPProgressRing'
import api from '../lib/api'
import {
  Sparkles, BookOpen, Gamepad2, Brain, Languages, Award,
  ChevronRight, Star, ArrowRight, CheckCircle, GraduationCap,
  Trophy, Clock, MessageSquare, Headphones, PenTool, Mic,
  Play, Flame, Diamond, Zap, Users, Globe, Shield, Medal, ClipboardCheck,
} from 'lucide-react'
import SEO from '../components/SEO'

export default function HomePage() {
  const { user } = useApp()
  const [faqOpen, setFaqOpen] = useState(null)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [topLearners, setTopLearners] = useState([])
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])

  useEffect(() => {
    api.get('/leaderboard').then(res => setTopLearners((res.data || []).slice(0, 3))).catch(() => {})
    const interval = setInterval(() => setTestimonialIdx(i => (i + 1) % 3), 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Brain, title: 'AI English Tutor', desc: 'Chat with AI tutor for instant grammar help, vocabulary lessons, and writing corrections.', color: 'from-violet-500 to-purple-600' },
    { icon: Languages, title: 'Vocabulary Builder', desc: 'Expand your vocabulary with daily words, synonyms, idioms, and flashcards.', color: 'from-blue-500 to-cyan-600' },
    { icon: Gamepad2, title: 'Fun Games', desc: 'Learn through 11 exciting games like Grammar Battle, Daily Challenge, and more.', color: 'from-emerald-500 to-teal-600' },
    { icon: Headphones, title: 'Listening Practice', desc: 'Improve listening with audio conversations, podcasts, and dictation exercises.', color: 'from-amber-500 to-orange-600' },
    { icon: Mic, title: 'Speaking & Pronunciation', desc: 'Practice speaking with speech recognition and get instant pronunciation scores.', color: 'from-pink-500 to-rose-600' },
    { icon: PenTool, title: 'AI Writing Feedback', desc: 'Paste your writing and get instant AI-powered corrections, scores, and style suggestions.', color: 'from-sky-500 to-indigo-600' },
  ]

  const learningPaths = [
    { icon: BookOpen, title: 'Grammar', lessons: '10 Topics', color: 'from-violet-500 to-purple-600', href: '/learn/grammar' },
    { icon: Languages, title: 'Vocabulary', lessons: '250+ Words', color: 'from-blue-500 to-cyan-600', href: '/learn/vocabulary' },
    { icon: MessageSquare, title: 'Reading', lessons: '20 Stories', color: 'from-emerald-500 to-teal-600', href: '/learn/reading' },
    { icon: PenTool, title: 'Writing', lessons: '22 Prompts', color: 'from-amber-500 to-orange-600', href: '/learn/writing' },
    { icon: Mic, title: 'Speaking', lessons: '400+ Sentences', color: 'from-pink-500 to-rose-600', href: '/learn/speaking' },
    { icon: Headphones, title: 'Listening', lessons: '12 Tracks', color: 'from-sky-500 to-indigo-600', href: '/learn/listening' },
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Student', avatar: 'S', text: 'LinguaLearn transformed my English skills! The AI grammar check is incredibly helpful. I improved from B1 to C1 in just 3 months.', rating: 5 },
    { name: 'Carlos Mendez', role: 'Professional', avatar: 'C', text: 'The games make learning so much fun. I find myself playing Grammar Battle even during breaks at work. Highly recommended!', rating: 5 },
    { name: 'Yuki Tanaka', role: 'ESL Learner', avatar: 'Y', text: 'The speaking practice with pronunciation scoring helped me reduce my accent significantly. The daily streak keeps me motivated.', rating: 5 },
  ]

  const AnimatedCounter = ({ value, label, icon: Icon, color, format }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const end = typeof value === 'number' ? value : parseInt(value) || 0
          if (end === 0) { setCount(0); return }
          const duration = 1500
          const step = Math.max(1, Math.floor(end / 60))
          const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) } else setCount(start)
          }, duration / (end / step))
          observer.disconnect()
        }
      }, { threshold: 0.3 })
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }, [value])
    const display = format ? format(count) : count.toLocaleString()
    return (
      <motion.div ref={ref} whileHover={{ y: -5 }} className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{display}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      </motion.div>
    )
  }

  return (
    <>
      <SEO
        title={null}
        description="Master English grammar, vocabulary, speaking and writing with AI-powered interactive lessons, fun games, and personalized feedback. Start learning for free today."
        keywords="learn english, english grammar, vocabulary builder, english speaking, AI english tutor, free english course, english learning app"
        url="/"
      />
      <div className="overflow-hidden">
        {/* Hero */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-violet-400/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>

          <motion.div style={{ y: heroY }} className="relative max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center lg:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6 border border-violet-200 dark:border-violet-700/50"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> AI-Powered English Learning
                </motion.div>

                <h1 className="text-5xl md:text-6xl xl:text-7xl font-display font-extrabold mb-6 leading-tight">
                  Master English with
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Interactive Learning</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-8">
                  Improve your English grammar, vocabulary, speaking, and writing through AI-powered lessons, fun games, and personalized feedback.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href={user ? '/dashboard' : '/register'} className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300">
                    {user ? 'Go to Dashboard' : 'Start Learning Free'}
                    <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/learn/grammar" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-md transition-all">
                    Explore Lessons
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />No credit card</span>
                  <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />Free forever tier</span>
                  <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />Cancel anytime</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative mx-auto w-full max-w-[340px]">
                <div className="absolute -inset-12 bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-pink-500/30 blur-3xl" />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative bg-gray-900 dark:bg-gray-950 rounded-[2.5rem] p-3 shadow-2xl border border-gray-700/60"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
                    <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <img src="/logo.svg" alt="LinguaLearn" className="w-7 h-7 rounded-lg" />
                        <span className="text-sm font-bold">LinguaLearn</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">7</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                          <Zap className="w-3.5 h-3.5 text-violet-500" />
                          <span className="text-xs font-bold text-violet-700 dark:text-violet-300">1,250</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center py-5">
                      <XPProgressRing xp={1250} nextLevelXp={2000} level={4} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Daily Goal</p>
                      <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1.5, delay: 0.8 }} className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
                      </div>
                    </div>
                    <div className="px-5 pb-5 space-y-3">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold flex items-center"><BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-500" />Vocabulary</span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">68%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.2, delay: 1 }} className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold flex items-center"><Brain className="w-3.5 h-3.5 mr-1.5 text-violet-500" />Grammar</span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">45%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.2, delay: 1.2 }} className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 border border-violet-100 dark:border-violet-800/40">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                          <Gamepad2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold">Grammar Battle</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Score 820 - New High!</p>
                        </div>
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-5 -right-3 sm:-right-8 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-xl border border-gray-100 dark:border-gray-700 z-10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">+50 XP Earned</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Daily Challenge</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-3 sm:-left-8 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 shadow-xl border border-gray-100 dark:border-gray-700 z-10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">7-Day Streak</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Keep it going!</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16"
            >
              <div className="max-w-4xl mx-auto p-1 rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500">
                <div className="rounded-2xl bg-white dark:bg-gray-900 p-8">
                  {user ? (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      <XPProgressRing xp={user.xp || 0} nextLevelXp={((user.level || 1)) * 500} level={user.level || 1} />
                      <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">{user.name}'s Progress</h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                            <Zap className="w-4 h-4 text-violet-500" />
                            <span className="font-semibold text-sm text-violet-700 dark:text-violet-300">{user.xp || 0} XP</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Flame className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-sm text-amber-700 dark:text-amber-300">{user.streak || 0} day streak</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                            <Diamond className="w-4 h-4 text-cyan-500" />
                            <span className="font-semibold text-sm text-cyan-700 dark:text-cyan-300">{user.diamonds || 0} diamonds</span>
                          </div>
                        </div>
                        <Link href="/dashboard" className="mt-4 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-sm">
                          Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                      >
                        <Play className="w-10 h-10 text-white ml-1" />
                      </motion.div>
                      <p className="text-lg font-semibold mb-1">Start Learning Today</p>
                      <p className="text-sm text-gray-500">Track your progress, earn XP, and unlock achievements</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatedCounter icon={Languages} value={250} label="Vocabulary Words" color="from-blue-500 to-cyan-600" format={(n) => n + '+'} />
              <AnimatedCounter icon={BookOpen} value={20} label="Reading Stories" color="from-emerald-500 to-teal-600" />
              <AnimatedCounter icon={Gamepad2} value={11} label="Interactive Games" color="from-violet-500 to-purple-600" />
              <AnimatedCounter icon={Mic} value={400} label="Speaking Sentences" color="from-pink-500 to-rose-600" format={(n) => n + '+'} />
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-violet-500" /> All this content is completely free — no credit card required, ever.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">Everything You Need to <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Learn English</span></h2>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">AI-powered tools and interactive content designed to make learning English effective and enjoyable.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <f.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">Start in <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">3 Easy Steps</span></h2>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From complete beginner to confident speaker — here's how your journey works.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: ClipboardCheck, step: '01', title: 'Take the Placement Test', desc: 'Answer a few smart questions and find out your exact English level in under 5 minutes.', href: '/placement-test', color: 'from-violet-500 to-purple-600' },
                { icon: Brain, step: '02', title: 'Learn with AI & Games', desc: 'Practice grammar, vocabulary, speaking and writing through AI-powered lessons and 11 fun games.', href: '/learn/grammar', color: 'from-blue-500 to-cyan-600' },
                { icon: Trophy, step: '03', title: 'Track Your Progress', desc: 'Earn XP, build daily streaks, climb the leaderboard and watch your level grow every day.', href: '/dashboard', color: 'from-emerald-500 to-teal-600' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={s.href} className="block relative h-full p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <span className="absolute top-6 right-6 text-4xl font-display font-extrabold text-gray-100 dark:text-gray-700/70 group-hover:text-violet-100 dark:group-hover:text-violet-900/40 transition-colors">{s.step}</span>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <s.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">{s.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    <div className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 mt-4 group-hover:translate-x-1 transition-transform">
                      Get Started <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-violet-50/30 dark:via-violet-900/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">Choose Your <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Learning Path</span></h2>
              <p className="text-center text-gray-600 dark:text-gray-400">Structured courses designed to take you from beginner to advanced level.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {learningPaths.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={p.href} className="block p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{p.lessons}</p>
                    <div className="flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                      Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">Top <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Learners</span></h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Compete with learners worldwide — every game, lesson and streak earns you XP.</p>
            </motion.div>
            {topLearners.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
                {topLearners.map((l, i) => (
                  <motion.div
                    key={l._id || i}
                    whileHover={{ y: -5 }}
                    className={`relative p-6 rounded-2xl text-center border shadow-sm ${
                      i === 0
                        ? 'bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800 border-amber-200 dark:border-amber-700/50 shadow-amber-100 dark:shadow-none'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50'
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-lg ${i === 0 ? 'from-amber-400 to-orange-500' : i === 1 ? 'from-gray-300 to-gray-500' : 'from-orange-300 to-orange-500'}`}>
                      {i === 0 ? <Trophy className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                    </div>
                    <h3 className="font-bold mb-1 truncate">{l.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Level {l.level || 1}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                      <Zap className="w-4 h-4 text-violet-500" />
                      <span className="font-semibold text-sm text-violet-700 dark:text-violet-300">{l.xp || 0} XP</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-10 rounded-2xl bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold mb-2">Be the First on the Leaderboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start learning today and claim the #1 spot!</p>
                <Link href="/register" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
                  Start Learning Free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            )}
            <div className="text-center mt-8">
              <Link href="/leaderboard" className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                View Full Leaderboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">What Our <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Learners Say</span></h2>
              <p className="text-gray-600 dark:text-gray-400 mb-12">Join thousands of satisfied learners who improved their English.</p>
            </motion.div>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="p-8 md:p-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">"{testimonials[testimonialIdx].text}"</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">{testimonials[testimonialIdx].avatar}</div>
                    <div className="text-left">
                      <p className="font-semibold">{testimonials[testimonialIdx].name}</p>
                      <p className="text-sm text-gray-500">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === testimonialIdx ? 'bg-violet-500 w-6' : 'bg-gray-300 dark:bg-gray-600'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">Frequently Asked <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Questions</span></h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Got questions? We've got answers.</p>
            </motion.div>
            <div className="space-y-3">
              {[
                { q: 'How does LinguaLearn work?', a: 'LinguaLearn uses interactive lessons, AI-powered grammar correction, and gamified exercises to help you improve English. Start with a placement test, then follow a personalized learning path.' },
                { q: 'Is LinguaLearn free?', a: 'Yes! We offer a generous free tier with access to basic lessons, daily challenges, and games. Premium unlocks advanced AI features, certificates, and ad-free experience.' },
                { q: 'How does the AI grammar check work?', a: 'Our AI analyzes your writing in real-time, detecting grammar mistakes, spelling errors, and suggesting improvements with detailed explanations for each correction.' },
                { q: 'Can I practice speaking?', a: 'Absolutely! Our speaking module uses speech recognition to evaluate pronunciation, fluency, and accuracy, giving you instant feedback and scores.' },
                { q: 'How long does it take to see results?', a: 'Most users see noticeable improvement within 2-4 weeks of regular practice (15-20 minutes daily). Consistency is key to language learning.' },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm md:text-base">{faq.q}</h3>
                    <ChevronRight className={`w-5 h-5 text-violet-500 transition-transform duration-300 shrink-0 ${faqOpen === i ? 'rotate-90' : ''}`} />
                  </div>
                  {faqOpen === i && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Start Your English Journey?</h2>
              <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">Join our learners community and start improving your English today. It's free!</p>
              <Link href={user ? '/dashboard' : '/register'} className="inline-flex items-center px-10 py-4 bg-white text-violet-700 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  )
}