import { motion } from 'framer-motion'
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center"><Scale className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-gray-500">Last updated: July 2026</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-primary-500" /> Acceptance of Terms</h3>
            <p className="text-gray-600 dark:text-gray-400">By accessing or using LinguaLearn, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-3 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-primary-500" /> User Responsibilities</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc list-inside">
              <li>Provide accurate information when creating an account</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the platform for lawful purposes only</li>
              <li>Not engage in any activity that disrupts the platform</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-3 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-primary-500" /> Intellectual Property</h3>
            <p className="text-gray-600 dark:text-gray-400">All content, features, and functionality on LinguaLearn are owned by LinguaLearn and protected by international copyright, trademark, and other intellectual property laws.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-3 flex items-center"><Scale className="w-5 h-5 mr-2 text-primary-500" /> Limitation of Liability</h3>
            <p className="text-gray-600 dark:text-gray-400">LinguaLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 mt-6">
          <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
          <p className="text-gray-600 dark:text-gray-400">For questions about these terms, contact us at <a href="mailto:hannanmoorad17@gmail.com" className="text-primary-500 hover:underline">hannanmoorad17@gmail.com</a></p>
        </motion.div>

        <div className="text-center mt-8">
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
