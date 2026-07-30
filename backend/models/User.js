const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  diamonds: { type: Number, default: 100 },
  hearts: { type: Number, default: 3 },
  maxHearts: { type: Number, default: 3 },
  heartRefillAt: { type: Date, default: null },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now },
  lastLoginDate: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  gamesPlayed: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  wordsLearned: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  totalGameScore: { type: Number, default: 0 },
  weeklyActivity: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
  completedCourses: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  gameScores: { type: Map, of: Number, default: {} },
  gameHistory: [{
    game: String,
    score: Number,
    xpEarned: Number,
    date: { type: Date, default: Date.now }
  }],
  learnProgress: {
    grammar: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 } },
    vocabulary: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 }, wordsLearned: [String] },
    reading: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 } },
    writing: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 } },
    speaking: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 } },
    listening: { completed: [String], score: { type: Number, default: 0 }, totalXp: { type: Number, default: 0 } },
  },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000
  return token
}

userSchema.methods.updateStreak = function () {
  const today = new Date().toISOString().split('T')[0]
  if (this.lastLoginDate === today) return false
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (this.lastLoginDate === yesterday) {
    this.streak = (this.streak || 0) + 1
  } else if (this.lastLoginDate !== today) {
    this.streak = 1
  }
  this.lastLoginDate = today
  if (this.streak > (this.bestStreak || 0)) this.bestStreak = this.streak
  return true
}

userSchema.methods.addXp = function (amount) {
  const oldLevel = Math.floor((this.xp || 0) / 500) + 1
  this.xp = (this.xp || 0) + amount
  const newLevel = Math.floor(this.xp / 500) + 1
  const levelUp = newLevel > oldLevel
  this.level = newLevel
  if (levelUp) {
    this.diamonds = (this.diamonds || 0) + 30
    this.hearts = Math.min((this.hearts || 0) + 1, this.maxHearts || 3)
  }
  this.lastActive = new Date()
  return { levelUp, oldLevel, newLevel, diamonds: this.diamonds, hearts: this.hearts }
}

userSchema.methods.refillHearts = function () {
  const now = new Date()
  if (this.heartRefillAt && now >= this.heartRefillAt) {
    this.hearts = this.maxHearts || 3
    this.heartRefillAt = null
    return true
  }
  return false
}

userSchema.methods.loseHeart = function () {
  if (this.hearts > 0) {
    this.hearts -= 1
    if (this.hearts === 0) {
      this.heartRefillAt = new Date(Date.now() + 30 * 60 * 1000)
    }
    return true
  }
  return false
}

userSchema.methods.checkBadges = function () {
  const earned = []
  if ((this.lessonsCompleted || 0) >= 5 && !this.badges.includes('quick_learner')) { this.badges.push('quick_learner'); earned.push('quick_learner') }
  if ((this.streak || 0) >= 7 && !this.badges.includes('streak_master')) { this.badges.push('streak_master'); earned.push('streak_master') }
  if ((this.gamesPlayed || 0) >= 10 && !this.badges.includes('game_champion')) { this.badges.push('game_champion'); earned.push('game_champion') }
  if ((this.wordsLearned || 0) >= 50 && !this.badges.includes('vocab_star')) { this.badges.push('vocab_star'); earned.push('vocab_star') }
  if ((this.quizzesTaken || 0) >= 10 && !this.badges.includes('quiz_master')) { this.badges.push('quiz_master'); earned.push('quiz_master') }
  if ((this.streak || 0) >= 30 && !this.badges.includes('dedicated')) { this.badges.push('dedicated'); earned.push('dedicated') }
  if ((this.totalGameScore || 0) >= 1000 && !this.badges.includes('high_scorer')) { this.badges.push('high_scorer'); earned.push('high_scorer') }
  if ((this.gamesPlayed || 0) >= 50 && !this.badges.includes('gaming_legend')) { this.badges.push('gaming_legend'); earned.push('gaming_legend') }
  return earned
}

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    xp: this.xp,
    level: this.level,
    streak: this.streak,
    bestStreak: this.bestStreak,
    diamonds: this.diamonds,
    hearts: this.hearts,
    maxHearts: this.maxHearts,
    heartRefillAt: this.heartRefillAt,
    avatar: this.avatar,
    bio: this.bio,
    joinDate: this.joinDate,
    gamesPlayed: this.gamesPlayed,
    lessonsCompleted: this.lessonsCompleted,
    wordsLearned: this.wordsLearned,
    quizzesTaken: this.quizzesTaken,
    totalGameScore: this.totalGameScore,
    weeklyActivity: this.weeklyActivity,
    completedCourses: this.completedCourses,
    badges: this.badges,
    gameScores: this.gameScores ? Object.fromEntries(this.gameScores) : {},
    gameHistory: this.gameHistory || [],
    learnProgress: this.learnProgress || {},
  }
}

module.exports = mongoose.model('User', userSchema)
