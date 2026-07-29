import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowUp, Star, Sparkles } from 'lucide-react'

export default function Celebration({ show, xpEarned, oldLevel, newLevel, onClose }) {
  const canvasRef = useRef(null)
  const hasFired = useRef(false)

  useEffect(() => {
    if (!show || hasFired.current) return
    hasFired.current = true

    let animId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 4 + 3,
      speedX: (Math.random() - 0.5) * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        if (p.opacity <= 0) continue
        alive = true
        p.x += p.speedX
        p.y += p.speedY
        p.speedY += 0.08
        p.rotation += p.rotSpeed
        p.opacity -= 0.003
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
      if (alive) animId = requestAnimationFrame(animate)
    }
    animate()

    const timer = setTimeout(() => {
      if (animId) cancelAnimationFrame(animId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 4000)

    return () => {
      if (animId) cancelAnimationFrame(animId)
      clearTimeout(timer)
    }
  }, [show])

  const leveledUp = newLevel > oldLevel

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ width: '100vw', height: '100vh' }}
      />

      <AnimatePresence>
        {show && leveledUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[101] flex items-center justify-center bg-black/40"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Level Up!</h2>
              <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-primary-500 mb-3">
                <span className="text-gray-400">{oldLevel}</span>
                <ArrowUp className="w-6 h-6 text-green-500" />
                <span className="text-green-500">{newLevel}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                You earned <span className="font-bold text-primary-500">{xpEarned} XP</span>
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Keep going!</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {show && !leveledUp && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-[101] bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg text-gray-900 dark:text-white">+{xpEarned} XP</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Great job!</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
            <Star className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </>
  )
}
