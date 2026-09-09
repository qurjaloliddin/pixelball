const AudioContextClass = window.AudioContext || window.webkitAudioContext

function noiseBuffer(context, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1
  }
  return buffer
}

function envelope(context, node, start, attack, hold, release, peak, end) {
  const gain = node.gain
  gain.setValueAtTime(0.0001, start)
  gain.linearRampToValueAtTime(peak, start + attack)
  gain.setValueAtTime(peak, start + attack + hold)
  gain.exponentialRampToValueAtTime(0.0001, end - release)
  gain.setValueAtTime(0.0001, end)
}

export function createStadiumAudio() {
  if (!AudioContextClass) return null
  const context = new AudioContextClass()
  const master = context.createGain()
  master.gain.value = 0.7
  master.connect(context.destination)
  let ambientNodes = []
  let ambienceTimer = null

  const resume = () => {
    if (context.state === 'suspended') context.resume()
  }

  const tone = (frequency, duration, type = 'sine', volume = 0.04, detune = 0) => {
    resume()
    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)
    oscillator.detune.value = detune
    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain).connect(master)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.03)
  }

  const filteredNoise = (duration, volume, low, high, attack = 0.08) => {
    resume()
    const now = context.currentTime
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    source.buffer = noiseBuffer(context, Math.max(1, duration))
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(low, now)
    filter.frequency.exponentialRampToValueAtTime(high, now + duration * 0.4)
    filter.Q.value = 0.7
    envelope(context, gain, now, attack, duration * 0.28, duration * 0.3, volume, now + duration)
    source.connect(filter).connect(gain).connect(master)
    source.start(now)
    source.stop(now + duration + 0.04)
  }

  const kick = () => {
    resume()
    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(150, now)
    oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.14)
    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    oscillator.connect(gain).connect(master)
    oscillator.start(now)
    oscillator.stop(now + 0.2)
    filteredNoise(0.09, 0.04, 900, 1600, 0.005)
  }

  const whistle = () => {
    tone(2800, 0.32, 'sine', 0.08)
    tone(3200, 0.32, 'sine', 0.06, 8)
  }

  const horn = () => {
    ;[110, 165, 220, 330].forEach((frequency, index) => {
      tone(frequency, 1.25, 'sawtooth', 0.055, index * 5)
      tone(frequency * 2, 1.1, 'square', 0.018, -index * 4)
    })
  }

  const cheer = (intensity = 1) => {
    filteredNoise(3.8, 0.24 * intensity, 260, 1450, 0.45)
    filteredNoise(2.8, 0.11 * intensity, 850, 2600, 0.2)
    ;[0, 0.13, 0.26, 0.39, 0.52].forEach((offset, index) => {
      setTimeout(() => tone(230 + index * 32, 0.7, 'sine', 0.025 * intensity), offset * 1000)
    })
  }

  const groan = () => {
    filteredNoise(2.4, 0.13, 130, 420, 0.12)
    tone(175, 1.7, 'sawtooth', 0.045)
    tone(132, 1.9, 'sine', 0.035, -10)
  }

  const goal = playerScored => {
    resume()
    whistle()
    horn()
    if (playerScored) cheer(1.25)
    else groan()
  }

  const startAmbient = () => {
    if (ambientNodes.length) return
    resume()
    const now = context.currentTime
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    const lfo = context.createOscillator()
    const lfoGain = context.createGain()
    source.buffer = noiseBuffer(context, 4)
    source.loop = true
    filter.type = 'lowpass'
    filter.frequency.value = 850
    filter.Q.value = 0.45
    gain.gain.value = 0.025
    lfo.type = 'sine'
    lfo.frequency.value = 0.075
    lfoGain.gain.value = 0.018
    lfo.connect(lfoGain).connect(gain.gain)
    source.connect(filter).connect(gain).connect(master)
    source.start(now)
    lfo.start(now)
    ambientNodes = [source, lfo, gain]
    ambienceTimer = window.setInterval(() => {
      if (Math.random() > 0.38) filteredNoise(0.35, 0.025, 700, 1800, 0.04)
    }, 1800)
  }

  const stopAmbient = () => {
    if (ambienceTimer) window.clearInterval(ambienceTimer)
    ambienceTimer = null
    ambientNodes.forEach(node => {
      try { node.stop() } catch { /* already stopped */ }
      node.disconnect()
    })
    ambientNodes = []
  }

  return {
    resume,
    tone,
    kick,
    goal,
    cheer,
    startAmbient,
    stopAmbient,
    close: () => { stopAmbient(); context.close() },
  }
}
