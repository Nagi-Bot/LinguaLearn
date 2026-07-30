const AudioContext = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null
let audioCtx = null

function getCtx() {
  if (!AudioContext) return null
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  const ctx = getCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playCorrect() {
  playTone(523.25, 0.1, 'sine', 0.25)
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.25), 100)
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.25), 200)
}

export function playWrong() {
  playTone(300, 0.15, 'square', 0.15)
  setTimeout(() => playTone(250, 0.2, 'square', 0.15), 150)
}

export function playLevelUp() {
  const notes = [523.25, 587.33, 659.25, 783.99, 1046.50]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.12, 'sine', 0.2), i * 80)
  })
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.1)
}

export function playHeartLoss() {
  playTone(400, 0.1, 'triangle', 0.2)
  setTimeout(() => playTone(300, 0.15, 'triangle', 0.2), 100)
}

export function playAchievement() {
  const notes = [784, 988, 1175, 1568]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.2), i * 100)
  })
}
