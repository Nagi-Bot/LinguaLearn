import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Linkedin, Quote, Sparkles, Target, Eye, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            About <span className="gradient-text">LinguaLearn</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering millions to master English through AI-powered interactive learning.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8 mb-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            HM
          </div>
          <h2 className="text-2xl font-display font-bold">Hannan Moorad</h2>
          <p className="text-primary-500 font-semibold mb-4">Co-founder & CEO of LinguaLearn</p>
          <div className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-primary-500" /><a href="mailto:hannanmoorad17@gmail.com" className="hover:text-primary-500">hannanmoorad17@gmail.com</a></div>
            <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-primary-500" /><a href="tel:+923152814383" className="hover:text-primary-500">+92 315 2814383</a></div>
            <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-primary-500" /><span>Pakistan, Karachi</span></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To make English learning accessible, fun, and effective for everyone through innovative technology and gamification.' },
            { icon: Eye, title: 'Our Vision', desc: 'A world where language barriers no longer exist, and everyone can communicate confidently in English.' },
            { icon: Heart, title: 'Our Values', desc: 'Innovation, accessibility, user-centric design, and a passion for education drive everything we build.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card text-center">
              <div className="w-12 h-12 mx-auto mb-3 gradient-bg rounded-xl flex items-center justify-center"><item.icon className="w-6 h-6 text-white" /></div>
              <h3 className="font-display font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-8">
          <h2 className="text-2xl font-display font-bold mb-4 text-center">Our Story</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>LinguaLearn was founded by Hannan Moorad with a simple vision: to make English learning accessible, engaging, and effective for everyone. Traditional language learning methods are often boring, expensive, and inflexible.</p>
            <p>We combined the power of artificial intelligence with game design principles to create a platform that feels more like playing than studying. Our AI analyzes your writing, speech, and progress to deliver personalized feedback and recommendations.</p>
            <p>From grammar basics to advanced pronunciation, from vocabulary building to real-world conversation practice — LinguaLearn is your complete English learning companion.</p>
            <p className="font-semibold text-primary-500">Join 50,000+ learners on their journey to English fluency!</p>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/contact" className="btn-primary">Get in Touch</Link>
        </div>
      </div>
    </div>
  )
}
