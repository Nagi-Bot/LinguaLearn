import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import XPProgressRing from '../components/XPProgressRing'
import api from '../lib/api'
import {
  Sparkles, BookOpen, Gamepad2, Brain, Languages, Award,
  ChevronRight, Star, Shield, Zap, Globe, Users, ArrowRight,
  CheckCircle, GraduationCap, Trophy, Clock, BarChart3,
  MessageSquare, Headphones, PenTool, Mic, Volume2, Play,
  Flame, Diamond
} from 'lucide-react'
import SEO from '../components/SEO'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
}

export default function HomePage() {
  const { user } = useApp()
  const [faqOpen, setFaqOpen] = useState(null)
  const [siteStats, setSiteStats] = useState({ users: 0, totalXp: 0, totalGames: 0, lessons: 48, games: 10 })

  useEffect(() => {
    api.get('/learn/stats').then(res => setSiteStats(res.data)).catch(() => {})
  }, [])

  const features = [
    { icon: Brain, title: 'AI Grammar Check', desc: 'Get instant grammar corrections with detailed explanations using advanced AI.', color: 'from-primary-500 to-primary-600' },
    { icon: Languages, title: 'Vocabulary Builder', desc: 'Expand your vocabulary with daily words, synonyms, idioms, and flashcards.', color: 'from-secondary-500 to-secondary-600' },
    { icon: Gamepad2, title: 'Fun Games', desc: 'Learn through exciting games like Grammar Battle, Word Builder, and more.', color: 'from-accent-500 to-accent-600' },
    { icon: Headphones, title: 'Listening Practice', desc: 'Improve listening with audio conversations, podcasts, and dictation exercises.', color: 'from-purple-500 to-purple-600' },
    { icon: Mic, title: 'Speaking & Pronunciation', desc: 'Practice speaking with speech recognition and get instant pronunciation scores.', color: 'from-pink-500 to-pink-600' },
    { icon: PenTool, title: 'Writing Assistant', desc: 'Get AI-powered writing feedback with grammar, spelling, and style suggestions.', color: 'from-cyan-500 to-cyan-600' },
  ]

  const learningPaths = [
    { icon: BookOpen, title: 'Grammar', lessons: '12 Topics', progress: 0, color: 'from-primary-500 to-primary-600', href: '/learn/grammar' },
    { icon: Languages, title: 'Vocabulary', lessons: '500+ Words', progress: 0, color: 'from-secondary-500 to-secondary-600', href: '/learn/vocabulary' },
    { icon: MessageSquare, title: 'Reading', lessons: '50+ Stories', progress: 0, color: 'from-accent-500 to-accent-600', href: '/learn/reading' },
    { icon: PenTool, title: 'Writing', lessons: 'Practice', progress: 0, color: 'from-purple-500 to-purple-600', href: '/learn/writing' },
    { icon: Mic, title: 'Speaking', lessons: 'Interactive', progress: 0, color: 'from-pink-500 to-pink-600', href: '/learn/speaking' },
    { icon: Headphones, title: 'Listening', lessons: 'Audio', progress: 0, color: 'from-cyan-500 to-cyan-600', href: '/learn/listening' },
  ]

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Student', avatar: 'S', text: 'LinguaLearn transformed my English skills! The AI grammar check is incredibly helpful. I improved my score from B1 to C1 in just 3 months.', rating: 5 },
    { name: 'Carlos Mendez', role: 'Professional', avatar: 'C', text: 'The games make learning so much fun. I find myself playing Grammar Battle even during breaks at work. Highly recommended!', rating: 5 },
    { name: 'Yuki Tanaka', role: 'ESL Learner', avatar: 'Y', text: 'The speaking practice with pronunciation scoring helped me reduce my accent significantly. The daily streak keeps me motivated.', rating: 5 },
  ]

  const stats = [
    { icon: Users, value: siteStats.users > 0 ? siteStats.users.toLocaleString() : '0', label: 'Active Learners' },
    { icon: BookOpen, value: siteStats.lessons || 48, label: 'Lessons' },
    { icon: Gamepad2, value: siteStats.games || 10, label: 'Interactive Games' },
    { icon: Zap, value: siteStats.totalXp > 0 ? (siteStats.totalXp / 1000).toFixed(0) + 'K+' : '0', label: 'Total XP Earned' },
  ]

  const faqs = [
    { q: 'How does LinguaLearn work?', a: 'LinguaLearn uses interactive lessons, AI-powered grammar correction, and gamified exercises to help you improve English. Start with a placement test, then follow a personalized learning path.' },
    { q: 'Is LinguaLearn free?', a: 'Yes! We offer a generous free tier with access to basic lessons, daily challenges, and games. Premium unlocks advanced AI features, certificates, and ad-free experience.' },
    { q: 'How does the AI grammar check work?', a: 'Our AI analyzes your writing in real-time, detecting grammar mistakes, spelling errors, and suggesting improvements with detailed explanations for each correction.' },
    { q: 'Can I practice speaking?', a: 'Absolutely! Our speaking module uses speech recognition to evaluate pronunciation, fluency, and accuracy, giving you instant feedback and scores.' },
    { q: 'How long does it take to see results?', a: 'Most users see noticeable improvement within 2-4 weeks of regular practice (15-20 minutes daily). Consistency is key to language learning.' },
  ]

  return (
    <>
      <SEO
        title={null}
        description="Master English grammar, vocabulary, speaking and writing with AI-powered interactive lessons, fun games, and personalized feedback. Start learning for free today."
        keywords="learn english, english grammar, vocabulary builder, english speaking, AI english tutor, free english course, english learning app"
        url="/"
      />
      <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" /> AI-Powered English Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
              Master English with
              <br />
              <span className="gradient-text">Interactive Learning</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Improve your English grammar, vocabulary, speaking, and writing through AI-powered lessons, fun games, and personalized feedback.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg px-8 py-4 group">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/learn/grammar" className="btn-secondary text-lg px-8 py-4">
                Explore Lessons
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-secondary-500" />No credit card</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-secondary-500" />Free forever tier</span>
              <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-secondary-500" />Cancel anytime</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="glass-card max-w-4xl mx-auto p-2">
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
                {user ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <XPProgressRing xp={user.xp || 0} nextLevelXp={((user.level || 1)) * 500} level={user.level || 1} />
                    <div className="text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{user.name}'s Progress</h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                          <Zap className="w-4 h-4 text-primary-500" />
                          <span className="font-semibold text-sm text-primary-700 dark:text-primary-300">{user.xp || 0} XP</span>
                        </div>
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                          <Flame className="w-4 h-4 text-accent-500" />
                          <span className="font-semibold text-sm text-accent-700 dark:text-accent-300">{user.streak || 0} day streak</span>
                        </div>
                        <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <Diamond className="w-4 h-4 text-cyan-500" />
                          <span className="font-semibold text-sm text-purple-700 dark:text-purple-300">{user.diamonds || 0} diamonds</span>
                        </div>
                      </div>
                      <Link href="/dashboard" className="mt-4 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow text-sm">
                        Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 gradient-bg rounded-2xl flex items-center justify-center animate-float">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Start Learning Today</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Track your progress, earn XP, and unlock achievements</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-card text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary-500" />
                <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Everything You Need to <span className="gradient-text">Learn English</span></h2>
            <p className="section-subtitle">AI-powered tools and interactive content designed to make learning English effective and enjoyable.</p>
          </motion.div>
          <motion.div {...stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Why Choose <span className="gradient-text">LinguaLearn</span>?</h2>
            <p className="section-subtitle">Join thousands of learners who transformed their English skills with our platform.</p>
          </motion.div>
          <motion.div {...stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { icon: GraduationCap, title: 'Personalized Learning', desc: 'AI adapts lessons to your level and learning pace for maximum improvement.' },
              { icon: Trophy, title: 'Gamified Experience', desc: 'Earn XP, level up, unlock badges, and compete on the leaderboard to stay motivated.' },
              { icon: Zap, title: 'Real-time Feedback', desc: 'Instant AI corrections and explanations help you learn from mistakes immediately.' },
              { icon: Globe, title: 'Accessible Anywhere', desc: 'Learn on any device, anytime, anywhere. Progress syncs across all your devices.' },
            ].map((benefit, i) => (
              <motion.div key={i} variants={{ initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }} className="glass-card text-center">
                <div className="w-14 h-14 mx-auto mb-4 gradient-bg rounded-xl flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary-50/30 dark:via-primary-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Choose Your <span className="gradient-text">Learning Path</span></h2>
            <p className="section-subtitle">Structured courses designed to take you from beginner to advanced level.</p>
          </motion.div>
          <motion.div {...stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
              >
                <Link href={path.href} className="block glass-card group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                    <path.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-1">{path.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{path.lessons}</p>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${path.color} rounded-full transition-all duration-1000`} style={{ width: `${path.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{path.progress}% complete</span>
                    <span className="text-primary-500 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">What Our <span className="gradient-text">Learners Say</span></h2>
            <p className="section-subtitle">Join thousands of satisfied learners who have improved their English with LinguaLearn.</p>
          </motion.div>
          <motion.div {...stagger} className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 }
                }}
                className="glass-card"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{t.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p className="section-subtitle">Got questions? We've got answers.</p>
          </motion.div>
          <div className="space-y-3 mt-12">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card cursor-pointer"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <ChevronRight className={`w-5 h-5 text-primary-500 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} />
                </div>
                {faqOpen === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 text-gray-600 dark:text-gray-400"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="glass-card text-center p-12 gradient-card border-primary-500/20">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Start Your <span className="gradient-text">English Journey</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Join 50,000+ learners and start improving your English today. It's free!
            </p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 group">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  )
}


