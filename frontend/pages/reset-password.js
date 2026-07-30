import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock, Sparkles, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import api from '../lib/api'
import Cookies from 'js-cookie'
import SEO from '../components/SEO'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()
  const { token } = router.query

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', { token, password: data.password })
      Cookies.set('token', res.data.token, { expires: 30 })
      localStorage.setItem('lingua_user', JSON.stringify(res.data.user))
      setSuccess(true)
      toast.success('Password reset successful!')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Reset Password"
        description="Set a new password for your LinguaLearn account."
        keywords="reset password, new password"
        url="/reset-password"
        noIndex={true}
      />
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
            {success ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold">Password Reset!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Redirecting to dashboard...</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-display font-bold">Reset Password</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Enter your new password</p>
              </>
            )}
          </div>

          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading || !token} className="btn-primary w-full flex items-center justify-center">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : 'Reset Password'}
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
    </>
  )
}
