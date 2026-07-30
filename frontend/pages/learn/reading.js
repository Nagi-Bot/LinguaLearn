import { useState } from 'react'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen, Key, Briefcase, Globe, Landmark, MessageCircle } from 'lucide-react'
import DynamicIcon from '../../components/DynamicIcon'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import SEO from '../../components/SEO'

const iconMap = {
  key: Key, work: Briefcase, climate: Globe, museum: Landmark, communication: MessageCircle
}

const readings = [
  {
    id: 1, title: 'The Lost Key', level: 'Beginner', icon: 'key',
    content: `Sarah was walking home from school when she found a small key on the ground. It was old and rusty. She picked it up and looked around. There was an old house at the end of the street. Sarah wondered if the key belonged to that house.

She walked to the old house and tried the key in the lock. It worked! The door opened slowly. Inside, she found a room full of old books and paintings. There was also a letter on the table. The letter was from a girl who lived there 100 years ago.

Sarah decided to keep the key as a treasure. She visited the old house every week to read the books. She learned many things about the past. The lost key had opened not just a door, but a window to history.`,
    questions: [
      { q: 'Where did Sarah find the key?', options: ['In her house', 'On the ground', 'In a book', 'At school'], answer: 1 },
      { q: 'What did she find inside the house?', options: ['Money', 'Old books and paintings', 'A cat', 'Food'], answer: 1 },
      { q: 'How old was the letter?', options: ['50 years', '100 years', '10 years', '200 years'], answer: 1 },
    ]
  },
  {
    id: 2, title: 'The First Day at Work', level: 'Intermediate', icon: 'work',
    content: `Emma was nervous on her first day at the new company. She had prepared for this moment for weeks. She arrived early, dressed in her best suit. The office was modern and busy. People were walking quickly with coffee cups and files.

Her manager, Mr. Johnson, greeted her warmly. "Welcome to the team, Emma! Let me show you around." He introduced her to colleagues and showed her where everything was. Emma felt more relaxed after meeting everyone.

By lunchtime, Emma had already completed her first task. She was proud of herself. During lunch, some colleagues invited her to join them. They talked about projects and shared stories. Emma realized that she had made the right decision joining this company.

The first day ended with a team meeting. Emma contributed some ideas that impressed her manager. She left the office feeling excited about her new journey.`,
    questions: [
      { q: 'How did Emma feel on her first day?', options: ['Confident', 'Nervous', 'Angry', 'Bored'], answer: 1 },
      { q: 'Who greeted Emma at the office?', options: ['The CEO', 'Her colleague', 'Mr. Johnson', 'The secretary'], answer: 2 },
      { q: 'What happened during the team meeting?', options: ['Emma was quiet', 'Emma left early', 'Emma shared ideas', 'The meeting was cancelled'], answer: 2 },
    ]
  },
  {
    id: 3, title: 'Climate Change Explained', level: 'Advanced', icon: 'climate',
    content: `Climate change is one of the most pressing challenges facing humanity today. Scientists have conclusively demonstrated that human activities, particularly the burning of fossil fuels, have led to a significant increase in greenhouse gas emissions. These gases trap heat in the Earth's atmosphere, causing global temperatures to rise.

The consequences of climate change are far-reaching. Rising sea levels threaten coastal communities, extreme weather events have become more frequent and severe, and biodiversity loss accelerates as ecosystems struggle to adapt. Agricultural patterns are shifting, affecting food security worldwide.

However, there is hope. Renewable energy technologies have become increasingly affordable and efficient. Countries around the world are committing to net-zero emissions targets. Individuals can also contribute by reducing waste, conserving energy, and supporting sustainable practices.

International cooperation remains crucial. The Paris Agreement provides a framework for global action, but implementation requires commitment from all nations. The transition to a sustainable future is not just an environmental necessity but also an economic opportunity.`,
    questions: [
      { q: 'What is the main cause of climate change according to the text?', options: ['Natural disasters', 'Human activities burning fossil fuels', 'Volcanic eruptions', 'Solar activity'], answer: 1 },
      { q: 'What is mentioned as a consequence of climate change?', options: ['More stable weather', 'Rising sea levels', 'Increased biodiversity', 'Lower temperatures'], answer: 1 },
      { q: 'What provides a framework for global climate action?', options: ['UN Charter', 'Paris Agreement', 'Kyoto Protocol', 'Geneva Convention'], answer: 1 },
    ]
  },
  {
    id: 4, title: 'A Trip to the Museum', level: 'Beginner', icon: 'museum',
    content: `Last Saturday, Tom and his family went to the Natural History Museum. Tom was very excited because he loved dinosaurs. When they entered the museum, Tom saw a huge dinosaur skeleton. It was taller than his house!

His favorite part was the fossil room. There were fossils of animals that lived millions of years ago. Tom learned that some dinosaurs were as small as chickens, while others were bigger than buses.

After visiting the museum, Tom told his friends all about what he learned. He decided he wanted to become a paleontologist when he grows up.`,
    questions: [
      { q: 'What did Tom love at the museum?', options: ['Paintings', 'Dinosaurs', 'Space', 'Robots'], answer: 1 },
      { q: 'What did Tom learn about some dinosaurs?', options: ['They could fly', 'They were as small as chickens', 'They lived in water', 'They were all big'], answer: 1 },
      { q: 'What does Tom want to become?', options: ['Doctor', 'Teacher', 'Paleontologist', 'Engineer'], answer: 2 },
    ]
  },
  {
    id: 5, title: 'The Art of Communication', level: 'Advanced', icon: 'communication',
    content: `Effective communication is a fundamental skill in both personal and professional contexts. It involves not just the words we choose, but also our tone of voice, body language, and ability to listen actively. In today's digital age, communication has become more complex, with emails, instant messages, and video calls supplementing face-to-face interactions.

One crucial aspect of communication is active listening. This means fully concentrating on what is being said rather than passively hearing the speaker's words. Active listening requires giving feedback, asking clarifying questions, and showing empathy. Studies show that effective listeners are perceived as more competent and trustworthy.

Non-verbal communication also plays a significant role. Research suggests that over 70% of communication is non-verbal. This includes facial expressions, gestures, posture, and eye contact. Being aware of these signals can help avoid misunderstandings and build stronger relationships.

In the workplace, clear communication can increase productivity, reduce errors, and improve team collaboration. Whether presenting ideas, giving feedback, or resolving conflicts, the ability to communicate effectively is invaluable.`,
    questions: [
      { q: 'What percentage of communication is non-verbal?', options: ['Over 50%', 'Over 70%', 'Over 90%', 'Over 30%'], answer: 1 },
      { q: 'What is active listening?', options: ['Hearing words passively', 'Fully concentrating and responding', 'Writing notes', 'Nodding occasionally'], answer: 1 },
      { q: 'What is mentioned as a benefit of clear communication?', options: ['More meetings', 'Increased productivity', 'Less work', 'More emails'], answer: 1 },
    ]
  },
]

export default function ReadingPage() {
  const { saveLearnProgress, loseHeart, user } = useApp()
  const [activeReading, setActiveReading] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [completedReadings, setCompletedReadings] = useState([])
  const [hearts, setHearts] = useState(user?.hearts ?? 3)
  const [ended, setEnded] = useState(false)

  const startReading = (reading) => {
    setActiveReading(reading)
    setCurrentQuestion(0)
    setScore(0)
    setQuizDone(false)
    setSelectedAnswer(null)
  }

  const handleAnswer = (index) => {
    setSelectedAnswer(index)
    if (index === activeReading.questions[currentQuestion].answer) {
      setScore(score + 1)
      toast.success('Correct!')
    } else {
      toast.error('Incorrect!')
      const newHearts = hearts - 1
      setHearts(newHearts)
      loseHeart()
      if (newHearts <= 0) {
        toast.error('No hearts left! Buy more in the Store', { duration: 3000 })
        setEnded(true)
        return
      }
    }
    setTimeout(() => {
      if (currentQuestion < activeReading.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setQuizDone(true)
        if (!completedReadings.includes(activeReading.id)) {
          setCompletedReadings([...completedReadings, activeReading.id])
        }
        const finalScore = score + (index === activeReading.questions[currentQuestion].answer ? 1 : 0)
        saveLearnProgress('reading', activeReading.id, finalScore * 10)
        toast.success(`Reading Complete! Score: ${finalScore}/${activeReading.questions.length}`)
        toast.success('+2 diamonds earned!', { icon: '💎', duration: 3000 })
      }
    }, 1000)
  }

  if (activeReading) {
    if (ended) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-4xl">💔</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You've run out of hearts. Visit the Store to buy more.</p>
              <div className="flex items-center justify-center space-x-4">
                <Link href="/store" className="btn-primary">Visit Store</Link>
                <button onClick={() => { setActiveReading(null); setEnded(false); setHearts(3) }} className="btn-secondary">Back to Readings</button>
              </div>
            </motion.div>
          </div>
        </div>
      )
    }
    if (quizDone) {
      return (
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12">
              <div className="w-20 h-20 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Reading Complete!</h2>
              <div className="text-5xl font-display font-bold gradient-text my-4">{score}/{activeReading.questions.length}</div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {score === activeReading.questions.length ? 'Perfect comprehension!' : 'Keep practicing!'}
              </p>
              <button onClick={() => setActiveReading(null)} className="btn-primary">Back to Readings</button>
            </motion.div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setActiveReading(null)} className="flex items-center text-gray-500 hover:text-primary-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Readings
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={activeReading.icon} /></span>
              <div>
                <h2 className="text-2xl font-display font-bold">{activeReading.title}</h2>
                <span className="text-sm text-gray-500">{activeReading.level}</span>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {activeReading.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{paragraph.trim()}</p>
              ))}
            </div>
          </motion.div>

          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Question {currentQuestion + 1} of {activeReading.questions.length}</h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold">❤️ {hearts}/3</span>
                <span className="text-sm text-primary-500 font-medium">Score: {score}</span>
              </div>
            </div>
            <p className="text-lg mb-4">{activeReading.questions[currentQuestion].q}</p>
            <div className="space-y-3">
              {activeReading.questions[currentQuestion].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswer === null
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-gray-200 dark:border-gray-700'
                      : i === activeReading.questions[currentQuestion].answer
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : selectedAnswer === i
                          ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                          : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <SEO title="Reading Comprehension" description="Improve your English reading skills with engaging stories, articles, and comprehension exercises at various difficulty levels." keywords="english reading, reading comprehension, english stories, reading practice" url="/learn/reading" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Reading <span className="gradient-text">Practice</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Improve your reading comprehension with stories, articles, and comprehension tests.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading, i) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => startReading(reading)}
              className={`glass-card cursor-pointer ${completedReadings.includes(reading.id) ? 'border-secondary-500/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="w-8 h-8 flex items-center justify-center"><DynamicIcon iconMap={iconMap} iconKey={reading.icon} /></span>
                {completedReadings.includes(reading.id) && <CheckCircle className="w-5 h-5 text-secondary-500" />}
              </div>
              <h3 className="text-lg font-display font-semibold mb-1">{reading.title}</h3>
              <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-3">{reading.level}</span>
              <p className="text-sm text-gray-500">{reading.questions.length} comprehension questions</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
