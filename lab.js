const IF_SCENARIOS = [
  {
    id: 'rain',
    label: 'Weather',
    question: 'Is it raining?',
    condition: 'raining',
    thenText: 'put on a raincoat',
    elseText: 'put on sunglasses',
    thenSpeech: 'Good thing I packed a coat.',
    elseSpeech: 'Sun’s out. Let’s go.',
    thenScene: 'rain',
    elseScene: 'sun',
    thenProp: '🧥',
    elseProp: '😎'
  },
  {
    id: 'night',
    label: 'Lights',
    question: 'Is it nighttime?',
    condition: 'nighttime',
    thenText: 'turn the lamp on',
    elseText: 'let the sunshine in',
    thenSpeech: 'Lamp on. I can see!',
    elseSpeech: 'What a bright day.',
    thenScene: 'night',
    elseScene: 'day',
    thenProp: '💡',
    elseProp: '🌻'
  },
  {
    id: 'prize',
    label: 'Prizes',
    question: 'Do you have enough points?',
    condition: 'points >= 10',
    thenText: 'unlock a snack',
    elseText: 'keep earning points',
    thenSpeech: 'Prize unlocked!',
    elseSpeech: 'A few more points to go.',
    thenScene: 'prize',
    elseScene: 'empty',
    thenProp: '🍬',
    elseProp: '🔒'
  }
]

const PRIZE_CHIPS = [
  { label: 'Candy vs stickers', left: 5, right: 10 },
  { label: 'Close call', left: 7, right: 8 },
  { label: 'Big lead', left: 12, right: 3 },
  { label: 'Tie game', left: 6, right: 6 }
]

const LOCKER_POOL = ['🍕', '🎮', '⚽', '📚', '🎸', '⭐', '🧃', '🎧', '🚀', '🏀', '🐱', '🧩']
const DECOY_TARGET = '🦄'
const LOCKER_COUNT = 10
const COMPARE_MAX = 12

const COUNT_TYPES = [
  { id: 'all', emoji: '✨', label: 'everything' },
  { id: 'robot', emoji: '🤖', label: 'robots' },
  { id: 'star', emoji: '⭐', label: 'stars' },
  { id: 'pizza', emoji: '🍕', label: 'pizzas' },
  { id: 'book', emoji: '📚', label: 'books' }
]

const COUNT_EMOJI = {
  robot: '🤖',
  star: '⭐',
  pizza: '🍕',
  book: '📚'
}

const labState = {
  scenarioId: 'rain',
  conditionTrue: true,
  left: 4,
  right: 6,
  lockers: [],
  target: '🍕',
  searchToken: 0,
  searching: false,
  countItems: [],
  countType: 'robot',
  countToken: 0,
  counting: false
}

function $(sel) {
  return document.querySelector(sel)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function prefersReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, prefersReduced() ? 0 : ms)
  })
}

function shuffle(list) {
  const copy = list.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

function currentScenario() {
  return IF_SCENARIOS.find((row) => row.id === labState.scenarioId) || IF_SCENARIOS[0]
}

function restartSwap(el) {
  if (!el) return
  el.classList.remove('is-swap')
  void el.offsetWidth
  el.classList.add('is-swap')
}

function renderIfThen() {
  const scenario = currentScenario()
  const on = labState.conditionTrue
  const scene = on ? scenario.thenScene : scenario.elseScene
  const prop = on ? scenario.thenProp : scenario.elseProp
  const speech = on ? scenario.thenSpeech : scenario.elseSpeech
  const diorama = $('#if-diorama')

  $('#if-scenarios').innerHTML = IF_SCENARIOS.map((row) => {
    const onClass = row.id === scenario.id ? ' is-on' : ''
    return `<button class='filter-btn${onClass}' type='button' data-if-scenario='${row.id}'>${escapeHtml(row.label)}</button>`
  }).join('')

  $('#if-question').textContent = scenario.question
  $('#if-toggle').checked = on
  $('#if-toggle').setAttribute('aria-label', scenario.question)
  $('.rocker').classList.toggle('is-yes', on)
  diorama.dataset.scene = scene
  $('#if-prop').textContent = prop
  $('#if-speech').textContent = speech
  restartSwap(diorama)

  $('#if-code').innerHTML = [
    `<span class='code-line'><span class='code-kw'>if</span> (${escapeHtml(scenario.condition)}) {</span>`,
    `<span class='code-line${on ? ' is-lit' : ''}'>  ${escapeHtml(scenario.thenText)}</span>`,
    `<span class='code-line'>} <span class='code-kw'>else</span> {</span>`,
    `<span class='code-line${on ? '' : ' is-lit'}'>  ${escapeHtml(scenario.elseText)}</span>`,
    `<span class='code-line'>}</span>`
  ].join('\n')

  $('#if-explain').textContent = on
    ? `The condition is true, so the computer runs the then path: ${scenario.thenText}.`
    : `The condition is false, so the computer runs the else path: ${scenario.elseText}.`
}

function initIfThen() {
  $('#if-scenarios').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-if-scenario]')
    if (!btn) return
    labState.scenarioId = btn.getAttribute('data-if-scenario')
    renderIfThen()
  })
  $('#if-toggle').addEventListener('change', (event) => {
    labState.conditionTrue = event.target.checked
    renderIfThen()
  })
  renderIfThen()
}

function compareOp() {
  if (labState.left > labState.right) return '>'
  if (labState.left < labState.right) return '<'
  return '='
}

function comparePhrase() {
  if (labState.left > labState.right) {
    return `${labState.left} is greater than ${labState.right}`
  }
  if (labState.left < labState.right) {
    return `${labState.left} is less than ${labState.right}`
  }
  return `Both are ${labState.left} — they’re the same`
}

function stackHtml(count) {
  const blocks = []
  for (let i = 0; i < count; i++) {
    blocks.push(`<span class='compare-block' style='animation-delay:${i * 18}ms'></span>`)
  }
  return blocks.join('')
}

function renderCompare() {
  const op = compareOp()
  const equal = labState.left === labState.right
  const opEl = $('#compare-op')
  const prev = opEl.textContent
  $('#compare-left-num').textContent = String(labState.left)
  $('#compare-right-num').textContent = String(labState.right)
  $('#compare-left-stack').innerHTML = stackHtml(labState.left)
  $('#compare-right-stack').innerHTML = stackHtml(labState.right)
  opEl.textContent = op
  opEl.classList.toggle('is-eq', equal)
  if (prev !== op) {
    opEl.classList.remove('is-pop')
    void opEl.offsetWidth
    opEl.classList.add('is-pop')
  }
  $('#compare-readout').textContent = comparePhrase()

  const diff = labState.left - labState.right
  const tilt = diff === 0 ? 0 : Math.sign(diff) * Math.min(16, 7 + Math.abs(diff) * 0.8)
  $('#seesaw-board').style.transform = `rotate(${tilt}deg)`
  $('#seesaw-left').style.height = `${12 + labState.left * 5}px`
  $('#seesaw-right').style.height = `${12 + labState.right * 5}px`

  const gt = labState.left > labState.right
  const lt = labState.left < labState.right
  $('#compare-code').innerHTML = [
    `<span class='code-line${gt ? ' is-lit' : ''}'>${labState.left} <span class='code-op'>&gt;</span> ${labState.right}  →  ${gt}</span>`,
    `<span class='code-line${lt ? ' is-lit' : ''}'>${labState.left} <span class='code-op'>&lt;</span> ${labState.right}  →  ${lt}</span>`,
    `<span class='code-line${equal ? ' is-lit' : ''}'>${labState.left} <span class='code-op'>==</span> ${labState.right}  →  ${equal}</span>`
  ].join('\n')

  $('#compare-explain').textContent = equal
    ? 'Equal means the comparison is true for ==, and false for greater-than or less-than.'
    : 'Only one comparison is true at a time. That true/false is what an if statement checks.'
}

function initCompare() {
  $('#compare-prizes').innerHTML = PRIZE_CHIPS.map((chip, index) => {
    return `<button class='filter-btn' type='button' data-prize-chip='${index}'>${escapeHtml(chip.label)}</button>`
  }).join('')

  $('.compare-arena').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-compare-delta]')
    if (!btn) return
    const side = btn.getAttribute('data-side')
    const delta = Number(btn.getAttribute('data-compare-delta'))
    const next = Math.max(0, Math.min(COMPARE_MAX, labState[side] + delta))
    labState[side] = next
    renderCompare()
  })

  $('#compare-prizes').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-prize-chip]')
    if (!btn) return
    const chip = PRIZE_CHIPS[Number(btn.getAttribute('data-prize-chip'))]
    if (!chip) return
    labState.left = chip.left
    labState.right = chip.right
    renderCompare()
  })

  renderCompare()
}

function uniqueTargets(items) {
  const seen = []
  for (const item of items) {
    if (!seen.includes(item)) seen.push(item)
  }
  return seen
}

function fillLockers() {
  labState.lockers = shuffle(LOCKER_POOL).slice(0, LOCKER_COUNT)
  const options = uniqueTargets(labState.lockers)
  if (labState.target !== DECOY_TARGET && !options.includes(labState.target)) {
    labState.target = options[0]
  }
}

function renderMatchTargets() {
  const options = uniqueTargets(labState.lockers).concat(DECOY_TARGET)
  $('#match-targets').innerHTML = options
    .map((item) => {
      const onClass = item === labState.target ? ' is-on' : ''
      return `<button class='filter-btn${onClass}' type='button' data-match-target='${item}'>${item}</button>`
    })
    .join('')
}

function renderLockers(view) {
  view = view || {}
  const openUntil = view.openUntil == null ? -1 : view.openUntil
  const checking = view.checking == null ? -1 : view.checking
  const foundAt = view.foundAt == null ? -1 : view.foundAt
  $('#locker-grid').innerHTML = labState.lockers
    .map((item, index) => {
      const classes = ['locker']
      if (index === checking) classes.push('is-checking')
      if (index <= openUntil) classes.push('is-open')
      if (foundAt >= 0 && index === foundAt) classes.push('is-match')
      if (index <= openUntil && index !== foundAt) classes.push('is-miss')
      return `<div class='${classes.join(' ')}' data-locker='${index}'>
        <span class='locker-door'>${index + 1}</span>
        <span class='locker-item'>${item}</span>
      </div>`
    })
    .join('')
}

function setMatchCode(activeLine, found) {
  const target = labState.target
  const lines = [
    { id: 'start', html: `<span class='code-kw'>found</span> = false` },
    { id: 'loop', html: `<span class='code-kw'>for</span> locker in lockers:` },
    {
      id: 'check',
      html: `  <span class='code-kw'>if</span> locker == <span class='code-str'>'${escapeHtml(target)}'</span>:`
    },
    { id: 'found', html: `    found = true` },
    { id: 'stop', html: `    stop` }
  ]
  $('#match-code').innerHTML = lines
    .map((line) => {
      const lit = line.id === activeLine || (found && (line.id === 'found' || line.id === 'stop'))
      return `<span class='code-line${lit ? ' is-lit' : ''}'>${line.html}</span>`
    })
    .join('\n')
}

const MATCH_EXPLAIN =
  'This is a linear search: start at the beginning, check each item, stop when you find a match — or reach the end.'

function resetMatchUi(message) {
  renderMatchTargets()
  renderLockers()
  setMatchCode('start', false)
  $('#match-status').textContent = message
  $('#match-explain').textContent = MATCH_EXPLAIN
  $('#match-search').disabled = false
  $('#match-shuffle').disabled = false
  labState.searching = false
}

async function runSearch() {
  if (labState.searching) return
  labState.searching = true
  const token = ++labState.searchToken
  $('#match-search').disabled = true
  renderLockers()
  setMatchCode('loop', false)

  let foundAt = -1
  for (let i = 0; i < labState.lockers.length; i++) {
    if (token !== labState.searchToken) return
    setMatchCode('check', false)
    renderLockers({ openUntil: i - 1, checking: i })
    $('#match-status').textContent = `Checking locker ${i + 1} of ${labState.lockers.length}…`
    await wait(420)
    if (token !== labState.searchToken) return
    if (labState.lockers[i] === labState.target) {
      foundAt = i
      renderLockers({ openUntil: i, foundAt: i })
      break
    }
    renderLockers({ openUntil: i })
  }

  if (token !== labState.searchToken) return

  if (foundAt >= 0) {
    setMatchCode('found', true)
    const checks = foundAt + 1
    $('#match-status').textContent =
      checks === 1
        ? `Match! Found ${labState.target} in locker 1 on the first check.`
        : `Match! Found ${labState.target} in locker ${foundAt + 1} after ${checks} checks.`
  } else {
    setMatchCode('loop', false)
    $('#match-status').textContent = `No match. ${labState.target} is not in this list.`
    $('#match-explain').textContent =
      'Sometimes the item isn’t there. A search still has to check every locker before it can be sure.'
  }

  labState.searching = false
  $('#match-search').disabled = false
  $('#match-shuffle').disabled = false
}

function initMatch() {
  fillLockers()
  resetMatchUi('Pick a target, then search.')
  setMatchCode('start', false)

  $('#match-targets').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-match-target]')
    if (!btn) return
    labState.target = btn.getAttribute('data-match-target')
    labState.searchToken += 1
    resetMatchUi(`Looking for ${labState.target}. Press search.`)
  })

  $('#match-search').addEventListener('click', () => {
    runSearch()
  })

  $('#match-shuffle').addEventListener('click', () => {
    labState.searchToken += 1
    fillLockers()
    resetMatchUi('Lockers shuffled. Pick a target, then search.')
  })
}

function mixCountItems() {
  const types = ['robot', 'star', 'pizza', 'book']
  const items = []
  for (let i = 0; i < 24; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    items.push({
      type,
      emoji: COUNT_EMOJI[type],
      rot: (Math.random() * 16 - 8).toFixed(1)
    })
  }
  labState.countItems = items
}

function renderCountTypes() {
  $('#count-types').innerHTML = COUNT_TYPES.map((row) => {
    const onClass = row.id === labState.countType ? ' is-on' : ''
    return `<button class='filter-btn${onClass}' type='button' data-count-type='${row.id}'>${row.emoji} ${escapeHtml(row.label)}</button>`
  }).join('')
}

function renderCountGrid(hits, activeIndex) {
  const marked = hits || []
  $('#count-grid').innerHTML = labState.countItems
    .map((item, index) => {
      const classes = ['count-item']
      const badge = marked[index]
      if (typeof activeIndex === 'number' && index !== activeIndex && !badge) {
        classes.push('is-dim')
      }
      if (badge) classes.push('is-hit')
      const badgeHtml = badge ? `<span class='count-badge'>${badge}</span>` : ''
      return `<div class='${classes.join(' ')}' style='--rot:${item.rot}deg'>${item.emoji}${badgeHtml}</div>`
    })
    .join('')
}

function countLabel() {
  const row = COUNT_TYPES.find((item) => item.id === labState.countType)
  return row ? row.label : 'items'
}

function itemMatches(item) {
  return labState.countType === 'all' || item.type === labState.countType
}

function expectedCount() {
  return labState.countItems.filter(itemMatches).length
}

function setCountCode(activeLine, total) {
  const kind = labState.countType === 'all' ? 'item' : countLabel().replace(/s$/, '')
  const check =
    labState.countType === 'all'
      ? 'count = count + 1'
      : `if item is a ${escapeHtml(kind)}: count = count + 1`
  const lines = [
    { id: 'zero', html: `<span class='code-kw'>count</span> = 0` },
    { id: 'loop', html: `<span class='code-kw'>for</span> item in pile:` },
    { id: 'add', html: `  ${check}` },
    { id: 'done', html: `count is ${total}` }
  ]
  $('#count-code').innerHTML = lines
    .map((line) => {
      return `<span class='code-line${line.id === activeLine ? ' is-lit' : ''}'>${line.html}</span>`
    })
    .join('\n')
}

function resetCountUi() {
  renderCountTypes()
  renderCountGrid()
  $('#count-total').textContent = '0'
  $('#count-total-label').textContent = 'not counted yet'
  $('#count-status').textContent = `Ready to count the ${countLabel()}.`
  setCountCode('zero', 0)
  $('#count-run').disabled = false
  $('#count-mix').disabled = false
  labState.counting = false
}

async function runCount() {
  if (labState.counting) return
  labState.counting = true
  const token = ++labState.countToken
  $('#count-run').disabled = true
  $('#count-mix').disabled = true
  $('#count-total').textContent = '0'
  $('#count-total-label').textContent = countLabel()
  setCountCode('loop', 0)

  const hits = []
  let total = 0
  for (let i = 0; i < labState.countItems.length; i++) {
    if (token !== labState.countToken) return
    setCountCode('add', total)
    $('#count-status').textContent = `Looking at item ${i + 1} of ${labState.countItems.length}…`
    if (itemMatches(labState.countItems[i])) {
      total += 1
      hits[i] = total
      const totalEl = $('#count-total')
      totalEl.textContent = String(total)
      totalEl.classList.remove('is-pop')
      void totalEl.offsetWidth
      totalEl.classList.add('is-pop')
    }
    renderCountGrid(hits, i)
    await wait(140)
  }

  if (token !== labState.countToken) return
  setCountCode('done', total)
  renderCountGrid(hits, -1)
  $('#count-status').textContent = `Done. There ${total === 1 ? 'is' : 'are'} ${total} ${countLabel()}.`
  $('#count-explain').textContent =
    total === expectedCount()
      ? `Start at zero. Check each item. Add one for every match. The total is ${total}.`
      : `The counter ended at ${total}.`
  labState.counting = false
  $('#count-run').disabled = false
  $('#count-mix').disabled = false
}

function initCount() {
  mixCountItems()
  resetCountUi()

  $('#count-types').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-count-type]')
    if (!btn) return
    labState.countType = btn.getAttribute('data-count-type')
    labState.countToken += 1
    resetCountUi()
    $('#count-explain').textContent =
      'Start at zero. Loop through the pile. Every time you see a match, add one. That’s a counter.'
  })

  $('#count-run').addEventListener('click', () => {
    runCount()
  })

  $('#count-mix').addEventListener('click', () => {
    labState.countToken += 1
    mixCountItems()
    resetCountUi()
    $('#count-status').textContent = 'New pile. Pick a type, then press count.'
  })
}

function init() {
  initIfThen()
  initCompare()
  initMatch()
  initCount()
}

init()
