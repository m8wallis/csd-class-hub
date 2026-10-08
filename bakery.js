// Bake Before Dark — a cartoon zombie bakery survival game.
// Standalone page: reads the class roster from data.js, keeps scores in localStorage.

;(() => {
  'use strict'

  // ---------- Tunables ----------
  const HALF_SECONDS = { full: 90, short: 45 }
  const MAX_HEALTH = 100
  const DAWN_HEAL = 20
  const MEDKIT_HEAL = 30
  const PLAYER_SPEED = 215
  const PLAYER_R = 14
  const ZOMBIE_R = 15
  const POINTS = { stun: 1, kill: 3, cure: 30, phase: 5, recipe: 5, allRecipes: 25 }
  const TRAPS_FROM_PHASE = 6
  const SNARE_STUN = 2.5
  const ZOMBIE_SPEED_CAP = 175
  const ENRAGED_SPEED_CAP = 205
  const MAX_NIGHT_ZOMBIES = { full: 45, short: 32 }
  const zombieHp = (phase) => 3 + Math.floor(phase / 2)
  const zombieDamage = (phase) => Math.min(30, 8 + 2 * phase)
  const CLASS_POINTS = { base: 1, perGamePoints: 100, max: 10 }
  const WORLD = { w: 2400, h: 1800 }
  const OVEN = { x: 1195, y: 905 }
  const STORAGE = {
    board: 'bbd-leaderboard-v1',
    unclaimed: 'bbd-unclaimed-v1',
    muted: 'bbd-muted-v1',
    teacher: 'bbd-teacher-v1'
  }
  const TEACHER_PIN = '7319'
  const SHARED_RUNS = (window.BBD_SCORES && window.BBD_SCORES.runs) || []
  const SHARED_IDS = new Set(SHARED_RUNS.map((r) => r.id))
  const PLAYER_COLORS = ['#2ec4b6', '#ff9f1c']
  const GUEST = '__guest'
  const INK = '#221a33'

  const INGREDIENTS = {
    flour: { name: 'Flour', icon: '🌾', weight: 6 },
    sugar: { name: 'Sugar', icon: '🍬', weight: 6 },
    eggs: { name: 'Eggs', icon: '🥚', weight: 4 },
    butter: { name: 'Butter', icon: '🧈', weight: 4 },
    milk: { name: 'Milk', icon: '🥛', weight: 3 },
    chocolate: { name: 'Chocolate', icon: '🍫', weight: 3 },
    berries: { name: 'Strawberries', icon: '🍓', weight: 3 },
    lemon: { name: 'Lemon', icon: '🍋', weight: 2 },
    cinnamon: { name: 'Cinnamon', icon: '🌰', weight: 2 },
    pepper: { name: 'Ghost Pepper', icon: '🌶️', weight: 3 },
    honey: { name: 'Golden Honey', icon: '🍯', rare: true, fromPhase: 2 },
    sprinkles: { name: 'Rainbow Sprinkles', icon: '🌈', rare: true, fromPhase: 3 },
    moonberry: { name: 'Moonberry', icon: '🫐', rare: true, fromPhase: 3 }
  }

  const RECIPES = [
    {
      id: 'sugarCookie',
      name: 'Sugar Cookie',
      icon: '🍪',
      needs: ['flour', 'sugar'],
      makes: 2,
      effect: { type: 'coma', secs: 4 },
      hint: 'Two pantry basics. The simplest cookie there is.'
    },
    {
      id: 'croissant',
      name: 'Butter Croissant',
      icon: '🥐',
      needs: ['flour', 'butter'],
      makes: 2,
      effect: { type: 'slow', secs: 7 },
      hint: 'Flaky, French, and only two ingredients.'
    },
    {
      id: 'pancakes',
      name: 'Pancake Stack',
      icon: '🥞',
      needs: ['flour', 'eggs', 'milk'],
      makes: 2,
      effect: { type: 'coma', secs: 6 },
      hint: 'Breakfast! Three things from any fridge and pantry.'
    },
    {
      id: 'cupcake',
      name: 'Strawberry Cupcake',
      icon: '🧁',
      needs: ['flour', 'sugar', 'berries'],
      makes: 2,
      effect: { type: 'coma', secs: 7 },
      hint: 'A sugar cookie, but make it fruity.'
    },
    {
      id: 'donut',
      name: 'Chocolate Donut',
      icon: '🍩',
      needs: ['flour', 'sugar', 'chocolate'],
      makes: 2,
      effect: { type: 'coma', secs: 8 },
      hint: 'A sugar cookie, but make it chocolate.'
    },
    {
      id: 'cinnamonRoll',
      name: 'Cinnamon Roll',
      icon: '🌀',
      needs: ['flour', 'butter', 'cinnamon'],
      makes: 2,
      effect: { type: 'coma', secs: 9 },
      hint: 'A croissant with a warm, spicy swirl.'
    },
    {
      id: 'lemonPie',
      name: 'Lemon Pie',
      icon: '🥧',
      needs: ['lemon', 'sugar', 'butter'],
      makes: 2,
      effect: { type: 'slow', secs: 10 },
      hint: 'Sweet, sour, buttery. No flour needed.'
    },
    {
      id: 'pepperBread',
      name: 'Ghost Pepper Bread',
      icon: '🍞',
      needs: ['flour', 'pepper'],
      makes: 2,
      effect: { type: 'enrage', secs: 8 },
      hint: 'Bread with a kick. What could go wrong?'
    },
    {
      id: 'spicyChoco',
      name: 'Spicy Choco Bomb',
      icon: '💣',
      needs: ['chocolate', 'pepper'],
      makes: 2,
      effect: { type: 'enrage', secs: 10 },
      hint: 'Chocolate and something that burns.'
    },
    {
      id: 'fruitcake',
      name: 'Fruitcake',
      icon: '🍰',
      needs: ['berries', 'lemon', 'cinnamon'],
      makes: 2,
      effect: { type: 'damage', amount: 4, secs: 1.5 },
      hint: "Fruit, citrus, spice. Everyone's grandma makes one."
    },
    {
      id: 'custard',
      name: 'Sour Custard',
      icon: '🍮',
      needs: ['eggs', 'milk', 'lemon'],
      makes: 2,
      effect: { type: 'coma', secs: 6 },
      hint: 'Eggs and milk plus something sour. Hmm.'
    },
    {
      id: 'honeyCake',
      name: 'Golden Honey Cake',
      icon: '🎂',
      needs: ['honey', 'flour', 'eggs'],
      makes: 1,
      effect: { type: 'areaComa', secs: 7, radius: 230 },
      hint: 'Rare golden sweetness baked into a cake. Smells AMAZING.'
    },
    {
      id: 'cure',
      name: 'Miracle Macaron',
      icon: '💖',
      needs: ['sprinkles', 'moonberry', 'sugar'],
      makes: 3,
      effect: { type: 'cure' },
      hint: 'Legend says rainbow + moon + something sweet turns a zombie back into a person.'
    }
  ]
  const BURNT = {
    id: 'burnt',
    name: 'Burnt Mystery Lump',
    icon: '🪨',
    makes: 1,
    effect: { type: 'distract', secs: 3 }
  }
  const STARTER_RECIPES = ['sugarCookie']
  const CARDS_PER_DAY = 1

  const WEAPONS = {
    bat: {
      name: 'Baseball Bat',
      damage: 1,
      stun: 2.0,
      range: 62,
      arc: 1.3,
      durability: 14,
      knock: 70
    },
    crowbar: {
      name: 'Crowbar',
      damage: 1,
      stun: 2.4,
      range: 58,
      arc: 1.1,
      durability: 20,
      knock: 55
    },
    pan: {
      name: 'Frying Pan',
      damage: 2,
      stun: 3.0,
      range: 50,
      arc: 1.5,
      durability: 10,
      knock: 85
    },
    machete: {
      name: 'Machete',
      damage: 3,
      stun: 2.4,
      range: 84,
      arc: 1.6,
      durability: 15,
      knock: 75,
      fromPhase: 6
    }
  }

  // ---------- Helpers ----------
  const $ = (s) => document.querySelector(s)
  const $$ = (s) => Array.from(document.querySelectorAll(s))
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const rand = (a, b) => a + Math.random() * (b - a)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const TAU = Math.PI * 2
  function angleDiff(a, b) {
    let d = (a - b) % TAU
    if (d > Math.PI) d -= TAU
    if (d < -Math.PI) d += TAU
    return d
  }
  function mulberry32(a) {
    return function () {
      a |= 0
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }
  function loadJSON(key, fallback) {
    try {
      const v = localStorage.getItem(key)
      return v == null ? fallback : JSON.parse(v)
    } catch {
      return fallback
    }
  }
  function saveJSON(key, v) {
    try {
      localStorage.setItem(key, JSON.stringify(v))
    } catch {
      /* storage full or blocked */
    }
  }
  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    )
  }
  function fmtTime(s) {
    s = Math.max(0, Math.ceil(s))
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
  }
  const recipeById = (id) => (id === 'burnt' ? BURNT : RECIPES.find((r) => r.id === id))
  const findRecipe = (sel) =>
    RECIPES.find((r) => r.needs.length === sel.length && r.needs.every((n) => sel.includes(n)))
  const classPointsFor = (score) =>
    Math.min(CLASS_POINTS.max, CLASS_POINTS.base + Math.floor(score / CLASS_POINTS.perGamePoints))

  function effectLabel(e) {
    switch (e.type) {
      case 'coma':
        return `😴 Food coma for ${e.secs}s`
      case 'slow':
        return `🐌 Sugar crash: slows them for ${e.secs}s`
      case 'enrage':
        return '😡 ENRAGES them! Faster and meaner'
      case 'damage':
        return `🧱 Hard as a brick! Hits for ${e.amount} damage (can knock them out)`
      case 'areaComa':
        return `💤 Food coma for EVERY zombie nearby (${e.secs}s)`
      case 'cure':
        return `💖 CURES a zombie! +${POINTS.cure}`
      case 'distract':
        return '🤔 They sniff it… a short distraction'
      default:
        return ''
    }
  }

  // ---------- Sound ----------
  const Sound = {
    ctx: null,
    master: null,
    sfxBus: null,
    musicBus: null,
    noiseBuf: null,
    muted: loadJSON(STORAGE.muted, false),
    mood: null,
    step: 0,
    nextNote: 0,
    timer: 0,

    unlock() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return
        this.ctx = new AC()
        this.master = this.ctx.createGain()
        this.master.gain.value = this.muted ? 0 : 0.7
        this.master.connect(this.ctx.destination)
        this.sfxBus = this.ctx.createGain()
        this.sfxBus.gain.value = 0.9
        this.sfxBus.connect(this.master)
        this.musicBus = this.ctx.createGain()
        this.musicBus.gain.value = 0.5
        this.musicBus.connect(this.master)
        const len = this.ctx.sampleRate
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
        const d = this.noiseBuf.getChannelData(0)
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
        if (this.mood) this.setMood(this.mood)
      }
      if (this.ctx.state === 'suspended') this.ctx.resume()
    },

    setMuted(m) {
      this.muted = m
      saveJSON(STORAGE.muted, m)
      if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.7, this.ctx.currentTime, 0.02)
      const btn = $('#mute')
      btn.textContent = m ? '🔇' : '🔊'
      btn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound')
    },

    tone(
      freq,
      {
        type = 'square',
        dur = 0.12,
        vol = 0.2,
        to = null,
        at = 0,
        bus = null,
        attack = 0.005,
        filter = 0
      } = {}
    ) {
      if (!this.ctx) return
      const t = this.ctx.currentTime + Math.max(0, at)
      const o = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      o.type = type
      o.frequency.setValueAtTime(freq, t)
      if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(vol, t + attack)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      let node = o
      if (filter) {
        const f = this.ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.value = filter
        o.connect(f)
        node = f
      }
      node.connect(g).connect(bus || this.sfxBus)
      o.start(t)
      o.stop(t + dur + 0.05)
    },

    noise({
      dur = 0.15,
      vol = 0.2,
      freq = 1200,
      q = 1,
      type = 'bandpass',
      at = 0,
      to = null,
      bus = null
    } = {}) {
      if (!this.ctx) return
      const t = this.ctx.currentTime + Math.max(0, at)
      const src = this.ctx.createBufferSource()
      src.buffer = this.noiseBuf
      const f = this.ctx.createBiquadFilter()
      f.type = type
      f.frequency.setValueAtTime(freq, t)
      if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur)
      f.Q.value = q
      const g = this.ctx.createGain()
      g.gain.setValueAtTime(vol, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      src
        .connect(f)
        .connect(g)
        .connect(bus || this.sfxBus)
      src.start(t, Math.random() * 0.5)
      src.stop(t + dur + 0.05)
    },

    play(name) {
      if (!this.ctx || this.muted) return
      const T = (f, o) => this.tone(f, o)
      const N = (o) => this.noise(o)
      switch (name) {
        case 'pickup':
          T(660, { dur: 0.07, vol: 0.1 })
          T(990, { dur: 0.09, vol: 0.1, at: 0.06 })
          break
        case 'rare':
          ;[784, 988, 1175, 1568].forEach((f, i) =>
            T(f, { type: 'triangle', dur: 0.2, vol: 0.16, at: i * 0.07 })
          )
          break
        case 'weapon':
          T(220, { type: 'sawtooth', dur: 0.12, vol: 0.08, to: 440 })
          T(880, { dur: 0.1, vol: 0.07, at: 0.1 })
          break
        case 'heal':
          ;[523, 659, 784].forEach((f, i) =>
            T(f, { type: 'sine', dur: 0.19, vol: 0.15, at: i * 0.08 })
          )
          break
        case 'swing':
          N({ dur: 0.14, vol: 0.14, freq: 900, to: 2600, q: 0.8 })
          break
        case 'bonk':
          T(320, { dur: 0.12, vol: 0.18, to: 90 })
          N({ dur: 0.08, vol: 0.22, freq: 1800, q: 2 })
          break
        case 'shove':
          N({ dur: 0.1, vol: 0.14, freq: 500 })
          break
        case 'break':
          N({ dur: 0.25, vol: 0.2, freq: 2400, q: 0.5 })
          T(200, { type: 'sawtooth', dur: 0.2, vol: 0.08, to: 60 })
          break
        case 'throw':
          T(400, { type: 'triangle', dur: 0.16, vol: 0.12, to: 900 })
          break
        case 'munch':
          for (let i = 0; i < 3; i++) {
            N({ dur: 0.06, vol: 0.2, freq: 700 + i * 150, q: 1.5, at: i * 0.09 })
            T(180, { dur: 0.05, vol: 0.06, at: i * 0.09 })
          }
          break
        case 'splat':
          N({ dur: 0.14, vol: 0.14, freq: 500, type: 'lowpass' })
          break
        case 'enrage':
          T(140, { type: 'sawtooth', dur: 0.55, vol: 0.16, to: 70, filter: 900 })
          T(147, { type: 'sawtooth', dur: 0.55, vol: 0.12, to: 72, filter: 900 })
          N({ dur: 0.4, vol: 0.14, freq: 300, type: 'lowpass' })
          break
        case 'cure':
          ;[523, 659, 784, 1047, 1319].forEach((f, i) =>
            T(f, { type: 'triangle', dur: 0.32, vol: 0.15, at: i * 0.08 })
          )
          T(2093, { type: 'sine', dur: 0.7, vol: 0.06, at: 0.4 })
          break
        case 'hurt':
          T(240, { dur: 0.2, vol: 0.16, to: 80 })
          N({ dur: 0.15, vol: 0.18, freq: 600 })
          break
        case 'groan': {
          const f = rand(75, 110)
          T(f, { type: 'sawtooth', dur: 0.9, vol: 0.07, to: f * 0.7, attack: 0.25, filter: 500 })
          break
        }
        case 'rise':
          N({ dur: 0.35, vol: 0.06, freq: 250, type: 'lowpass' })
          break
        case 'bake':
          T(1318, { type: 'sine', dur: 0.45, vol: 0.18 })
          T(1760, { type: 'sine', dur: 0.55, vol: 0.14, at: 0.15 })
          break
        case 'newRecipe':
          ;[523, 659, 784, 1047].forEach((f, i) =>
            T(f, { type: 'triangle', dur: 0.25, vol: 0.15, at: i * 0.09 })
          )
          T(1568, { type: 'sine', dur: 0.6, vol: 0.12, at: 0.4 })
          break
        case 'burnt':
          T(110, { type: 'sawtooth', dur: 0.4, vol: 0.1, filter: 800 })
          T(104, { type: 'sawtooth', dur: 0.4, vol: 0.1, filter: 800 })
          break
        case 'oven':
          N({ dur: 0.35, vol: 0.08, freq: 300, type: 'lowpass' })
          T(990, { type: 'sine', dur: 0.12, vol: 0.08, at: 0.05 })
          break
        case 'error':
          T(150, { dur: 0.12, vol: 0.08 })
          break
        case 'click':
          T(1200, { dur: 0.03, vol: 0.05 })
          break
        case 'warn':
          T(880, { dur: 0.1, vol: 0.09 })
          T(880, { dur: 0.1, vol: 0.09, at: 0.2 })
          break
        case 'day':
          ;[523, 659, 784, 1047].forEach((f, i) =>
            T(f, { type: 'triangle', dur: 0.3, vol: 0.14, at: i * 0.1 })
          )
          break
        case 'night':
          ;[220, 262, 311, 247].forEach((f, i) =>
            T(f, { type: 'triangle', dur: 0.6, vol: 0.16, at: i * 0.2 })
          )
          break
        case 'win':
          ;[523, 659, 784, 659, 784, 1047].forEach((f, i) =>
            T(f, { type: 'square', dur: 0.2, vol: 0.09, at: i * 0.13, filter: 2500 })
          )
          break
        case 'lose':
          ;[392, 370, 349, 294].forEach((f, i) =>
            T(f, { type: 'sawtooth', dur: 0.4, vol: 0.1, at: i * 0.3, filter: 1200 })
          )
          break
      }
    },

    setMood(m) {
      this.mood = m
      if (!this.ctx) return
      if (m && !this.timer) {
        this.nextNote = this.ctx.currentTime + 0.1
        this.step = 0
        this.timer = setInterval(() => this.tick(), 50)
      } else if (!m && this.timer) {
        clearInterval(this.timer)
        this.timer = 0
      }
    },

    tick() {
      if (!this.mood || !this.ctx) return
      const bpm = this.mood === 'day' ? 112 : 96 + (game ? game.phase : 1) * 7
      const spb = 60 / bpm / 2
      while (this.nextNote < this.ctx.currentTime + 0.15) {
        if (!this.muted) this.note(this.step, this.nextNote - this.ctx.currentTime, spb)
        this.nextNote += spb
        this.step++
      }
    },

    note(step, at, spb) {
      const bar = Math.floor(step / 8) % 4
      const s = step % 8
      const M = (m) => 440 * Math.pow(2, (m - 69) / 12)
      const bus = this.musicBus
      if (this.mood === 'day') {
        const r = [48, 45, 41, 43][bar]
        if (s === 0 || s === 3 || s === 4 || s === 6)
          this.tone(M(r + (s === 4 ? 12 : 0)), {
            type: 'triangle',
            dur: spb * 1.6,
            vol: 0.16,
            at,
            bus
          })
        const mel = [
          76, 0, 79, 76, 74, 0, 72, 0, 72, 0, 76, 74, 72, 0, 69, 0, 69, 0, 72, 74, 76, 0, 74, 0, 74,
          0, 79, 0, 76, 74, 72, 0
        ]
        const n = mel[step % 32]
        if (n) this.tone(M(n), { type: 'square', dur: spb * 0.9, vol: 0.03, at, bus, filter: 2200 })
        if (s % 2 === 1)
          this.noise({ dur: 0.03, vol: 0.035, freq: 8000, type: 'highpass', at, bus })
      } else {
        const r = [45, 41, 43, 40][bar]
        if (s % 2 === 0)
          this.tone(M(r), { type: 'sawtooth', dur: spb * 1.8, vol: 0.09, at, bus, filter: 500 })
        if (s === 0 || s === 1)
          this.tone(s === 0 ? 75 : 60, {
            type: 'sine',
            dur: 0.18,
            vol: s === 0 ? 0.35 : 0.25,
            to: 35,
            at,
            bus
          })
        if (s === 4 && bar % 2 === 0)
          this.tone(M([81, 84, 88, 83][bar]), {
            type: 'sine',
            dur: spb * 6,
            vol: 0.04,
            at,
            bus,
            attack: 0.2
          })
        if (s === 6) this.noise({ dur: 0.05, vol: 0.045, freq: 5000, type: 'highpass', at, bus })
      }
    }
  }

  // ---------- World ----------
  const ROADS_H = [
    { y: 560, h: 110 },
    { y: 1180, h: 110 }
  ]
  const ROADS_V = [
    { x: 760, w: 110 },
    { x: 1520, w: 110 }
  ]

  function buildWorld() {
    const rng = mulberry32(20261006)
    const R = (a, b) => a + rng() * (b - a)
    const solids = []
    const statics = []
    const lamps = []
    const ponds = []
    const roofs = [
      '#ff6b6b',
      '#4d96ff',
      '#ffd93d',
      '#6bcb77',
      '#c77dff',
      '#ff9f68',
      '#5ee7df',
      '#f78fb3'
    ]
    const xs = [
      [0, 760],
      [870, 1520],
      [1630, 2400]
    ]
    const ys = [
      [0, 560],
      [670, 1180],
      [1290, 1800]
    ]

    const treeOk = (x, y) =>
      solids.every((s) => x < s.x - 40 || x > s.x + s.w + 40 || y < s.y - 30 || y > s.y + s.h + 46)
    const addTree = (x, y, r) => {
      statics.push({ kind: 'tree', x, y, r, sortY: y, tint: rng() })
      solids.push({ x: x - 9, y: y - 8, w: 18, h: 12 })
    }

    ys.forEach(([y0, y1], ri) =>
      xs.forEach(([x0, x1], ci) => {
        const pad = 36
        if (ri === 1 && ci === 1) {
          const b = {
            kind: 'bakery',
            x: 1065,
            y: 720,
            w: 260,
            h: 150,
            roof: '#ff8fab',
            wall: '#fff1e6',
            seed: 0.3,
            sortY: 870
          }
          statics.push(b)
          solids.push(b)
          statics.push({ kind: 'oven', x: OVEN.x, y: OVEN.y, sortY: OVEN.y })
          solids.push({ x: OVEN.x - 22, y: OVEN.y - 20, w: 44, h: 24 })
          ;[
            [925, 735],
            [1465, 735],
            [925, 1130],
            [1465, 1130]
          ].forEach(([x, y]) => addTree(x, y, 30))
          lamps.push({ x: 1040, y: 965 }, { x: 1350, y: 965 })
          return
        }
        const park = (ri === 0 && ci === 0) || (ri === 2 && ci === 2)
        if (park) {
          const pond =
            ri === 0
              ? { x: x0 + 250, y: y0 + 170, w: 240, h: 150 }
              : { x: x0 + 280, y: y0 + 180, w: 260, h: 150 }
          ponds.push(pond)
          solids.push(pond)
          for (let i = 0; i < 40; i++) {
            const x = R(x0 + pad, x1 - pad)
            const y = R(y0 + pad + 30, y1 - pad)
            if (treeOk(x, y)) addTree(x, y, R(24, 36))
          }
          return
        }
        const cw = (x1 - x0 - pad * 2 - 70) / 2
        const ch = (y1 - y0 - pad * 2 - 70) / 2
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 2; c++) {
            const cx0 = x0 + pad + c * (cw + 70)
            const cy0 = y0 + pad + r * (ch + 70)
            if (rng() < 0.18) {
              for (let i = 0; i < 3; i++) {
                const x = R(cx0 + 30, cx0 + cw - 30)
                const y = R(cy0 + 40, cy0 + ch - 10)
                if (treeOk(x, y)) addTree(x, y, R(24, 34))
              }
              continue
            }
            const w = cw * R(0.72, 1)
            const h = ch * R(0.72, 1)
            const b = {
              kind: 'building',
              x: cx0 + R(0, cw - w),
              y: cy0 + R(0, ch - h),
              w,
              h,
              roof: roofs[Math.floor(rng() * roofs.length)],
              wall: '#efe6d8',
              seed: rng()
            }
            b.sortY = b.y + b.h
            statics.push(b)
            solids.push(b)
          }
        }
        for (let i = 0; i < 5; i++) {
          const x = R(x0 + pad, x1 - pad)
          const y = R(y0 + pad + 30, y1 - pad)
          if (treeOk(x, y)) addTree(x, y, R(22, 30))
        }
      })
    )

    const carColors = ['#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#8d99ae', '#ffb703']
    ;[
      { x: 300, y: 585, h: true },
      { x: 1150, y: 600, h: true },
      { x: 2000, y: 1205, h: true },
      { x: 420, y: 1230, h: true },
      { x: 785, y: 300, h: false },
      { x: 1550, y: 1500, h: false },
      { x: 1575, y: 250, h: false },
      { x: 800, y: 1450, h: false }
    ].forEach((s, i) => {
      const c = s.h ? { x: s.x, y: s.y, w: 74, h: 38 } : { x: s.x, y: s.y, w: 38, h: 74 }
      Object.assign(c, {
        kind: 'car',
        horiz: s.h,
        color: carColors[i % carColors.length],
        sortY: c.y + c.h
      })
      statics.push(c)
      solids.push(c)
    })

    ROADS_V.forEach((v) =>
      ROADS_H.forEach((h) => {
        lamps.push({ x: v.x - 16, y: h.y - 16 }, { x: v.x + v.w + 16, y: h.y + h.h + 20 })
      })
    )
    lamps.forEach((l) => statics.push({ kind: 'lamp', x: l.x, y: l.y, sortY: l.y }))

    return { solids, statics, lamps, ponds }
  }

  const world = buildWorld()

  function rrPath(g, x, y, w, h, r) {
    g.beginPath()
    if (g.roundRect) g.roundRect(x, y, w, h, r)
    else g.rect(x, y, w, h)
  }

  function renderGround() {
    const c = document.createElement('canvas')
    c.width = WORLD.w
    c.height = WORLD.h
    const g = c.getContext('2d')
    const rng = mulberry32(7)
    g.fillStyle = '#7fcf6e'
    g.fillRect(0, 0, WORLD.w, WORLD.h)
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = rng() < 0.5 ? 'rgba(60,140,60,0.22)' : 'rgba(200,245,160,0.22)'
      g.beginPath()
      g.ellipse(rng() * WORLD.w, rng() * WORLD.h, 6 + rng() * 24, 4 + rng() * 12, 0, 0, TAU)
      g.fill()
    }
    g.strokeStyle = 'rgba(40,110,50,0.5)'
    g.lineWidth = 2
    for (let i = 0; i < 900; i++) {
      const x = rng() * WORLD.w
      const y = rng() * WORLD.h
      g.beginPath()
      g.moveTo(x - 3, y)
      g.lineTo(x - 1, y - 6)
      g.moveTo(x, y)
      g.lineTo(x + 1, y - 7)
      g.moveTo(x + 3, y)
      g.lineTo(x + 4, y - 5)
      g.stroke()
    }
    const flowers = ['#ff8fab', '#ffd23f', '#ffffff', '#c77dff']
    for (let i = 0; i < 260; i++) {
      g.fillStyle = flowers[Math.floor(rng() * flowers.length)]
      g.beginPath()
      g.arc(rng() * WORLD.w, rng() * WORLD.h, 2.5, 0, TAU)
      g.fill()
    }

    // bakery plaza
    g.fillStyle = '#f3d2b0'
    rrPath(g, 900, 700, 590, 450, 30)
    g.fill()
    g.save()
    g.clip()
    g.strokeStyle = '#e6bf98'
    g.lineWidth = 2
    for (let x = 900; x < 1490; x += 30) {
      g.beginPath()
      g.moveTo(x, 700)
      g.lineTo(x, 1150)
      g.stroke()
    }
    for (let y = 700; y < 1150; y += 30) {
      g.beginPath()
      g.moveTo(900, y)
      g.lineTo(1490, y)
      g.stroke()
    }
    g.restore()
    g.strokeStyle = INK
    g.lineWidth = 4
    rrPath(g, 900, 700, 590, 450, 30)
    g.stroke()

    // sidewalks + roads
    g.fillStyle = '#d8d2c4'
    ROADS_H.forEach((r) => g.fillRect(0, r.y - 16, WORLD.w, r.h + 32))
    ROADS_V.forEach((r) => g.fillRect(r.x - 16, 0, r.w + 32, WORLD.h))
    g.fillStyle = '#4b4f5c'
    ROADS_H.forEach((r) => g.fillRect(0, r.y, WORLD.w, r.h))
    ROADS_V.forEach((r) => g.fillRect(r.x, 0, r.w, WORLD.h))
    g.strokeStyle = '#ffd23f'
    g.lineWidth = 4
    g.setLineDash([28, 22])
    ROADS_H.forEach((r) => {
      g.beginPath()
      g.moveTo(0, r.y + r.h / 2)
      g.lineTo(WORLD.w, r.y + r.h / 2)
      g.stroke()
    })
    ROADS_V.forEach((r) => {
      g.beginPath()
      g.moveTo(r.x + r.w / 2, 0)
      g.lineTo(r.x + r.w / 2, WORLD.h)
      g.stroke()
    })
    g.setLineDash([])
    ROADS_V.forEach((v) =>
      ROADS_H.forEach((h) => {
        g.fillStyle = '#4b4f5c'
        g.fillRect(v.x, h.y, v.w, h.h)
        g.fillStyle = '#f4f1ea'
        for (let i = 0; i < 6; i++) {
          g.fillRect(v.x + 8 + i * 17, h.y - 14, 10, 12)
          g.fillRect(v.x + 8 + i * 17, h.y + h.h + 2, 10, 12)
          g.fillRect(v.x - 14, h.y + 8 + i * 17, 12, 10)
          g.fillRect(v.x + v.w + 2, h.y + 8 + i * 17, 12, 10)
        }
      })
    )
    // cracks
    g.strokeStyle = 'rgba(20,20,30,0.45)'
    g.lineWidth = 2
    for (let i = 0; i < 40; i++) {
      const horiz = rng() < 0.5
      const r = horiz ? ROADS_H[Math.floor(rng() * 2)] : ROADS_V[Math.floor(rng() * 2)]
      let x = horiz ? rng() * WORLD.w : r.x + 10 + rng() * (r.w - 20)
      let y = horiz ? r.y + 10 + rng() * (r.h - 20) : rng() * WORLD.h
      g.beginPath()
      g.moveTo(x, y)
      for (let k = 0; k < 4; k++) {
        x += (rng() - 0.5) * 30
        y += (rng() - 0.5) * 30
        g.lineTo(x, y)
      }
      g.stroke()
    }

    // ponds
    world.ponds.forEach((p) => {
      g.fillStyle = '#4fb3e8'
      g.beginPath()
      g.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, TAU)
      g.fill()
      g.strokeStyle = INK
      g.lineWidth = 4
      g.stroke()
      g.fillStyle = 'rgba(255,255,255,0.35)'
      g.beginPath()
      g.ellipse(p.x + p.w * 0.38, p.y + p.h * 0.35, p.w * 0.18, p.h * 0.1, -0.3, 0, TAU)
      g.fill()
      g.fillStyle = '#4caf50'
      for (let i = 0; i < 4; i++) {
        g.beginPath()
        g.arc(p.x + p.w * (0.25 + rng() * 0.5), p.y + p.h * (0.3 + rng() * 0.45), 9, 0.3, TAU - 0.3)
        g.lineTo(p.x + p.w * 0.5, p.y + p.h * 0.5)
        g.fill()
      }
    })

    // hedge border
    g.strokeStyle = '#2f7a3a'
    g.lineWidth = 28
    g.strokeRect(0, 0, WORLD.w, WORLD.h)
    return c
  }

  const MINI = 0.075
  function renderMinimap() {
    const c = document.createElement('canvas')
    c.width = Math.round(WORLD.w * MINI)
    c.height = Math.round(WORLD.h * MINI)
    const g = c.getContext('2d')
    g.scale(MINI, MINI)
    g.fillStyle = '#5aa85a'
    g.fillRect(0, 0, WORLD.w, WORLD.h)
    g.fillStyle = '#e8c49e'
    g.fillRect(900, 700, 590, 450)
    g.fillStyle = '#3d3f4a'
    ROADS_H.forEach((r) => g.fillRect(0, r.y, WORLD.w, r.h))
    ROADS_V.forEach((r) => g.fillRect(r.x, 0, r.w, WORLD.h))
    world.ponds.forEach((p) => {
      g.fillStyle = '#4fb3e8'
      g.fillRect(p.x, p.y, p.w, p.h)
    })
    world.statics.forEach((s) => {
      if (s.kind === 'building') {
        g.fillStyle = '#2a2238'
        g.fillRect(s.x, s.y, s.w, s.h)
      }
      if (s.kind === 'bakery') {
        g.fillStyle = '#ff5fa2'
        g.fillRect(s.x, s.y, s.w, s.h)
      }
      if (s.kind === 'tree') {
        g.fillStyle = '#2f7a3a'
        g.beginPath()
        g.arc(s.x, s.y - 10, s.r, 0, TAU)
        g.fill()
      }
    })
    return c
  }

  const ground = renderGround()
  const minimap = renderMinimap()

  function isFree(x, y, r) {
    for (const o of world.solids) {
      const cx = clamp(x, o.x, o.x + o.w)
      const cy = clamp(y, o.y, o.y + o.h)
      if ((x - cx) ** 2 + (y - cy) ** 2 < r * r) return false
    }
    return true
  }
  function pointInSolid(x, y) {
    for (const o of world.solids)
      if (x > o.x && x < o.x + o.w && y > o.y && y < o.y + o.h) return true
    return false
  }
  function resolve(e, r) {
    for (const o of world.solids) {
      if (e.x + r < o.x || e.x - r > o.x + o.w || e.y + r < o.y || e.y - r > o.y + o.h) continue
      const cx = clamp(e.x, o.x, o.x + o.w)
      const cy = clamp(e.y, o.y, o.y + o.h)
      const dx = e.x - cx
      const dy = e.y - cy
      const d2 = dx * dx + dy * dy
      if (d2 === 0) {
        const left = e.x - o.x,
          right = o.x + o.w - e.x,
          top = e.y - o.y,
          bottom = o.y + o.h - e.y
        const m = Math.min(left, right, top, bottom)
        if (m === left) e.x = o.x - r
        else if (m === right) e.x = o.x + o.w + r
        else if (m === top) e.y = o.y - r
        else e.y = o.y + o.h + r
      } else if (d2 < r * r) {
        const d = Math.sqrt(d2)
        e.x = cx + (dx / d) * r
        e.y = cy + (dy / d) * r
      }
    }
    e.x = clamp(e.x, r + 10, WORLD.w - r - 10)
    e.y = clamp(e.y, r + 10, WORLD.h - r - 10)
  }
  function moveCircle(e, dx, dy, r) {
    e.x += dx
    resolve(e, r)
    e.y += dy
    resolve(e, r)
  }

  // ---------- Canvas ----------
  const canvas = $('#game')
  const ctx = canvas.getContext('2d')
  const light = document.createElement('canvas')
  const lctx = light.getContext('2d')
  let viewW = 0,
    viewH = 0,
    dpr = 1,
    zoom = 1

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    viewW = window.innerWidth
    viewH = window.innerHeight
    canvas.width = Math.round(viewW * dpr)
    canvas.height = Math.round(viewH * dpr)
    light.width = Math.ceil(viewW / 2)
    light.height = Math.ceil(viewH / 2)
    zoom = clamp(viewH / 760, 0.75, 1.3)
  }
  window.addEventListener('resize', resize)
  resize()

  const emojiCache = new Map()
  function emojiSprite(ch, px) {
    const key = ch + '|' + px
    let c = emojiCache.get(key)
    if (!c) {
      c = document.createElement('canvas')
      const s = Math.ceil(px * 1.35)
      c.width = c.height = s
      const g = c.getContext('2d')
      g.font = `${px}px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(ch, s / 2, s / 2 + px * 0.06)
      emojiCache.set(key, c)
    }
    return c
  }
  function drawEmoji(ch, x, y, size, scale) {
    const px = Math.max(8, Math.round(size * scale))
    const sp = emojiSprite(ch, px)
    const w = sp.width / scale
    ctx.drawImage(sp, x - w / 2, y - w / 2, w, w)
  }
  const worldScale = () => dpr * zoom

  function rr(x, y, w, h, r) {
    rrPath(ctx, x, y, w, h, r)
  }
  function circle(x, y, r) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TAU)
  }
  function ellipse(x, y, rx, ry) {
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU)
  }
  function fillStroke(fill, lw = 3) {
    ctx.fillStyle = fill
    ctx.fill()
    ctx.lineWidth = lw
    ctx.strokeStyle = INK
    ctx.stroke()
  }
  function comicText(str, x, y, size, fill, strokeW = 6, align = 'center') {
    ctx.font = `${size}px Bangers, Impact, sans-serif`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'
    ctx.lineWidth = strokeW
    ctx.strokeStyle = INK
    ctx.strokeText(str, x, y)
    ctx.fillStyle = fill
    ctx.fillText(str, x, y)
  }
  function bodyText(str, x, y, size, fill, align = 'left', weight = 800) {
    ctx.font = `${weight} ${size}px Nunito, system-ui, sans-serif`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fill
    ctx.fillText(str, x, y)
  }

  // ---------- Game state ----------
  let game = null
  let session = null
  let ui = 'title'
  let bookReturn = null
  const keys = new Set()

  function newGame(player, index) {
    const half = HALF_SECONDS[session.mode]
    game = {
      half,
      phase: 1,
      isNight: false,
      t: half,
      time: 0,
      score: 0,
      stats: { stuns: 0, kills: 0, cures: 0, survived: 0 },
      traps: [],
      deathCause: null,
      ingredients: {},
      treats: {},
      treatOrder: [],
      selected: 0,
      known: Object.fromEntries(STARTER_RECIPES.map((id) => [id, { effectKnown: true }])),
      zombies: [],
      items: [],
      projectiles: [],
      particles: [],
      humans: [],
      toasts: [],
      spawn: { left: 0, timer: 0, interval: 1 },
      banner: null,
      shake: 0,
      over: false,
      dying: 0,
      groanT: 3,
      duskWarned: false,
      ovenNear: false,
      swapItem: null,
      tips: {},
      name: player.name,
      guest: player.guest,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      player: {
        x: OVEN.x,
        y: OVEN.y + 70,
        face: Math.PI / 2,
        hp: MAX_HEALTH,
        invuln: 0,
        swingT: 0,
        swingCd: 0,
        stunT: 0,
        weapon: null,
        anim: 0,
        moving: false,
        kx: 0,
        ky: 0
      }
    }
    startDay(true)
  }

  function banner(title, sub, night = false) {
    game.banner = { title, sub, t: 3.2, night }
  }
  function toast(text) {
    game.toasts.push({ text, t: 3.5 })
    if (game.toasts.length > 3) game.toasts.shift()
  }
  function tipOnce(key, text) {
    if (game.tips[key]) return
    game.tips[key] = true
    toast(text)
  }

  function startDay(first) {
    game.isNight = false
    game.t = game.half
    game.duskWarned = false
    game.zombies.forEach((z) => poof(z.x, z.y - 20))
    game.zombies = []
    let sub = 'Scavenge ingredients, then bake at the oven 🔥'
    if (!first) {
      game.player.hp = Math.min(MAX_HEALTH, game.player.hp + DAWN_HEAL)
      sub = `Survived the night! +${game.lastBonus} pts · +${DAWN_HEAL} health`
    }
    spawnSupplies()
    spawnTraps()
    const n = Math.min(10, 2 + Math.floor(game.phase / 2))
    for (let i = 0; i < n; i++) spawnZombie()
    banner(`Day ${game.phase}`, sub)
    if (first) {
      STARTER_RECIPES.map(recipeById).forEach((r) =>
        toast(
          `📖 You know one recipe: ${r.icon} ${r.name} = ${r.needs.map((n) => INGREDIENTS[n].name).join(' + ')}`
        )
      )
    }
    if (game.phase === 2)
      toast('✨ Golden Honey appeared far from the bakery. Look for gold dots on your map!')
    if (game.phase === 3) toast('🌈 Legendary ingredients spotted! Legend says they make a cure…')
    if (game.phase === TRAPS_FROM_PHASE)
      toast('⚠️ Traps have appeared! Bear traps freeze you. Pits are DEADLY. Watch your step!')
    Sound.play('day')
    Sound.setMood('day')
  }

  function startNight() {
    game.isNight = true
    game.t = game.half
    const count = Math.min(
      MAX_NIGHT_ZOMBIES[session.mode],
      session.mode === 'short' ? 4 + 2 * game.phase : 6 + 3 * game.phase
    )
    game.spawn = { left: count, timer: 1, interval: (game.half * 0.6) / count }
    banner(`Night ${game.phase}`, 'The oven is off. Feed them, bonk them, survive!', true)
    Sound.play('night')
    Sound.setMood('night')
  }

  function endNight() {
    const bonus = POINTS.phase * game.phase
    game.lastBonus = bonus
    addScore(bonus, game.player.x, game.player.y - 80, `Night ${game.phase} survived!`)
    game.stats.survived = game.phase
    game.phase++
    startDay(false)
  }

  function spawnSupplies() {
    const short = session.mode === 'short'
    game.items = [
      ...game.items.filter((i) => i.kind === 'card'),
      ...game.items.filter((i) => i.kind === 'ingredient').slice(-16)
    ]
    const commons = Object.entries(INGREDIENTS).filter(([, v]) => !v.rare)
    const totalW = commons.reduce((s, [, v]) => s + v.weight, 0)
    const count = (short ? 15 : 20) + game.phase
    for (let i = 0; i < count; i++) {
      let r = Math.random() * totalW
      let key = commons[0][0]
      for (const [k, v] of commons) {
        r -= v.weight
        if (r <= 0) {
          key = k
          break
        }
      }
      placeItem('ingredient', key)
    }
    if (game.phase === 1)
      ['flour', 'flour', 'sugar', 'sugar', 'butter', 'eggs'].forEach((k) =>
        placeItem('ingredient', k, { near: 650 })
      )
    for (const [k, v] of Object.entries(INGREDIENTS)) {
      if (!v.rare || game.phase < v.fromPhase) continue
      const n = 2 + (game.phase >= 5 ? 1 : 0)
      for (let i = 0; i < n; i++) placeItem('ingredient', k, { far: true })
    }
    const weaponKeys = Object.keys(WEAPONS).filter((k) => game.phase >= (WEAPONS[k].fromPhase ?? 1))
    if (game.phase === 1) placeItem('weapon', 'bat', { near: 380 })
    placeItem('weapon', pick(weaponKeys))
    if (game.phase >= 3) placeItem('weapon', pick(weaponKeys))
    if (game.phase >= WEAPONS.machete.fromPhase) placeItem('weapon', 'machete', { far: true })
    if (game.phase === WEAPONS.machete.fromPhase)
      toast('🔪 A Machete has appeared somewhere in town! Most damage, longest reach.')
    if (game.phase >= 2) for (let i = 0; i < (short ? 1 : 2); i++) placeItem('medkit', 'medkit')
    if (cardCandidates().length) {
      for (let i = 0; i < CARDS_PER_DAY; i++) placeItem('card', 'card', { min: 450 })
    }
  }

  function spawnTraps() {
    game.traps = []
    if (game.phase < TRAPS_FROM_PHASE) return
    const extra = game.phase - TRAPS_FROM_PHASE
    const snares = Math.min(10, 3 + extra)
    const pits = Math.min(5, 1 + Math.floor(extra / 2))
    const place = (kind, r) => {
      const p = game.player
      for (let i = 0; i < 120; i++) {
        const x = rand(60, WORLD.w - 60)
        const y = rand(60, WORLD.h - 60)
        if (Math.hypot(x - OVEN.x, y - OVEN.y) < 220) continue
        if (Math.hypot(x - p.x, y - p.y) < 200) continue
        if (!isFree(x, y, r + 6)) continue
        if (game.traps.some((t) => Math.hypot(t.x - x, t.y - y) < t.r + r + 40)) continue
        if (game.items.some((it) => Math.hypot(it.x - x, it.y - y) < r + 30)) continue
        game.traps.push({ kind, x, y, r, armed: true })
        return
      }
    }
    for (let i = 0; i < pits; i++) place('pit', 38)
    for (let i = 0; i < snares; i++) place('snare', 16)
  }

  function cardCandidates() {
    return RECIPES.filter((r) => {
      if (game.known[r.id]) return false
      if (r.id === 'cure') return game.phase >= 3
      return r.needs.every((n) => !INGREDIENTS[n].rare || game.phase >= INGREDIENTS[n].fromPhase)
    })
  }

  function placeItem(kind, key, opt = {}) {
    for (let i = 0; i < 120; i++) {
      const x = rand(50, WORLD.w - 50)
      const y = rand(50, WORLD.h - 50)
      const d = Math.hypot(x - OVEN.x, y - OVEN.y)
      if (d < 100) continue
      if (opt.near && d > opt.near) continue
      if (opt.far && d < 750) continue
      if (opt.min && d < opt.min) continue
      if (!isFree(x, y, 24)) continue
      game.items.push({ kind, key, x, y, bob: rand(0, TAU) })
      return
    }
  }

  function spawnZombie() {
    const p = game.player
    let x = 60,
      y = 60
    for (let i = 0; i < 80; i++) {
      x = rand(50, WORLD.w - 50)
      y = rand(50, WORLD.h - 50)
      if (Math.hypot(x - p.x, y - p.y) > 560 && isFree(x, y, ZOMBIE_R + 4)) break
    }
    game.zombies.push({
      x,
      y,
      kx: 0,
      ky: 0,
      dx: 0,
      dy: 1,
      dir: rand(0, TAU),
      wanderT: 0,
      idle: false,
      stunT: 0,
      comaT: 0,
      slowT: 0,
      enrageT: 0,
      distractT: 0,
      distractPos: null,
      attackCd: 0.6,
      sideT: 0,
      sideA: 0,
      lx: x,
      ly: y,
      checkT: 0.4,
      anim: rand(0, 10),
      flash: 0,
      zzzT: 0,
      steamT: 0,
      shirt: pick(['#7b6fd6', '#d65f8a', '#4f9dd9', '#c9a14a', '#6cae5b', '#9a6b4f', '#e07a5f']),
      size: rand(0.92, 1.1),
      spawnT: 0.7,
      hp: zombieHp(game.phase),
      maxHp: zombieHp(game.phase)
    })
  }

  // ---------- Effects ----------
  function addParticle(p) {
    if (game.particles.length > 450) game.particles.shift()
    game.particles.push(p)
  }
  function burst(x, y, color, n = 8, speed = 160) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU)
      const s = rand(speed * 0.4, speed)
      addParticle({
        type: 'dot',
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        g: 320,
        life: rand(0.4, 0.8),
        max: 0.8,
        color,
        size: rand(2.5, 5.5)
      })
    }
  }
  function confetti(x, y) {
    const colors = ['#ff5fa2', '#ffd23f', '#3ee6b5', '#7b6fd6', '#ffffff', '#ff9f1c']
    for (let i = 0; i < 30; i++) {
      const a = rand(0, TAU)
      const s = rand(80, 260)
      addParticle({
        type: 'dot',
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 140,
        g: 380,
        life: rand(0.7, 1.3),
        max: 1.3,
        color: pick(colors),
        size: rand(3, 6)
      })
    }
  }
  function poof(x, y) {
    for (let i = 0; i < 10; i++) {
      const a = rand(0, TAU)
      addParticle({
        type: 'dot',
        x,
        y,
        vx: Math.cos(a) * 60,
        vy: Math.sin(a) * 40 - 30,
        g: 0,
        life: rand(0.4, 0.8),
        max: 0.8,
        color: 'rgba(200,200,210,0.8)',
        size: rand(6, 11)
      })
    }
  }
  function floatText(text, x, y, color = '#fff', size = 18) {
    addParticle({
      type: 'text',
      text,
      x,
      y,
      vx: 0,
      vy: -46,
      g: 0,
      life: 1.3,
      max: 1.3,
      color,
      size
    })
  }
  function comic(text, x, y, color) {
    addParticle({
      type: 'comic',
      text,
      x,
      y,
      vx: 0,
      vy: -20,
      g: 0,
      life: 0.75,
      max: 0.75,
      color,
      rot: rand(-0.3, 0.3)
    })
  }
  function emojiFx(ch, x, y, size = 20) {
    addParticle({
      type: 'emoji',
      text: ch,
      x,
      y,
      vx: rand(-15, 15),
      vy: -42,
      g: 0,
      life: 1.2,
      max: 1.2,
      size
    })
  }
  function ring(x, y, r, color) {
    addParticle({ type: 'ring', x, y, vx: 0, vy: 0, g: 0, life: 0.7, max: 0.7, r, color })
  }

  function addScore(n, x, y, label = '') {
    game.score += n
    floatText(`+${n}${label ? ' ' + label : ''}`, x, y, '#ffd23f', label ? 22 : 18)
  }
  const isDisabled = (z) => z.comaT > 0 || z.stunT > 0
  function awardStun(z) {
    game.stats.stuns++
    addScore(POINTS.stun, z.x, z.y - 78)
  }

  function defeatZombie(z, label = 'KO!') {
    if (z.dead) return
    z.dead = true
    game.zombies = game.zombies.filter((o) => o !== z)
    game.stats.kills++
    poof(z.x, z.y - 20)
    burst(z.x, z.y - 30, '#94d26b', 12)
    comic(label, z.x, z.y - 86, '#ff5c5c')
    addScore(POINTS.kill, z.x, z.y - 62, 'Knocked out!')
    Sound.play('break')
  }

  function damageZombie(z, amount) {
    z.hp -= amount
    if (z.hp <= 0) defeatZombie(z)
    return z.dead
  }

  function discoverRecipe(r) {
    if (game.known[r.id]) return false
    game.known[r.id] = { effectKnown: false }
    const p = game.player
    addScore(POINTS.recipe, p.x, p.y - 90, 'New recipe!')
    if (RECIPES.every((x) => game.known[x.id])) {
      addScore(POINTS.allRecipes, p.x, p.y - 120, 'EVERY recipe!')
      toast(`🏆 Master Baker! You found every recipe: +${POINTS.allRecipes} bonus`)
      Sound.play('win')
    }
    return true
  }

  // ---------- Actions ----------
  function swing() {
    const p = game.player
    if (p.swingCd > 0 || p.stunT > 0) return
    const w = p.weapon ? WEAPONS[p.weapon.type] : null
    p.swingCd = w ? 0.42 : 0.5
    p.swingT = 0.19
    Sound.play('swing')
    const range = (w ? w.range : 42) + ZOMBIE_R
    const arc = (w ? w.arc : 1.4) / 2 + 0.25
    let hit = false
    for (const z of game.zombies) {
      if (z.spawnT > 0) continue
      const dx = z.x - p.x
      const dy = z.y - p.y
      const d = Math.hypot(dx, dy)
      if (d > range) continue
      const a = Math.atan2(dy, dx)
      if (d > 20 && Math.abs(angleDiff(a, p.face)) > arc) continue
      hit = true
      if (w) {
        const fresh = !isDisabled(z)
        z.stunT = Math.max(z.stunT, w.stun)
        z.kx = Math.cos(a) * w.knock * 6
        z.ky = Math.sin(a) * w.knock * 6
        z.flash = 0.15
        comic(pick(['BONK!', 'WHACK!', 'POW!', 'THWACK!']), z.x, z.y - 62, '#ffd23f')
        burst(z.x, z.y - 30, '#ffffff', 6)
        if (fresh) awardStun(z)
        damageZombie(z, w.damage)
      } else {
        z.kx = Math.cos(a) * 300
        z.ky = Math.sin(a) * 300
        comic('SHOVE!', z.x, z.y - 62, '#ffffff')
      }
    }
    if (!hit) return
    Sound.play(w ? 'bonk' : 'shove')
    game.shake = Math.max(game.shake, w ? 5 : 2)
    if (w) {
      p.weapon.dur--
      if (p.weapon.dur <= 0) {
        toast(`💥 Your ${w.name} broke!`)
        comic('CRACK!', p.x, p.y - 74, '#ff5c5c')
        p.weapon = null
        Sound.play('break')
      }
    } else {
      tipOnce(
        'fists',
        'Shoving only pushes them away. Find a weapon to stun and knock out zombies!'
      )
    }
  }

  function throwTreat(aimX, aimY) {
    const p = game.player
    if (p.stunT > 0) return
    const id = game.treatOrder[game.selected]
    if (!id) {
      toast('No treats yet! Bake some at the oven 🔥')
      Sound.play('error')
      return
    }
    const recipe = recipeById(id)
    let ang = p.face
    if (aimX != null) {
      ang = Math.atan2(aimY + 22 - p.y, aimX - p.x)
      p.face = ang
    } else {
      let best = null
      let bd = Infinity
      for (const z of game.zombies) {
        if (z.spawnT > 0) continue
        const d = Math.hypot(z.x - p.x, z.y - p.y)
        if (d > 360) continue
        const a = Math.atan2(z.y - p.y, z.x - p.x)
        if (Math.abs(angleDiff(a, p.face)) > 0.9) continue
        if (d < bd) {
          bd = d
          best = a
        }
      }
      if (best != null) ang = best
    }
    game.treats[id]--
    if (game.treats[id] <= 0) {
      delete game.treats[id]
      game.treatOrder.splice(game.selected, 1)
      game.selected = clamp(game.selected, 0, Math.max(0, game.treatOrder.length - 1))
    }
    const sp = 560
    game.projectiles.push({
      x: p.x + Math.cos(ang) * 14,
      y: p.y + Math.sin(ang) * 14,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      travel: 0,
      max: 380,
      recipe,
      spin: 0
    })
    Sound.play('throw')
  }

  function cycleTreat(dir) {
    const n = game.treatOrder.length
    if (!n) return
    game.selected = (game.selected + dir + n) % n
    Sound.play('click')
  }
  function selectTreat(i) {
    if (i < game.treatOrder.length) {
      game.selected = i
      Sound.play('click')
    }
  }

  function interact() {
    const p = game.player
    if (game.ovenNear && !game.isNight) {
      openBake()
      return
    }
    if (game.ovenNear && !game.swapItem) {
      toast('🌙 The oven is off at night. Bake during the day!')
      Sound.play('error')
      return
    }
    if (game.swapItem) {
      const it = game.swapItem
      const old = p.weapon
      p.weapon = { type: it.key, dur: it.dur ?? WEAPONS[it.key].durability }
      it.key = old.type
      it.dur = old.dur
      floatText(`Got ${WEAPONS[p.weapon.type].name}!`, p.x, p.y - 70, '#7fe0ff')
      Sound.play('weapon')
    }
  }

  function revealEffect(recipe) {
    const k = game.known[recipe.id]
    if (k && !k.effectKnown) {
      k.effectKnown = true
      toast(`📖 Learned: ${recipe.name} → ${effectLabel(recipe.effect)}`)
    }
  }

  function feed(z, secs, quiet) {
    const fresh = !isDisabled(z)
    z.comaT = Math.max(z.comaT, secs)
    z.enrageT = 0
    z.stunT = 0
    if (!quiet) Sound.play('munch')
    comic('NOM!', z.x, z.y - 62, '#ff9fd0')
    emojiFx('💗', z.x, z.y - 70)
    if (fresh) awardStun(z)
  }

  function applyTreat(recipe, z, x, y) {
    const e = recipe.effect
    revealEffect(recipe)
    switch (e.type) {
      case 'coma':
        feed(z, e.secs)
        break
      case 'slow': {
        const fresh = !isDisabled(z) && z.slowT <= 0
        z.slowT = e.secs
        z.enrageT = 0
        Sound.play('munch')
        comic('NOM!', z.x, z.y - 62, '#7fe0ff')
        emojiFx('🐌', z.x, z.y - 74)
        if (fresh) awardStun(z)
        break
      }
      case 'enrage':
        z.enrageT = e.secs
        z.comaT = 0
        z.stunT = 0
        z.slowT = 0
        Sound.play('enrage')
        comic('RAAAH!', z.x, z.y - 62, '#ff5c5c')
        burst(z.x, z.y - 30, '#ff5c5c', 12)
        game.shake = 6
        tipOnce('enrage', '😡 Uh oh. That treat made it ANGRY. Avoid baking that one!')
        break
      case 'damage': {
        const fresh = !isDisabled(z)
        z.stunT = Math.max(z.stunT, e.secs)
        z.enrageT = 0
        z.flash = 0.15
        Sound.play('bonk')
        comic('THUNK!', z.x, z.y - 62, '#ffd23f')
        game.shake = Math.max(game.shake, 4)
        if (fresh) awardStun(z)
        damageZombie(z, e.amount)
        break
      }
      case 'areaComa':
        areaComa(x ?? z.x, y ?? z.y, e)
        break
      case 'cure':
        cureZombie(z)
        break
      case 'distract':
        z.distractT = e.secs
        z.distractPos = { x: z.x, y: z.y }
        emojiFx('❓', z.x, z.y - 74)
        Sound.play('splat')
        break
    }
  }

  function areaComa(x, y, e) {
    ring(x, y, e.radius, '#ffd23f')
    confetti(x, y)
    Sound.play('munch')
    for (const z of game.zombies) {
      if (z.spawnT <= 0 && Math.hypot(z.x - x, z.y - y) <= e.radius) feed(z, e.secs, true)
    }
    comic('FOOD COMA!', x, y - 70, '#ffd23f')
  }

  function cureZombie(z) {
    z.dead = true
    game.zombies = game.zombies.filter((o) => o !== z)
    game.humans.push({ x: z.x, y: z.y, t: 0, shirt: z.shirt, heartT: 0 })
    game.stats.cures++
    addScore(POINTS.cure, z.x, z.y - 70, 'CURED!')
    comic('CURED!', z.x, z.y - 90, '#ff5fa2')
    confetti(z.x, z.y - 30)
    Sound.play('cure')
  }

  function hurtPlayer(dmg, z) {
    const p = game.player
    if (p.invuln > 0 || game.dying) return
    p.hp -= dmg
    p.invuln = 0.8
    const a = Math.atan2(p.y - z.y, p.x - z.x)
    p.kx = Math.cos(a) * 420
    p.ky = Math.sin(a) * 420
    game.shake = 10
    Sound.play('hurt')
    floatText(`-${dmg}`, p.x, p.y - 56, '#ff5c5c', 22)
    burst(p.x, p.y - 30, '#ff5c5c', 8)
    if (p.hp <= 0) {
      p.hp = 0
      game.dying = 1.8
      banner('CHOMP!', 'The zombies got you…', true)
      Sound.setMood(null)
      Sound.play('lose')
    }
  }

  function pickup(it) {
    const p = game.player
    if (it.kind === 'ingredient') {
      const ing = INGREDIENTS[it.key]
      game.ingredients[it.key] = (game.ingredients[it.key] || 0) + 1
      floatText(`+1 ${ing.name}`, it.x, it.y - 24, ing.rare ? '#ffd23f' : '#ffffff')
      burst(it.x, it.y - 8, ing.rare ? '#ffd23f' : '#ffffff', ing.rare ? 16 : 6)
      Sound.play(ing.rare ? 'rare' : 'pickup')
      if (ing.rare) toast(`✨ Found ${ing.icon} ${ing.name}! It's legendary.`)
      tipOnce(
        'firstIng',
        'Nice! Bring ingredients to the 🔥 oven at the pink bakery (press E there).'
      )
      return true
    }
    if (it.kind === 'weapon') {
      const w = WEAPONS[it.key]
      if (p.weapon && p.weapon.type !== it.key) return false
      p.weapon = {
        type: it.key,
        dur: Math.max(it.dur ?? w.durability, p.weapon ? p.weapon.dur : 0)
      }
      floatText(`Got ${w.name}!`, it.x, it.y - 24, '#7fe0ff', 20)
      Sound.play('weapon')
      tipOnce('weapon', `${w.name} equipped! Press Space to swing.`)
      return true
    }
    if (it.kind === 'card') {
      const options = cardCandidates()
      if (!options.length) return false
      const r = pick(options)
      discoverRecipe(r)
      const needs = r.needs.map((n) => INGREDIENTS[n].name).join(' + ')
      floatText('📜 Recipe card!', it.x, it.y - 24, '#ffd23f', 20)
      burst(it.x, it.y - 8, '#fff3c4', 14)
      Sound.play('newRecipe')
      toast(`📜 Learned a recipe: ${r.icon} ${r.name} = ${needs}`)
      return true
    }
    if (it.kind === 'medkit') {
      if (p.hp >= MAX_HEALTH) return false
      p.hp = Math.min(MAX_HEALTH, p.hp + MEDKIT_HEAL)
      floatText(`+${MEDKIT_HEAL} health`, it.x, it.y - 24, '#7dff9b', 20)
      Sound.play('heal')
      return true
    }
    return false
  }

  // ---------- Update ----------
  function update(dt) {
    game.time += dt
    game.shake = Math.max(0, game.shake - dt * 30)
    for (const t of game.toasts) t.t -= dt
    game.toasts = game.toasts.filter((t) => t.t > 0)
    if (game.banner) {
      game.banner.t -= dt
      if (game.banner.t <= 0) game.banner = null
    }
    updateParticles(dt)

    if (game.dying) {
      game.dying -= dt
      if (game.dying <= 0) endGame()
      return
    }

    game.t -= dt
    if (!game.isNight && !game.duskWarned && game.t <= 10) {
      game.duskWarned = true
      toast('🌅 Sunset in 10 seconds! The oven shuts off at night, so bake now!')
      Sound.play('warn')
    }
    if (game.t <= 0) {
      if (game.isNight) endNight()
      else startNight()
      if (game.over) return
    }

    updatePlayer(dt)
    updateZombies(dt)
    updateProjectiles(dt)
    updateHumans(dt)

    if (game.isNight && game.spawn.left > 0) {
      game.spawn.timer -= dt
      if (game.spawn.timer <= 0) {
        spawnZombie()
        game.spawn.left--
        game.spawn.timer = game.spawn.interval
      }
    }

    game.groanT -= dt
    if (game.groanT <= 0) {
      game.groanT = game.isNight ? rand(1.5, 3.5) : rand(4, 8)
      const p = game.player
      if (game.zombies.some((z) => Math.hypot(z.x - p.x, z.y - p.y) < 650 && z.comaT <= 0))
        Sound.play('groan')
    }
  }

  function updatePlayer(dt) {
    const p = game.player
    let ix = 0,
      iy = 0
    if (keys.has('ArrowLeft') || keys.has('KeyA')) ix -= 1
    if (keys.has('ArrowRight') || keys.has('KeyD')) ix += 1
    if (keys.has('ArrowUp') || keys.has('KeyW')) iy -= 1
    if (keys.has('ArrowDown') || keys.has('KeyS')) iy += 1
    if (p.stunT > 0) {
      p.stunT = Math.max(0, p.stunT - dt)
      ix = 0
      iy = 0
    }
    p.moving = ix !== 0 || iy !== 0
    if (p.moving) {
      const l = Math.hypot(ix, iy)
      ix /= l
      iy /= l
      p.face = Math.atan2(iy, ix)
    }
    p.anim += dt
    moveCircle(p, (ix * PLAYER_SPEED + p.kx) * dt, (iy * PLAYER_SPEED + p.ky) * dt, PLAYER_R)
    const f = Math.max(0, 1 - dt * 8)
    p.kx *= f
    p.ky *= f
    p.invuln = Math.max(0, p.invuln - dt)
    p.swingT = Math.max(0, p.swingT - dt)
    p.swingCd = Math.max(0, p.swingCd - dt)

    game.swapItem = null
    for (let i = game.items.length - 1; i >= 0; i--) {
      const it = game.items[i]
      if (Math.hypot(it.x - p.x, it.y - p.y) < PLAYER_R + 20) {
        if (pickup(it)) game.items.splice(i, 1)
        else if (it.kind === 'weapon') game.swapItem = it
      }
    }
    game.ovenNear = Math.hypot(p.x - OVEN.x, p.y - OVEN.y) < 90

    for (const t of game.traps) {
      const d = Math.hypot(t.x - p.x, t.y - p.y)
      if (t.kind === 'pit' && d < t.r * 0.6) {
        fallInPit(t)
        return
      }
      if (t.kind === 'snare' && t.armed && d < t.r + PLAYER_R * 0.5) {
        t.armed = false
        p.stunT = SNARE_STUN
        p.kx = 0
        p.ky = 0
        comic('SNAP!', p.x, p.y - 70, '#ff5c5c')
        Sound.play('bonk')
        game.shake = 8
        tipOnce('snare', `🪤 Bear trap! You're stuck for ${SNARE_STUN} seconds.`)
      }
    }
  }

  function fallInPit(t) {
    const p = game.player
    p.hp = 0
    p.x = t.x
    p.y = t.y
    game.deathCause = 'pit'
    game.dying = 1.8
    banner('AAAAH!', 'You fell into a pit…', true)
    Sound.setMood(null)
    Sound.play('lose')
  }

  function updateZombies(dt) {
    const p = game.player
    const night = game.isNight
    const base = Math.min(ZOMBIE_SPEED_CAP, night ? 66 + 9 * game.phase : 44 + 4 * game.phase)
    const hitDmg = zombieDamage(game.phase)
    for (const z of game.zombies) {
      if (z.dead) continue
      z.anim += dt
      z.flash = Math.max(0, z.flash - dt)
      if (z.spawnT > 0) {
        z.spawnT -= dt
        if (Math.random() < 0.35)
          addParticle({
            type: 'dot',
            x: z.x + rand(-14, 14),
            y: z.y,
            vx: rand(-40, 40),
            vy: rand(-90, -40),
            g: 260,
            life: 0.5,
            max: 0.5,
            color: '#6b4a2f',
            size: rand(3, 5)
          })
        continue
      }
      z.stunT = Math.max(0, z.stunT - dt)
      z.comaT = Math.max(0, z.comaT - dt)
      z.slowT = Math.max(0, z.slowT - dt)
      z.enrageT = Math.max(0, z.enrageT - dt)
      z.distractT = Math.max(0, z.distractT - dt)
      z.attackCd = Math.max(0, z.attackCd - dt)

      if (z.kx || z.ky) {
        moveCircle(z, z.kx * dt, z.ky * dt, ZOMBIE_R)
        const f = Math.max(0, 1 - dt * 7)
        z.kx *= f
        z.ky *= f
        if (Math.abs(z.kx) < 3) z.kx = 0
        if (Math.abs(z.ky) < 3) z.ky = 0
      }
      if (z.comaT > 0) {
        z.zzzT -= dt
        if (z.zzzT <= 0) {
          z.zzzT = 0.9
          emojiFx('💤', z.x + 10, z.y - 46, 16)
        }
        continue
      }
      if (z.stunT > 0) continue
      if (z.enrageT > 0) {
        z.steamT -= dt
        if (z.steamT <= 0) {
          z.steamT = 0.15
          addParticle({
            type: 'dot',
            x: z.x + rand(-8, 8),
            y: z.y - 58,
            vx: rand(-20, 20),
            vy: -70,
            g: 0,
            life: 0.5,
            max: 0.5,
            color: 'rgba(255,255,255,0.75)',
            size: rand(4, 7)
          })
        }
      }

      const dp = Math.hypot(p.x - z.x, p.y - z.y)
      const enraged = z.enrageT > 0
      let speed = base * (2 - z.size)
      let tx, ty
      if (z.distractT > 0 && z.distractPos) {
        tx = z.distractPos.x
        ty = z.distractPos.y
      } else if (night || enraged || dp < 210) {
        tx = p.x
        ty = p.y
      } else {
        z.wanderT -= dt
        if (z.wanderT <= 0) {
          z.wanderT = rand(1.5, 3.2)
          z.dir = rand(0, TAU)
          z.idle = Math.random() < 0.3
        }
        tx = z.x + Math.cos(z.dir) * 60
        ty = z.y + Math.sin(z.dir) * 60
        speed *= z.idle ? 0 : 0.5
      }
      if (enraged) speed = Math.min(ENRAGED_SPEED_CAP, speed * 1.65)
      if (z.slowT > 0) speed *= 0.4

      let ang = Math.atan2(ty - z.y, tx - z.x)
      const dT = Math.hypot(tx - z.x, ty - z.y)
      if (tx === p.x && ty === p.y && dp < PLAYER_R + ZOMBIE_R + 2) speed = 0
      if (z.sideT > 0) {
        z.sideT -= dt
        ang = z.sideA
      }
      if (dT > 6 && speed > 0) {
        z.dx = Math.cos(ang)
        z.dy = Math.sin(ang)
        moveCircle(z, z.dx * speed * dt, z.dy * speed * dt, ZOMBIE_R)
      }
      z.checkT -= dt
      if (z.checkT <= 0) {
        const moved = Math.hypot(z.x - z.lx, z.y - z.ly)
        if (speed > 0 && dT > 40 && moved < speed * 0.4 * 0.3 && z.sideT <= 0) {
          z.sideT = 0.8
          z.sideA = ang + ((Math.random() < 0.5 ? 1 : -1) * Math.PI) / 2
        }
        z.lx = z.x
        z.ly = z.y
        z.checkT = 0.4
      }

      if (dp < PLAYER_R + ZOMBIE_R + 6 && z.attackCd <= 0 && z.distractT <= 0) {
        z.attackCd = 1.1
        hurtPlayer(enraged ? Math.round(hitDmg * 1.8) : hitDmg, z)
      }

      const pit = game.traps.find(
        (t) => t.kind === 'pit' && Math.hypot(t.x - z.x, t.y - z.y) < t.r * 0.6
      )
      if (pit) {
        emojiFx('😱', z.x, z.y - 60, 22)
        defeatZombie(z, 'FELL IN!')
      }
    }

    const zs = game.zombies
    for (let i = 0; i < zs.length; i++) {
      for (let j = i + 1; j < zs.length; j++) {
        const a = zs[i],
          b = zs[j]
        const dx = b.x - a.x,
          dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        const min = ZOMBIE_R * 2
        if (d > 0 && d < min) {
          const push = (min - d) / 2
          const nx = dx / d,
            ny = dy / d
          a.x -= nx * push
          a.y -= ny * push
          b.x += nx * push
          b.y += ny * push
          resolve(a, ZOMBIE_R)
          resolve(b, ZOMBIE_R)
        }
      }
    }
  }

  function updateProjectiles(dt) {
    const keep = []
    for (const pr of game.projectiles) {
      pr.x += pr.vx * dt
      pr.y += pr.vy * dt
      pr.travel += Math.hypot(pr.vx, pr.vy) * dt
      pr.spin += dt * 12
      let done = false
      for (const z of game.zombies) {
        if (z.spawnT > 0) continue
        if (Math.hypot(z.x - pr.x, z.y - pr.y) < ZOMBIE_R + 14) {
          applyTreat(pr.recipe, z, z.x, z.y)
          done = true
          break
        }
      }
      if (!done && (pr.travel >= pr.max || pointInSolid(pr.x, pr.y))) {
        land(pr)
        done = true
      }
      if (!done) keep.push(pr)
    }
    game.projectiles = keep
  }

  function land(pr) {
    const e = pr.recipe.effect
    if (e.type === 'areaComa') {
      revealEffect(pr.recipe)
      areaComa(pr.x, pr.y, e)
      return
    }
    if (e.type === 'distract') {
      for (const z of game.zombies) {
        if (Math.hypot(z.x - pr.x, z.y - pr.y) < 260) {
          z.distractT = e.secs
          z.distractPos = { x: pr.x, y: pr.y }
        }
      }
      emojiFx('🪨', pr.x, pr.y - 10, 18)
    }
    burst(pr.x, pr.y, '#f3d2b0', 6, 90)
    Sound.play('splat')
  }

  function updateHumans(dt) {
    for (const h of game.humans) {
      h.t += dt
      const a = Math.atan2(OVEN.y + 40 - h.y, OVEN.x - h.x)
      moveCircle(h, Math.cos(a) * 110 * dt, Math.sin(a) * 110 * dt, 12)
      h.heartT -= dt
      if (h.heartT <= 0) {
        h.heartT = 0.3
        emojiFx(pick(['💖', '💕', '✨']), h.x + rand(-10, 10), h.y - 60, 16)
      }
    }
    game.humans = game.humans.filter(
      (h) => h.t < 4 && Math.hypot(h.x - OVEN.x, h.y - OVEN.y - 40) > 30
    )
  }

  function updateParticles(dt) {
    for (const p of game.particles) {
      p.life -= dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += p.g * dt
    }
    game.particles = game.particles.filter((p) => p.life > 0)
  }

  // ---------- Drawing: world ----------
  function darkness() {
    if (!game) return 0.5
    if (game.dying) return 0.8
    if (!game.isNight) return game.t < 10 ? (1 - game.t / 10) * 0.55 : 0
    const e = game.half - game.t
    let d = Math.min(1, 0.55 + (e / 4) * 0.45)
    if (game.t < 6) d *= 0.35 + 0.65 * (game.t / 6)
    return d
  }

  function drawTree(t) {
    const { x, y, r } = t
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ellipse(x + 6, y + 2, r * 0.9, r * 0.35)
    ctx.fill()
    rr(x - 6, y - 20, 12, 22, 4)
    fillStroke('#8a5a3b')
    const leaf = t.tint < 0.5 ? '#3fa34d' : '#4cb85a'
    const puffs = [
      [x, y - r - 14, r],
      [x - r * 0.62, y - r * 0.62, r * 0.72],
      [x + r * 0.62, y - r * 0.62, r * 0.72]
    ]
    ctx.lineWidth = 6
    ctx.strokeStyle = INK
    puffs.forEach(([px, py, pr]) => {
      circle(px, py, pr)
      ctx.stroke()
    })
    ctx.fillStyle = leaf
    puffs.forEach(([px, py, pr]) => {
      circle(px, py, pr)
      ctx.fill()
    })
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    circle(x - r * 0.3, y - r - 22, r * 0.4)
    ctx.fill()
  }

  function drawBuilding(b, night) {
    const wallH = 36
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.fillRect(b.x + 10, b.y + 14, b.w, b.h)
    rr(b.x, b.y + b.h - wallH, b.w, wallH, 4)
    fillStroke(b.wall)
    const n = Math.max(2, Math.floor(b.w / 44))
    const gap = b.w / n
    for (let i = 0; i < n; i++) {
      const wx = b.x + gap * i + gap / 2 - 9
      const wy = b.y + b.h - wallH + 9
      if (i === Math.floor(n / 2)) {
        rr(wx - 1, wy - 2, 20, wallH - 7, 3)
        fillStroke(b.kind === 'bakery' ? '#ff5fa2' : '#7a4f3a', 2.5)
        continue
      }
      const lit = night && (i * 7 + Math.floor(b.seed * 10)) % 3 === 0
      rr(wx, wy, 18, 14, 3)
      fillStroke(
        lit || (night && b.kind === 'bakery') ? '#ffd76b' : night ? '#2e3557' : '#a8dcff',
        2.5
      )
    }
    rr(b.x, b.y, b.w, b.h - wallH + 2, 8)
    fillStroke(b.roof)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    rr(b.x + 8, b.y + 8, b.w - 16, b.h - wallH - 14, 6)
    ctx.fill()

    if (b.kind === 'bakery') {
      const ay = b.y + b.h - wallH - 6
      const stripes = Math.floor(b.w / 20)
      for (let i = 0; i < stripes; i++) {
        ctx.fillStyle = i % 2 ? '#ffffff' : '#ff5fa2'
        ctx.beginPath()
        ctx.moveTo(b.x + i * 20, ay)
        ctx.lineTo(b.x + i * 20 + 20, ay)
        ctx.lineTo(b.x + i * 20 + 20, ay + 10)
        ctx.arc(b.x + i * 20 + 10, ay + 10, 10, 0, Math.PI)
        ctx.closePath()
        ctx.fill()
      }
      ctx.lineWidth = 2.5
      ctx.strokeStyle = INK
      ctx.strokeRect(b.x, ay, stripes * 20, 10)
      comicText('BAKERY', b.x + b.w / 2, b.y + 40, 34, '#fff', 6)
      drawEmoji('🧁', b.x + b.w / 2, b.y + 78, 30, worldScale())
    } else {
      const ax = b.x + 14 + b.seed * (b.w - 60)
      rr(ax, b.y + 16, 30, 22, 4)
      fillStroke('#b8bcc8', 2.5)
      ctx.strokeStyle = INK
      ctx.lineWidth = 2
      circle(ax + 15, b.y + 27, 7)
      ctx.stroke()
    }
  }

  function drawCar(c) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    rr(c.x + 5, c.y + 6, c.w, c.h, 10)
    ctx.fill()
    ctx.fillStyle = INK
    if (c.horiz) {
      ;[
        [c.x + 10, c.y - 3],
        [c.x + c.w - 22, c.y - 3],
        [c.x + 10, c.y + c.h - 5],
        [c.x + c.w - 22, c.y + c.h - 5]
      ].forEach(([x, y]) => {
        rr(x, y, 12, 8, 2)
        ctx.fill()
      })
    } else {
      ;[
        [c.x - 3, c.y + 10],
        [c.x - 3, c.y + c.h - 22],
        [c.x + c.w - 5, c.y + 10],
        [c.x + c.w - 5, c.y + c.h - 22]
      ].forEach(([x, y]) => {
        rr(x, y, 8, 12, 2)
        ctx.fill()
      })
    }
    rr(c.x, c.y, c.w, c.h, 10)
    fillStroke(c.color)
    if (c.horiz) rr(c.x + c.w * 0.3, c.y + 6, c.w * 0.4, c.h - 12, 5)
    else rr(c.x + 6, c.y + c.h * 0.3, c.w - 12, c.h * 0.4, 5)
    fillStroke('#bfe3ff', 2.5)
  }

  function drawLamp(l, dark) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ellipse(l.x, l.y + 1, 7, 3)
    ctx.fill()
    ctx.lineCap = 'round'
    ctx.strokeStyle = INK
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(l.x, l.y)
    ctx.lineTo(l.x, l.y - 48)
    ctx.stroke()
    ctx.strokeStyle = '#6c6f80'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(l.x, l.y)
    ctx.lineTo(l.x, l.y - 48)
    ctx.stroke()
    circle(l.x, l.y - 52, 7)
    fillStroke(dark > 0.2 ? '#fff3b0' : '#e8e2c8', 2.5)
  }

  function drawOven() {
    const { x, y } = OVEN
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ellipse(x, y + 2, 30, 8)
    ctx.fill()
    rr(x + 8, y - 64, 12, 22, 3)
    fillStroke('#9a9aa8', 2.5)
    rr(x - 26, y - 42, 52, 44, 8)
    fillStroke('#ff8fab')
    const flick = 0.75 + Math.sin((game ? game.time : performance.now() / 1000) * 12) * 0.15
    rr(x - 17, y - 30, 34, 20, 5)
    fillStroke(`rgba(255,${Math.round(140 + flick * 60)},40,1)`, 2.5)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    rr(x - 13, y - 27, 10, 4, 2)
    ctx.fill()
    ;[-14, -4, 6, 16].forEach((k) => {
      circle(x + k - 1, y - 37, 2.5)
      ctx.fillStyle = INK
      ctx.fill()
    })
    if (game && game.time % 0.5 < 0.02)
      addParticle({
        type: 'dot',
        x: x + 14,
        y: y - 66,
        vx: rand(-10, 10),
        vy: -40,
        g: 0,
        life: 1,
        max: 1,
        color: 'rgba(240,240,250,0.6)',
        size: rand(5, 8)
      })
    if (game && game.ovenNear && !game.dying) {
      const by = y - 82 + Math.sin(game.time * 5) * 3
      const closed = game.isNight
      rr(x - 52, by - 16, 104, 30, 12)
      fillStroke(closed ? '#6b6b80' : '#ffd23f')
      comicText(closed ? '🌙 CLOSED' : 'E · BAKE', x, by, 20, '#fff', 4)
    }
  }

  function drawItem(it) {
    const s = worldScale()
    const by = Math.sin(game.time * 3 + it.bob) * 3
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ellipse(it.x, it.y + 6, 11, 4)
    ctx.fill()
    const rare = it.kind === 'ingredient' && INGREDIENTS[it.key].rare
    if (it.kind === 'card') {
      const g = ctx.createRadialGradient(it.x, it.y - 8, 2, it.x, it.y - 8, 30)
      g.addColorStop(0, 'rgba(190,230,255,0.85)')
      g.addColorStop(1, 'rgba(190,230,255,0)')
      ctx.fillStyle = g
      circle(it.x, it.y - 8, 30)
      ctx.fill()
    } else if (rare) {
      const g = ctx.createRadialGradient(it.x, it.y - 8, 2, it.x, it.y - 8, 34)
      g.addColorStop(0, 'rgba(255,230,120,0.9)')
      g.addColorStop(1, 'rgba(255,230,120,0)')
      ctx.fillStyle = g
      circle(it.x, it.y - 8, 34)
      ctx.fill()
      for (let i = 0; i < 4; i++) {
        const a = game.time * 2 + (i * TAU) / 4
        drawEmoji('✨', it.x + Math.cos(a) * 22, it.y - 8 + Math.sin(a) * 14, 12, s)
      }
    } else {
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + Math.sin(game.time * 4 + it.bob) * 0.2})`
      ctx.lineWidth = 2
      ellipse(it.x, it.y + 6, 16, 6)
      ctx.stroke()
    }
    if (it.kind === 'ingredient') drawEmoji(INGREDIENTS[it.key].icon, it.x, it.y - 10 + by, 26, s)
    else if (it.kind === 'medkit') drawEmoji('🩹', it.x, it.y - 10 + by, 26, s)
    else if (it.kind === 'card') drawEmoji('📜', it.x, it.y - 10 + by, 28, s)
    else {
      ctx.save()
      ctx.translate(it.x - 16, it.y - 6 + by)
      ctx.rotate(-0.5)
      drawWeaponShape(it.key, 30)
      ctx.restore()
    }
  }

  function drawWeaponShape(type, L) {
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = INK
    if (type === 'bat') {
      ctx.beginPath()
      ctx.moveTo(0, -2.5)
      ctx.lineTo(L * 0.35, -3)
      ctx.lineTo(L, -6)
      ctx.quadraticCurveTo(L + 5, 0, L, 6)
      ctx.lineTo(L * 0.35, 3)
      ctx.lineTo(0, 2.5)
      ctx.closePath()
      fillStroke('#d79b5a', 2.5)
      ctx.fillStyle = '#3a3a48'
      ctx.fillRect(0, -2.5, L * 0.25, 5)
    } else if (type === 'crowbar') {
      const path = () => {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(L, 0)
        ctx.quadraticCurveTo(L + 9, 0, L + 6, -9)
      }
      ctx.lineWidth = 8
      path()
      ctx.stroke()
      ctx.strokeStyle = '#e04848'
      ctx.lineWidth = 4
      path()
      ctx.stroke()
    } else if (type === 'machete') {
      const B = L * 1.15
      ctx.beginPath()
      ctx.moveTo(L * 0.28, -3)
      ctx.lineTo(B * 0.8, -4)
      ctx.quadraticCurveTo(B + 6, -5, B + 2, 2)
      ctx.quadraticCurveTo(B * 0.7, 7, L * 0.28, 4)
      ctx.closePath()
      fillStroke('#dfe6ec', 2.5)
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(L * 0.34, -1)
      ctx.lineTo(B * 0.78, -1.5)
      ctx.stroke()
      ctx.strokeStyle = INK
      rr(-2, -3.5, L * 0.32, 7, 3)
      fillStroke('#2b2b33', 2.5)
      ctx.fillStyle = '#c9a227'
      circle(L * 0.08, 0, 1.6)
      ctx.fill()
      circle(L * 0.2, 0, 1.6)
      ctx.fill()
    } else {
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(L * 0.55, 0)
      ctx.stroke()
      ctx.strokeStyle = '#6b4f3a'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(L * 0.55, 0)
      ctx.stroke()
      circle(L * 0.55 + 11, 0, 11)
      fillStroke('#2b2b33', 2.5)
      circle(L * 0.55 + 11, 0, 6.5)
      ctx.fillStyle = '#4a4a5a'
      ctx.fill()
    }
  }

  function drawPerson(x, y, o) {
    const t = o.anim || 0
    const walk = o.moving ? Math.sin(t * 14) : 0
    const back = Math.sin(o.face) < -0.45
    const side = Math.cos(o.face)
    ctx.save()
    ctx.translate(x, y)
    if (o.alpha != null) ctx.globalAlpha = o.alpha
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ellipse(0, 1, 15, 5)
    ctx.fill()
    rr(-8, -12 + Math.max(0, walk * 3), 6, 12, 3)
    fillStroke('#3a3355', 2.5)
    rr(2, -12 + Math.max(0, -walk * 3), 6, 12, 3)
    fillStroke('#3a3355', 2.5)
    ctx.translate(0, o.moving ? -Math.abs(walk) * 2 : Math.sin(t * 3) * 0.8)

    if (back) drawHeld(o)
    rr(-11, -32, 22, 22, 7)
    fillStroke(o.shirt)
    if (!back && o.hat) {
      rr(-7, -27, 14, 16, 4)
      fillStroke('#fffaf0', 2)
    }
    circle(-12, -20, 4.5)
    fillStroke(o.skin, 2)
    circle(12, -20, 4.5)
    fillStroke(o.skin, 2)
    circle(0, -43, 13)
    fillStroke(o.skin)
    if (!back) {
      const ex = side * 4
      ctx.fillStyle = INK
      if (o.dead) {
        ctx.lineWidth = 2
        ctx.strokeStyle = INK
        ;[-4, 4].forEach((k) => {
          ctx.beginPath()
          ctx.moveTo(k + ex - 2.5, -46)
          ctx.lineTo(k + ex + 2.5, -41)
          ctx.moveTo(k + ex + 2.5, -46)
          ctx.lineTo(k + ex - 2.5, -41)
          ctx.stroke()
        })
      } else {
        circle(-4 + ex, -44, 2.2)
        ctx.fill()
        circle(4 + ex, -44, 2.2)
        ctx.fill()
      }
      ctx.fillStyle = 'rgba(255,120,150,0.5)'
      circle(-8 + ex, -39, 2.5)
      ctx.fill()
      circle(8 + ex, -39, 2.5)
      ctx.fill()
      ctx.strokeStyle = INK
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(ex, -40, o.happy ? 4.5 : 3, 0.2, Math.PI - 0.2)
      ctx.stroke()
    } else {
      ctx.fillStyle = '#5a3a2a'
      ctx.beginPath()
      ctx.arc(0, -43, 11, Math.PI * 0.9, Math.PI * 2.1)
      ctx.fill()
    }
    if (!o.hat) {
      ctx.fillStyle = o.hair || '#5a3a2a'
      ctx.beginPath()
      ctx.arc(0, -46, 13, Math.PI * 1.05, Math.PI * 1.95)
      ctx.fill()
    } else {
      rr(-10, -62, 20, 10, 3)
      fillStroke('#ffffff')
      const puffs = [
        [-7, -64, 7],
        [0, -68, 8],
        [7, -64, 7]
      ]
      ctx.lineWidth = 6
      ctx.strokeStyle = INK
      puffs.forEach(([px, py, r]) => {
        circle(px, py, r)
        ctx.stroke()
      })
      ctx.fillStyle = '#ffffff'
      puffs.forEach(([px, py, r]) => {
        circle(px, py, r)
        ctx.fill()
      })
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(-8.5, -62, 17, 6)
    }
    if (!back) drawHeld(o)
    ctx.restore()
  }

  function drawHeld(o) {
    if (!o.weapon) return
    const sp = o.swingP
    const a = sp >= 0 ? o.face - 1.3 + sp * 2.6 : o.face + 0.9
    if (sp >= 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(0, -22, 46, o.face - 1.3, a)
      ctx.stroke()
    }
    ctx.save()
    ctx.translate(Math.cos(o.face) * 8, -22)
    ctx.rotate(a)
    drawWeaponShape(o.weapon, 32)
    ctx.restore()
  }

  function drawPlayer() {
    const p = game.player
    if (p.invuln > 0 && Math.floor(p.invuln * 20) % 2 === 0) ctx.globalAlpha = 0.5
    if (game.dying) {
      ctx.save()
      ctx.translate(p.x, p.y)
      if (game.deathCause === 'pit') {
        const s = Math.max(0, 1 - (1.8 - game.dying) * 1.2)
        ctx.scale(s, s)
      }
      ctx.rotate(Math.min(1, (1.8 - game.dying) * 2) * 1.4)
      drawPerson(0, 0, {
        face: Math.PI / 2,
        anim: 0,
        shirt: game.color,
        skin: '#f6c9a0',
        hat: true,
        dead: true
      })
      ctx.restore()
    } else {
      drawPerson(p.x, p.y, {
        face: p.face,
        anim: p.anim,
        moving: p.moving,
        shirt: game.color,
        skin: '#f6c9a0',
        hat: true,
        weapon: p.weapon ? p.weapon.type : null,
        swingP: p.swingT > 0 ? 1 - p.swingT / 0.19 : -1
      })
      if (p.stunT > 0) {
        const t = performance.now() / 1000
        for (let i = 0; i < 3; i++) {
          const a = t * 6 + (i * TAU) / 3
          drawEmoji('⭐', p.x + Math.cos(a) * 14, p.y - 62 + Math.sin(a) * 5, 12, worldScale())
        }
      }
    }
    ctx.globalAlpha = 1
  }

  function drawTrap(t) {
    if (t.kind === 'pit') {
      const g = ctx.createRadialGradient(t.x, t.y, 4, t.x, t.y, t.r)
      g.addColorStop(0, '#000')
      g.addColorStop(0.7, '#120c08')
      g.addColorStop(1, '#3a2a1c')
      ctx.fillStyle = g
      ellipse(t.x, t.y, t.r, t.r * 0.62)
      ctx.fill()
      ctx.strokeStyle = '#1a1208'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.fillStyle = '#6b4d32'
      for (let i = 0; i < 7; i++) {
        const a = (i * TAU) / 7
        ellipse(t.x + Math.cos(a) * t.r, t.y + Math.sin(a) * t.r * 0.62, 5, 3)
        ctx.fill()
      }
      return
    }
    ctx.save()
    ctx.globalAlpha = t.armed ? 1 : 0.45
    ctx.strokeStyle = '#1b1b1b'
    ctx.fillStyle = '#9aa0a6'
    ctx.lineWidth = 3
    ellipse(t.x, t.y, t.r, t.r * 0.55)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#d9dde0'
    for (let i = -3; i <= 3; i++) {
      const x = t.x + i * (t.r / 3.6)
      ctx.beginPath()
      ctx.moveTo(x - 3, t.y - (t.armed ? 1 : 3))
      ctx.lineTo(x, t.y - (t.armed ? 9 : 4))
      ctx.lineTo(x + 3, t.y - (t.armed ? 1 : 3))
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    ctx.restore()
  }

  function drawZombie(z) {
    const coma = z.comaT > 0
    const stun = z.stunT > 0
    const rage = z.enrageT > 0
    const slow = z.slowT > 0
    const moving = !coma && !stun && z.spawnT <= 0
    const t = z.anim
    ctx.save()
    ctx.translate(z.x, z.y)
    if (z.spawnT > 0) {
      const k = 1 - z.spawnT / 0.7
      ctx.fillStyle = '#6b4a2f'
      ellipse(0, 0, 20, 7)
      ctx.fill()
      ctx.beginPath()
      ctx.rect(-40, -90, 80, 90)
      ctx.clip()
      ctx.translate(0, (1 - k) * 70)
    }
    ctx.scale(z.size, z.size)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ellipse(0, 1, 16, 5)
    ctx.fill()
    if (coma) {
      ctx.rotate(-0.35)
      ctx.translate(0, 4)
    }
    const walk = moving ? Math.sin(t * 8) : 0
    rr(-8, -12 + Math.max(0, walk * 3), 6, 12, 3)
    fillStroke('#4a4458', 2.5)
    rr(2, -12 + Math.max(0, -walk * 3), 6, 12, 3)
    fillStroke('#4a4458', 2.5)
    ctx.rotate(moving ? Math.sin(t * 4) * 0.07 : 0)
    if (stun) ctx.translate(Math.sin(t * 40) * 1.5, 0)

    const skin = z.flash > 0 ? '#ffffff' : rage ? '#ff8a6a' : slow ? '#9fd6d2' : '#94d26b'
    const face = Math.atan2(z.dy || 1, z.dx || 0)
    const back = Math.sin(face) < -0.45
    const side = Math.cos(face)

    const arms = () => {
      if (coma) return
      const reach = stun ? 4 : 16
      ;[-1, 1].forEach((s) => {
        const ex = s * 9 + side * reach
        const ey = -26 + (back ? -8 : 6) + Math.sin(t * 6 + s) * 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = INK
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(s * 9, -26)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.strokeStyle = skin
        ctx.lineWidth = 4.5
        ctx.beginPath()
        ctx.moveTo(s * 9, -26)
        ctx.lineTo(ex, ey)
        ctx.stroke()
      })
    }
    if (back) arms()
    ctx.beginPath()
    ctx.moveTo(-11, -32)
    ctx.lineTo(11, -32)
    ctx.lineTo(11, -12)
    ctx.lineTo(6, -9)
    ctx.lineTo(2, -13)
    ctx.lineTo(-3, -9)
    ctx.lineTo(-7, -13)
    ctx.lineTo(-11, -10)
    ctx.closePath()
    fillStroke(z.shirt)
    if (!back) arms()

    circle(0, -43, 13.5)
    fillStroke(skin)
    ctx.fillStyle = 'rgba(40,80,30,0.35)'
    circle(6, -51, 3)
    ctx.fill()

    if (!back) {
      const ex = side * 3
      ctx.strokeStyle = INK
      ctx.lineWidth = 2
      if (coma) {
        ctx.beginPath()
        ctx.arc(-5 + ex, -45, 3, 0.1, Math.PI - 0.1)
        ctx.moveTo(8 + ex, -45)
        ctx.arc(5 + ex, -45, 3, 0.1, Math.PI - 0.1)
        ctx.stroke()
        ctx.fillStyle = 'rgba(255,120,150,0.6)'
        circle(-9 + ex, -40, 3)
        ctx.fill()
        circle(9 + ex, -40, 3)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(ex, -38, 3.5, 0, Math.PI)
        ctx.stroke()
      } else if (stun) {
        ;[-5, 5].forEach((k) => {
          ctx.beginPath()
          ctx.moveTo(k + ex - 3, -48)
          ctx.lineTo(k + ex + 3, -42)
          ctx.moveTo(k + ex + 3, -48)
          ctx.lineTo(k + ex - 3, -42)
          ctx.stroke()
        })
        circle(ex, -37, 3)
        ctx.stroke()
      } else {
        circle(-5 + ex, -45, 5)
        fillStroke('#fffbe6', 2)
        circle(5 + ex, -44, 3.6)
        fillStroke('#fffbe6', 2)
        ctx.fillStyle = INK
        const jx = Math.sin(t * 7) * 1.2
        circle(-5 + ex + side * 1.5 + jx, -45, 2)
        ctx.fill()
        circle(5 + ex + side * 1 - jx, -44, 1.5)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(-5 + ex, -37)
        for (let i = 0; i < 4; i++) ctx.lineTo(-5 + ex + (i + 1) * 2.5, i % 2 ? -37 : -35)
        ctx.stroke()
        if (rage) {
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(-10 + ex, -53)
          ctx.lineTo(-2 + ex, -50)
          ctx.moveTo(10 + ex, -53)
          ctx.lineTo(2 + ex, -50)
          ctx.stroke()
        }
      }
    }
    ctx.restore()

    if (stun) {
      for (let i = 0; i < 3; i++) {
        const a = t * 6 + (i * TAU) / 3
        drawEmoji('⭐', z.x + Math.cos(a) * 14, z.y - 66 + Math.sin(a) * 5, 12, worldScale())
      }
    }
    if (slow && !coma) drawEmoji('🐌', z.x + 16, z.y - 64, 14, worldScale())
    if (z.hp < z.maxHp) {
      const w = 34
      const y = z.y - 80
      ctx.fillStyle = '#1b1b1b'
      ctx.fillRect(z.x - w / 2 - 2, y - 2, w + 4, 8)
      ctx.fillStyle = '#ff5c5c'
      ctx.fillRect(z.x - w / 2, y, (w * Math.max(0, z.hp)) / z.maxHp, 4)
    }
    if (z.distractT > 0 && !coma) comicText('?', z.x, z.y - 70, 22, '#fff', 4)
    if (rage) {
      ctx.strokeStyle = `rgba(255,70,70,${0.4 + Math.sin(t * 15) * 0.3})`
      ctx.lineWidth = 3
      ellipse(z.x, z.y + 1, 20, 7)
      ctx.stroke()
    }
  }

  function drawHuman(h) {
    drawPerson(h.x, h.y, {
      face: Math.PI / 2,
      anim: h.t,
      moving: true,
      shirt: h.shirt,
      skin: '#f2c49b',
      hat: false,
      happy: true,
      alpha: h.t > 3 ? 4 - h.t : 1
    })
  }

  function drawProjectile(pr) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ellipse(pr.x, pr.y + 4, 8, 3)
    ctx.fill()
    const lift = Math.sin((pr.travel / pr.max) * Math.PI) * 18
    ctx.save()
    ctx.translate(pr.x, pr.y - 22 - lift)
    ctx.rotate(pr.spin)
    drawEmoji(pr.recipe.icon, 0, 0, 24, worldScale())
    ctx.restore()
  }

  function drawParticles() {
    const s = worldScale()
    for (const p of game.particles) {
      const k = p.life / p.max
      ctx.globalAlpha = Math.min(1, k * 1.6)
      if (p.type === 'dot') {
        ctx.fillStyle = p.color
        circle(p.x, p.y, p.size)
        ctx.fill()
      } else if (p.type === 'text') {
        ctx.font = `900 ${p.size}px Nunito, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineWidth = 5
        ctx.lineJoin = 'round'
        ctx.strokeStyle = INK
        ctx.strokeText(p.text, p.x, p.y)
        ctx.fillStyle = p.color
        ctx.fillText(p.text, p.x, p.y)
      } else if (p.type === 'comic') {
        const pop = 1 + Math.max(0, (k - 0.75) * 3)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.scale(pop, pop)
        comicText(p.text, 0, 0, 26, p.color, 6)
        ctx.restore()
      } else if (p.type === 'emoji') {
        drawEmoji(p.text, p.x, p.y, p.size, s)
      } else if (p.type === 'ring') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 6 * k
        circle(p.x, p.y, p.r * (1 - k * 0.7))
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }

  function drawLights(camX, camY, dark) {
    const lw = light.width
    const lh = light.height
    const k = (zoom * lw) / viewW
    lctx.globalCompositeOperation = 'source-over'
    lctx.clearRect(0, 0, lw, lh)
    lctx.fillStyle = `rgba(14,8,40,${0.9 * dark})`
    lctx.fillRect(0, 0, lw, lh)
    lctx.globalCompositeOperation = 'destination-out'
    const hole = (wx, wy, r, strength) => {
      const x = (wx - camX) * k
      const y = (wy - camY) * k
      const R = r * k
      if (x < -R || y < -R || x > lw + R || y > lh + R) return
      const g = lctx.createRadialGradient(x, y, R * 0.15, x, y, R)
      g.addColorStop(0, `rgba(0,0,0,${strength})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      lctx.fillStyle = g
      lctx.beginPath()
      lctx.arc(x, y, R, 0, TAU)
      lctx.fill()
    }
    if (game) {
      const p = game.player
      hole(p.x, p.y - 20, 230 + Math.sin(game.time * 9) * 4, 1)
      hole(p.x + Math.cos(p.face) * 130, p.y - 20 + Math.sin(p.face) * 130, 150, 0.7)
      game.humans.forEach((h) => hole(h.x, h.y - 20, 90, 0.6))
      game.projectiles.forEach((pr) => hole(pr.x, pr.y - 20, 60, 0.5))
    }
    world.lamps.forEach((l) => hole(l.x, l.y - 30, 150, 0.85))
    hole(OVEN.x, OVEN.y - 10, 150, 0.9)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(light, 0, 0, canvas.width, canvas.height)
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = '#1b1430'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const vw = viewW / zoom
    const vh = viewH / zoom
    let camX, camY
    if (game) {
      camX = clamp(game.player.x - vw / 2, 0, Math.max(0, WORLD.w - vw))
      camY = clamp(game.player.y - vh / 2 - 20, 0, Math.max(0, WORLD.h - vh))
      if (game.shake > 0) {
        camX += rand(-game.shake, game.shake)
        camY += rand(-game.shake, game.shake)
      }
    } else {
      const t = performance.now() / 1000
      camX = (Math.sin(t * 0.05) * 0.5 + 0.5) * Math.max(0, WORLD.w - vw)
      camY = (Math.cos(t * 0.037) * 0.5 + 0.5) * Math.max(0, WORLD.h - vh)
    }
    const s = worldScale()
    ctx.setTransform(s, 0, 0, s, -camX * s, -camY * s)
    const sx = Math.max(0, camX)
    const sy = Math.max(0, camY)
    const sw = Math.min(vw + 2, WORLD.w - sx)
    const sh = Math.min(vh + 2, WORLD.h - sy)
    ctx.drawImage(ground, sx, sy, sw, sh, sx, sy, sw, sh)

    const dark = darkness()
    const night = dark > 0.4
    const inView = (x, y, m = 160) =>
      x > camX - m && x < camX + vw + m && y > camY - m && y < camY + vh + m + 80

    if (game) game.traps.forEach((t) => inView(t.x, t.y) && drawTrap(t))
    if (game) game.items.forEach((it) => inView(it.x, it.y) && drawItem(it))

    const list = []
    for (const st of world.statics) {
      const cx = st.w ? st.x + st.w / 2 : st.x
      const cy = st.h ? st.y + st.h / 2 : st.y
      if (inView(cx, cy, 260)) list.push(st)
    }
    if (game) {
      game.zombies.forEach(
        (z) => inView(z.x, z.y) && list.push({ kind: 'zombie', ref: z, sortY: z.y })
      )
      game.humans.forEach((h) => list.push({ kind: 'human', ref: h, sortY: h.y }))
      list.push({ kind: 'player', sortY: game.player.y })
    }
    list.sort((a, b) => a.sortY - b.sortY)
    for (const d of list) {
      switch (d.kind) {
        case 'tree':
          drawTree(d)
          break
        case 'building':
        case 'bakery':
          drawBuilding(d, night)
          break
        case 'car':
          drawCar(d)
          break
        case 'lamp':
          drawLamp(d, dark)
          break
        case 'oven':
          drawOven()
          break
        case 'zombie':
          drawZombie(d.ref)
          break
        case 'human':
          drawHuman(d.ref)
          break
        case 'player':
          drawPlayer()
          break
      }
    }
    if (game) {
      game.projectiles.forEach(drawProjectile)
      drawParticles()
    }

    if (dark > 0.01) {
      drawLights(camX, camY, dark)
      ctx.setTransform(s, 0, 0, s, -camX * s, -camY * s)
      ctx.globalCompositeOperation = 'lighter'
      world.lamps.concat([{ x: OVEN.x, y: OVEN.y + 20 }]).forEach((l) => {
        if (!inView(l.x, l.y)) return
        const g = ctx.createRadialGradient(l.x, l.y - 30, 4, l.x, l.y - 30, 130)
        g.addColorStop(0, `rgba(255,190,90,${0.22 * dark})`)
        g.addColorStop(1, 'rgba(255,190,90,0)')
        ctx.fillStyle = g
        circle(l.x, l.y - 30, 130)
        ctx.fill()
      })
      ctx.globalCompositeOperation = 'source-over'
      if (game && dark > 0.3) {
        for (const z of game.zombies) {
          if (z.comaT > 0 || z.spawnT > 0 || !inView(z.x, z.y)) continue
          const back = Math.sin(Math.atan2(z.dy || 1, z.dx || 0)) < -0.45
          if (back) continue
          const ex = Math.cos(Math.atan2(z.dy || 1, z.dx || 0)) * 3
          const col = z.enrageT > 0 ? '255,80,60' : '210,255,90'
          ;[
            [-5, -45],
            [5, -44]
          ].forEach(([ox, oy]) => {
            const x = z.x + (ox + ex) * z.size
            const y = z.y + oy * z.size
            ctx.fillStyle = `rgba(${col},${0.25 * dark})`
            circle(x, y, 7)
            ctx.fill()
            ctx.fillStyle = `rgba(${col},${0.95 * dark})`
            circle(x, y, 2.4)
            ctx.fill()
          })
        }
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (game) drawHUD()
  }

  // ---------- Drawing: HUD ----------
  function panel(x, y, w, h, fill = 'rgba(28,18,48,0.85)') {
    ctx.fillStyle = INK
    rr(x + 4, y + 4, w, h, 14)
    ctx.fill()
    rr(x, y, w, h, 14)
    ctx.fillStyle = fill
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = INK
    ctx.stroke()
  }

  function drawHUD() {
    const p = game.player
    const W = viewW
    const H = viewH

    const dark = darkness()
    const vg = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.35,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.75
    )
    vg.addColorStop(0, 'rgba(0,0,0,0)')
    vg.addColorStop(1, `rgba(10,5,30,${0.25 + dark * 0.25})`)
    ctx.fillStyle = vg
    ctx.fillRect(0, 0, W, H)
    if (p.hp < 35 && !game.over) {
      const pulse = 0.25 + Math.sin(game.time * 6) * 0.12
      const rg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.3,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.7
      )
      rg.addColorStop(0, 'rgba(255,0,0,0)')
      rg.addColorStop(1, `rgba(255,30,30,${pulse})`)
      ctx.fillStyle = rg
      ctx.fillRect(0, 0, W, H)
    }

    // player panel
    panel(14, 14, 270, 96)
    bodyText(game.name, 28, 34, 16, '#fff', 'left', 900)
    drawEmoji('❤️', 32, 60, 18, dpr)
    rr(48, 51, 220, 18, 9)
    ctx.fillStyle = '#3b2b4f'
    ctx.fill()
    const hpK = p.hp / MAX_HEALTH
    if (hpK > 0) {
      rr(48, 51, 220 * hpK, 18, 9)
      ctx.fillStyle = hpK > 0.5 ? '#5ee07a' : hpK > 0.25 ? '#ffd23f' : '#ff5c5c'
      ctx.fill()
    }
    rr(48, 51, 220, 18, 9)
    ctx.lineWidth = 2.5
    ctx.strokeStyle = INK
    ctx.stroke()
    bodyText(`${Math.ceil(p.hp)}`, 158, 60.5, 12, INK, 'center', 900)
    if (p.weapon) {
      const w = WEAPONS[p.weapon.type]
      ctx.save()
      ctx.translate(24, 90)
      ctx.rotate(-0.4)
      drawWeaponShape(p.weapon.type, 22)
      ctx.restore()
      bodyText(w.name, 60, 88, 13, '#fff', 'left', 800)
      const k = p.weapon.dur / w.durability
      rr(170, 82, 98, 10, 5)
      ctx.fillStyle = '#3b2b4f'
      ctx.fill()
      rr(170, 82, 98 * k, 10, 5)
      ctx.fillStyle = '#7fe0ff'
      ctx.fill()
    } else {
      bodyText('✋ No weapon: find one to stun zombies', 26, 88, 12, '#cbbbe6', 'left', 800)
    }

    // phase + timer
    const cx = W / 2
    const night = game.isNight
    panel(cx - 110, 12, 220, 76, night ? 'rgba(40,24,90,0.92)' : 'rgba(255,170,60,0.92)')
    bodyText(
      `PHASE ${game.phase} · ${night ? '🌙 NIGHT' : '☀️ DAY'}`,
      cx,
      30,
      13,
      '#fff',
      'center',
      900
    )
    const urgent = game.t <= 10
    const pulse = urgent ? 1 + Math.max(0, Math.sin(game.time * 10)) * 0.08 : 1
    ctx.save()
    ctx.translate(cx, 62)
    ctx.scale(pulse, pulse)
    comicText(fmtTime(game.t), 0, 0, 38, urgent ? '#ff6b6b' : '#fff', 6)
    ctx.restore()
    const prog = 1 - game.t / game.half
    rr(cx - 96, 80, 192, 5, 3)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill()
    rr(cx - 96, 80, 192 * prog, 5, 3)
    ctx.fillStyle = '#fff'
    ctx.fill()

    // score
    panel(W - 210, 14, 130, 62)
    bodyText('SCORE', W - 145, 30, 11, '#cbbbe6', 'center', 900)
    comicText(String(game.score), W - 145, 55, 32, '#ffd23f', 5)

    // toasts
    game.toasts.forEach((t, i) => {
      const a = Math.min(1, t.t * 2)
      ctx.globalAlpha = a
      ctx.font = '800 15px Nunito, sans-serif'
      const tw = ctx.measureText(t.text).width + 28
      panel(cx - tw / 2, 102 + i * 40, tw, 32, 'rgba(255,248,239,0.96)')
      bodyText(t.text, cx, 118 + i * 40, 15, INK, 'center', 800)
      ctx.globalAlpha = 1
    })

    // hotbar
    const slots = Math.max(1, Math.min(9, game.treatOrder.length))
    const sw = 58
    const hbW = game.treatOrder.length ? slots * (sw + 8) - 8 + 24 : 300
    const hbX = cx - hbW / 2
    const hbY = H - 92
    panel(hbX, hbY, hbW, 78)
    if (!game.treatOrder.length) {
      bodyText(
        game.isNight
          ? 'No treats! Bake again in the morning 🌅'
          : 'No treats yet. Bake at the 🔥 oven!',
        cx,
        hbY + 39,
        14,
        '#cbbbe6',
        'center',
        800
      )
    } else {
      for (let i = 0; i < slots; i++) {
        const id = game.treatOrder[i]
        const r = recipeById(id)
        const x = hbX + 12 + i * (sw + 8)
        const sel = i === game.selected
        const y = hbY + 10 - (sel ? 4 : 0)
        rr(x, y, sw, sw, 12)
        ctx.fillStyle = sel ? '#ffd23f' : 'rgba(255,255,255,0.12)'
        ctx.fill()
        ctx.lineWidth = sel ? 3 : 2
        ctx.strokeStyle = sel ? '#fff' : 'rgba(255,255,255,0.25)'
        ctx.stroke()
        drawEmoji(r.icon, x + sw / 2, y + sw / 2 - 2, 30, dpr)
        bodyText(String(i + 1), x + 6, y + 9, 10, sel ? INK : '#cbbbe6', 'left', 900)
        comicText(`×${game.treats[id]}`, x + sw - 6, y + sw - 9, 16, '#fff', 4, 'right')
      }
      const r = recipeById(game.treatOrder[game.selected])
      const k = game.known[r.id]
      const fx =
        r.id === 'burnt'
          ? effectLabel(r.effect)
          : k && k.effectKnown
            ? effectLabel(r.effect)
            : '❓ unknown effect'
      ctx.font = '900 14px Nunito, sans-serif'
      const label = `${r.name} · ${fx}`
      const lw = ctx.measureText(label).width + 24
      panel(cx - lw / 2, hbY - 38, lw, 28, 'rgba(28,18,48,0.9)')
      bodyText(label, cx, hbY - 24, 14, '#fff', 'center', 900)
    }
    bodyText('F / click: throw · Q: switch', cx, H - 8, 11, 'rgba(255,255,255,0.7)', 'center', 800)

    // pantry
    const owned = Object.keys(INGREDIENTS).filter((k) => game.ingredients[k] > 0)
    const cols = 5
    const rows = Math.max(1, Math.ceil(owned.length / cols))
    const pw = 14 + cols * 50
    const ph = 30 + rows * 34
    const px = 14
    const py = H - ph - 14
    panel(px, py, pw, ph)
    bodyText('PANTRY', px + 12, py + 15, 11, '#cbbbe6', 'left', 900)
    if (!owned.length)
      bodyText('empty: go scavenge!', px + 12, py + 42, 12, 'rgba(255,255,255,0.6)', 'left', 800)
    owned.forEach((k, i) => {
      const x = px + 12 + (i % cols) * 50
      const y = py + 28 + Math.floor(i / cols) * 34
      drawEmoji(INGREDIENTS[k].icon, x + 13, y + 14, 22, dpr)
      comicText(
        String(game.ingredients[k]),
        x + 38,
        y + 20,
        15,
        INGREDIENTS[k].rare ? '#ffd23f' : '#fff',
        4
      )
    })

    // minimap
    const mw = minimap.width
    const mh = minimap.height
    const mx = W - mw - 18
    const my = H - mh - 18
    panel(mx - 6, my - 6, mw + 12, mh + 12)
    ctx.drawImage(minimap, mx, my)
    if (night || dark > 0.3) {
      ctx.fillStyle = `rgba(14,8,40,${0.45 * dark})`
      ctx.fillRect(mx, my, mw, mh)
    }
    for (const it of game.items) {
      if (it.kind === 'ingredient' && INGREDIENTS[it.key].rare) {
        ctx.fillStyle = Math.sin(game.time * 6 + it.bob) > 0 ? '#ffd23f' : '#fff6b0'
        circle(mx + it.x * MINI, my + it.y * MINI, 3)
        ctx.fill()
      }
    }
    for (const z of game.zombies) {
      ctx.fillStyle = z.enrageT > 0 ? '#ff2e2e' : z.comaT > 0 ? '#ff9fd0' : '#ff6b6b'
      circle(mx + z.x * MINI, my + z.y * MINI, 2.2)
      ctx.fill()
    }
    const op = 3 + Math.sin(game.time * 5) * 1
    circle(mx + OVEN.x * MINI, my + OVEN.y * MINI, op + 1)
    ctx.fillStyle = '#ff5fa2'
    ctx.fill()
    circle(mx + p.x * MINI, my + p.y * MINI, 4)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = INK
    ctx.stroke()

    // swap weapon prompt
    if (game.swapItem && !(game.ovenNear && !game.isNight)) {
      const msg = `E: swap for ${WEAPONS[game.swapItem.key].name}`
      ctx.font = '900 15px Nunito, sans-serif'
      const tw = ctx.measureText(msg).width + 26
      panel(cx - tw / 2, H / 2 + 50, tw, 32, '#ffd23f')
      bodyText(msg, cx, H / 2 + 66, 15, INK, 'center', 900)
    }

    // banner
    if (game.banner) {
      const b = game.banner
      const age = 3.2 - b.t
      const a = Math.min(1, b.t * 2, age * 4)
      const pop = age < 0.25 ? 0.6 + (age / 0.25) * 0.4 : 1
      ctx.globalAlpha = a
      ctx.save()
      ctx.translate(cx, H * 0.36)
      ctx.scale(pop, pop)
      ctx.rotate(-0.04)
      comicText(b.title, 0, 0, 92, b.night ? '#c9b6ff' : '#ffd23f', 12)
      ctx.restore()
      ctx.font = '900 20px Nunito, sans-serif'
      const tw = ctx.measureText(b.sub).width + 30
      panel(cx - tw / 2, H * 0.36 + 56, tw, 38, 'rgba(255,248,239,0.96)')
      bodyText(b.sub, cx, H * 0.36 + 75, 20, INK, 'center', 900)
      ctx.globalAlpha = 1
    }
  }

  // ---------- Overlay UI ----------
  const overlay = $('#overlay')
  const SOLID = new Set(['title', 'pass', 'over', 'results', 'board'])

  function showScreen(name) {
    ui = name
    overlay.classList.toggle('is-open', !!name)
    overlay.classList.toggle('is-solid', SOLID.has(name))
    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.id === 'screen-' + name))
    keys.clear()
    if (!name) {
      if (document.activeElement) document.activeElement.blur()
      canvas.focus()
    }
  }

  function focusSoon(sel) {
    setTimeout(() => {
      const el = $(sel)
      if (el) el.focus({ preventScroll: true })
    }, 30)
  }

  const ROSTER = ((window.CSD_DATA && window.CSD_DATA.students) || [])
    .map((s) => s.displayName)
    .filter(Boolean)
  function fillSelect(sel) {
    sel.innerHTML =
      `<option value=''>Choose your name…</option>` +
      ROSTER.map((n) => `<option value='${escapeHtml(n)}'>${escapeHtml(n)}</option>`).join('') +
      `<option value='${GUEST}'>Guest (no class points)</option>`
  }
  fillSelect($('#p1'))
  fillSelect($('#p2'))

  const form = $('#setup-form')
  const lengthField = () => form.elements.gameLength
  const playersField = () => form.elements.players
  function syncSetup() {
    const two = playersField().value === '2'
    $('#p2-field').hidden = !two
    const mode = lengthField().value
    const s = HALF_SECONDS[mode]
    $('#length-hint').textContent = two
      ? `Two players take turns, one run each until they get caught. ${mode === 'short' ? 'Short phases keep turns quicker.' : 'Try Short for quicker turns!'}`
      : `Endless phases. Each phase is a ${s} second day and a ${s} second night. How long can you last?`
    renderMiniBoard()
  }
  form.addEventListener('change', (e) => {
    if (e.target.name === 'players') lengthField().value = e.target.value === '2' ? 'short' : 'full'
    syncSetup()
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    Sound.unlock()
    const two = playersField().value === '2'
    const picks = [$('#p1').value]
    if (two) picks.push($('#p2').value)
    const err = $('#setup-error')
    if (picks.some((v) => !v)) {
      err.textContent = 'Pick a name for every player.'
      return
    }
    if (two && picks[0] === picks[1] && picks[0] !== GUEST) {
      err.textContent = 'Each player needs a different name.'
      return
    }
    err.textContent = ''
    startSession(
      picks.map((v, i) => ({
        name: v === GUEST ? (two ? `Guest ${i + 1}` : 'Guest') : v,
        guest: v === GUEST
      })),
      lengthField().value
    )
  })

  function startSession(players, mode) {
    session = { players, mode, idx: 0, results: [] }
    showPass()
  }

  function showPass() {
    const pl = session.players[session.idx]
    const two = session.players.length > 1
    $('#pass-kicker').textContent = two
      ? `Player ${session.idx + 1} of ${session.players.length}`
      : 'Ready?'
    $('#pass-name').textContent = pl.name
    $('#pass-msg').textContent =
      session.idx === 0
        ? 'Grab the keyboard. The sun is up… for now.'
        : 'Your turn! Same town, fresh zombies. Beat that score.'
    game = null
    Sound.setMood(null)
    showScreen('pass')
    focusSoon('#pass-go')
  }

  $('#pass-go').addEventListener('click', () => {
    Sound.unlock()
    newGame(session.players[session.idx], session.idx)
    showScreen(null)
  })

  function pause() {
    if (!game || game.over) return
    Sound.setMood(null)
    showScreen('pause')
    focusSoon('#pause-resume')
  }
  function resume() {
    showScreen(null)
    if (game && !game.dying) Sound.setMood(game.isNight ? 'night' : 'day')
  }
  $('#pause-resume').addEventListener('click', resume)
  $('#pause-book').addEventListener('click', () => openBook('pause'))
  $('#pause-quit').addEventListener('click', () => {
    game = null
    Sound.setMood(null)
    goTitle()
  })

  // oven
  let bakeSel = []
  function openBake() {
    bakeSel = []
    const res = $('#bake-result')
    res.textContent = ''
    res.className = 'bake-result'
    renderBake()
    showScreen('bake')
    Sound.play('oven')
  }
  function ownedIngredients() {
    return Object.keys(INGREDIENTS).filter((k) => (game.ingredients[k] || 0) > 0)
  }
  function renderBake() {
    const owned = ownedIngredients()
    $('#bake-pantry').innerHTML = owned.length
      ? owned
          .map((k, i) => {
            const ing = INGREDIENTS[k]
            return `<button type='button' class='ing ${bakeSel.includes(k) ? 'is-on' : ''} ${ing.rare ? 'is-rare' : ''}' data-ing='${k}'>
              ${i < 9 ? `<kbd>${i + 1}</kbd>` : ''}<span class='ing-icon'>${ing.icon}</span><span>${ing.name}</span><span class='ing-count'>×${game.ingredients[k]}</span></button>`
          })
          .join('')
      : `<p class='empty'>Your pantry is empty. Go find ingredients around town!</p>`
    const slots = [0, 1, 2]
      .map((i) => {
        const k = bakeSel[i]
        return `${i ? `<span class='bake-plus'>+</span>` : ''}<div class='bake-slot ${k ? 'is-filled' : ''}' data-slot='${i}' title='${k ? 'Remove' : 'Empty'}'>${k ? INGREDIENTS[k].icon : ''}</div>`
      })
      .join('')
    $('#bake-slots').innerHTML = slots
    $('#bake-go').disabled = bakeSel.length < 2
    renderBook($('#bake-book'), true)
  }
  function toggleIng(k) {
    if (!k) return
    const i = bakeSel.indexOf(k)
    if (i >= 0) bakeSel.splice(i, 1)
    else if (bakeSel.length < 3) bakeSel.push(k)
    else return Sound.play('error')
    Sound.play('click')
    renderBake()
  }
  $('#bake-pantry').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ing]')
    if (b) toggleIng(b.dataset.ing)
  })
  $('#bake-slots').addEventListener('click', (e) => {
    const s = e.target.closest('[data-slot]')
    if (s && bakeSel[+s.dataset.slot]) toggleIng(bakeSel[+s.dataset.slot])
  })
  $('#bake-book').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bake]')
    if (b) doBake(recipeById(b.dataset.bake).needs.slice())
  })
  $('#bake-go').addEventListener('click', () => doBake())
  $('#bake-clear').addEventListener('click', () => {
    bakeSel = []
    renderBake()
  })
  $('#bake-close').addEventListener('click', resume)

  function doBake(sel = bakeSel) {
    const res = $('#bake-result')
    if (sel.length < 2) {
      res.textContent = 'Pick at least 2 ingredients.'
      res.className = 'bake-result'
      Sound.play('error')
      return
    }
    if (!sel.every((k) => (game.ingredients[k] || 0) > 0)) {
      res.textContent = "You don't have enough of those ingredients."
      res.className = 'bake-result'
      Sound.play('error')
      return
    }
    sel.forEach((k) => {
      game.ingredients[k]--
      if (game.ingredients[k] <= 0) delete game.ingredients[k]
    })
    const r = findRecipe(sel) || BURNT
    const isNew = r !== BURNT && discoverRecipe(r)
    game.treats[r.id] = (game.treats[r.id] || 0) + r.makes
    if (!game.treatOrder.includes(r.id)) game.treatOrder.push(r.id)
    if (r === BURNT) {
      res.textContent = `Oops… ${r.icon} Burnt Mystery Lump. That combo isn't a recipe. (You can still throw it as a distraction.)`
      res.className = 'bake-result is-burnt'
      Sound.play('burnt')
    } else if (isNew) {
      res.textContent = `✨ NEW RECIPE! +${POINTS.recipe} pts. ${r.icon} ${r.name} ×${r.makes}. Feed one to a zombie to see what it does!`
      res.className = 'bake-result is-new'
      Sound.play('newRecipe')
    } else {
      res.textContent = `Ding! ${r.icon} ${r.name} ×${r.makes}`
      res.className = 'bake-result'
      Sound.play('bake')
    }
    bakeSel = []
    renderBake()
  }

  function renderBook(el, withButtons) {
    el.innerHTML = RECIPES.map((r) => {
      const k = game.known[r.id]
      if (!k) {
        return `<li class='recipe is-locked'><span class='r-icon'>❔</span><div><strong>???</strong><span class='r-count'>${r.needs.length} ingredients</span><p class='r-hint'>${escapeHtml(r.hint)}</p></div></li>`
      }
      const can = r.needs.every((n) => (game.ingredients[n] || 0) > 0)
      const needs = r.needs.map((n) => `${INGREDIENTS[n].icon} ${INGREDIENTS[n].name}`).join(' + ')
      const fx = k.effectKnown
        ? `<p class='r-effect fx-${r.effect.type}'>${effectLabel(r.effect)}</p>`
        : `<p class='r-effect'>❓ Feed one to a zombie to find out</p>`
      const btn = withButtons
        ? `<button type='button' class='btn btn-small' data-bake='${r.id}' ${can ? '' : 'disabled'}>Bake</button>`
        : ''
      return `<li class='recipe'><span class='r-icon'>${r.icon}</span><div><strong>${r.name}</strong><p>${needs}</p>${fx}</div>${btn}</li>`
    }).join('')
  }

  function openBook(from) {
    bookReturn = from
    renderBook($('#book-list'), false)
    showScreen('book')
    focusSoon('#book-close')
    if (from !== 'pause') Sound.setMood(null)
  }
  function closeBook() {
    if (bookReturn === 'pause') {
      showScreen('pause')
      focusSoon('#pause-resume')
    } else resume()
  }
  $('#book-close').addEventListener('click', closeBook)

  // end of a run
  function endGame() {
    game.over = true
    Sound.setMood(null)
    const reached = `Phase ${game.phase} · ${game.isNight ? 'night' : 'day'}`
    const result = {
      name: game.name,
      guest: game.guest,
      score: game.score,
      reached,
      cures: game.stats.cures,
      stuns: game.stats.stuns,
      kills: game.stats.kills,
      classPoints: game.guest ? 0 : classPointsFor(game.score)
    }
    session.results.push(result)

    const entry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: result.name,
      score: result.score,
      reached,
      cures: result.cures,
      kills: result.kills,
      mode: session.mode,
      date: todayISO()
    }
    const board = loadJSON(STORAGE.board, [])
    board.push(entry)
    board.sort((a, b) => b.score - a.score)
    saveJSON(STORAGE.board, board.slice(0, 200))
    const rank = topRuns(session.mode, 10).findIndex((e) => e.id === entry.id) + 1
    result.entryId = entry.id

    if (!result.guest) {
      result.run = { ...entry, classPoints: result.classPoints }
      const un = loadJSON(STORAGE.unclaimed, [])
      un.push(result.run)
      saveJSON(STORAGE.unclaimed, un)
    }

    $('#over-kicker').textContent = result.name
    const pit = game.deathCause === 'pit'
    $('#over-title').textContent = pit ? 'Down the pit… 🕳️' : 'Zombie snack… 🧟'
    $('#over-msg').textContent = pit
      ? `You made it to ${reached.toLowerCase()} before taking a wrong step. Watch the ground!`
      : `You made it to ${reached.toLowerCase()}. The zombies say thanks for the snacks.`
    $('#over-stats').innerHTML = [
      ['Score', result.score],
      ['Stuns', result.stuns],
      ['KOs', result.kills],
      ['Cures', result.cures],
      ['Class pts', result.guest ? '—' : `+${result.classPoints}`]
    ]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('')
    $('#over-rank').textContent =
      rank > 0 ? `🏆 #${rank} on the class ${session.mode} leaderboard!` : ''
    const more = session.idx < session.players.length - 1
    $('#over-next').textContent = more
      ? `Pass to ${session.players[session.idx + 1].name} ▶`
      : 'See results ▶'
    showScreen('over')
    focusSoon('#over-next')
  }

  $('#over-next').addEventListener('click', () => {
    if (session.idx < session.players.length - 1) {
      session.idx++
      showPass()
    } else showResults()
  })

  const RUN_KEYS = ['id', 'name', 'score', 'reached', 'cures', 'kills', 'mode', 'date']

  function runsJSON(runs) {
    if (!runs.length) return ''
    const keys = [...RUN_KEYS, 'classPoints']
    const line = (r) =>
      JSON.stringify(
        Object.fromEntries(keys.filter((k) => r[k] !== undefined).map((k) => [k, r[k]]))
      )
    return `{ "game": "Bake Before Dark", "runs": [\n${runs.map((r) => '  ' + line(r)).join(',\n')}\n] }`
  }

  function showResults() {
    game = null
    const res = session.results
    const best = Math.max(...res.map((r) => r.score))
    $('#results-title').textContent =
      res.length > 1
        ? res.filter((r) => r.score === best).length > 1
          ? "It's a tie! 🤝"
          : `${res.find((r) => r.score === best).name} wins! 🏆`
        : 'Results'
    $('#results-body').innerHTML = res
      .map(
        (r) =>
          `<tr class='${res.length > 1 && r.score === best ? 'is-new' : ''}'><td>${escapeHtml(r.name)}</td><td class='num'>${r.score}</td><td>${escapeHtml(r.reached)}</td><td class='num'>${r.cures}</td><td class='num'>${r.guest ? '—' : '+' + r.classPoints}</td></tr>`
      )
      .join('')
    const rows = res.filter((r) => r.run).map((r) => r.run)
    $('#results-json').value = rows.length ? runsJSON(rows) : 'Guests don’t earn class points.'
    $('#results-copy').disabled = !rows.length
    showScreen('results')
    focusSoon('#results-again')
  }

  function copyFrom(textarea, btn) {
    const text = textarea.value
    const done = () => {
      const old = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(() => (btn.textContent = old), 1400)
    }
    if (navigator.clipboard && window.isSecureContext)
      navigator.clipboard.writeText(text).then(done, () => {
        textarea.select()
        document.execCommand('copy')
        done()
      })
    else {
      textarea.select()
      document.execCommand('copy')
      done()
    }
  }
  $('#results-copy').addEventListener('click', (e) => copyFrom($('#results-json'), e.currentTarget))
  $('#results-again').addEventListener('click', () => startSession(session.players, session.mode))
  $('#results-new').addEventListener('click', goTitle)

  // leaderboard
  let boardMode = 'full'

  function todayISO() {
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  function showDate(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '')
    return m ? new Date(+m[1], m[2] - 1, +m[3]).toLocaleDateString() : s || ''
  }

  function topRuns(mode, n) {
    const local = loadJSON(STORAGE.board, [])
      .filter((r) => !SHARED_IDS.has(r.id))
      .map((r) => ({ ...r, local: true }))
    const seen = new Set()
    return [...SHARED_RUNS, ...local]
      .filter((r) => r.mode === mode)
      .sort((a, b) => b.score - a.score)
      .filter((r) => !seen.has(r.name) && seen.add(r.name))
      .slice(0, n)
  }

  function pendingRuns() {
    const un = loadJSON(STORAGE.unclaimed, [])
    const pending = un
      .filter((r) => !SHARED_IDS.has(r.id))
      .map((r, i) =>
        r.id
          ? r
          : {
              id: `old-${Date.now().toString(36)}-${i}`,
              name: r.name,
              classPoints: r.delta ?? r.classPoints
            }
      )
    if (pending.length !== un.length || pending.some((r, i) => r !== un[i]))
      saveJSON(STORAGE.unclaimed, pending)
    return pending
  }

  function renderBoard() {
    const board = topRuns(boardMode, 10)
    const latest = new Set(session ? session.results.map((r) => r.entryId) : [])
    $('#board-body').innerHTML = board.length
      ? board
          .map(
            (e, i) =>
              `<tr class='${latest.has(e.id) ? 'is-new' : ''}'><td class='num'>${i + 1}</td><td>${escapeHtml(e.name)}${e.local ? ` <span title='Only on this Chromebook until your teacher posts it'>⏳</span>` : ''}</td><td class='num'>${e.score}</td><td>${escapeHtml(e.reached)}</td><td class='num'>${e.cures}</td><td>${escapeHtml(showDate(e.date))}</td></tr>`
          )
          .join('')
      : `<tr><td colspan='6'>No scores yet. Be the first!</td></tr>`
    $$('[data-board]').forEach((b) => b.classList.toggle('is-on', b.dataset.board === boardMode))

    const pending = pendingRuns()
    $('#teacher-count').textContent = pending.length
      ? `${pending.length} game${pending.length === 1 ? '' : 's'} not posted yet. Paste this into Cursor to add the scores and class points.`
      : 'Nothing waiting. Every game from this Chromebook has been posted.'
    $('#teacher-json').value = runsJSON(pending)
    $('#teacher-copy').disabled = !pending.length
  }
  function renderMiniBoard() {
    const mode = lengthField().value
    const board = topRuns(mode, 5)
    $('#board-mini-mode').textContent = mode === 'full' ? 'Full games' : 'Short games'
    $('#board-mini').innerHTML = board.length
      ? board.map((e) => `<li>${escapeHtml(e.name)} <span>${e.score}</span></li>`).join('')
      : `<li class='empty'>No scores yet. Be the first!</li>`
  }
  $$('[data-board]').forEach((b) =>
    b.addEventListener('click', () => {
      boardMode = b.dataset.board
      renderBoard()
    })
  )
  $('#teacher-copy').addEventListener('click', (e) => copyFrom($('#teacher-json'), e.currentTarget))
  const teacherPanel = $('#teacher-panel')
  teacherPanel.hidden = !new URLSearchParams(location.search).has('teacher')
  teacherPanel.addEventListener('toggle', () => {
    if (!teacherPanel.open || sessionStorage.getItem(STORAGE.teacher) === '1') return
    if (prompt('Teacher PIN') === TEACHER_PIN) sessionStorage.setItem(STORAGE.teacher, '1')
    else teacherPanel.open = false
  })

  function goTitle() {
    syncSetup()
    showScreen('title')
  }
  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]')
    if (!go) return
    if (go.dataset.go === 'board') {
      boardMode = session ? session.mode : lengthField().value
      renderBoard()
      showScreen('board')
    } else goTitle()
  })

  // ---------- Input ----------
  $('#mute').addEventListener('click', (e) => {
    Sound.unlock()
    Sound.setMuted(!Sound.muted)
    e.currentTarget.blur()
  })
  Sound.setMuted(Sound.muted)

  window.addEventListener('pointerdown', () => Sound.unlock(), { once: true })

  canvas.tabIndex = -1
  canvas.addEventListener('mousedown', (e) => {
    if (ui !== null || !game || game.over || game.dying) return
    const vw = viewW / zoom
    const vh = viewH / zoom
    const camX = clamp(game.player.x - vw / 2, 0, Math.max(0, WORLD.w - vw))
    const camY = clamp(game.player.y - vh / 2 - 20, 0, Math.max(0, WORLD.h - vh))
    throwTreat(camX + e.clientX / zoom, camY + e.clientY / zoom)
  })

  window.addEventListener('keydown', (e) => {
    const typing = e.target.matches && e.target.matches('select, textarea, input')
    if (e.code === 'KeyM' && !e.repeat && !typing) {
      Sound.unlock()
      Sound.setMuted(!Sound.muted)
      return
    }
    if (ui === null && game && !game.over) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code))
        e.preventDefault()
      keys.add(e.code)
      if (e.repeat || game.dying) return
      switch (e.code) {
        case 'Space':
          swing()
          break
        case 'KeyF':
          throwTreat()
          break
        case 'KeyQ':
          cycleTreat(1)
          break
        case 'KeyE':
          interact()
          break
        case 'KeyB':
          openBook('game')
          break
        case 'KeyP':
        case 'Escape':
          pause()
          break
        default:
          if (/^Digit[1-9]$/.test(e.code)) selectTreat(+e.code.slice(5) - 1)
      }
      return
    }
    if (e.repeat) return
    if (ui === 'bake') {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault()
        resume()
      } else if (e.code === 'Enter') {
        e.preventDefault()
        doBake()
      } else if (/^Digit[1-9]$/.test(e.code)) {
        toggleIng(ownedIngredients()[+e.code.slice(5) - 1])
      }
    } else if (ui === 'book') {
      if (e.code === 'Escape' || e.code === 'KeyB') {
        e.preventDefault()
        closeBook()
      }
    } else if (ui === 'pause') {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault()
        resume()
      }
    }
  })
  window.addEventListener('keyup', (e) => keys.delete(e.code))
  window.addEventListener('blur', () => {
    keys.clear()
    if (ui === null && game && !game.over && !game.dying) pause()
  })

  // ---------- Loop ----------
  let last = performance.now()
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (game && ui === null && !game.over) update(dt)
    render()
    requestAnimationFrame(frame)
  }

  syncSetup()
  requestAnimationFrame(frame)
})()
