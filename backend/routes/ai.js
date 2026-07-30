const router = require('express').Router()
const auth = require('../middleware/auth')

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const rateLimitStore = {}
const RATE_LIMIT_WINDOW = 60000
const RATE_LIMIT_MAX = 15

function checkRateLimit(ip) {
  const now = Date.now()
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, start: now }
    return { allowed: true }
  }
  const entry = rateLimitStore[ip]
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitStore[ip] = { count: 1, start: now }
    return { allowed: true }
  }
  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - entry.start)) / 1000) }
  }
  return { allowed: true }
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || 'unknown'
}

function sanitize(str) {
  return (str || '').replace(/<[^>]*>/g, '').replace(/[<>]/g, '').slice(0, 4000)
}

async function callGroq(systemPrompt, messages, temperature = 0.7) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role || 'user', content: sanitize(m.content).slice(0, 2000) }))
        ],
        max_tokens: 1024,
        temperature
      })
    })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`Groq API error: ${response.status}`)
    const data = await response.json()
    return data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again."
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('AI timed out. Please try again.')
    throw err
  }
}

router.post('/chat', auth, async (req, res) => {
  try {
    const ip = getClientIP(req)
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) return res.status(429).json({ message: `Too many requests. Try again in ${rateCheck.retryAfter}s.` })

    const { messages, systemPrompt } = req.body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages required' })
    }

    const defaultPrompt = `You are LinguaLearn AI, a friendly and expert English tutor. You help users learn English by:
- Explaining grammar rules clearly with examples
- Teaching vocabulary with definitions, synonyms, and example sentences
- Correcting mistakes and explaining why something is wrong
- Giving pronunciation tips
- Keeping responses concise but educational
- Using encouraging and supportive tone
- When correcting, show the wrong version with ❌ and correct version with ✅`

    const reply = await callGroq(systemPrompt || defaultPrompt, messages.slice(-10), 0.7)
    res.json({ reply })
  } catch (err) {
    console.error('AI chat error:', err.message)
    res.status(500).json({ message: 'AI is temporarily unavailable. Please try again.' })
  }
})

router.post('/writing-feedback', auth, async (req, res) => {
  try {
    const ip = getClientIP(req)
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) return res.status(429).json({ message: `Too many requests. Try again in ${rateCheck.retryAfter}s.` })

    const { text, type } = req.body
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide at least 10 characters of text to check.' })
    }

    const systemPrompt = `You are an expert English writing teacher. Analyze the user's writing and provide:

1. **Grammar Corrections**: List each mistake with ❌ wrong → ✅ correct
2. **Spelling Errors**: If any
3. **Style Suggestions**: Better word choices or sentence structures
4. **Vocabulary Score**: Rate vocabulary usage 1-10
5. **Grammar Score**: Rate grammar accuracy 1-10
6. **Overall Score**: Rate the writing 1-10
7. **Summary**: Brief encouraging feedback

Format your response clearly with headers. Be constructive and encouraging.
Writing type: ${type || 'general'}`

    const reply = await callGroq(systemPrompt, [{ role: 'user', content: text }], 0.5)
    res.json({ feedback: reply })
  } catch (err) {
    console.error('Writing feedback error:', err.message)
    res.status(500).json({ message: 'AI feedback unavailable. Please try again.' })
  }
})

router.post('/daily-challenge', auth, async (req, res) => {
  try {
    const systemPrompt = `You are an English quiz generator. Generate exactly 10 multiple-choice questions for a daily English challenge.

Mix these types:
- 3 Grammar questions (tenses, articles, prepositions)
- 3 Vocabulary questions (synonyms, antonyms, word meanings)
- 2 Sentence correction questions
- 2 Reading comprehension (short passage + question)

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "questions": [
    {
      "question": "question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": 0,
      "explanation": "Brief explanation of correct answer",
      "type": "grammar|vocabulary|correction|reading"
    }
  ]
}`

    const reply = await callGroq(systemPrompt, [{ role: 'user', content: 'Generate my daily English challenge quiz now.' }], 0.8)
    
    const jsonMatch = reply.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid quiz format')
    
    const quiz = JSON.parse(jsonMatch[0])
    res.json({ questions: quiz.questions || quiz })
  } catch (err) {
    console.error('Daily challenge error:', err.message)
    res.status(500).json({ message: 'Failed to generate challenge. Please try again.' })
  }
})

router.post('/placement-test', auth, async (req, res) => {
  try {
    const { level } = req.body
    const systemPrompt = `You are an English placement test generator. Generate exactly 15 multiple-choice questions for level: ${level || 'beginner'}.

Difficulty levels:
- beginner: A1-A2 (basic grammar, simple vocab, present tense)
- intermediate: B1-B2 (complex grammar, idioms, all tenses)
- advanced: C1-C2 (advanced grammar, nuanced vocab, formal writing)

Mix question types: grammar, vocabulary, sentence completion, error detection.

Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "question": "question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correct": 0,
      "explanation": "Brief explanation",
      "type": "grammar|vocabulary|completion|error"
    }
  ]
}`

    const reply = await callGroq(systemPrompt, [{ role: 'user', content: `Generate a ${level || 'beginner'} placement test.` }], 0.7)
    
    const jsonMatch = reply.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid test format')
    
    const test = JSON.parse(jsonMatch[0])
    res.json({ questions: test.questions })
  } catch (err) {
    console.error('Placement test error:', err.message)
    res.status(500).json({ message: 'Failed to generate test. Please try again.' })
  }
})

module.exports = router
