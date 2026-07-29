// Infinite question generator - algorithmic generation for endless gameplay

const tenses = ['present simple', 'present continuous', 'present perfect', 'past simple', 'past continuous', 'future simple', 'future continuous']
const subjects = ['I', 'You', 'She', 'He', 'It', 'We', 'They', 'The cat', 'The dog', 'My friend', 'The teacher', 'The students', 'Everyone']
const verbs = ['run', 'eat', 'read', 'write', 'play', 'work', 'study', 'speak', 'listen', 'watch', 'cook', 'sing', 'dance', 'drive', 'swim', 'travel', 'teach', 'learn', 'build', 'draw']
const objects = ['a book', 'music', 'dinner', 'the game', 'English', 'a letter', 'a song', 'a picture', 'a car', 'a house', 'a story', 'a poem', 'a cake', 'a plan', 'a movie']
const adjectives = ['beautiful', 'intelligent', 'interesting', 'important', 'wonderful', 'fantastic', 'amazing', 'delicious', 'exciting', 'peaceful', 'helpful']
const adverbs = ['quickly', 'slowly', 'carefully', 'eagerly', 'quietly', 'loudly', 'happily', 'sadly', 'politely', 'badly', 'well', 'hard']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function generateGrammarQuestion() {
  const type = Math.floor(Math.random() * 6)
  const subject = pick(subjects)
  const verb = pick(verbs)
  const obj = pick(objects)
  const adj = pick(adjectives)
  const adv = pick(adverbs)

  switch (type) {
    case 0: { // Subject-verb agreement
      const isPlural = ['I', 'We', 'They', 'The students', 'Everyone'].includes(subject) || subject.includes('students') || subject === 'Everyone'
      const correctV = verb + (isPlural && subject !== 'I' ? '' : 's')
      const wrongOptions = [
        verb + (verb.endsWith('e') ? 's' : 'es'),
        verb + 'ing',
        verb.slice(0, -1) + 'ed'
      ].map(s => s === correctV ? correctV + 'x' : s)
      const options = [correctV, ...wrongOptions.filter((v, i) => i < 3)]
      const shuffled = options.sort(() => Math.random() - 0.5)
      return {
        question: `${subject} ___ ${adv} ${obj}.`,
        options: shuffled,
        correct: shuffled.indexOf(correctV),
      }
    }
    case 1: { // Tense - choose correct form
      const forms = {
        'present simple': verb + 's',
        'past simple': verb + 'ed',
        'present continuous': 'am/is/are ' + verb + 'ing',
        'future simple': 'will ' + verb,
      }
      const tenses2 = ['present simple', 'past simple', 'present continuous', 'future simple']
      const correct = pick(tenses2)
      const opts = tenses2.map(t => forms[t]).sort(() => Math.random() - 0.5)
      const correctForm = forms[correct]
      return {
        question: `Choose the ${correct} form: ${subject} ___ ${adv} ${obj}.`,
        options: opts,
        correct: opts.indexOf(correctForm),
      }
    }
    case 2: { // Article (a/an/the)
      const words = ['apple', 'orange', 'hour', 'university', 'honest man', 'elephant', 'umbrella', 'one-way street', 'European country', 'hero']
      const word = pick(words)
      const isVowel = /^[aeiou]/i.test(word)
      const correctArticle = isVowel ? 'an' : 'a'
      const opts = ['a', 'an', 'the', 'some'].sort(() => Math.random() - 0.5)
      return {
        question: `Choose the correct article: "___ ${word}"`,
        options: opts,
        correct: opts.indexOf(correctArticle),
      }
    }
    case 3: { // Preposition
      const prepOptions = ['in', 'on', 'at', 'for', 'since', 'during', 'by', 'with', 'about', 'from']
      const correct = pick(prepOptions)
      const wrong = prepOptions.filter(p => p !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
      return {
        question: `She has been studying ___ three hours.`,
        options: [correct, ...wrong].sort(() => Math.random() - 0.5),
        correct: [correct, ...wrong].sort(() => Math.random() - 0.5).indexOf(correct),
      }
    }
    case 4: { // Modal verbs
      const modals = [
        { q: 'You ___ finish your homework before playing.', correct: 'must' },
        { q: '___ I come in?', correct: 'May' },
        { q: 'She ___ speak three languages.', correct: 'can' },
        { q: 'You ___ see a doctor.', correct: 'should' },
        { q: 'It ___ rain tomorrow.', correct: 'might' },
      ]
      const m = pick(modals)
      const opts = ['can', 'must', 'should', 'may', 'might', 'will', 'could'].sort(() => Math.random() - 0.5)
      return {
        question: m.q,
        options: opts,
        correct: opts.indexOf(m.correct),
      }
    }
    case 5: { // Vocabulary - synonym
      const pairs = [
        { word: 'Happy', synonym: 'Joyful' }, { word: 'Big', synonym: 'Large' }, { word: 'Fast', synonym: 'Quick' },
        { word: 'Smart', synonym: 'Intelligent' }, { word: 'Strong', synonym: 'Powerful' }, { word: 'Beautiful', synonym: 'Gorgeous' },
        { word: 'Begin', synonym: 'Start' }, { word: 'Difficult', synonym: 'Hard' }, { word: 'Rich', synonym: 'Wealthy' },
        { word: 'Quiet', synonym: 'Silent' }, { word: 'Brave', synonym: 'Courageous' }, { word: 'Ancient', synonym: 'Old' },
        { word: 'Clear', synonym: 'Obvious' }, { word: 'Calm', synonym: 'Peaceful' }, { word: 'Helpful', synonym: 'Useful' },
        { word: 'Delicious', synonym: 'Tasty' }, { word: 'Exciting', synonym: 'Thrilling' }, { word: 'Sad', synonym: 'Unhappy' },
        { word: 'Angry', synonym: 'Furious' }, { word: 'Tired', synonym: 'Exhausted' },
      ]
      const p = pick(pairs)
      const allWords = pairs.map(p2 => p2.synonym).filter(s => s !== p.synonym)
      const opts = [p.synonym, ...allWords.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5)
      return {
        question: `What is a synonym of "${p.word}"?`,
        options: opts,
        correct: opts.indexOf(p.synonym),
      }
    }
  }
}

function generateWordBuilderWord() {
  const words = [
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
  ]
  return words[Math.floor(Math.random() * words.length)]
}

function generateTenseQuestion() {
  const allTenses = [
    { tense: 'Present Simple', sentence: 'She ___ (work) here every day.', forms: ['works', 'worked', 'is working', 'has worked'], correct: 0 },
    { tense: 'Past Simple', sentence: 'They ___ (visit) Paris last year.', forms: ['visit', 'visited', 'are visiting', 'have visited'], correct: 1 },
    { tense: 'Present Continuous', sentence: 'He ___ (read) a book right now.', forms: ['reads', 'read', 'is reading', 'has read'], correct: 2 },
    { tense: 'Present Perfect', sentence: 'I ___ (finish) my homework already.', forms: ['finish', 'finished', 'have finished', 'am finishing'], correct: 2 },
    { tense: 'Future Simple', sentence: 'We ___ (travel) to London tomorrow.', forms: ['travel', 'will travel', 'are traveling', 'have traveled'], correct: 1 },
    { tense: 'Past Continuous', sentence: 'She ___ (cook) when I called.', forms: ['cooks', 'cooked', 'was cooking', 'has cooked'], correct: 2 },
    { tense: 'Present Perfect Continuous', sentence: 'They ___ (wait) for 30 minutes.', forms: ['wait', 'are waiting', 'have been waiting', 'waited'], correct: 2 },
    { tense: 'Past Perfect', sentence: 'He ___ (leave) before she arrived.', forms: ['leaves', 'left', 'had left', 'was leaving'], correct: 2 },
    { tense: 'Future Perfect', sentence: 'By next month, I ___ (complete) the course.', forms: ['complete', 'will complete', 'will have completed', 'am completing'], correct: 2 },
    { tense: 'Present Simple', sentence: 'The sun ___ (rise) in the east.', forms: ['rise', 'rises', 'is rising', 'rose'], correct: 1 },
    { tense: 'Past Simple', sentence: 'She ___ (buy) a new car yesterday.', forms: ['buys', 'bought', 'is buying', 'has bought'], correct: 1 },
    { tense: 'Present Continuous', sentence: 'They ___ (build) a new school.', forms: ['build', 'builds', 'are building', 'have built'], correct: 2 },
  ]
  return allTenses[Math.floor(Math.random() * allTenses.length)]
}

function generateFillBlankQuestion() {
  const questions = [
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
  return questions[Math.floor(Math.random() * questions.length)]
}

function generateSentenceBuilderWords() {
  const sentences = [
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
  ]
  return sentences[Math.floor(Math.random() * sentences.length)]
}

function generateSynonymQuestion() {
  const pairs = [
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
  ]
  const p = pick(pairs)
  const options = [p.correct, ...p.wrong].sort(() => Math.random() - 0.5)
  return { word: p.word, options, correct: options.indexOf(p.correct) }
}

function generateAntonymQuestion() {
  const pairs = [
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
  ]
  const p = pick(pairs)
  const options = [p.correct, ...p.wrong].sort(() => Math.random() - 0.5)
  return { word: p.word, options, correct: options.indexOf(p.correct) }
}

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
  for (let i = 0; i < count; i++) arr[i] = generateWordBuilderWord()
  return arr
}

export function getSentenceBuilderPuzzles(count = 10) {
  const arr = new Array(count)
  for (let i = 0; i < count; i++) arr[i] = generateSentenceBuilderWords()
  return arr
}
