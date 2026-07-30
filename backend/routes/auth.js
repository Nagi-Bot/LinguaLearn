const router = require('express').Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const auth = require('../middleware/auth')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '')

let nodemailer = null
try { nodemailer = require('nodemailer') } catch {}

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const user = await User.create({ name, email, password })
    user.updateStreak()
    await user.save()
    const token = generateToken(user)
    res.status(201).json({ user: user.toPublicJSON(), token })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: 'Account not found. Please sign up first.' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    user.updateStreak()
    user.lastActive = new Date()
    await user.save()
    const token = generateToken(user)
    res.json({ user: user.toPublicJSON(), token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() })
})

router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body
    if (name) req.user.name = name
    if (bio !== undefined) req.user.bio = bio
    if (avatar !== undefined) req.user.avatar = avatar
    await req.user.save()
    res.json({ user: req.user.toPublicJSON() })
  } catch (err) {
    console.error('Update error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ message: 'Google token required' })

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: 'google-auth-' + Math.random().toString(36).slice(2),
        avatar: picture || '',
      })
    }
    user.updateStreak()
    user.lastActive = new Date()
    await user.save()
    const token = generateToken(user)
    res.json({ user: user.toPublicJSON(), token })
  } catch (err) {
    console.error('Google auth error:', err)
    res.status(500).json({ message: 'Google login failed' })
  }
})

router.post('/sync', async (req, res) => {
  try {
    const { name, email, xp, level, streak, coins, diamonds, avatar, bio, badges, gameScores, lessonsCompleted, wordsLearned, quizzesTaken, gamesPlayed, totalGameScore } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })
    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      user = await User.create({
        name, email, password: 'sync-' + Math.random().toString(36).slice(2),
        xp: xp || 0, level: level || 1, streak: streak || 0,
        coins: coins || 100, diamonds: diamonds || 100,
        avatar: avatar || '', bio: bio || '',
        badges: badges || [], lessonsCompleted: lessonsCompleted || 0,
        wordsLearned: wordsLearned || 0, quizzesTaken: quizzesTaken || 0,
        gamesPlayed: gamesPlayed || 0, totalGameScore: totalGameScore || 0
      })
    } else {
      if (xp > (user.xp || 0)) user.xp = xp
      if (level > (user.level || 0)) user.level = level
      if (streak > (user.streak || 0)) user.streak = streak
      if (coins > (user.coins || 0)) user.coins = coins
      if (diamonds > (user.diamonds || 0)) user.diamonds = diamonds
      if (avatar) user.avatar = avatar
      if (bio) user.bio = bio
      if (badges && badges.length > 0) {
        badges.forEach(b => { if (!user.badges.includes(b)) user.badges.push(b) })
      }
      if (lessonsCompleted > (user.lessonsCompleted || 0)) user.lessonsCompleted = lessonsCompleted
      if (wordsLearned > (user.wordsLearned || 0)) user.wordsLearned = wordsLearned
      if (quizzesTaken > (user.quizzesTaken || 0)) user.quizzesTaken = quizzesTaken
      if (gamesPlayed > (user.gamesPlayed || 0)) user.gamesPlayed = gamesPlayed
      if (totalGameScore > (user.totalGameScore || 0)) user.totalGameScore = totalGameScore
    }
    user.lastActive = new Date()
    await user.save()
    res.json({ user: user.toPublicJSON() })
  } catch (err) {
    console.error('Sync error:', err)
    res.status(500).json({ message: 'Sync failed' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.json({ message: 'If an account exists with this email, a reset link has been sent.' })
    }
    const resetToken = user.generateResetToken()
    await user.save()
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    if (nodemailer && process.env.SMTP_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        })
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'LinguaLearn <no-reply@lingualearn.com>',
          to: user.email,
          subject: 'Password Reset - LinguaLearn',
          html: `<h2>Password Reset</h2><p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 30 minutes.</p>`
        })
      } catch (emailErr) {
        console.error('Email send error:', emailErr.message)
      }
    }

    res.json({
      message: 'If an account exists with this email, a reset link has been sent.',
      resetToken,
      resetUrl
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Token and password required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' })
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    const newToken = generateToken(user)
    res.json({ message: 'Password reset successful', token: newToken, user: user.toPublicJSON() })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
