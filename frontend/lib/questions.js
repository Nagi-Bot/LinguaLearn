// Infinite question generator - algorithmic generation for endless gameplay

const tenses = ['present simple', 'present continuous', 'present perfect', 'past simple', 'past continuous', 'future simple', 'future continuous']
const subjects = ['I', 'You', 'She', 'He', 'It', 'We', 'They', 'The cat', 'The dog', 'My friend', 'The teacher', 'The students', 'Everyone']
const verbs = ['run', 'eat', 'read', 'write', 'play', 'work', 'study', 'speak', 'listen', 'watch', 'cook', 'sing', 'dance', 'drive', 'swim', 'travel', 'teach', 'learn', 'build', 'draw', 'walk', 'talk', 'paint', 'climb', 'jump', 'help', 'open', 'close', 'clean', 'visit']
const objects = ['a book', 'music', 'dinner', 'the game', 'English', 'a letter', 'a song', 'a picture', 'a car', 'a house', 'a story', 'a poem', 'a cake', 'a plan', 'a movie', 'a garden', 'a computer', 'a bicycle', 'a restaurant', 'a mountain']
const adjectives = ['beautiful', 'intelligent', 'interesting', 'important', 'wonderful', 'fantastic', 'amazing', 'delicious', 'exciting', 'peaceful', 'helpful', 'careful', 'friendly', 'patient', 'polite', 'brave', 'clever', 'creative', 'honest', 'kind']
const adverbs = ['quickly', 'slowly', 'carefully', 'eagerly', 'quietly', 'loudly', 'happily', 'sadly', 'politely', 'badly', 'well', 'hard', 'gently', 'firmly', 'wisely']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---- seen-questions tracking (localStorage) to minimize repeats ----
const SEEN_KEY = 'lingua_seen_questions'
function getSeen() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}
  } catch { return {} }
}
function saveSeen(seen) {
  try {
    const keys = Object.keys(seen)
    if (keys.length > 500) {
      keys.slice(0, 250).forEach(k => delete seen[k])
    }
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  } catch {}
}
export function markQuestionSeen(category, id) {
  const seen = getSeen()
  seen[`${category}:${id}`] = Date.now()
  saveSeen(seen)
}
function isSeen(category, id) {
  const seen = getSeen()
  const t = seen[`${category}:${id}`]
  if (!t) return false
  const age = (Date.now() - t) / 86400000
  return age < 7
}

// ---- GRAMMAR ----
const grammarVerbs = [
  { base: 'go', past: 'went', pastPart: 'gone', ing: 'going' },
  { base: 'eat', past: 'ate', pastPart: 'eaten', ing: 'eating' },
  { base: 'take', past: 'took', pastPart: 'taken', ing: 'taking' },
  { base: 'see', past: 'saw', pastPart: 'seen', ing: 'seeing' },
  { base: 'make', past: 'made', pastPart: 'made', ing: 'making' },
  { base: 'come', past: 'came', pastPart: 'come', ing: 'coming' },
  { base: 'know', past: 'knew', pastPart: 'known', ing: 'knowing' },
  { base: 'get', past: 'got', pastPart: 'gotten', ing: 'getting' },
  { base: 'give', past: 'gave', pastPart: 'given', ing: 'giving' },
  { base: 'find', past: 'found', pastPart: 'found', ing: 'finding' },
  { base: 'think', past: 'thought', pastPart: 'thought', ing: 'thinking' },
  { base: 'tell', past: 'told', pastPart: 'told', ing: 'telling' },
  { base: 'write', past: 'wrote', pastPart: 'written', ing: 'writing' },
  { base: 'speak', past: 'spoke', pastPart: 'spoken', ing: 'speaking' },
  { base: 'read', past: 'read', pastPart: 'read', ing: 'reading' },
  { base: 'buy', past: 'bought', pastPart: 'bought', ing: 'buying' },
  { base: 'bring', past: 'brought', pastPart: 'brought', ing: 'bringing' },
  { base: 'build', past: 'built', pastPart: 'built', ing: 'building' },
  { base: 'teach', past: 'taught', pastPart: 'taught', ing: 'teaching' },
  { base: 'run', past: 'ran', pastPart: 'run', ing: 'running' },
  { base: 'sing', past: 'sang', pastPart: 'sung', ing: 'singing' },
  { base: 'swim', past: 'swam', pastPart: 'swum', ing: 'swimming' },
  { base: 'drive', past: 'drove', pastPart: 'driven', ing: 'driving' },
  { base: 'fly', past: 'flew', pastPart: 'flown', ing: 'flying' },
  { base: 'forget', past: 'forgot', pastPart: 'forgotten', ing: 'forgetting' },
]

function generateGrammarQuestion() {
  const type = Math.floor(Math.random() * 8)
  const subject = pick(subjects)
  const verb = pick(verbs)
  const obj = pick(objects)
  const adj = pick(adjectives)
  const adv = pick(adverbs)

  switch (type) {
    case 0: { // Subject-verb agreement
      const isPlural = ['I', 'We', 'They', 'The students', 'Everyone'].includes(subject) || subject.includes('students')
      const correctV = verb + (subject === 'I' || isPlural ? '' : 's')
      const wrongs = [verb + (verb.endsWith('e') ? 's' : 'es'), verb + 'ing', verb + 'ed']
      const options = shuffle([correctV, ...wrongs.filter((v, i) => v !== correctV)])
      return {
        question: `${subject} ___ ${adv} ${obj}.`,
        options,
        correct: options.indexOf(correctV),
      }
    }
    case 1: { // Irregular verb forms
      const v = pick(grammarVerbs)
      const forms = [v.base, v.past, v.pastPart, v.ing]
      const correct = v.past
      const opts = shuffle(forms)
      return {
        question: `What is the past tense of "${v.base}"?`,
        options: opts,
        correct: opts.indexOf(correct),
        category: 'Grammar',
      }
    }
    case 2: { // Article (a/an/the)
      const words = ['apple', 'orange', 'hour', 'university', 'honest man', 'elephant', 'umbrella', 'one-way street', 'European country', 'hero', 'ice cream', 'artist', 'owl', 'engineer', 'idea', 'evening', 'American', 'MBA', 'FBI agent', 'X-ray']
      const word = pick(words)
      const isVowel = /^[aeiou]/i.test(word)
      const correctArticle = isVowel ? 'an' : 'a'
      const opts = shuffle(['a', 'an', 'the', 'some'])
      return {
        question: `Choose the correct article: "___ ${word}"`,
        options: opts,
        correct: opts.indexOf(correctArticle),
        category: 'Grammar',
      }
    }
    case 3: { // Preposition
      const preps = [
        { q: 'She has been studying ___ three hours.', correct: 'for' },
        { q: 'He has lived here ___ 2015.', correct: 'since' },
        { q: 'The meeting starts ___ 9 AM.', correct: 'at' },
        { q: 'We will meet ___ Monday.', correct: 'on' },
        { q: 'The book is ___ the table.', correct: 'on' },
        { q: 'She is afraid ___ spiders.', correct: 'of' },
        { q: 'He is good ___ mathematics.', correct: 'at' },
        { q: 'I am interested ___ learning Spanish.', correct: 'in' },
        { q: 'She depends ___ her parents.', correct: 'on' },
        { q: 'We arrived ___ the airport on time.', correct: 'at' },
        { q: 'The cat is hiding ___ the bed.', correct: 'under' },
        { q: 'They walked ___ the park together.', correct: 'through' },
        { q: 'I will be there ___ an hour.', correct: 'in' },
        { q: 'She goes to work ___ bus.', correct: 'by' },
        { q: 'The gift is ___ you.', correct: 'for' },
      ]
      const p = pick(preps)
      const opts = shuffle(['in', 'on', 'at', 'for', 'since', 'by', 'under', 'through', 'of', 'with'].filter(x => x !== p.correct).slice(0, 3).concat(p.correct))
      return {
        question: p.q,
        options: opts,
        correct: opts.indexOf(p.correct),
        category: 'Grammar',
      }
    }
    case 4: { // Modal verbs
      const modals = [
        { q: 'You ___ finish your homework before playing.', correct: 'must' },
        { q: '___ I come in?', correct: 'May' },
        { q: 'She ___ speak three languages.', correct: 'can' },
        { q: 'You ___ see a doctor.', correct: 'should' },
        { q: 'It ___ rain tomorrow.', correct: 'might' },
        { q: '___ you help me with this?', correct: 'Could' },
        { q: 'You ___ not smoke here.', correct: 'must' },
        { q: 'We ___ attend the meeting.', correct: 'should' },
        { q: 'He ___ be at home now.', correct: 'must' },
        { q: 'They ___ come to the party.', correct: 'will' },
      ]
      const m = pick(modals)
      const opts = shuffle(['can', 'must', 'should', 'may', 'might', 'will', 'could'].filter(x => x.toLowerCase() !== m.correct.toLowerCase()).slice(0, 3).concat(m.correct))
      return {
        question: m.q,
        options: opts,
        correct: opts.indexOf(m.correct),
        category: 'Grammar',
      }
    }
    case 5: { // Comparatives/superlatives
      const pairs = [
        { adj: 'good', comp: 'better', sup: 'best' },
        { adj: 'bad', comp: 'worse', sup: 'worst' },
        { adj: 'big', comp: 'bigger', sup: 'biggest' },
        { adj: 'small', comp: 'smaller', sup: 'smallest' },
        { adj: 'easy', comp: 'easier', sup: 'easiest' },
        { adj: 'happy', comp: 'happier', sup: 'happiest' },
        { adj: 'tall', comp: 'taller', sup: 'tallest' },
        { adj: 'fast', comp: 'faster', sup: 'fastest' },
        { adj: 'interesting', comp: 'more interesting', sup: 'most interesting' },
        { adj: 'beautiful', comp: 'more beautiful', sup: 'most beautiful' },
      ]
      const p = pick(pairs)
      const mode = Math.random() < 0.5
      const correct = mode ? p.comp : p.sup
      const opts = shuffle([p.comp, p.sup, p.adj, `more ${p.adj}`])
      return {
        question: mode
          ? `Which is the correct comparative form of "${p.adj}"?`
          : `Which is the correct superlative form of "${p.adj}"?`,
        options: opts,
        correct: opts.indexOf(correct),
        category: 'Grammar',
      }
    }
    case 6: { // Question words
      const qs = [
        { q: '___ is your name?', correct: 'What' },
        { q: '___ are you going?', correct: 'Where' },
        { q: '___ do you get up?', correct: 'When' },
        { q: '___ is that man?', correct: 'Who' },
        { q: '___ book is this?', correct: 'Whose' },
        { q: '___ did you do it?', correct: 'Why' },
        { q: '___ many books do you have?', correct: 'How' },
        { q: '___ is your favorite color?', correct: 'What' },
        { q: '___ old are you?', correct: 'How' },
        { q: '___ one do you prefer?', correct: 'Which' },
      ]
      const p = pick(qs)
      const opts = shuffle(['What', 'Where', 'When', 'Who', 'Whose', 'Why', 'How', 'Which'].filter(x => x !== p.correct).slice(0, 3).concat(p.correct))
      return {
        question: p.q,
        options: opts,
        correct: opts.indexOf(p.correct),
        category: 'Grammar',
      }
    }
    case 7: { // Passive voice
      const v = pick(grammarVerbs)
      const obj = pick(objects)
      const correct = `is ${v.pastPart}`
      const opts = shuffle([`is ${v.pastPart}`, `${v.base}`, `was ${v.pastPart}`, `is ${v.ing}`])
      return {
        question: `${obj.charAt(0).toUpperCase() + obj.slice(1)} ___ (${v.base}) every day. (passive voice)`,
        options: opts,
        correct: opts.indexOf(correct),
        category: 'Grammar',
      }
    }
  }
}

// ---- WORD BUILDER (60+ words) ----
const wordBuilderWords = [
  { word: 'BEAUTIFUL', hint: 'Very pleasing to look at' },
  { word: 'EDUCATION', hint: 'Process of learning' },
  { word: 'IMPORTANT', hint: 'Of great significance' },
  { word: 'DIFFERENT', hint: 'Not the same' },
  { word: 'KNOWLEDGE', hint: 'Information and skills' },
  { word: 'LANGUAGE', hint: 'System of communication' },
  { word: 'PRACTICE', hint: 'Repeated exercise' },
  { word: 'VOCABULARY', hint: 'Words in a language' },
  { word: 'SENTENCE', hint: 'Group of words' },
  { word: 'GRAMMAR', hint: 'Rules of language' },
  { word: 'COMPUTER', hint: 'Electronic device' },
  { word: 'HISTORY', hint: 'Study of the past' },
  { word: 'SCIENCE', hint: 'Systematic study' },
  { word: 'MUSICIAN', hint: 'One who plays music' },
  { word: 'CELEBRATE', hint: 'Mark a special occasion' },
  { word: 'ADVENTURE', hint: 'Exciting experience' },
  { word: 'FANTASTIC', hint: 'Extraordinarily good' },
  { word: 'HOSPITAL', hint: 'Medical facility' },
  { word: 'UNIVERSITY', hint: 'Higher education' },
  { word: 'TELEPHONE', hint: 'Communication device' },
  { word: 'CHOCOLATE', hint: 'Sweet food' },
  { word: 'EXCELLENT', hint: 'Extremely good' },
  { word: 'DANGEROUS', hint: 'Not safe' },
  { word: 'MYSTERIOUS', hint: 'Difficult to understand' },
  { word: 'GENERATION', hint: 'All people born at similar time' },
  { word: 'INDEPENDENT', hint: 'Free from outside control' },
  { word: 'OPPORTUNITY', hint: 'Chance for advancement' },
  { word: 'ENVIRONMENT', hint: 'Surroundings' },
  { word: 'EXPERIENCE', hint: 'Practical contact' },
  { word: 'CONFIDENCE', hint: 'Belief in oneself' },
  { word: 'DELICIOUS', hint: 'Very tasty' },
  { word: 'JOURNEY', hint: 'Long trip' },
  { word: 'WEATHER', hint: 'State of the atmosphere' },
  { word: 'FAMILY', hint: 'Group of relatives' },
  { word: 'FRIENDSHIP', hint: 'Relationship between friends' },
  { word: 'BREAKFAST', hint: 'First meal of the day' },
  { word: 'VEGETABLE', hint: 'Healthy plant food' },
  { word: 'TRANSPORT', hint: 'Moving people or goods' },
  { word: 'HOLIDAY', hint: 'Vacation time' },
  { word: 'HAPPINESS', hint: 'State of being happy' },
  { word: 'DICTIONARY', hint: 'Book of word meanings' },
  { word: 'MEMORIZE', hint: 'Learn by heart' },
  { word: 'EXERCISE', hint: 'Physical activity' },
  { word: 'MEDICINE', hint: 'Treatment for illness' },
  { word: 'RESTAURANT', hint: 'Place to eat out' },
  { word: 'SUPERMARKET', hint: 'Large food store' },
  { word: 'MOUNTAIN', hint: 'Very high hill' },
  { word: 'OCEAN', hint: 'Vast sea' },
  { word: 'PICTURE', hint: 'Visual representation' },
  { word: 'QUESTION', hint: 'Request for information' },
  { word: 'ANSWER', hint: 'Reply to a question' },
  { word: 'CHALLENGE', hint: 'Difficult task' },
  { word: 'STRATEGY', hint: 'Plan of action' },
  { word: 'DECISION', hint: 'Choice made' },
  { word: 'PROMISE', hint: 'Assurance of doing something' },
  { word: 'RESPONSIBLE', hint: 'Accountable for actions' },
  { word: 'SUCCESSFUL', hint: 'Achieving goals' },
  { word: 'PATIENT', hint: 'Calm and tolerant' },
  { word: 'FAVORITE', hint: 'Most liked' },
  { word: 'CULTURE', hint: 'Customs and traditions' },
  { word: 'TRADITION', hint: 'Custom handed down' },
  { word: 'CELEBRATION', hint: 'Festive occasion' },
  { word: 'IMAGINATION', hint: 'Creative thinking' },
  { word: 'UNDERSTAND', hint: 'Comprehend meaning' },
  { word: 'REMEMBER', hint: 'Recall from memory' },
  { word: 'TOGETHER', hint: 'In the company of others' },
  { word: 'ENJOYMENT', hint: 'Pleasure from something' },
  { word: 'DISCOVERY', hint: 'Finding something new' },
  { word: 'IMPROVEMENT', hint: 'Making better' },
  { word: 'ACHIEVEMENT', hint: 'Successful accomplishment' },
  { word: 'RESPECTFUL', hint: 'Showing respect' },
  { word: 'TRUSTWORTHY', hint: 'Deserving trust' },
  { word: 'WONDERFUL', hint: 'Extremely good' },
  { word: 'THOUGHTFUL', hint: 'Considerate of others' },
  { word: 'GRATEFUL', hint: 'Feeling thankful' },
  { word: 'COURAGEOUS', hint: 'Very brave' },
]

// ---- TENSE (algorithmic from irregular verbs) ----
function generateTenseQuestion() {
  const v = pick(grammarVerbs)
  const subject = pick(subjects.filter(s => !['I', 'We', 'You', 'They'].includes(s)))
  const singular = !['I', 'We', 'You', 'They'].includes(subject)

  const templates = [
    { tense: 'Present Simple', correct: v.base + (singular ? 's' : ''), wrong: [v.past, v.ing, 'has ' + v.pastPart] },
    { tense: 'Past Simple', correct: v.past, wrong: [v.base + (singular ? 's' : ''), v.pastPart, 'is ' + v.ing] },
    { tense: 'Present Continuous', correct: 'am/is/are ' + v.ing, wrong: [v.base, v.past, v.pastPart] },
    { tense: 'Present Perfect', correct: 'has/have ' + v.pastPart, wrong: [v.base, v.past, v.ing] },
    { tense: 'Future Simple', correct: 'will ' + v.base, wrong: [v.past, v.pastPart, 'is ' + v.ing] },
    { tense: 'Past Continuous', correct: 'was/were ' + v.ing, wrong: [v.base, v.past, v.pastPart] },
  ]
  const t = pick(templates)
  const opts = shuffle([t.correct, ...t.wrong.filter(w => w !== t.correct)])
  return {
    tense: t.tense,
    sentence: `She ___ (${v.base}) ${pick(objects)}.`,
    forms: opts,
    correct: opts.indexOf(t.correct),
  }
}

// ---- FILL BLANK (algorithmic templates) ----
const fillBlankTemplates = [
  { template: 'She ___ a doctor.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'They ___ playing football now.', options: ['is', 'are', 'am', 'was'], correct: 1 },
  { template: 'I have ___ finished my work.', options: ['already', 'yet', 'since', 'for'], correct: 0 },
  { template: 'He is the ___ student in class.', options: ['good', 'better', 'best', 'more good'], correct: 2 },
  { template: 'We ___ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], correct: 2 },
  { template: '___ you like some tea?', options: ['Would', 'Do', 'Are', 'Have'], correct: 0 },
  { template: 'The book ___ on the shelf.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'She ___ English very well.', options: ['speak', 'speaks', 'speaking', 'spoke'], correct: 1 },
  { template: 'They have lived here ___ 2010.', options: ['since', 'for', 'from', 'during'], correct: 0 },
  { template: 'This is ___ interesting book.', options: ['a', 'an', 'the', 'none'], correct: 1 },
  { template: 'I ___ like to order pizza.', options: ['will', 'would', 'shall', 'must'], correct: 1 },
  { template: 'The sun ___ in the east.', options: ['rise', 'rises', 'rose', 'rising'], correct: 1 },
  { template: 'She ___ to music every night.', options: ['listen', 'listens', 'listening', 'listened'], correct: 1 },
  { template: 'They ___ been friends for years.', options: ['have', 'has', 'are', 'were'], correct: 0 },
  { template: 'He ___ never been to Japan.', options: ['have', 'has', 'is', 'was'], correct: 1 },
  { template: 'We ___ going to the beach tomorrow.', options: ['is', 'are', 'am', 'was'], correct: 1 },
  { template: 'The movie ___ already started.', options: ['has', 'have', 'is', 'was'], correct: 0 },
  { template: 'I ___ breakfast at 7 AM every day.', options: ['have', 'has', 'am having', 'had'], correct: 0 },
  { template: 'She ___ her homework before dinner.', options: ['do', 'does', 'is doing', 'did'], correct: 3 },
  { template: 'They ___ not like spicy food.', options: ['do', 'does', 'are', 'have'], correct: 0 },
  { template: '___ is your favorite color?', options: ['What', 'Which', 'Who', 'Whose'], correct: 0 },
  { template: 'The test was ___ than I expected.', options: ['easy', 'easier', 'easiest', 'more easy'], correct: 1 },
  { template: 'This is the ___ day of my life!', options: ['good', 'better', 'best', 'more good'], correct: 2 },
  { template: 'Please ___ quiet in the library.', options: ['be', 'is', 'are', 'am'], correct: 0 },
  { template: 'I have ___ seen that movie.', options: ['ever', 'never', 'always', 'sometimes'], correct: 1 },
  { template: 'She is afraid ___ spiders.', options: ['from', 'of', 'about', 'with'], correct: 1 },
  { template: 'He is good ___ mathematics.', options: ['in', 'at', 'on', 'with'], correct: 1 },
  { template: 'They arrived ___ the airport on time.', options: ['in', 'at', 'on', 'to'], correct: 1 },
  { template: 'I am interested ___ learning Spanish.', options: ['in', 'at', 'on', 'about'], correct: 0 },
  { template: 'She depends ___ her parents.', options: ['in', 'at', 'on', 'from'], correct: 2 },
  { template: '___ a beautiful day!', options: ['What', 'How', 'What a', 'Such'], correct: 0 },
  { template: 'I wish I ___ fly.', options: ['can', 'could', 'will', 'may'], correct: 1 },
  { template: 'If I ___ rich, I would travel.', options: ['am', 'was', 'were', 'be'], correct: 2 },
  { template: 'She acts ___ she knows everything.', options: ['like', 'as if', 'as', 'so'], correct: 1 },
  { template: 'Neither the teacher ___ the students were late.', options: ['or', 'nor', 'and', 'but'], correct: 1 },
  { template: 'You ___ pay attention in class.', options: ['can', 'must', 'could', 'may'], correct: 1 },
  { template: '___ I borrow your pen?', options: ['Must', 'May', 'Should', 'Need'], correct: 1 },
  { template: 'We ___ to finish this project today.', options: ['must', 'have', 'need', 'should'], correct: 2 },
  { template: 'There ___ many people in the park.', options: ['is', 'are', 'was', 'be'], correct: 1 },
  { template: 'There ___ a book on the table.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'Each student ___ to bring a pencil.', options: ['need', 'needs', 'needing', 'needed'], correct: 1 },
  { template: 'Everyone ___ a good time at the party.', options: ['have', 'has', 'are', 'were'], correct: 1 },
  { template: 'Somebody ___ left the door open.', options: ['have', 'has', 'are', 'were'], correct: 1 },
  { template: 'The news ___ very surprising.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'Mathematics ___ my favorite subject.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'A pair of shoes ___ on the floor.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'The police ___ looking for the thief.', options: ['is', 'are', 'am', 'be'], correct: 1 },
  { template: 'My family ___ very supportive.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'The team ___ playing well this season.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: 'Ten dollars ___ not enough.', options: ['is', 'are', 'am', 'be'], correct: 0 },
  { template: '"Hamlet" ___ written by Shakespeare.', options: ['is', 'was', 'were', 'has'], correct: 1 },
  { template: 'The window ___ broken by the ball.', options: ['is', 'was', 'were', 'has'], correct: 1 },
  { template: 'Letters ___ delivered every morning.', options: ['is', 'are', 'was', 'were'], correct: 1 },
  { template: 'The cake ___ eaten by the children.', options: ['is', 'was', 'were', 'has'], correct: 1 },
  { template: 'English ___ spoken all over the world.', options: ['is', 'are', 'was', 'were'], correct: 0 },
  { template: 'She said that she ___ happy.', options: ['is', 'was', 'has', 'will'], correct: 1 },
  { template: 'He asked where I ___ going.', options: ['am', 'is', 'was', 'have'], correct: 2 },
  { template: 'She told me that she ___ come.', options: ['will', 'would', 'can', 'may'], correct: 1 },
  { template: 'The teacher said the earth ___ around the sun.', options: ['go', 'goes', 'went', 'going'], correct: 1 },
]

function generateFillBlankQuestion() {
  const q = pick(fillBlankTemplates)
  return { ...q, sentence: q.template }
}

// ---- SYNONYMS (60+ pairs) ----
const synonymPairs = [
  { word: 'Happy', correct: 'Joyful', wrong: ['Sad', 'Angry', 'Tired'] },
  { word: 'Big', correct: 'Large', wrong: ['Small', 'Tiny', 'Thin'] },
  { word: 'Fast', correct: 'Quick', wrong: ['Slow', 'Heavy', 'Light'] },
  { word: 'Smart', correct: 'Intelligent', wrong: ['Dull', 'Slow', 'Weak'] },
  { word: 'Beautiful', correct: 'Gorgeous', wrong: ['Ugly', 'Plain', 'Rough'] },
  { word: 'Strong', correct: 'Powerful', wrong: ['Weak', 'Frail', 'Gentle'] },
  { word: 'Rich', correct: 'Wealthy', wrong: ['Poor', 'Broke', 'Needy'] },
  { word: 'Begin', correct: 'Start', wrong: ['End', 'Stop', 'Finish'] },
  { word: 'Difficult', correct: 'Hard', wrong: ['Easy', 'Simple', 'Light'] },
  { word: 'Quiet', correct: 'Silent', wrong: ['Loud', 'Noisy', 'Busy'] },
  { word: 'Brave', correct: 'Courageous', wrong: ['Cowardly', 'Scared', 'Weak'] },
  { word: 'Ancient', correct: 'Old', wrong: ['New', 'Modern', 'Young'] },
  { word: 'Clear', correct: 'Obvious', wrong: ['Unclear', 'Vague', 'Hidden'] },
  { word: 'Calm', correct: 'Peaceful', wrong: ['Agitated', 'Worried', 'Upset'] },
  { word: 'Delicious', correct: 'Tasty', wrong: ['Bland', 'Sour', 'Bitter'] },
  { word: 'Exciting', correct: 'Thrilling', wrong: ['Boring', 'Dull', 'Tiresome'] },
  { word: 'Sad', correct: 'Unhappy', wrong: ['Glad', 'Happy', 'Cheerful'] },
  { word: 'Angry', correct: 'Furious', wrong: ['Calm', 'Pleased', 'Happy'] },
  { word: 'Tired', correct: 'Exhausted', wrong: ['Energetic', 'Fresh', 'Alert'] },
  { word: 'Cold', correct: 'Freezing', wrong: ['Hot', 'Warm', 'Boiling'] },
  { word: 'Hungry', correct: 'Starving', wrong: ['Full', 'Satisfied', 'Stuffed'] },
  { word: 'Funny', correct: 'Humorous', wrong: ['Serious', 'Boring', 'Dull'] },
  { word: 'Pretty', correct: 'Attractive', wrong: ['Ugly', 'Unattractive', 'Plain'] },
  { word: 'Shy', correct: 'Timid', wrong: ['Bold', 'Confident', 'Outgoing'] },
  { word: 'Thin', correct: 'Slim', wrong: ['Fat', 'Heavy', 'Wide'] },
  { word: 'Important', correct: 'Significant', wrong: ['Trivial', 'Minor', 'Petty'] },
  { word: 'Interesting', correct: 'Fascinating', wrong: ['Boring', 'Dull', 'Tedious'] },
  { word: 'Easy', correct: 'Simple', wrong: ['Hard', 'Complex', 'Tough'] },
  { word: 'Helpful', correct: 'Useful', wrong: ['Useless', 'Harmful', 'Worthless'] },
  { word: 'Honest', correct: 'Truthful', wrong: ['Dishonest', 'Liar', 'False'] },
  { word: 'Lazy', correct: 'Idle', wrong: ['Active', 'Busy', 'Energetic'] },
  { word: 'Lucky', correct: 'Fortunate', wrong: ['Unlucky', 'Unfortunate', 'Cursed'] },
  { word: 'Neat', correct: 'Tidy', wrong: ['Messy', 'Dirty', 'Cluttered'] },
  { word: 'Polite', correct: 'Courteous', wrong: ['Rude', 'Impolite', 'Crude'] },
  { word: 'Rare', correct: 'Uncommon', wrong: ['Common', 'Frequent', 'Ordinary'] },
  { word: 'Rude', correct: 'Impolite', wrong: ['Polite', 'Courteous', 'Kind'] },
  { word: 'Safe', correct: 'Secure', wrong: ['Dangerous', 'Risky', 'Unsafe'] },
  { word: 'Scary', correct: 'Frightening', wrong: ['Calm', 'Peaceful', 'Reassuring'] },
  { word: 'Small', correct: 'Tiny', wrong: ['Huge', 'Large', 'Giant'] },
  { word: 'Strange', correct: 'Weird', wrong: ['Normal', 'Usual', 'Common'] },
  { word: 'Stupid', correct: 'Foolish', wrong: ['Clever', 'Smart', 'Wise'] },
  { word: 'Sure', correct: 'Certain', wrong: ['Unsure', 'Doubtful', 'Uncertain'] },
  { word: 'Tough', correct: 'Rough', wrong: ['Soft', 'Smooth', 'Easy'] },
  { word: 'Unusual', correct: 'Rare', wrong: ['Common', 'Typical', 'Ordinary'] },
  { word: 'Wide', correct: 'Broad', wrong: ['Narrow', 'Thin', 'Slim'] },
  { word: 'Wise', correct: 'Smart', wrong: ['Foolish', 'Stupid', 'Naive'] },
  { word: 'Wonderful', correct: 'Amazing', wrong: ['Terrible', 'Awful', 'Horrible'] },
  { word: 'Worried', correct: 'Anxious', wrong: ['Relaxed', 'Calm', 'Carefree'] },
  { word: 'Wrong', correct: 'Incorrect', wrong: ['Right', 'Correct', 'True'] },
  { word: 'Young', correct: 'Youthful', wrong: ['Old', 'Elderly', 'Aged'] },
  { word: 'Awful', correct: 'Terrible', wrong: ['Wonderful', 'Great', 'Excellent'] },
  { word: 'Bright', correct: 'Shining', wrong: ['Dark', 'Dull', 'Dim'] },
  { word: 'Careful', correct: 'Cautious', wrong: ['Careless', 'Reckless', 'Hasty'] },
  { word: 'Cheap', correct: 'Inexpensive', wrong: ['Expensive', 'Costly', 'Pricey'] },
  { word: 'Cool', correct: 'Chilly', wrong: ['Warm', 'Hot', 'Boiling'] },
  { word: 'Courageous', correct: 'Brave', wrong: ['Cowardly', 'Timid', 'Fearful'] },
  { word: 'Cute', correct: 'Adorable', wrong: ['Ugly', 'Unattractive', 'Hideous'] },
  { word: 'Dangerous', correct: 'Hazardous', wrong: ['Safe', 'Secure', 'Harmless'] },
  { word: 'Dirty', correct: 'Filthy', wrong: ['Clean', 'Tidy', 'Spotless'] },
  { word: 'Dull', correct: 'Boring', wrong: ['Exciting', 'Interesting', 'Fun'] },
  { word: 'Fair', correct: 'Just', wrong: ['Unfair', 'Biased', 'Partial'] },
  { word: 'Famous', correct: 'Well-known', wrong: ['Unknown', 'Anonymous', 'Obscure'] },
  { word: 'Genuine', correct: 'Authentic', wrong: ['Fake', 'False', 'Fraudulent'] },
  { word: 'Gloomy', correct: 'Dark', wrong: ['Bright', 'Sunny', 'Cheerful'] },
  { word: 'Huge', correct: 'Enormous', wrong: ['Tiny', 'Small', 'Petite'] },
  { word: 'Ill', correct: 'Sick', wrong: ['Healthy', 'Well', 'Fit'] },
  { word: 'Kind', correct: 'Gentle', wrong: ['Cruel', 'Mean', 'Harsh'] },
  { word: 'Loud', correct: 'Noisy', wrong: ['Quiet', 'Silent', 'Calm'] },
  { word: 'Mad', correct: 'Angry', wrong: ['Happy', 'Pleased', 'Calm'] },
  { word: 'Necessary', correct: 'Essential', wrong: ['Unnecessary', 'Optional', 'Extra'] },
  { word: 'Odd', correct: 'Strange', wrong: ['Normal', 'Regular', 'Standard'] },
  { word: 'Quick', correct: 'Rapid', wrong: ['Slow', 'Gradual', 'Leisurely'] },
  { word: 'Silly', correct: 'Foolish', wrong: ['Serious', 'Sensible', 'Wise'] },
  { word: 'Splendid', correct: 'Magnificent', wrong: ['Mediocre', 'Poor', 'Average'] },
  { word: 'Terrific', correct: 'Fantastic', wrong: ['Awful', 'Terrible', 'Horrible'] },
  { word: 'Tiny', correct: 'Minuscule', wrong: ['Huge', 'Enormous', 'Giant'] },
  { word: 'Ugly', correct: 'Hideous', wrong: ['Beautiful', 'Pretty', 'Gorgeous'] },
  { word: 'Wet', correct: 'Damp', wrong: ['Dry', 'Parched', 'Arid'] },
]

// ---- ANTONYMS (60+ pairs) ----
const antonymPairs = [
  { word: 'Hot', correct: 'Cold', wrong: ['Warm', 'Cool', 'Mild'] },
  { word: 'Big', correct: 'Small', wrong: ['Huge', 'Large', 'Wide'] },
  { word: 'Fast', correct: 'Slow', wrong: ['Quick', 'Rapid', 'Swift'] },
  { word: 'Light', correct: 'Heavy', wrong: ['Bright', 'Pale', 'Clear'] },
  { word: 'Rich', correct: 'Poor', wrong: ['Wealthy', 'Prosperous', 'Affluent'] },
  { word: 'Happy', correct: 'Sad', wrong: ['Glad', 'Cheerful', 'Joyful'] },
  { word: 'Strong', correct: 'Weak', wrong: ['Powerful', 'Sturdy', 'Tough'] },
  { word: 'Begin', correct: 'End', wrong: ['Start', 'Launch', 'Open'] },
  { word: 'High', correct: 'Low', wrong: ['Tall', 'Elevated', 'Rising'] },
  { word: 'Easy', correct: 'Hard', wrong: ['Simple', 'Light', 'Smooth'] },
  { word: 'Clean', correct: 'Dirty', wrong: ['Tidy', 'Neat', 'Fresh'] },
  { word: 'Open', correct: 'Closed', wrong: ['Unlocked', 'Ajar', 'Wide'] },
  { word: 'Full', correct: 'Empty', wrong: ['Stuffed', 'Packed', 'Loaded'] },
  { word: 'Wet', correct: 'Dry', wrong: ['Moist', 'Damp', 'Humid'] },
  { word: 'Young', correct: 'Old', wrong: ['Youthful', 'Junior', 'Teenage'] },
  { word: 'Early', correct: 'Late', wrong: ['Prompt', 'Timely', 'Soon'] },
  { word: 'Love', correct: 'Hate', wrong: ['Adore', 'Like', 'Care'] },
  { word: 'Friend', correct: 'Enemy', wrong: ['Ally', 'Buddy', 'Pal'] },
  { word: 'Win', correct: 'Lose', wrong: ['Defeat', 'Triumph', 'Succeed'] },
  { word: 'Save', correct: 'Spend', wrong: ['Keep', 'Store', 'Reserve'] },
  { word: 'Laugh', correct: 'Cry', wrong: ['Smile', 'Giggle', 'Chuckle'] },
  { word: 'Give', correct: 'Take', wrong: ['Offer', 'Donate', 'Provide'] },
  { word: 'Buy', correct: 'Sell', wrong: ['Purchase', 'Shop', 'Acquire'] },
  { word: 'Remember', correct: 'Forget', wrong: ['Recall', 'Remind', 'Memorize'] },
  { word: 'Arrive', correct: 'Leave', wrong: ['Come', 'Reach', 'Enter'] },
  { word: 'Accept', correct: 'Reject', wrong: ['Agree', 'Approve', 'Admit'] },
  { word: 'Active', correct: 'Inactive', wrong: ['Busy', 'Lively', 'Energetic'] },
  { word: 'Alive', correct: 'Dead', wrong: ['Living', 'Breathing', 'Existing'] },
  { word: 'Always', correct: 'Never', wrong: ['Often', 'Frequently', 'Usually'] },
  { word: 'Ancient', correct: 'Modern', wrong: ['Old', 'Aged', 'Antique'] },
  { word: 'Answer', correct: 'Question', wrong: ['Reply', 'Response', 'Solution'] },
  { word: 'Attack', correct: 'Defend', wrong: ['Strike', 'Assault', 'Charge'] },
  { word: 'Awake', correct: 'Asleep', wrong: ['Conscious', 'Alert', 'Waking'] },
  { word: 'Beautiful', correct: 'Ugly', wrong: ['Pretty', 'Lovely', 'Gorgeous'] },
  { word: 'Bitter', correct: 'Sweet', wrong: ['Sour', 'Tart', 'Sharp'] },
  { word: 'Borrow', correct: 'Lend', wrong: ['Loan', 'Take', 'Use'] },
  { word: 'Bright', correct: 'Dark', wrong: ['Shiny', 'Luminous', 'Radiant'] },
  { word: 'Broad', correct: 'Narrow', wrong: ['Wide', 'Extensive', 'Ample'] },
  { word: 'Build', correct: 'Destroy', wrong: ['Construct', 'Create', 'Make'] },
  { word: 'Busy', correct: 'Idle', wrong: ['Active', 'Engaged', 'Occupied'] },
  { word: 'Calm', correct: 'Agitated', wrong: ['Peaceful', 'Quiet', 'Relaxed'] },
  { word: 'Careful', correct: 'Careless', wrong: ['Cautious', 'Attentive', 'Thorough'] },
  { word: 'Cheap', correct: 'Expensive', wrong: ['Inexpensive', 'Affordable', 'Budget'] },
  { word: 'City', correct: 'Village', wrong: ['Town', 'Metropolis', 'Capital'] },
  { word: 'Clean', correct: 'Dirty', wrong: ['Neat', 'Spotless', 'Tidy'] },
  { word: 'Clever', correct: 'Stupid', wrong: ['Smart', 'Intelligent', 'Bright'] },
  { word: 'Cold', correct: 'Hot', wrong: ['Chilly', 'Cool', 'Freezing'] },
  { word: 'Comfortable', correct: 'Uncomfortable', wrong: ['Cozy', 'Relaxing', 'Snug'] },
  { word: 'Courage', correct: 'Fear', wrong: ['Bravery', 'Valor', 'Daring'] },
  { word: 'Cruel', correct: 'Kind', wrong: ['Mean', 'Harsh', 'Brutal'] },
  { word: 'Deep', correct: 'Shallow', wrong: ['Low', 'Profound', 'Bottomless'] },
  { word: 'Defeat', correct: 'Victory', wrong: ['Loss', 'Failure', 'Downfall'] },
  { word: 'Demand', correct: 'Supply', wrong: ['Request', 'Require', 'Ask'] },
  { word: 'Descend', correct: 'Ascend', wrong: ['Drop', 'Fall', 'Lower'] },
  { word: 'Diligent', correct: 'Lazy', wrong: ['Hardworking', 'Industrious', 'Devoted'] },
  { word: 'Divide', correct: 'Unite', wrong: ['Split', 'Separate', 'Part'] },
  { word: 'Down', correct: 'Up', wrong: ['Lower', 'Below', 'Under'] },
  { word: 'Dull', correct: 'Sharp', wrong: ['Boring', 'Blunt', 'Tired'] },
  { word: 'Expand', correct: 'Contract', wrong: ['Grow', 'Enlarge', 'Spread'] },
  { word: 'Fail', correct: 'Pass', wrong: ['Flop', 'Fall', 'Miss'] },
  { word: 'Few', correct: 'Many', wrong: ['Several', 'Some', 'Couple'] },
  { word: 'First', correct: 'Last', wrong: ['Initial', 'Primary', 'Leading'] },
  { word: 'Generous', correct: 'Stingy', wrong: ['Giving', 'Charitable', 'Kind'] },
  { word: 'Gentle', correct: 'Rough', wrong: ['Soft', 'Mild', 'Tender'] },
  { word: 'Grow', correct: 'Shrink', wrong: ['Develop', 'Increase', 'Expand'] },
  { word: 'Hard', correct: 'Soft', wrong: ['Tough', 'Rigid', 'Firm'] },
  { word: 'Increase', correct: 'Decrease', wrong: ['Raise', 'Grow', 'Boost'] },
  { word: 'Inner', correct: 'Outer', wrong: ['Inside', 'Internal', 'Interior'] },
  { word: 'Loud', correct: 'Quiet', wrong: ['Noisy', 'Deafening', 'Boisterous'] },
  { word: 'Major', correct: 'Minor', wrong: ['Main', 'Primary', 'Principal'] },
  { word: 'Mature', correct: 'Immature', wrong: ['Grown', 'Adult', 'Ripe'] },
  { word: 'Never', correct: 'Always', wrong: ['Rarely', 'Seldom', 'Hardly'] },
  { word: 'New', correct: 'Old', wrong: ['Fresh', 'Modern', 'Recent'] },
  { word: 'Night', correct: 'Day', wrong: ['Midnight', 'Darkness', 'Evening'] },
  { word: 'Obey', correct: 'Disobey', wrong: ['Follow', 'Comply', 'Respect'] },
  { word: 'Peace', correct: 'War', wrong: ['Calm', 'Harmony', 'Quiet'] },
  { word: 'Permanent', correct: 'Temporary', wrong: ['Forever', 'Enduring', 'Constant'] },
  { word: 'Polite', correct: 'Rude', wrong: ['Courteous', 'Civil', 'Respectful'] },
  { word: 'Praise', correct: 'Criticize', wrong: ['Compliment', 'Applaud', 'Admire'] },
  { word: 'Private', correct: 'Public', wrong: ['Personal', 'Confidential', 'Secret'] },
  { word: 'Pure', correct: 'Impure', wrong: ['Clean', 'Clear', 'Natural'] },
  { word: 'Push', correct: 'Pull', wrong: ['Shove', 'Press', 'Force'] },
  { word: 'Safe', correct: 'Dangerous', wrong: ['Secure', 'Protected', 'Harmless'] },
  { word: 'Sink', correct: 'Float', wrong: ['Drown', 'Submerge', 'Plunge'] },
  { word: 'Strict', correct: 'Lenient', wrong: ['Severe', 'Harsh', 'Firm'] },
  { word: 'Success', correct: 'Failure', wrong: ['Achievement', 'Triumph', 'Win'] },
  { word: 'Sweet', correct: 'Sour', wrong: ['Sugary', 'Candy', 'Sweetened'] },
  { word: 'Thick', correct: 'Thin', wrong: ['Fat', 'Chunky', 'Dense'] },
  { word: 'Truth', correct: 'Lie', wrong: ['Fact', 'Reality', 'Honesty'] },
  { word: 'Wild', correct: 'Tame', wrong: ['Feral', 'Untamed', 'Natural'] },
  { word: 'Wisdom', correct: 'Ignorance', wrong: ['Knowledge', 'Intelligence', 'Sense'] },
  { word: 'Worst', correct: 'Best', wrong: ['Poorest', 'Lowest', 'Least'] },
]

function generateSynonymQuestion() {
  const p = pick(synonymPairs)
  const options = shuffle([p.correct, ...p.wrong])
  return { word: p.word, options, correct: options.indexOf(p.correct), question: `What is a synonym of "${p.word}"?`, category: 'Vocabulary' }
}

function generateAntonymQuestion() {
  const p = pick(antonymPairs)
  const options = shuffle([p.correct, ...p.wrong])
  return { word: p.word, options, correct: options.indexOf(p.correct), question: `What is an antonym of "${p.word}"?`, category: 'Vocabulary' }
}

// ---- SENTENCE BUILDER (50+ puzzles) ----
const sentenceBuilderPuzzles = [
  { words: ['She', 'is', 'a', 'very', 'intelligent', 'student'], sentence: 'She is a very intelligent student' },
  { words: ['They', 'have', 'been', 'waiting', 'for', 'an', 'hour'], sentence: 'They have been waiting for an hour' },
  { words: ['The', 'sun', 'rises', 'in', 'the', 'east'], sentence: 'The sun rises in the east' },
  { words: ['Can', 'you', 'help', 'me', 'with', 'this', 'problem'], sentence: 'Can you help me with this problem' },
  { words: ['I', 'would', 'like', 'to', 'order', 'a', 'coffee'], sentence: 'I would like to order a coffee' },
  { words: ['She', 'has', 'been', 'learning', 'English', 'for', 'two', 'years'], sentence: 'She has been learning English for two years' },
  { words: ['We', 'went', 'to', 'the', 'beach', 'last', 'weekend'], sentence: 'We went to the beach last weekend' },
  { words: ['Please', 'send', 'me', 'an', 'email', 'with', 'the', 'details'], sentence: 'Please send me an email with the details' },
  { words: ['The', 'meeting', 'will', 'start', 'at', 'three', 'o\'clock'], sentence: 'The meeting will start at three o\'clock' },
  { words: ['Learning', 'a', 'new', 'language', 'is', 'always', 'rewarding'], sentence: 'Learning a new language is always rewarding' },
  { words: ['My', 'brother', 'plays', 'guitar', 'very', 'well'], sentence: 'My brother plays guitar very well' },
  { words: ['She', 'wants', 'to', 'become', 'a', 'doctor'], sentence: 'She wants to become a doctor' },
  { words: ['They', 'are', 'going', 'to', 'build', 'a', 'new', 'hospital'], sentence: 'They are going to build a new hospital' },
  { words: ['I', 'have', 'never', 'seen', 'such', 'a', 'beautiful', 'place'], sentence: 'I have never seen such a beautiful place' },
  { words: ['The', 'children', 'are', 'playing', 'in', 'the', 'garden'], sentence: 'The children are playing in the garden' },
  { words: ['Please', 'turn', 'off', 'the', 'lights', 'when', 'you', 'leave'], sentence: 'Please turn off the lights when you leave' },
  { words: ['She', 'is', 'the', 'most', 'talented', 'artist', 'I', 'know'], sentence: 'She is the most talented artist I know' },
  { words: ['We', 'should', 'protect', 'the', 'environment', 'for', 'future', 'generations'], sentence: 'We should protect the environment for future generations' },
  { words: ['He', 'has', 'been', 'working', 'here', 'since', 'January'], sentence: 'He has been working here since January' },
  { words: ['Could', 'you', 'please', 'tell', 'me', 'the', 'time'], sentence: 'Could you please tell me the time' },
  { words: ['The', 'more', 'you', 'practice', 'the', 'better', 'you', 'get'], sentence: 'The more you practice the better you get' },
  { words: ['She', 'not', 'only', 'sings', 'but', 'also', 'dances'], sentence: 'She not only sings but also dances' },
  { words: ['I', 'used', 'to', 'live', 'in', 'a', 'small', 'town'], sentence: 'I used to live in a small town' },
  { words: ['There', 'are', 'many', 'interesting', 'places', 'to', 'visit'], sentence: 'There are many interesting places to visit' },
  { words: ['He', 'was', 'so', 'tired', 'that', 'he', 'fell', 'asleep'], sentence: 'He was so tired that he fell asleep' },
  { words: ['We', 'are', 'looking', 'forward', 'to', 'seeing', 'you'], sentence: 'We are looking forward to seeing you' },
  { words: ['She', 'likes', 'to', 'listen', 'to', 'music', 'while', 'studying'], sentence: 'She likes to listen to music while studying' },
  { words: ['The', 'train', 'leaves', 'at', 'six', 'in', 'the', 'morning'], sentence: 'The train leaves at six in the morning' },
  { words: ['I', 'need', 'to', 'buy', 'some', 'fruits', 'from', 'the', 'market'], sentence: 'I need to buy some fruits from the market' },
  { words: ['He', 'is', 'afraid', 'of', 'speaking', 'in', 'public'], sentence: 'He is afraid of speaking in public' },
  { words: ['She', 'was', 'born', 'in', 'a', 'small', 'village'], sentence: 'She was born in a small village' },
  { words: ['We', 'have', 'known', 'each', 'other', 'for', 'years'], sentence: 'We have known each other for years' },
  { words: ['Please', 'close', 'the', 'window', 'it', 'is', 'cold'], sentence: 'Please close the window it is cold' },
  { words: ['My', 'favorite', 'subject', 'is', 'English', 'literature'], sentence: 'My favorite subject is English literature' },
  { words: ['They', 'were', 'surprised', 'by', 'the', 'unexpected', 'news'], sentence: 'They were surprised by the unexpected news' },
  { words: ['I', 'am', 'looking', 'for', 'my', 'lost', 'keys'], sentence: 'I am looking for my lost keys' },
  { words: ['The', 'weather', 'is', 'getting', 'better', 'day', 'by', 'day'], sentence: 'The weather is getting better day by day' },
  { words: ['She', 'takes', 'care', 'of', 'her', 'younger', 'brother'], sentence: 'She takes care of her younger brother' },
  { words: ['We', 'should', 'always', 'tell', 'the', 'truth'], sentence: 'We should always tell the truth' },
  { words: ['He', 'works', 'very', 'hard', 'to', 'support', 'his', 'family'], sentence: 'He works very hard to support his family' },
  { words: ['The', 'movie', 'was', 'so', 'boring', 'that', 'I', 'fell', 'asleep'], sentence: 'The movie was so boring that I fell asleep' },
  { words: ['I', 'prefer', 'tea', 'to', 'coffee', 'in', 'the', 'morning'], sentence: 'I prefer tea to coffee in the morning' },
  { words: ['She', 'has', 'promised', 'to', 'help', 'me', 'with', 'my', 'project'], sentence: 'She has promised to help me with my project' },
  { words: ['The', 'children', 'were', 'excited', 'about', 'the', 'school', 'trip'], sentence: 'The children were excited about the school trip' },
  { words: ['You', 'should', 'drink', 'plenty', 'of', 'water', 'every', 'day'], sentence: 'You should drink plenty of water every day' },
  { words: ['He', 'is', 'the', 'best', 'player', 'on', 'the', 'team'], sentence: 'He is the best player on the team' },
  { words: ['We', 'had', 'to', 'cancel', 'the', 'picnic', 'because', 'of', 'rain'], sentence: 'We had to cancel the picnic because of rain' },
  { words: ['She', 'always', 'wakes', 'up', 'early', 'to', 'exercise'], sentence: 'She always wakes up early to exercise' },
  { words: ['The', 'teacher', 'asked', 'the', 'students', 'to', 'be', 'quiet'], sentence: 'The teacher asked the students to be quiet' },
  { words: ['I', 'have', 'to', 'finish', 'this', 'report', 'by', 'tomorrow'], sentence: 'I have to finish this report by tomorrow' },
  { words: ['They', 'live', 'in', 'a', 'big', 'house', 'near', 'the', 'park'], sentence: 'They live in a big house near the park' },
  { words: ['She', 'enjoys', 'reading', 'novels', 'in', 'her', 'free', 'time'], sentence: 'She enjoys reading novels in her free time' },
  { words: ['The', 'students', 'are', 'preparing', 'for', 'their', 'final', 'exams'], sentence: 'The students are preparing for their final exams' },
]

// ---- export functions ----
export function getGrammarBattleQuestions(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateGrammarQuestion()
  return arr
}

export function getTenseQuestions(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateTenseQuestion()
  return arr
}

export function getFillBlankQuestions(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateFillBlankQuestion()
  return arr
}

export function getSynonymQuestions(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateSynonymQuestion()
  return arr
}

export function getAntonymQuestions(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateAntonymQuestion()
  return arr
}

export function getWordBuilderWords(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = wordBuilderWords[Math.floor(Math.random() * wordBuilderWords.length)]
  return arr
}

export function getSentenceBuilderPuzzles(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = sentenceBuilderPuzzles[Math.floor(Math.random() * sentenceBuilderPuzzles.length)]
  return arr
}

// Mixed daily challenge questions - unlimited, randomized from all pools
export function getDailyChallengeQuestions(count = 10) {
  const generators = [
    generateGrammarQuestion,
    generateTenseQuestion,
    generateFillBlankQuestion,
    generateSynonymQuestion,
    generateAntonymQuestion,
  ]
  const arr = new Array(count)
  for (let i = 0; i < count; i++) {
    const gen = pick(generators)
    const q = gen()
    arr[i] = {
      ...q,
      question: q.question || q.sentence || 'Complete the sentence:',
      options: q.options || q.forms,
      category: q.category || q.tense || 'Mixed',
      explanation: q.explanation || '',
    }
  }
  return arr
}
