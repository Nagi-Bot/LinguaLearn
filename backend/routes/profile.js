const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    res.json({ user: req.user.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body
    if (name !== undefined) req.user.name = name
    if (bio !== undefined) req.user.bio = bio
    if (avatar !== undefined) req.user.avatar = avatar
    await req.user.save()
    res.json({ user: req.user.toPublicJSON() })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/xp', auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || amount < 0) {
      return res.status(400).json({ message: 'Valid XP amount required' })
    }
    req.user.xp = (req.user.xp || 0) + amount
    req.user.level = Math.floor(req.user.xp / 500) + 1
    req.user.coins = (req.user.coins || 0) + Math.floor(amount / 10)
    req.user.gamesPlayed = (req.user.gamesPlayed || 0) + 1
    req.user.lastActive = new Date()
    await req.user.save()
    res.json({ user: req.user.toPublicJSON() })
  } catch (err) {
    console.error('XP add error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name xp level streak avatar')
      .sort({ xp: -1 })
      .limit(50)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
