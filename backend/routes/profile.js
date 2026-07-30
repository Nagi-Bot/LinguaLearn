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
    const result = req.user.addXp(amount)
    req.user.gamesPlayed = (req.user.gamesPlayed || 0) + 1
    req.user.totalGameScore = (req.user.totalGameScore || 0) + amount

    const dayOfWeek = new Date().getDay()
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    if (!req.user.weeklyActivity) req.user.weeklyActivity = [0, 0, 0, 0, 0, 0, 0]
    req.user.weeklyActivity[adjustedDay] = (req.user.weeklyActivity[adjustedDay] || 0) + amount

    const newBadges = req.user.checkBadges()
    await req.user.save()
    res.json({
      user: req.user.toPublicJSON(),
      levelUp: result.levelUp,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      newBadges,
      diamonds: result.diamonds
    })
  } catch (err) {
    console.error('XP add error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name xp level streak bestStreak avatar diamonds badges gamesPlayed')
      .sort({ xp: -1 })
      .limit(50)
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
