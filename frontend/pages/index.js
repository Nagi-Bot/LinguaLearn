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
  Play, Flame, Diamond, Zap, Users, Globe, Shield,
} from 'lucide-react'
import SEO from '../components/SEO'

export default function HomePage() {
  const { user } = useApp()
  const [faqOpen, setFaqOpen] = useState(null)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [siteStats, setSiteStats] = useState({ users: 0, totalXp: 0, totalGames: 0, lessons: 48, games: 10 })
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])

  useEffect(() => {
    api.get('/learn/stats').then(res => setSiteStats(res.data)).catch(() => {})
    const interval = setInterval(() => setTestimonialIdx(i => (i + 1) % 3), 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Brain, title: 'AI English Tutor', desc: 'Chat with AI tutor for instant grammar help, vocabulary lessons, and writing corrections.', color: 'from-violet-500 to-purple-600' },
    { icon: Languages, title: 'Vocabulary Builder', desc: 'Expand your vocabulary with daily words, synonyms, idioms, and flashcards.', color: 'from-blue-500 to-cyan-600' },
    { icon: Gamepad2, title: 'Fun Games', desc: 'Learn through 10+ exciting games like Grammar Battle, Daily Challenge, and more.', color: 'from-emerald-500 to-teal-600' },
    { icon: Headphones, title: 'Listening Practice', desc: 'Improve listening with audio conversations, podcasts, and dictation exercises.', color: 'from-amber-500 to-orange-600' },
    { icon: Mic, title: 'Speaking & Pronunciation', desc: 'Practice speaking with speech recognition and get instant pronunciation scores.', color: 'from-pink-500 to-rose-600' },
    { icon: PenTool, title: 'AI Writing Feedback', desc: 'Paste your writing and get instant AI-powered corrections, scores, and style suggestions.', color: 'from-sky-500 to-indigo-600' },
  ]

  const learningPaths = [
    { icon: BookOpen, title: 'Grammar', lessons: '12 Topics', color: 'from-violet-500 to-purple-600', href: '/learn/grammar' },
    { icon: Languages, title: 'Vocabulary', lessons: '500+ Words', color: 'from-blue-500 to-cyan-600', href: '/learn/vocabulary' },
    { icon: MessageSquare, title: 'Reading', lessons: '50+ Stories', color: 'from-emerald-500 to-teal-600', href: '/learn/reading' },
    { icon: PenTool, title: 'Writing', lessons: 'Practice', color: 'from-amber-500 to-orange-600', href: '/learn/writing' },
    { icon: Mic, title: 'Speaking', lessons: 'Interactive', color: 'from-pink-500 to-rose-600', href: '/learn/speaking' },
    { icon: Headphones, title: 'Listening', lessons: 'Audio', color: 'from-sky-500 to-indigo-600', href: '/learn/listening' },
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Student', avatar: 'S', text: 'LinguaLearn transformed my English skills! The AI grammar check is incredibly helpful. I improved from B1 to C1 in just 3 months.', rating: 5 },
    { name: 'Carlos Mendez', role: 'Professional', avatar: 'C', text: 'The games make learning so much fun. I find myself playing Grammar Battle even during breaks at work. Highly recommended!', rating: 5 },
    { name: 'Yuki Tanaka', role: 'ESL Learner', avatar: 'Y', text: 'The speaking practice with pronunciation scoring helped me reduce my accent significantly. The daily streak keeps me motivated.', rating: 5 },
  ]

  const AnimatedCounter = ({ value, label, icon: Icon, color }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const end = typeof value === 'number' ? value : parseInt(value) || 0
          if (end === 0) return
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
    return (
      <motion.div ref={ref} whileHover={{ y: -5 }} className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-100 dark:border-gray-700/50">
        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{count.toLocaleString()}</div>
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

          <motion.div style={{ y: heroY }} className="relative max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-6 border border-violet-200 dark:border-violet-700/50"
              >
                <Sparkles className="w-4 h-4 mr-2" /> AI-Powered English Learning
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
                Master English with
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Interactive Learning</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Improve your English grammar, vocabulary, speaking, and writing through AI-powered lessons, fun games, and personalized feedback.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={user ? '/dashboard' : '/register'} className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300">
                  {user ? 'Go to Dashboard' : 'Start Learning Free'}
                  <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/learn/grammar" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 shadow-sm hover:shadow-md transition-all">
                  Explore Lessons
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />No credit card</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />Free forever tier</span>
                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-500" />Cancel anytime</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter icon={Users} value={siteStats.users} label="Active Learners" color="from-violet-500 to-purple-600" />
            <AnimatedCounter icon={BookOpen} value={siteStats.lessons || 48} label="Lessons" color="from-blue-500 to-cyan-600" />
            <AnimatedCounter icon={Gamepad2} value={siteStats.games || 10} label="Interactive Games" color="from-emerald-500 to-teal-600" />
            <AnimatedCounter icon={Award} value={siteStats.totalXp > 0 ? parseInt((siteStats.totalXp / 1000).toFixed(0)) : 0} label="Total XP Earned (K)" color="from-amber-500 to-orange-600" />
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
              <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">Join 50,000+ learners and start improving your English today. It's free!</p>
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