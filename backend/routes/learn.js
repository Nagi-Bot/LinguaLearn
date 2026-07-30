const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({})
    const totalXp = await User.aggregate([{ $group: { _id: null, total: { $sum: '$xp' } } }])
    const totalGames = await User.aggregate([{ $group: { _id: null, total: { $sum: '$gamesPlayed' } } }])
    res.json({
      users: totalUsers,
      totalXp: totalXp[0]?.total || 0,
      totalGames: totalGames[0]?.total || 0,
      lessons: 48,
      games: 10
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/progress', auth, async (req, res) => {
  try {
    const { module, itemId, score, xpEarned } = req.body
    if (!module || !itemId) return res.status(400).json({ message: 'Module and itemId required' })

    const user = req.user
    if (!user.learnProgress) user.learnProgress = {}
    if (!user.learnProgress[module]) user.learnProgress[module] = { completed: [], score: 0, totalXp: 0, wordsLearned: [] }

    if (!user.learnProgress[module].completed.includes(itemId)) {
      user.learnProgress[module].completed.push(itemId)
    }
    if (score) user.learnProgress[module].score = (user.learnProgress[module].score || 0) + score
    const xp = xpEarned || score || 10
    user.learnProgress[module].totalXp = (user.learnProgress[module].totalXp || 0) + xp

    if (module === 'vocabulary' && itemId) {
      if (!user.learnProgress[module].wordsLearned) user.learnProgress[module].wordsLearned = []
      if (!user.learnProgress[module].wordsLearned.includes(itemId)) {
        user.learnProgress[module].wordsLearned.push(itemId)
        user.wordsLearned = (user.wordsLearned || 0) + 1
      }
    }

    user.lessonsCompleted = (user.lessonsCompleted || 0) + 1

    const result = user.addXp(xp)
    const newBadges = user.checkBadges()

    const dayOfWeek = new Date().getDay()
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    if (!user.weeklyActivity) user.weeklyActivity = [0, 0, 0, 0, 0, 0, 0]
    user.weeklyActivity[adjustedDay] = (user.weeklyActivity[adjustedDay] || 0) + xp

    await user.save()
    res.json({
      user: user.toPublicJSON(),
      levelUp: result.levelUp,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      newBadges,
      diamonds: result.diamonds,
      hearts: result.hearts
    })
  } catch (err) {
    console.error('Learn progress error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/progress', auth, async (req, res) => {
  try {
    res.json({ learnProgress: req.user.learnProgress || {} })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/lose-heart', auth, async (req, res) => {
  try {
    const user = req.user
    user.refillHearts()
    const lost = user.loseHeart()
    await user.save()
    res.json({ hearts: user.hearts, heartRefillAt: user.heartRefillAt, lost })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/refill-hearts', auth, async (req, res) => {
  try {
    const user = req.user
    user.hearts = user.maxHearts || 3
    user.heartRefillAt = null
    await user.save()
    res.json({ hearts: user.hearts })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/buy-hearts', auth, async (req, res) => {
  try {
    const { amount } = req.body
    const cost = (amount || 1) * 15
    const user = req.user
    if ((user.diamonds || 0) < cost) return res.status(400).json({ message: 'Not enough diamonds' })
    user.diamonds = (user.diamonds || 0) - cost
    user.hearts = Math.min((user.hearts || 0) + (amount || 1), 10)
    await user.save()
    res.json({ hearts: user.hearts, diamonds: user.diamonds })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/buy-xp', auth, async (req, res) => {
  try {
    const { diamonds } = req.body
    if (!diamonds || diamonds < 10) return res.status(400).json({ message: 'Minimum 10 diamonds' })
    const user = req.user
    if ((user.diamonds || 0) < diamonds) return res.status(400).json({ message: 'Not enough diamonds' })
    const xpAmount = Math.floor(diamonds / 10) * 50
    user.diamonds = (user.diamonds || 0) - diamonds
    const result = user.addXp(xpAmount)
    await user.save()
    res.json({ user: user.toPublicJSON(), xpAdded: xpAmount, diamondsSpent: diamonds, levelUp: result.levelUp })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
