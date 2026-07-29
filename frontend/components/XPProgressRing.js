import { motion } from 'framer-motion'

export default function XPProgressRing({ xp, nextLevelXp, level }) {
  const percent = Math.min(100, (xp / Math.max(1, nextLevelXp)) * 100)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160" className="-rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-700" />
        <motion.circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="url(#xpGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{level}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
      </div>
    </div>
  )
}
