// Unlimited learning content - algorithmic generation + large hand-written pools

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function uniqueShuffle(arr) {
  const seen = new Set()
  const out = []
  while (out.length < arr.length) {
    const item = pick(arr)
    const key = item.word || item.title || item.sentence || item.id || item
    if (!seen.has(key)) { seen.add(key); out.push(item) }
  }
  return out
}

// ==================== SPEAKING (endless) ====================

const speakingExtra = [
  'The early bird catches the worm.',
  'Practice makes perfect, so keep speaking every day.',
  'My favorite hobby is reading books on the weekend.',
  'Could you please speak a little more slowly?',
  'I usually wake up at six o\'clock in the morning.',
  'She is learning English because she wants to travel.',
  'We had a wonderful time at the party last night.',
  'The library is open from nine to six on weekdays.',
  'He plays football with his friends every Saturday.',
  'I am looking forward to meeting you next week.',
  'The restaurant serves delicious food at reasonable prices.',
  'My sister is studying medicine at the university.',
  'They are planning to visit their grandparents this summer.',
  'Please turn left at the traffic lights and go straight.',
  'The movie was so interesting that I watched it twice.',
  'I need to buy some groceries on my way home.',
  'She always drinks a glass of water before breakfast.',
  'We are going to the cinema tonight if you want to join.',
  'The teacher explained the lesson very clearly.',
  'It is important to stay healthy by exercising regularly.',
  'He forgot his umbrella and got wet in the rain.',
  'My parents moved to the city ten years ago.',
  'The children are playing happily in the park.',
  'I have never tasted such delicious food before.',
  'She will call you as soon as she arrives home.',
]

const spkVerbs = [
  { base: 'go', past: 'went', pp: 'gone', ing: 'going' },
  { base: 'eat', past: 'ate', pp: 'eaten', ing: 'eating' },
  { base: 'take', past: 'took', pp: 'taken', ing: 'taking' },
  { base: 'see', past: 'saw', pp: 'seen', ing: 'seeing' },
  { base: 'make', past: 'made', pp: 'made', ing: 'making' },
  { base: 'write', past: 'wrote', pp: 'written', ing: 'writing' },
  { base: 'read', past: 'read', pp: 'read', ing: 'reading' },
  { base: 'buy', past: 'bought', pp: 'bought', ing: 'buying' },
  { base: 'build', past: 'built', pp: 'built', ing: 'building' },
  { base: 'teach', past: 'taught', pp: 'taught', ing: 'teaching' },
  { base: 'run', past: 'ran', pp: 'run', ing: 'running' },
  { base: 'sing', past: 'sang', pp: 'sung', ing: 'singing' },
  { base: 'swim', past: 'swam', pp: 'swum', ing: 'swimming' },
  { base: 'drive', past: 'drove', pp: 'driven', ing: 'driving' },
  { base: 'fly', past: 'flew', pp: 'flown', ing: 'flying' },
  { base: 'talk', past: 'talked', pp: 'talked', ing: 'talking' },
  { base: 'watch', past: 'watched', pp: 'watched', ing: 'watching' },
  { base: 'play', past: 'played', pp: 'played', ing: 'playing' },
  { base: 'study', past: 'studied', pp: 'studied', ing: 'studying' },
  { base: 'cook', past: 'cooked', pp: 'cooked', ing: 'cooking' },
  { base: 'clean', past: 'cleaned', pp: 'cleaned', ing: 'cleaning' },
  { base: 'visit', past: 'visited', pp: 'visited', ing: 'visiting' },
  { base: 'travel', past: 'travelled', pp: 'travelled', ing: 'travelling' },
  { base: 'practice', past: 'practiced', pp: 'practiced', ing: 'practicing' },
]
const spkSubjects = ['I', 'You', 'He', 'She', 'We', 'They', 'My friend', 'My brother', 'My mother', 'The teacher', 'The children', 'The students']
const spkObjects = ['a book', 'some music', 'dinner', 'a letter', 'a picture', 'the garden', 'a movie', 'a bicycle', 'English', 'a song', 'a story', 'breakfast']

function generateSpeakingSentence() {
  const v = pick(spkVerbs)
  const s = pick(spkSubjects)
  const o = pick(spkObjects)
  const third = !['I', 'You', 'We', 'They', 'My friend', 'My brother', 'My mother', 'The teacher', 'The children', 'The students'].includes(s)
  const isSingular = ['He', 'She', 'My friend', 'My brother', 'My mother', 'The teacher'].includes(s)
  const type = Math.floor(Math.random() * 5)
  switch (type) {
    case 0: return `${s} ${v.base}${isSingular ? 's' : ''} ${o} every day.`
    case 1: return `${s} ${isSingular ? 'is' : 'are'} ${v.ing} ${o} right now.`
    case 2: return `${s} ${v.past} ${o} yesterday.`
    case 3: return `${s} ${isSingular ? 'has' : 'have'} ${v.pp} ${o} before.`
    case 4: return `${s} will ${v.base} ${o} tomorrow.`
  }
  return `${s} ${v.base}${isSingular ? 's' : ''} ${o} every day.`
}

export function getSpeakingSentences(count = 10) {
  const pool = [...speakingExtra]
  for (let i = 0; i < 400; i++) pool.push(generateSpeakingSentence())
  const out = []
  const seen = new Set()
  while (out.length < count) {
    const s = pick(pool)
    if (!seen.has(s)) { seen.add(s); out.push(s) }
  }
  return out
}

// ==================== VOCABULARY (endless) ====================

const vocabDailyWords = [
  { word: 'Beautiful', meaning: 'Pleasing the senses or mind aesthetically', example: 'The sunset was **beautiful**.' },
  { word: 'Important', meaning: 'Of great significance or value', example: 'This is an **important** meeting.' },
  { word: 'Different', meaning: 'Not the same as another or each other', example: 'They have **different** opinions.' },
  { word: 'Available', meaning: 'Able to be used or obtained', example: 'Is this seat **available**?' },
  { word: 'Significant', meaning: 'Sufficiently great or important', example: 'A **significant** improvement.' },
]

const vocabSynonymPairs = [
  { word: 'Happy', correct: 'Joyful' }, { word: 'Big', correct: 'Large' }, { word: 'Fast', correct: 'Quick' },
  { word: 'Smart', correct: 'Intelligent' }, { word: 'Beautiful', correct: 'Gorgeous' }, { word: 'Strong', correct: 'Powerful' },
  { word: 'Rich', correct: 'Wealthy' }, { word: 'Begin', correct: 'Start' }, { word: 'Difficult', correct: 'Hard' },
  { word: 'Quiet', correct: 'Silent' }, { word: 'Brave', correct: 'Courageous' }, { word: 'Ancient', correct: 'Old' },
  { word: 'Clear', correct: 'Obvious' }, { word: 'Calm', correct: 'Peaceful' }, { word: 'Delicious', correct: 'Tasty' },
  { word: 'Exciting', correct: 'Thrilling' }, { word: 'Sad', correct: 'Unhappy' }, { word: 'Angry', correct: 'Furious' },
  { word: 'Tired', correct: 'Exhausted' }, { word: 'Cold', correct: 'Freezing' }, { word: 'Hungry', correct: 'Starving' },
  { word: 'Funny', correct: 'Humorous' }, { word: 'Pretty', correct: 'Attractive' }, { word: 'Shy', correct: 'Timid' },
  { word: 'Thin', correct: 'Slim' }, { word: 'Important', correct: 'Significant' }, { word: 'Interesting', correct: 'Fascinating' },
  { word: 'Easy', correct: 'Simple' }, { word: 'Helpful', correct: 'Useful' }, { word: 'Honest', correct: 'Truthful' },
  { word: 'Lazy', correct: 'Idle' }, { word: 'Lucky', correct: 'Fortunate' }, { word: 'Neat', correct: 'Tidy' },
  { word: 'Polite', correct: 'Courteous' }, { word: 'Rare', correct: 'Uncommon' }, { word: 'Rude', correct: 'Impolite' },
  { word: 'Safe', correct: 'Secure' }, { word: 'Scary', correct: 'Frightening' }, { word: 'Small', correct: 'Tiny' },
  { word: 'Strange', correct: 'Weird' }, { word: 'Stupid', correct: 'Foolish' }, { word: 'Sure', correct: 'Certain' },
  { word: 'Wide', correct: 'Broad' }, { word: 'Wise', correct: 'Smart' }, { word: 'Wonderful', correct: 'Amazing' },
  { word: 'Worried', correct: 'Anxious' }, { word: 'Wrong', correct: 'Incorrect' }, { word: 'Young', correct: 'Youthful' },
  { word: 'Bright', correct: 'Shining' }, { word: 'Careful', correct: 'Cautious' }, { word: 'Cheap', correct: 'Inexpensive' },
  { word: 'Dangerous', correct: 'Hazardous' }, { word: 'Dirty', correct: 'Filthy' }, { word: 'Famous', correct: 'Well-known' },
  { word: 'Genuine', correct: 'Authentic' }, { word: 'Huge', correct: 'Enormous' }, { word: 'Ill', correct: 'Sick' },
  { word: 'Kind', correct: 'Gentle' }, { word: 'Loud', correct: 'Noisy' }, { word: 'Necessary', correct: 'Essential' },
  { word: 'Odd', correct: 'Strange' }, { word: 'Quick', correct: 'Rapid' }, { word: 'Terrific', correct: 'Fantastic' },
  { word: 'Tiny', correct: 'Minuscule' }, { word: 'Ugly', correct: 'Hideous' }, { word: 'Wet', correct: 'Damp' },
]

const vocabAntonymPairs = [
  { word: 'Hot', correct: 'Cold' }, { word: 'Big', correct: 'Small' }, { word: 'Fast', correct: 'Slow' },
  { word: 'Light', correct: 'Heavy' }, { word: 'Rich', correct: 'Poor' }, { word: 'Happy', correct: 'Sad' },
  { word: 'Strong', correct: 'Weak' }, { word: 'Begin', correct: 'End' }, { word: 'High', correct: 'Low' },
  { word: 'Easy', correct: 'Hard' }, { word: 'Clean', correct: 'Dirty' }, { word: 'Open', correct: 'Closed' },
  { word: 'Full', correct: 'Empty' }, { word: 'Wet', correct: 'Dry' }, { word: 'Young', correct: 'Old' },
  { word: 'Early', correct: 'Late' }, { word: 'Love', correct: 'Hate' }, { word: 'Friend', correct: 'Enemy' },
  { word: 'Win', correct: 'Lose' }, { word: 'Save', correct: 'Spend' }, { word: 'Laugh', correct: 'Cry' },
  { word: 'Give', correct: 'Take' }, { word: 'Buy', correct: 'Sell' }, { word: 'Remember', correct: 'Forget' },
  { word: 'Arrive', correct: 'Leave' }, { word: 'Accept', correct: 'Reject' }, { word: 'Alive', correct: 'Dead' },
  { word: 'Always', correct: 'Never' }, { word: 'Ancient', correct: 'Modern' }, { word: 'Answer', correct: 'Question' },
  { word: 'Attack', correct: 'Defend' }, { word: 'Awake', correct: 'Asleep' }, { word: 'Beautiful', correct: 'Ugly' },
  { word: 'Bitter', correct: 'Sweet' }, { word: 'Borrow', correct: 'Lend' }, { word: 'Bright', correct: 'Dark' },
  { word: 'Broad', correct: 'Narrow' }, { word: 'Build', correct: 'Destroy' }, { word: 'Busy', correct: 'Idle' },
  { word: 'Calm', correct: 'Agitated' }, { word: 'Careful', correct: 'Careless' }, { word: 'Cheap', correct: 'Expensive' },
  { word: 'City', correct: 'Village' }, { word: 'Clever', correct: 'Stupid' }, { word: 'Cold', correct: 'Hot' },
  { word: 'Comfortable', correct: 'Uncomfortable' }, { word: 'Courage', correct: 'Fear' }, { word: 'Cruel', correct: 'Kind' },
  { word: 'Deep', correct: 'Shallow' }, { word: 'Defeat', correct: 'Victory' }, { word: 'Demand', correct: 'Supply' },
  { word: 'Descend', correct: 'Ascend' }, { word: 'Diligent', correct: 'Lazy' }, { word: 'Divide', correct: 'Unite' },
  { word: 'Down', correct: 'Up' }, { word: 'Dull', correct: 'Sharp' }, { word: 'Expand', correct: 'Contract' },
  { word: 'Fail', correct: 'Pass' }, { word: 'Few', correct: 'Many' }, { word: 'First', correct: 'Last' },
  { word: 'Generous', correct: 'Stingy' }, { word: 'Gentle', correct: 'Rough' }, { word: 'Grow', correct: 'Shrink' },
  { word: 'Hard', correct: 'Soft' }, { word: 'Increase', correct: 'Decrease' }, { word: 'Inner', correct: 'Outer' },
  { word: 'Loud', correct: 'Quiet' }, { word: 'Major', correct: 'Minor' }, { word: 'Mature', correct: 'Immature' },
  { word: 'Never', correct: 'Always' }, { word: 'New', correct: 'Old' }, { word: 'Night', correct: 'Day' },
  { word: 'Obey', correct: 'Disobey' }, { word: 'Peace', correct: 'War' }, { word: 'Permanent', correct: 'Temporary' },
  { word: 'Polite', correct: 'Rude' }, { word: 'Praise', correct: 'Criticize' }, { word: 'Private', correct: 'Public' },
  { word: 'Pure', correct: 'Impure' }, { word: 'Push', correct: 'Pull' }, { word: 'Safe', correct: 'Dangerous' },
  { word: 'Sink', correct: 'Float' }, { word: 'Strict', correct: 'Lenient' }, { word: 'Success', correct: 'Failure' },
  { word: 'Sweet', correct: 'Sour' }, { word: 'Thick', correct: 'Thin' }, { word: 'Truth', correct: 'Lie' },
  { word: 'Wild', correct: 'Tame' }, { word: 'Wisdom', correct: 'Ignorance' }, { word: 'Worst', correct: 'Best' },
]

const vocabDailyPool = [
  { word: 'Achievement', hint: 'A thing done successfully' }, { word: 'Adventure', hint: 'An exciting experience' },
  { word: 'Beautiful', hint: 'Very pleasing to look at' }, { word: 'Brave', hint: 'Ready to face danger' },
  { word: 'Brilliant', hint: 'Exceptionally clever' }, { word: 'Challenge', hint: 'A difficult task' },
  { word: 'Confident', hint: 'Feeling sure of yourself' }, { word: 'Courage', hint: 'Strength in danger' },
  { word: 'Curious', hint: 'Eager to learn' }, { word: 'Decision', hint: 'A choice you make' },
  { word: 'Delicious', hint: 'Very tasty' }, { word: 'Determined', hint: 'Firmly decided' },
  { word: 'Diligent', hint: 'Hard-working and careful' }, { word: 'Education', hint: 'Process of learning' },
  { word: 'Efficient', hint: 'Working without waste' }, { word: 'Enormous', hint: 'Very large' },
  { word: 'Experience', hint: 'Practical knowledge gained' }, { word: 'Fantastic', hint: 'Extremely good' },
  { word: 'Fortunate', hint: 'Lucky' }, { word: 'Generous', hint: 'Giving freely' },
  { word: 'Grateful', hint: 'Feeling thankful' }, { word: 'Honest', hint: 'Truthful' },
  { word: 'Imagination', hint: 'Creative thinking' }, { word: 'Improvement', hint: 'Making better' },
  { word: 'Independent', hint: 'Free from outside control' }, { word: 'Intelligent', hint: 'Quick to learn' },
  { word: 'Journey', hint: 'A long trip' }, { word: 'Knowledge', hint: 'Information and skills' },
  { word: 'Language', hint: 'System of communication' }, { word: 'Motivation', hint: 'Reason to act' },
  { word: 'Opportunity', hint: 'A chance to advance' }, { word: 'Patient', hint: 'Calm and tolerant' },
  { word: 'Polite', hint: 'Showing good manners' }, { word: 'Practice', hint: 'Repeated exercise' },
  { word: 'Promise', hint: 'Assurance of doing something' }, { word: 'Responsible', hint: 'Accountable' },
  { word: 'Sincere', hint: 'Honest and genuine' }, { word: 'Success', hint: 'Achieving goals' },
  { word: 'Talented', hint: 'Naturally skilled' }, { word: 'Thoughtful', hint: 'Considerate of others' },
  { word: 'Tradition', hint: 'Custom handed down' }, { word: 'Tremendous', hint: 'Very great in amount' },
  { word: 'Trustworthy', hint: 'Deserving trust' }, { word: 'Vocabulary', hint: 'Words in a language' },
  { word: 'Wonderful', hint: 'Extremely good' }, { word: 'Achieve', hint: 'Successfully reach a goal' },
  { word: 'Appreciate', hint: 'Recognize value' }, { word: 'Believe', hint: 'Accept as true' },
  { word: 'Celebrate', hint: 'Mark a special occasion' }, { word: 'Communicate', hint: 'Share information' },
  { word: 'Discover', hint: 'Find something new' }, { word: 'Encourage', hint: 'Give support to' },
  { word: 'Improve', hint: 'Make or become better' }, { word: 'Memorize', hint: 'Learn by heart' },
  { word: 'Participate', hint: 'Take part in' }, { word: 'Persevere', hint: 'Keep going despite difficulty' },
  { word: 'Remember', hint: 'Recall from memory' }, { word: 'Understand', hint: 'Comprehend meaning' },
  { word: 'Environment', hint: 'Natural surroundings' }, { word: 'Community', hint: 'People living together' },
  { word: 'Future', hint: 'Time yet to come' }, { word: 'History', hint: 'Study of the past' },
  { word: 'Scientist', hint: 'Expert in science' }, { word: 'University', hint: 'Higher education place' },
]

const vocabIdioms = [
  { word: 'Piece of cake', meaning: 'Something very easy', example: 'The exam was a **piece of cake**.' },
  { word: 'Break the ice', meaning: 'To initiate conversation in a social setting', example: 'He told a joke to **break the ice**.' },
  { word: 'Hit the nail on the head', meaning: 'To be exactly right', example: 'You **hit the nail on the head** with that analysis.' },
  { word: 'Under the weather', meaning: 'Feeling ill or sick', example: 'I\'m feeling a bit **under the weather** today.' },
  { word: 'Once in a blue moon', meaning: 'Very rarely', example: 'I visit my hometown **once in a blue moon**.' },
  { word: 'Bite the bullet', meaning: 'To face a difficult situation bravely', example: 'I had to **bite the bullet** and apologize.' },
  { word: 'Burn the midnight oil', meaning: 'To work late into the night', example: 'She was **burning the midnight oil** before exams.' },
  { word: 'Cost an arm and a leg', meaning: 'To be very expensive', example: 'That phone must have **cost an arm and a leg**.' },
  { word: 'Let the cat out of the bag', meaning: 'To reveal a secret', example: 'He **let the cat out of the bag** about the surprise party.' },
  { word: 'The ball is in your court', meaning: 'It is your turn to act or decide', example: 'I sent the offer - now **the ball is in your court**.' },
  { word: 'A blessing in disguise', meaning: 'Something bad that turns out good', example: 'Missing the train was **a blessing in disguise**.' },
  { word: 'Actions speak louder than words', meaning: 'What you do matters more than what you say', example: 'Remember, **actions speak louder than words**.' },
  { word: 'Better late than never', meaning: 'Doing something late is better than not at all', example: 'He finally apologized - **better late than never**.' },
  { word: 'Cry over spilled milk', meaning: 'To worry about past mistakes', example: 'Don\'t **cry over spilled milk**; learn and move on.' },
  { word: 'Get out of hand', meaning: 'To become uncontrollable', example: 'The party **got out of hand** quickly.' },
  { word: 'In hot water', meaning: 'In trouble', example: 'He found himself **in hot water** with the boss.' },
  { word: 'Keep your chin up', meaning: 'Stay positive in hard times', example: '**Keep your chin up** - things will get better.' },
  { word: 'Miss the boat', meaning: 'To miss an opportunity', example: 'If you don\'t apply now, you\'ll **miss the boat**.' },
  { word: 'On cloud nine', meaning: 'Extremely happy', example: 'She has been **on cloud nine** since the news.' },
  { word: 'Spill the beans', meaning: 'To reveal a secret', example: 'Who **spilled the beans** about the plan?' },
  { word: 'Take it with a grain of salt', meaning: 'To not take something too seriously', example: 'Take his advice **with a grain of salt**.' },
  { word: 'The best of both worlds', meaning: 'Enjoying two different advantages', example: 'Working from home gives me **the best of both worlds**.' },
]

const vocabPhrasal = [
  { word: 'Give up', meaning: 'To stop trying or quit', example: 'Don\'t **give up** on your dreams.' },
  { word: 'Look after', meaning: 'To take care of', example: 'She **looks after** her younger brother.' },
  { word: 'Put off', meaning: 'To postpone or delay', example: 'Don\'t **put off** your homework.' },
  { word: 'Run out of', meaning: 'To use up the supply of something', example: 'We\'ve **run out of** milk.' },
  { word: 'Turn down', meaning: 'To reject an offer', example: 'She **turned down** the job offer.' },
  { word: 'Bring up', meaning: 'To raise a child or mention a topic', example: 'He **brought up** an interesting point in the meeting.' },
  { word: 'Call off', meaning: 'To cancel', example: 'They **called off** the match because of rain.' },
  { word: 'Carry on', meaning: 'To continue', example: '**Carry on** with your work, please.' },
  { word: 'Come across', meaning: 'To find by chance', example: 'I **came across** an old photo yesterday.' },
  { word: 'Find out', meaning: 'To discover information', example: 'I need to **find out** the train schedule.' },
  { word: 'Get along with', meaning: 'To have a good relationship', example: 'I **get along with** all my classmates.' },
  { word: 'Get over', meaning: 'To recover from', example: 'It took her a week to **get over** the flu.' },
  { word: 'Go on', meaning: 'To continue happening', example: 'Please **go on** with your story.' },
  { word: 'Look forward to', meaning: 'To anticipate with pleasure', example: 'I **look forward to** meeting you.' },
  { word: 'Look up', meaning: 'To search for information', example: '**Look up** the word in the dictionary.' },
  { word: 'Make up', meaning: 'To invent or reconcile', example: 'She **made up** a story about the dog.' },
  { word: 'Pick up', meaning: 'To collect or learn', example: 'I\'ll **pick up** the groceries on the way home.' },
  { word: 'Put on', meaning: 'To wear or gain', example: '**Put on** your jacket; it\'s cold.' },
  { word: 'Set up', meaning: 'To arrange or establish', example: 'They **set up** a small business.' },
  { word: 'Take off', meaning: 'To remove or leave quickly', example: 'The plane will **take off** at noon.' },
  { word: 'Take over', meaning: 'To gain control', example: 'The new manager will **take over** next month.' },
  { word: 'Throw away', meaning: 'To discard', example: 'Don\'t **throw away** those old books.' },
  { word: 'Turn on', meaning: 'To start a device', example: 'Please **turn on** the lights.' },
  { word: 'Work out', meaning: 'To exercise or solve', example: 'I **work out** at the gym three times a week.' },
  { word: 'Wake up', meaning: 'To stop sleeping', example: 'I **wake up** at 6 AM every day.' },
]

const vocabCollocations = [
  { word: 'Make a decision', meaning: 'To choose or decide', example: 'I need to **make a decision** soon.' },
  { word: 'Take a break', meaning: 'To rest briefly', example: 'Let\'s **take a break** for 10 minutes.' },
  { word: 'Do business', meaning: 'To engage in commercial activities', example: 'They **do business** with many countries.' },
  { word: 'Have a conversation', meaning: 'To talk with someone', example: 'We **had a conversation** about the project.' },
  { word: 'Pay attention', meaning: 'To focus or concentrate', example: 'Please **pay attention** to the lesson.' },
  { word: 'Catch a cold', meaning: 'To become ill with a cold', example: 'Wear a jacket or you\'ll **catch a cold**.' },
  { word: 'Make progress', meaning: 'To improve or advance', example: 'She is **making progress** in English.' },
  { word: 'Take responsibility', meaning: 'To accept accountability', example: 'He needs to **take responsibility** for his actions.' },
  { word: 'Break a habit', meaning: 'To stop a regular behavior', example: 'It\'s hard to **break a habit** of procrastination.' },
  { word: 'Come to an agreement', meaning: 'To reach a shared decision', example: 'The two sides finally **came to an agreement**.' },
  { word: 'Do homework', meaning: 'To complete school assignments', example: 'I **do my homework** right after dinner.' },
  { word: 'Have a good time', meaning: 'To enjoy oneself', example: 'We **had a good time** at the beach.' },
  { word: 'Make a mistake', meaning: 'To do something wrong', example: 'Everyone **makes mistakes** sometimes.' },
  { word: 'Take a photo', meaning: 'To photograph', example: 'Let\'s **take a photo** together.' },
  { word: 'Pay a visit', meaning: 'To go see someone', example: 'We should **pay a visit** to grandma this weekend.' },
  { word: 'Break the news', meaning: 'To tell someone something important', example: 'Who will **break the news** to her?' },
  { word: 'Catch someone\'s eye', meaning: 'To attract attention', example: 'The bright colors **caught my eye**.' },
  { word: 'Keep a promise', meaning: 'To do what you promised', example: 'She always **keeps her promises**.' },
  { word: 'Make a plan', meaning: 'To prepare in advance', example: 'Let\'s **make a plan** for the weekend.' },
  { word: 'Take a chance', meaning: 'To risk something', example: 'You should **take a chance** and apply.' },
]

function vocabWordFromSynonym(p) {
  return { word: p.word, meaning: `A synonym of "${p.correct}"`, example: `Try using "${p.word}" instead of "${p.correct}" in your writing.` }
}
function vocabWordFromAntonym(p) {
  return { word: p.word, meaning: `The opposite of "${p.correct}"`, example: `"${p.word}" is the opposite of "${p.correct}".` }
}
function vocabWordFromDaily(p) {
  return { word: p.word, meaning: p.hint, example: `I am learning the word "${p.word}" today.` }
}

export function getVocabularyCategories() {
  const syns = shuffle(vocabSynonymPairs).map(vocabWordFromSynonym)
  const ants = shuffle(vocabAntonymPairs).map(vocabWordFromAntonym)
  const dailies = shuffle(vocabDailyPool).map(vocabWordFromDaily)
  return [
    { name: 'Daily Words', icon: 'daily', words: shuffle([...vocabDailyWords, ...dailies]) },
    { name: 'Synonyms', icon: 'synonyms', words: syns },
    { name: 'Antonyms', icon: 'antonyms', words: ants },
    { name: 'Idioms', icon: 'idioms', words: shuffle(vocabIdioms) },
    { name: 'Phrasal Verbs', icon: 'phrasal', words: shuffle(vocabPhrasal) },
    { name: 'Collocations', icon: 'collocations', words: shuffle(vocabCollocations) },
  ]
}

// ==================== READING (large pool, endless flow) ====================

const handWrittenReadings = [
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

const extraReadings = [
  {
    id: 6, title: 'The Little Bakery', level: 'Beginner', icon: 'key',
    content: `Mrs. Patel opened her bakery at five in the morning every day. She made fresh bread, cakes, and cookies. Her bakery was small, but it was always full of customers. People loved her warm smile and delicious food.

One morning, a young man came in looking worried. He had forgotten his wallet at home. "Don't worry," said Mrs. Patel. "Take the bread. You can pay tomorrow." The man was very grateful. He came back the next day and paid double.

Years passed, and the young man became a successful businessman. He never forgot Mrs. Patel's kindness. He helped her open a second bakery. "Kindness always comes back," Mrs. Patel said with a smile.`,
    questions: [
      { q: 'What time does Mrs. Patel open her bakery?', options: ['At 5 AM', 'At 6 AM', 'At 7 AM', 'At 8 AM'], answer: 0 },
      { q: 'Why was the young man worried?', options: ['He lost his job', 'He forgot his wallet', 'He was late', 'He was sick'], answer: 1 },
      { q: 'What happened years later?', options: ['The bakery closed', 'The man helped open a second bakery', 'Mrs. Patel retired', 'The man moved away'], answer: 1 },
    ]
  },
  {
    id: 7, title: 'The Marathon Runner', level: 'Intermediate', icon: 'work',
    content: `When Daniel was forty, he decided to run a marathon. He had never run more than a few kilometers in his life. His friends laughed at him. "You're too old to start running!" they said.

Daniel didn't listen. He started training every morning before work. The first week was very hard. His legs hurt, and he wanted to quit. But he kept going. He ran a little farther each day.

After six months of training, Daniel ran his first marathon. He finished in four hours and twenty minutes. He didn't win any medals, but he crossed the finish line. His friends stopped laughing. "If Daniel can do it, I can too!" said one of them.

The next year, Daniel's friends joined him at the starting line.`,
    questions: [
      { q: 'How old was Daniel when he decided to run?', options: ['Thirty', 'Forty', 'Fifty', 'Sixty'], answer: 1 },
      { q: 'What did Daniel do before work?', options: ['He slept', 'He trained', 'He cooked', 'He watched TV'], answer: 1 },
      { q: 'How long did it take Daniel to finish?', options: ['3 hours', '4 hours 20 minutes', '5 hours', '6 hours'], answer: 1 },
    ]
  },
  {
    id: 8, title: 'The Smart City', level: 'Advanced', icon: 'climate',
    content: `Cities around the world are becoming "smart." This means they use technology to improve the lives of their residents. Smart cities have sensors that monitor traffic, air quality, and energy use. This information helps city officials make better decisions.

One example is smart traffic lights. These lights change based on how many cars are on the road. This reduces traffic jams and pollution. Another example is smart waste management. Bins send a signal when they are full, so trucks only visit the ones that need emptying.

Smart cities also use technology for safety. Cameras and sensors can detect problems quickly, and emergency services can respond faster. Some cities even use apps that let residents report issues like broken streetlights.

However, smart cities are not perfect. They are expensive to build, and they raise questions about privacy. Governments must balance the benefits of technology with the rights of citizens. The future of cities depends on finding this balance.`,
    questions: [
      { q: 'What does a "smart city" use?', options: ['More workers', 'Technology', 'More roads', 'Bigger buildings'], answer: 1 },
      { q: 'How do smart traffic lights work?', options: ['They are always green', 'They change based on traffic', 'They are controlled by police', 'They are removed at night'], answer: 1 },
      { q: 'What is a problem with smart cities?', options: ['They are too small', 'They are expensive and raise privacy questions', 'They have no technology', 'They are too quiet'], answer: 1 },
    ]
  },
  {
    id: 9, title: 'The Kind Neighbor', level: 'Beginner', icon: 'museum',
    content: `Mr. Khan was seventy years old and lived alone. His children had moved to other countries for work. Every morning, he sat on his balcony, drinking tea and watching the street.

One day, a new family moved into the apartment next door. They had two young children. At first, Mr. Khan was shy and stayed inside. But the children were friendly. They waved at him every day.

One evening, the children knocked on his door. "We brought you some food!" they said. Their mother had made biryani. Mr. Khan was touched. He invited them in and told them stories about his life.

From that day, the children visited him every week. They helped him with his shopping and listened to his stories. Mr. Khan learned that family is not just about blood. Sometimes, the best family is the one you choose.`,
    questions: [
      { q: 'Where had Mr. Khan\'s children moved?', options: ['Another city', 'Other countries', 'A village', 'A hostel'], answer: 1 },
      { q: 'What did the children bring Mr. Khan?', options: ['Tea', 'Food', 'Flowers', 'A book'], answer: 1 },
      { q: 'What lesson did Mr. Khan learn?', options: ['Children are noisy', 'Family is about blood only', 'Family can be chosen', 'He should move away'], answer: 2 },
    ]
  },
  {
    id: 10, title: 'How Solar Energy Works', level: 'Advanced', icon: 'communication',
    content: `Solar energy is the energy we get from the sun. It is one of the cleanest sources of power available. Solar panels, which are usually placed on rooftops, capture sunlight and turn it into electricity.

The process is quite simple. Solar panels contain special materials called semiconductors, usually silicon. When sunlight hits these materials, it causes electrons to move. This movement creates an electric current, which can power homes and businesses.

Solar energy has many advantages. It is renewable, meaning it will never run out. It produces no pollution, which helps fight climate change. And once the panels are installed, the electricity they produce is almost free.

There are some disadvantages too. Solar panels do not work well at night or on very cloudy days. They also take up space and can be expensive to install. However, the cost of solar panels has fallen dramatically in recent years, and battery technology continues to improve.

Many experts believe that solar energy will play a major role in the world's future power supply.`,
    questions: [
      { q: 'What do solar panels capture?', options: ['Wind', 'Sunlight', 'Water', 'Heat from the ground'], answer: 1 },
      { q: 'What material are solar panels usually made of?', options: ['Copper', 'Silicon', 'Glass', 'Plastic'], answer: 1 },
      { q: 'When do solar panels not work well?', options: ['In summer', 'At night and on cloudy days', 'In cities', 'In winter only'], answer: 1 },
    ]
  },
  {
    id: 11, title: 'The Market Day', level: 'Beginner', icon: 'key',
    content: `Every Friday, the town square became a big market. Farmers brought vegetables, fruit, and eggs. Craftsmen sold handmade bags and pottery. There was music and the smell of fresh food everywhere.

Aisha loved market day. She walked slowly between the stalls, looking at everything. She stopped at a stall selling colorful scarves. "This one is beautiful," she said, picking up a blue scarf. "How much is it?"

"Two hundred rupees," said the seller. Aisha smiled and paid. She wrapped the scarf around her neck and walked home happily.

When she got home, her mother saw the scarf and smiled. "You have good taste, my daughter." Aisha promised to go to the market with her mother next Friday.`,
    questions: [
      { q: 'When does the market happen?', options: ['Monday', 'Friday', 'Sunday', 'Saturday'], answer: 1 },
      { q: 'What did Aisha buy?', options: ['A bag', 'A scarf', 'Some fruit', 'A pot'], answer: 1 },
      { q: 'How much did the scarf cost?', options: ['100 rupees', '200 rupees', '300 rupees', '500 rupees'], answer: 1 },
    ]
  },
  {
    id: 12, title: 'The History of Tea', level: 'Intermediate', icon: 'museum',
    content: `Tea is the most popular drink in the world after water. Its history goes back thousands of years. According to legend, a Chinese emperor discovered tea around 2737 BC when some leaves fell into his pot of boiling water.

For centuries, tea was only consumed in China. It was a luxury drink for the rich. Later, traders carried tea to other parts of Asia, and then to Europe. By the 1600s, tea had become popular in England, where it was served in special tea houses.

Different cultures developed their own tea traditions. In Japan, the tea ceremony became an art form. In England, afternoon tea became a social event. In Pakistan and India, chai is a daily part of life, often served with milk and sugar.

Today, people drink tea in every country on Earth. Whether you prefer green tea, black tea, or chai, you are taking part in a tradition that is thousands of years old.`,
    questions: [
      { q: 'Who discovered tea according to legend?', options: ['An English king', 'A Chinese emperor', 'A Japanese samurai', 'An Indian prince'], answer: 1 },
      { q: 'When did tea become popular in England?', options: ['By the 1600s', 'By the 1700s', 'By the 1800s', 'By the 1500s'], answer: 0 },
      { q: 'How is chai often served in Pakistan?', options: ['With lemon', 'With milk and sugar', 'Cold', 'Without sugar'], answer: 1 },
    ]
  },
  {
    id: 13, title: 'The Night Market', level: 'Intermediate', icon: 'work',
    content: `In many cities, the day does not end when the sun sets. Night markets come alive with bright lights, loud music, and the smell of street food. These markets are popular with both locals and tourists.

At a night market, you can find almost anything. There are clothes, electronics, toys, and traditional crafts. But the main attraction is the food. You can try grilled meat, noodles, fresh juice, and desserts you have never seen before.

Bargaining is a normal part of visiting a night market. Sellers expect customers to negotiate the price. A friendly smile and a few words in the local language can help you get a better deal.

Night markets are more than just places to shop. They are social spaces where families meet, friends gather, and strangers become friends. For many people, a night market is the heart of their city.`,
    questions: [
      { q: 'What is the main attraction of a night market?', options: ['The music', 'The food', 'The lights', 'The toys'], answer: 1 },
      { q: 'What is a normal part of visiting a night market?', options: ['Buying everything', 'Bargaining', 'Dressing up', 'Arriving early'], answer: 1 },
      { q: 'What do night markets represent for many people?', options: ['A business', 'The heart of their city', 'A problem', 'A tradition from abroad'], answer: 1 },
    ]
  },
  {
    id: 14, title: 'Why We Dream', level: 'Advanced', icon: 'communication',
    content: `Every night, while we sleep, our brains create dreams. For thousands of years, people have wondered why we dream. Ancient cultures believed dreams were messages from gods. Today, scientists still do not have all the answers, but they have some interesting theories.

One theory is that dreams help us process our emotions. During the day, we experience many feelings. At night, the brain sorts through these experiences while we dream. This may be why people who study a new skill often dream about it.

Another theory is that dreams help us solve problems. Some famous inventors and writers have found solutions in their dreams. The chemist Dmitri Mendeleev said he saw the periodic table in a dream.

Dreams can also be strange and frightening. Nightmares are common, especially in children. Scientists believe nightmares may be the brain's way of preparing us for dangers, a leftover from our ancestors' lives in the wild.

Whatever the reason, dreams are a fascinating part of being human.`,
    questions: [
      { q: 'What did ancient cultures believe about dreams?', options: ['They were random', 'They were messages from gods', 'They were harmful', 'They were ignored'], answer: 1 },
      { q: 'What is one theory about why we dream?', options: ['To waste time', 'To process emotions', 'To remember everything', 'To rest the eyes'], answer: 1 },
      { q: 'Who saw the periodic table in a dream?', options: ['Einstein', 'Mendeleev', 'Newton', 'Darwin'], answer: 1 },
    ]
  },
  {
    id: 15, title: 'The First Rain', level: 'Beginner', icon: 'key',
    content: `After months of hot, dry weather, the first rain finally came. Dark clouds gathered in the sky, and the wind began to blow. Children ran into the streets, laughing and holding out their hands.

The rain fell softly at first, then harder. The dry ground drank the water quickly. Puddles formed on the roads, and the air smelled fresh and clean. Farmers looked at the sky with joy. Their crops would grow now.

When the rain stopped, a beautiful rainbow appeared. Everyone came out of their houses. Neighbors talked and smiled. The rain had brought the whole town together.

That evening, the children played in the puddles until their mothers called them home. They fell asleep that night to the sound of water dripping from the roof.`,
    questions: [
      { q: 'How long had the weather been dry?', options: ['Weeks', 'Months', 'Days', 'Years'], answer: 1 },
      { q: 'How did the farmers feel?', options: ['Worried', 'Joyful', 'Angry', 'Tired'], answer: 1 },
      { q: 'What appeared after the rain stopped?', options: ['A rainbow', 'Snow', 'Fog', 'Stars'], answer: 0 },
    ]
  },
  {
    id: 16, title: 'The Power of Habits', level: 'Intermediate', icon: 'work',
    content: `We all have habits - the things we do automatically every day. Some habits are good, like brushing our teeth or reading before bed. Others are bad, like staying up too late or eating too much sugar. Habits shape our lives more than we realize.

Scientists say that habits are formed in a part of the brain called the basal ganglia. When we repeat an action many times, our brain creates a pattern. After a while, we do the action without thinking.

The good news is that we can change our habits. It usually takes about 66 days for a new habit to become automatic. The key is to start small and be consistent. If you want to exercise, start with five minutes a day. If you want to read more, read one page every night.

Experts also suggest linking new habits to old ones. For example, drink a glass of water right after brushing your teeth. The old habit reminds you of the new one.

Changing habits takes time and patience, but the results are worth it. Small actions every day can lead to big changes over the years.`,
    questions: [
      { q: 'Where are habits formed in the brain?', options: ['The cerebrum', 'The basal ganglia', 'The cortex', 'The cerebellum'], answer: 1 },
      { q: 'How long does it usually take to form a new habit?', options: ['About 21 days', 'About 66 days', 'About 100 days', 'About 30 days'], answer: 1 },
      { q: 'What do experts suggest linking new habits to?', options: ['Old habits', 'New people', 'Weekends', 'Holidays'], answer: 0 },
    ]
  },
  {
    id: 17, title: 'The Library Cat', level: 'Beginner', icon: 'museum',
    content: `The city library had an unusual employee: a cat named Whiskers. Whiskers was a small orange cat who had walked into the library one cold winter day and decided to stay.

The librarians loved Whiskers. He slept on the history books, sat on the computers, and greeted visitors at the door. Children especially loved him. Many children came to the library just to see Whiskers, and while they were there, they borrowed books.

Whiskers had one rule: he must never go into the book storage room. But one day, someone left the door open, and Whiskers went in. The librarians found him sleeping on a box of old maps.

Instead of being angry, they made Whiskers the official library cat. They even gave him his own name tag. Whiskers became famous, and the library received visitors from other towns who wanted to meet him. The cat who loved books had made the library famous too.`,
    questions: [
      { q: 'What is the library cat\'s name?', options: ['Oscar', 'Whiskers', 'Tom', 'Milo'], answer: 1 },
      { q: 'Where did Whiskers sleep?', options: ['Outside', 'On the history books', 'In a box', 'On the roof'], answer: 1 },
      { q: 'What happened after Whiskers became famous?', options: ['He left the library', 'Visitors came to meet him', 'The library closed', 'He got a house'], answer: 1 },
    ]
  },
  {
    id: 18, title: 'The Water Crisis', level: 'Advanced', icon: 'climate',
    content: `Water is essential for life, yet millions of people around the world do not have access to clean water. According to the United Nations, nearly two billion people live in areas facing water scarcity.

The causes of the water crisis are complex. Climate change is making droughts more frequent and severe. Population growth means more people need water. And pollution contaminates rivers, lakes, and groundwater. Agriculture uses about 70% of the world's freshwater, so inefficient farming makes the problem worse.

The solutions are equally varied. Building better infrastructure can reduce water loss, since some cities lose up to 30% of their water through leaking pipes. Rainwater harvesting is another simple but effective solution. Farmers can use drip irrigation, which delivers water directly to plant roots and uses much less water.

Education also plays a role. When people understand how to conserve water, they use less of it. Small changes - like fixing a dripping tap or taking shorter showers - can add up to a big difference.

Water is not an endless resource. Managing it wisely is one of the most important challenges of our time.`,
    questions: [
      { q: 'How many people face water scarcity?', options: ['Nearly one billion', 'Nearly two billion', 'Nearly three billion', 'Nearly half a billion'], answer: 1 },
      { q: 'What uses about 70% of the world\'s freshwater?', options: ['Industry', 'Agriculture', 'Households', 'Tourism'], answer: 1 },
      { q: 'How much water can cities lose through leaking pipes?', options: ['10%', 'Up to 30%', '50%', '5%'], answer: 1 },
    ]
  },
  {
    id: 19, title: 'The Pen Pal Project', level: 'Intermediate', icon: 'communication',
    content: `Ms. Ali's English class was studying countries around the world. Instead of using only textbooks, she had a better idea. She arranged for her students to have pen pals in another country.

Her students were excited. They wrote their first letters, introducing themselves and asking questions about life in the other country. Weeks later, the replies arrived. The students gathered around, eager to see what their pen pals had written.

The letters were full of interesting details. The students learned about different foods, holidays, and school life. They discovered that even though their lives were different, they shared the same dreams - good grades, good friends, and happy families.

The pen pal project continued for the whole school year. Some students exchanged emails instead of letters, which was faster. By the end of the year, the students had improved their English writing skills and made friends on the other side of the world.

Ms. Ali smiled as she watched her students. "Language," she said, "is a bridge between people."`,
    questions: [
      { q: 'What did the students learn about first?', options: ['Weather', 'Life in the other country', 'History', 'Politics'], answer: 1 },
      { q: 'What did the students share with their pen pals?', options: ['The same dreams', 'The same houses', 'The same names', 'The same schools'], answer: 0 },
      { q: 'What did Ms. Ali call language?', options: ['A subject', 'A bridge between people', 'A game', 'A job'], answer: 1 },
    ]
  },
  {
    id: 20, title: 'The Clock Tower', level: 'Beginner', icon: 'key',
    content: `In the center of the old town stood a clock tower. It was over 300 years old. Every hour, its big bell rang, and everyone in the town could hear it.

One day, the clock stopped. The bell did not ring at noon. The town was quiet. People checked their watches and phones, but they missed the sound of the bell.

A young watchmaker named Ravi offered to fix it. He climbed to the top of the tower and examined the old clock carefully. The gears were worn and rusty. He worked on it for three days.

On the third day, at exactly noon, the bell rang again. The whole town cheered. The mayor thanked Ravi and asked him how much they owed him. "Just let me ring the bell every New Year's Eve," Ravi said with a smile.`,
    questions: [
      { q: 'How old is the clock tower?', options: ['100 years', 'Over 300 years', '500 years', '50 years'], answer: 1 },
      { q: 'What happened when the clock stopped?', options: ['The town was quiet', 'People slept more', 'The tower fell', 'The bell rang louder'], answer: 0 },
      { q: 'How long did Ravi work on the clock?', options: ['One day', 'Two days', 'Three days', 'A week'], answer: 2 },
    ]
  },
]

export function getReadings() {
  return shuffle([...handWrittenReadings, ...extraReadings])
}

// ==================== LISTENING (large pool, endless flow) ====================

const extraListening = [
  {
    id: 5, title: 'The Morning Routine', level: 'Beginner', icon: 'weather',
    transcript: 'My morning routine is simple. I wake up at six, drink a glass of warm water, and go for a short walk. Then I take a shower, have breakfast, and leave for work at eight. On weekends, I sleep a little longer and make pancakes for my family.',
    questions: [
      { q: 'What time does the speaker wake up?', options: ['5 AM', '6 AM', '7 AM', '8 AM'], answer: 1 },
      { q: 'What does the speaker do after waking up?', options: ['Checks email', 'Drinks warm water and walks', 'Cooks breakfast', 'Watches TV'], answer: 1 },
      { q: 'What does the speaker make on weekends?', options: ['Toast', 'Pancakes', 'Eggs', 'Cereal'], answer: 1 },
    ]
  },
  {
    id: 6, title: 'The Job Interview', level: 'Intermediate', icon: 'work',
    transcript: 'Interviewer: Good morning, Ayesha. Thank you for coming. Ayesha: Thank you for having me. Interviewer: So, tell me about yourself. Ayesha: I graduated two years ago with a degree in marketing. I have worked at a small company where I managed social media and wrote reports. Interviewer: Why do you want to work here? Ayesha: I admire your company\'s creative projects, and I want to grow as a professional. Interviewer: Great. We will contact you within a week.',
    questions: [
      { q: 'What did Ayesha study?', options: ['Engineering', 'Marketing', 'Medicine', 'Design'], answer: 1 },
      { q: 'What did Ayesha manage at her old job?', options: ['A shop', 'Social media', 'A team of 20', 'The budget'], answer: 1 },
      { q: 'When will they contact Ayesha?', options: ['Tomorrow', 'Within a week', 'In a month', 'Today'], answer: 1 },
    ]
  },
  {
    id: 7, title: 'The Science Fair', level: 'Beginner', icon: 'news',
    transcript: 'Our school held a science fair last Thursday. There were forty projects from students of all grades. My team built a small robot that could pick up objects. We worked on it for two months. The judges liked our project, and we won second place. Next year, we want to build a robot that can sort recycling.',
    questions: [
      { q: 'When was the science fair held?', options: ['Monday', 'Thursday', 'Friday', 'Saturday'], answer: 1 },
      { q: 'What did the speaker\'s team build?', options: ['A rocket', 'A robot', 'A bridge', 'A computer'], answer: 1 },
      { q: 'What place did they win?', options: ['First', 'Second', 'Third', 'Fourth'], answer: 1 },
    ]
  },
  {
    id: 8, title: 'The Travel Guide', level: 'Advanced', icon: 'travel',
    transcript: 'Welcome to Lahore, a city with over a thousand years of history. Start your visit at the Badshahi Mosque, one of the largest mosques in the world. From there, walk to the Lahore Fort. In the evening, visit the Food Street, where you can taste local dishes. If you have time, take a day trip to Wagah Border to see the famous flag ceremony. The best time to visit is between November and February, when the weather is pleasant.',
    questions: [
      { q: 'How many years of history does Lahore have?', options: ['Over 500', 'Over 1000', 'Over 2000', 'Over 300'], answer: 1 },
      { q: 'What is one of the largest mosques in the world?', options: ['Lahore Fort', 'Badshahi Mosque', 'Data Darbar', 'Minar-e-Pakistan'], answer: 1 },
      { q: 'When is the best time to visit?', options: ['June to August', 'November to February', 'March to May', 'September to October'], answer: 1 },
    ]
  },
  {
    id: 9, title: 'The Sports Coach', level: 'Intermediate', icon: 'restaurant',
    transcript: 'Coach Ahmed has been teaching swimming for fifteen years. He says the most important thing is not speed, but confidence. Many of his students are children who are afraid of water. He starts by teaching them to float. "Once you can float," he says, "you can learn anything." His students have won many competitions, but he is proudest of the shy children who become brave swimmers.',
    questions: [
      { q: 'How long has Coach Ahmed been teaching?', options: ['5 years', '15 years', '20 years', '10 years'], answer: 1 },
      { q: 'What does Coach Ahmed say is most important?', options: ['Speed', 'Confidence', 'Strength', 'Style'], answer: 1 },
      { q: 'What does he start by teaching?', options: ['Diving', 'Floating', 'Breathing', 'Racing'], answer: 1 },
    ]
  },
  {
    id: 10, title: 'The Planet Mars', level: 'Advanced', icon: 'news',
    transcript: 'Mars is the fourth planet from the Sun and our closest neighbor. It is called the Red Planet because of its rusty color. In recent years, rovers have explored its surface, sending back pictures and samples. Scientists have found evidence that water once flowed on Mars. This has raised the question: could life have existed there? Space agencies are planning missions to bring Martian rocks back to Earth, and someday, humans may walk on Mars themselves.',
    questions: [
      { q: 'Which planet is Mars?', options: ['Second', 'Fourth', 'Sixth', 'Eighth'], answer: 1 },
      { q: 'Why is Mars called the Red Planet?', options: ['It is hot', 'Its rusty color', 'It has red rocks', 'It is close to the Sun'], answer: 1 },
      { q: 'What have scientists found evidence of?', options: ['Life', 'Water once flowing', 'Trees', 'Volcanoes'], answer: 1 },
    ]
  },
  {
    id: 11, title: 'The New Student', level: 'Beginner', icon: 'weather',
    transcript: 'Hello everyone! My name is Leo, and I just moved here from Brazil. I am sixteen years old, and I love football and video games. I am a little nervous because everything is new, but everyone has been very friendly. My favorite subject is science, and I hope to study engineering one day. If you want to play football after school, come and join me!',
    questions: [
      { q: 'Where is Leo from?', options: ['Spain', 'Brazil', 'Portugal', 'Argentina'], answer: 1 },
      { q: 'What is Leo\'s favorite subject?', options: ['Math', 'Science', 'History', 'English'], answer: 1 },
      { q: 'What does Leo want to study?', options: ['Medicine', 'Engineering', 'Law', 'Art'], answer: 1 },
    ]
  },
  {
    id: 12, title: 'The Doctor\'s Advice', level: 'Intermediate', icon: 'work',
    transcript: 'Doctor: Good afternoon. What can I do for you? Patient: I have had a headache for three days. Doctor: How many hours do you sleep? Patient: About five hours. I work late. Doctor: That is the problem. Your body needs rest. Sleep at least seven hours, drink more water, and take a break from screens every hour. Come back next week if the headache continues. Patient: Thank you, doctor.',
    questions: [
      { q: 'How long has the patient had a headache?', options: ['One day', 'Three days', 'A week', 'Two days'], answer: 1 },
      { q: 'How many hours does the patient sleep?', options: ['Seven', 'Five', 'Eight', 'Six'], answer: 1 },
      { q: 'What did the doctor advise?', options: ['Take medicine', 'Sleep more and drink water', 'Exercise more', 'Eat less'], answer: 1 },
    ]
  },
]

export function getListeningExercises() {
  return shuffle([...extraListening])
}

// ==================== WRITING (large pool, endless flow) ====================

const extraPrompts = [
  { title: 'My Favorite Season', type: 'Paragraph', prompt: 'Write about your favorite season of the year. Describe the weather, the activities you enjoy, and explain why you love it.' },
  { title: 'A Person I Admire', type: 'Paragraph', prompt: 'Describe a person you admire. It could be a family member, a teacher, or a famous person. Explain why you look up to them.' },
  { title: 'My Dream Job', type: 'Essay', prompt: 'What is your dream job? Describe what it involves, why you want it, and what steps you would take to achieve it.' },
  { title: 'The Best Advice I Received', type: 'Story', prompt: 'Write about the best piece of advice you have ever received. Who gave it to you, and how did it help you?' },
  { title: 'A Place I Want to Visit', type: 'Paragraph', prompt: 'Describe a place you have always wanted to visit. Include details about what you would see, do, and eat there.' },
  { title: 'Should Students Wear Uniforms?', type: 'Essay', prompt: 'Write an essay arguing for or against school uniforms. Give at least three reasons to support your opinion.' },
  { title: 'My Favorite Book or Movie', type: 'Paragraph', prompt: 'Write about your favorite book or movie. Summarize the story briefly and explain why you recommend it.' },
  { title: 'The Importance of Friendship', type: 'Essay', prompt: 'Write an essay on why friendship is important in life. Include examples from your own experience.' },
  { title: 'A Difficult Decision', type: 'Story', prompt: 'Tell a story about a difficult decision you had to make. Describe the options, your thoughts, and the outcome.' },
  { title: 'Life in the Year 2050', type: 'Essay', prompt: 'Imagine life in the year 2050. Write about how technology, transport, and daily life might be different.' },
  { title: 'My City', type: 'Paragraph', prompt: 'Describe your city or town. Mention its famous places, food, people, and what makes it special to you.' },
  { title: 'Social Media: Good or Bad?', type: 'Essay', prompt: 'Write an essay about the effects of social media. Discuss both the positive and negative sides.' },
  { title: 'A Letter to a Friend', type: 'Email', prompt: 'Write an email to a friend who moved to another city. Tell them about your life and invite them to visit.' },
  { title: 'My Most Memorable Day', type: 'Story', prompt: 'Describe the most memorable day of your life. What happened, who was with you, and why was it special?' },
  { title: 'Healthy Habits', type: 'Paragraph', prompt: 'Write about healthy habits people should adopt. Include eating, exercise, sleep, and mental health tips.' },
  { title: 'If I Could Meet Any Historical Figure', type: 'Story', prompt: 'If you could meet any person from history, who would you choose? Write about what you would ask them and why.' },
  { title: 'The Role of Money in Happiness', type: 'Essay', prompt: 'Write an essay discussing whether money can buy happiness. Support your opinion with examples.' },
  { title: 'My Favorite Food', type: 'Paragraph', prompt: 'Describe your favorite food in detail. Include how it is made, how it tastes, and when you usually eat it.' },
  { title: 'The Value of Learning English', type: 'Essay', prompt: 'Write an essay on why learning English is valuable. Include personal, academic, and career reasons.' },
  { title: 'A Day Without Technology', type: 'Story', prompt: 'Imagine spending a whole day without phones, computers, or television. Write a story about your day.' },
  { title: 'My Goals for This Year', type: 'Paragraph', prompt: 'Write about your goals for this year. What do you want to achieve, and what is your plan?' },
  { title: 'A Complaint Letter', type: 'Email', prompt: 'Write a formal email complaining about a product or service you received. Be polite but clear about the problem.' },
]

export function getWritingPrompts() {
  return shuffle([...extraPrompts])
}
