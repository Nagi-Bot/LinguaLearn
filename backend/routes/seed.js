const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const users = [
  { name: 'Sarah Johnson', email: 'sarah.j@email.com', password: 'Test123!', xp: 14200, level: 28, streak: 45, bestStreak: 45, diamonds: 320, gamesPlayed: 87, lessonsCompleted: 64, wordsLearned: 1200, quizzesTaken: 45, totalGameScore: 28500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4', bio: 'English teacher from London. Love helping others learn!' },
  { name: 'Carlos Mendez', email: 'carlos.m@email.com', password: 'Test123!', xp: 9800, level: 19, streak: 23, bestStreak: 30, diamonds: 180, gamesPlayed: 56, lessonsCompleted: 42, wordsLearned: 850, quizzesTaken: 32, totalGameScore: 19200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=c0aede', bio: 'Business professional learning English for work.' },
  { name: 'Yuki Tanaka', email: 'yuki.t@email.com', password: 'Test123!', xp: 7500, level: 15, streak: 18, bestStreak: 25, diamonds: 150, gamesPlayed: 43, lessonsCompleted: 38, wordsLearned: 620, quizzesTaken: 28, totalGameScore: 15100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki&backgroundColor=d1d4f9', bio: 'ESL learner from Japan. Big fan of grammar games!' },
  { name: 'Ali Hassan', email: 'ali.h@email.com', password: 'Test123!', xp: 18500, level: 37, streak: 67, bestStreak: 67, diamonds: 450, gamesPlayed: 120, lessonsCompleted: 89, wordsLearned: 1800, quizzesTaken: 67, totalGameScore: 37000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali&backgroundColor=ffd5dc', bio: 'Student from Lahore. Top of the leaderboard!' },
  { name: 'Priya Sharma', email: 'priya.s@email.com', password: 'Test123!', xp: 6200, level: 12, streak: 14, bestStreak: 20, diamonds: 95, gamesPlayed: 34, lessonsCompleted: 29, wordsLearned: 480, quizzesTaken: 22, totalGameScore: 12400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffdfbf', bio: 'Medical student from Mumbai improving English for studies.' },
  { name: 'Ahmed Khan', email: 'ahmed.k@email.com', password: 'Test123!', xp: 11000, level: 22, streak: 31, bestStreak: 35, diamonds: 230, gamesPlayed: 65, lessonsCompleted: 52, wordsLearned: 950, quizzesTaken: 40, totalGameScore: 22000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=c0aede', bio: 'Software developer from Karachi. Learning English for better opportunities.' },
  { name: 'Emily Chen', email: 'emily.c@email.com', password: 'Test123!', xp: 4500, level: 9, streak: 10, bestStreak: 15, diamonds: 80, gamesPlayed: 28, lessonsCompleted: 22, wordsLearned: 380, quizzesTaken: 18, totalGameScore: 9000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=b6e3f4', bio: 'College student from Singapore.' },
  { name: 'Muhammad Bilal', email: 'bilal.m@email.com', password: 'Test123!', xp: 3300, level: 7, streak: 8, bestStreak: 12, diamonds: 60, gamesPlayed: 20, lessonsCompleted: 16, wordsLearned: 290, quizzesTaken: 14, totalGameScore: 6600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal&backgroundColor=ffd5dc', bio: 'University student from Islamabad.' },
  { name: 'Sneha Patel', email: 'sneha.p@email.com', password: 'Test123!', xp: 7800, level: 16, streak: 19, bestStreak: 22, diamonds: 165, gamesPlayed: 48, lessonsCompleted: 40, wordsLearned: 700, quizzesTaken: 30, totalGameScore: 15600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=ffdfbf', bio: 'Teacher from Delhi.' },
  { name: 'David Wilson', email: 'david.w@email.com', password: 'Test123!', xp: 2100, level: 5, streak: 5, bestStreak: 7, diamonds: 45, gamesPlayed: 15, lessonsCompleted: 12, wordsLearned: 200, quizzesTaken: 10, totalGameScore: 4200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9', bio: 'New learner from Australia.' },
  { name: 'Fatima Zaidi', email: 'fatima.z@email.com', password: 'Test123!', xp: 5600, level: 11, streak: 13, bestStreak: 18, diamonds: 110, gamesPlayed: 38, lessonsCompleted: 31, wordsLearned: 520, quizzesTaken: 24, totalGameScore: 11200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=c0aede', bio: 'Housewife from Lahore learning English online.' },
  { name: 'Raj Kumar', email: 'raj.k@email.com', password: 'Test123!', xp: 4100, level: 8, streak: 9, bestStreak: 14, diamonds: 75, gamesPlayed: 25, lessonsCompleted: 20, wordsLearned: 340, quizzesTaken: 16, totalGameScore: 8200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj&backgroundColor=b6e3f4', bio: 'Engineer from Bangalore.' },
  { name: 'Ayesha Malik', email: 'ayesha.m@email.com', password: 'Test123!', xp: 9200, level: 18, streak: 22, bestStreak: 28, diamonds: 195, gamesPlayed: 52, lessonsCompleted: 44, wordsLearned: 780, quizzesTaken: 35, totalGameScore: 18400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha&backgroundColor=ffd5dc', bio: 'Content writer from Karachi.' },
]

router.get('/', async (req, res) => {
  try {
    const existing = await User.find({ email: { $in: users.map(u => u.email) } }).select('email')
    const existingEmails = new Set(existing.map(u => u.email))
    const toCreate = users.filter(u => !existingEmails.has(u.email))

    if (toCreate.length === 0) {
      return res.json({ message: 'Seed users already exist!', count: existing.length })
    }

    const created = []
    for (const data of toCreate) {
      const hashed = await bcrypt.hash(data.password, 12)
      const user = new User({
        ...data,
        password: hashed,
        joinDate: new Date(Date.now() - Math.random() * 90 * 86400000),
        lastActive: new Date(Date.now() - Math.random() * 7 * 86400000),
        lastLoginDate: new Date().toISOString().split('T')[0],
        weeklyActivity: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500)),
        learnProgress: {
          grammar: { completed: ['basics', 'tenses', 'articles'], score: 80, totalXp: data.xp * 0.3 },
          vocabulary: { completed: ['daily_words', 'synonyms'], score: 70, totalXp: data.xp * 0.2, wordsLearned: [`word_${data.name}`] },
          reading: { completed: ['beginner_1'], score: 60, totalXp: data.xp * 0.15 },
          writing: { completed: [], score: 0, totalXp: data.xp * 0.1 },
          speaking: { completed: [], score: 0, totalXp: data.xp * 0.1 },
          listening: { completed: [], score: 0, totalXp: data.xp * 0.15 },
        },
        gameScores: new Map([
          ['daily-challenge', data.xp * 2],
          ['grammar-battle', data.xp * 1.5],
          ['word-builder', data.xp],
        ]),
        gameHistory: Array.from({ length: 10 }, (_, i) => ({
          game: ['daily-challenge', 'grammar-battle', 'word-builder'][i % 3],
          score: Math.floor(Math.random() * 100) + 10,
          xpEarned: Math.floor(Math.random() * 50) + 10,
          date: new Date(Date.now() - i * 86400000),
        })),
      })
      await user.save()
      created.push(data.name)
    }

    res.json({ message: `${created.length} users created`, users: created })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/clear', async (req, res) => {
  try {
    const emails = users.map(u => u.email)
    const result = await User.deleteMany({ email: { $in: emails } })
    res.json({ message: `${result.deletedCount} seed users cleared` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router