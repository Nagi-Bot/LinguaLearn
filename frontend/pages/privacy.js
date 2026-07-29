import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center"><Shield className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Privacy</span> Policy
          </h1>
          <p className="text-gray-500">Last updated: July 2026</p>
        </motion.div>

        <div className="space-y-6">
          {[
            { icon: FileText, title: 'Information We Collect', content: 'We collect information you provide when creating an account, including your name, email address, and learning progress data. We also collect usage data to improve our platform.' },
            { icon: Lock, title: 'How We Use Your Information', content: 'Your information is used to personalize your learning experience, track your progress, send notifications, and improve our services. We never sell your personal data to third parties.' },
            { icon: Eye, title: 'Data Protection', content: 'We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest. We use secure servers and regularly audit our security practices.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"><item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 mt-6">
          <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
          <p className="text-gray-600 dark:text-gray-400">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hannanmoorad17@gmail.com" className="text-primary-500 hover:underline">hannanmoorad17@gmail.com</a></p>
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
