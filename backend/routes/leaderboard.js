const router = require('express').Router()
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name xp level streak avatar')
      .sort({ xp: -1 })
      .limit(50)
    res.json(users)
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
