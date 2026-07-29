require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const app = express()

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'https://lingualearn.up.railway.app'],
  credentials: true,
}))
app.use(express.json({ limit: '5mb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.',
})
app.use('/api/', limiter)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err.message); process.exit(1) })

app.use('/api/auth', require('./routes/auth'))
app.use('/api/leaderboard', require('./routes/leaderboard'))
app.use('/api/profile', require('./routes/profile'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
