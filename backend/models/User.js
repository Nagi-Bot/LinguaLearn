const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  coins: { type: Number, default: 100 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now },
  joinDate: { type: Date, default: Date.now },
  gamesPlayed: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  wordsLearned: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  weeklyActivity: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
  completedCourses: { type: [String], default: [] },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    xp: this.xp,
    level: this.level,
    streak: this.streak,
    coins: this.coins,
    avatar: this.avatar,
    bio: this.bio,
    joinDate: this.joinDate,
    gamesPlayed: this.gamesPlayed,
    lessonsCompleted: this.lessonsCompleted,
    wordsLearned: this.wordsLearned,
    quizzesTaken: this.quizzesTaken,
    weeklyActivity: this.weeklyActivity,
    completedCourses: this.completedCourses,
  }
}

module.exports = mongoose.model('User', userSchema)
