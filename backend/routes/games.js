const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.post('/submit', auth, async (req, res) => {
  try {
    const { game, score, xpEarned } = req.body
    if (!game || score === undefined) {
      return res.status(400).json({ message: 'Game name and score required' })
    }

    const user = req.user
    const xp = xpEarned || score

    const result = user.addXp(xp)
    user.gamesPlayed = (user.gamesPlayed || 0) + 1
    user.totalGameScore = (user.totalGameScore || 0) + score

    const prevBest = user.gameScores?.get(game) || 0
    if (!user.gameScores) user.gameScores = new Map()
    if (score > prevBest) user.gameScores.set(game, score)

    user.gameHistory.push({
      game,
      score,
      xpEarned: xp,
      date: new Date()
    })

    if (user.gameHistory.length > 100) {
      user.gameHistory = user.gameHistory.slice(-100)
    }

    const dayOfWeek = new Date().getDay()
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    if (!user.weeklyActivity) user.weeklyActivity = [0, 0, 0, 0, 0, 0, 0]
    user.weeklyActivity[adjustedDay] = (user.weeklyActivity[adjustedDay] || 0) + xp

    const newBadges = user.checkBadges()
    user.lastActive = new Date()
    await user.save()

    res.json({
      user: user.toPublicJSON(),
      levelUp: result.levelUp,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      newBadges,
      diamonds: result.diamonds
    })
  } catch (err) {
    console.error('Game score error:', err)
    res.status(500).json({ message: 'Failed to save score' })
  }
})

router.get('/history', auth, async (req, res) => {
  try {
    const user = req.user
    res.json({
      gameHistory: user.gameHistory || [],
      gameScores: user.gameScores ? Object.fromEntries(user.gameScores) : {}
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/buy-xp', auth, async (req, res) => {
  try {
    const { diamonds } = req.body
    if (!diamonds || diamonds < 10) {
      return res.status(400).json({ message: 'Minimum 10 diamonds required' })
    }
    if ((user.diamonds || 0) < diamonds) {
      return res.status(400).json({ message: 'Not enough diamonds' })
    }

    const user = req.user
    const xpAmount = Math.floor(diamonds / 10) * 50
    user.diamonds = (user.diamonds || 0) - diamonds
    const result = user.addXp(xpAmount)
    await user.save()

    res.json({
      user: user.toPublicJSON(),
      xpAdded: xpAmount,
      diamondsSpent: diamonds,
      levelUp: result.levelUp,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel
    })
  } catch (err) {
    console.error('Buy XP error:', err)
    res.status(500).json({ message: 'Failed to buy XP' })
  }
})

module.exports = router
