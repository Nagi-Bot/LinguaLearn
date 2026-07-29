import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Contact</span> Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-8 mb-6">
              <h2 className="text-xl font-display font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hannanmoorad17@gmail.com', href: 'mailto:hannanmoorad17@gmail.com' },
                  { icon: Phone, label: 'Phone', value: '+92 315 2814383', href: 'tel:+923152814383' },
                  { icon: MapPin, label: 'Address', value: 'Pakistan, Karachi' },
                  { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      {item.href ? <a href={item.href} className="font-medium hover:text-primary-500">{item.value}</a> : <p className="font-medium">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass-card p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center"><CheckCircle className="w-8 h-8 text-white" /></div>
                  <h3 className="text-xl font-display font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-display font-semibold mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Full Name</label>
                      <input type="text" required className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email</label>
                      <input type="email" required className="input-field" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Subject</label>
                      <input type="text" required className="input-field" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Message</label>
                      <textarea rows={5} required className="input-field resize-none" placeholder="Your message..." />
                    </div>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center"><Send className="w-4 h-4 mr-2" /> Send Message</button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
