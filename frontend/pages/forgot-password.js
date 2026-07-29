import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Sparkles, ArrowLeft, Send } from 'lucide-react'
import api from '../lib/api'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', data)
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold gradient-text">LinguaLearn</span>
            </Link>
            {sent ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 gradient-bg rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold">Check Your Email</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">We've sent a password reset link to your email address.</p>
                <Link href="/login" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium mt-4 hover:underline">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-display font-bold">Forgot Password?</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Enter your email to receive a reset link</p>
              </>
            )}
          </div>

          {!sent && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    type="email"
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Send Reset Link</>
                )}
              </button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
