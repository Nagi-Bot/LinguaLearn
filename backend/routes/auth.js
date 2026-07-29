const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')
const auth = require('../middleware/auth')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '')

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
    const { name, email, xp, level, streak, coins, avatar, bio } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })
    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      user = await User.create({ name, email, password: 'sync-' + Math.random().toString(36).slice(2), xp: xp || 0, level: level || 1, streak: streak || 0, coins: coins || 100, avatar: avatar || '', bio: bio || '' })
    } else {
      if (xp > user.xp) user.xp = xp
      if (level > user.level) user.level = level
      if (streak > user.streak) user.streak = streak
      if (coins > user.coins) user.coins = coins
      if (avatar) user.avatar = avatar
      if (bio) user.bio = bio
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
  res.json({ message: 'Password reset link sent to your email (demo)' })
})

module.exports = router
