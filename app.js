const PALETTE = [
  '#e25a38',
  '#1b8a80',
  '#d9a21b',
  '#c45c7a',
  '#4f6f8c',
  '#c46b3a',
  '#5b7a4a',
  '#6d5b9a'
]

const FILTERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'first-time', label: 'First-time coders' },
  { id: 'a-little-coding', label: 'A little coding' },
  { id: 'scratch', label: 'Scratch' },
  { id: 'lots-of-coding', label: 'Lots of coding' },
  { id: 'roblox', label: 'Roblox fans' },
  { id: 'fortnite', label: 'Fortnite' },
  { id: 'minecraft', label: 'Minecraft' },
  { id: 'readers', label: 'Readers' },
  { id: 'soccer', label: 'Soccer' },
  { id: 'basketball', label: 'Basketball' },
  { id: 'music-makers', label: 'Music makers' },
  { id: 'artists', label: 'Artists' }
]

const PRIZES = [
  { label: 'Candy or snack', cost: 5 },
  { label: 'Stickers or toy', cost: 10 },
  { label: 'Fidget', cost: 15 },
  { label: 'Squishy', cost: 20 },
  { label: 'Pokemon cards', cost: 25 },
  { label: 'Homework pass', cost: 30 },
  { label: 'Gift card', cost: 50 }
]

const POINTS_KEY = 'csd-class-hub-points'
const PIN_KEY = 'csd-class-hub-pin'
const TEACHER_SESSION_KEY = 'csd-class-hub-teacher'

const state = {
  filter: 'all',
  query: '',
  sort: 'roster',
  spotlightId: null,
  modalId: null,
  pointsMessage: ''
}

const data = window.CSD_DATA
const students = data.students

function colorFor(id) {
  const n = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return PALETTE[n % PALETTE.length]
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

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", '&#39;')
}

function emptyPointsStore() {
  return { version: 1, balances: {}, ledger: [], appliedAwardIds: [] }
}

function loadPointsStore() {
  try {
    const raw = localStorage.getItem(POINTS_KEY)
    if (!raw) return emptyPointsStore()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyPointsStore()
    return {
      version: 1,
      balances: parsed.balances || {},
      ledger: Array.isArray(parsed.ledger) ? parsed.ledger : [],
      appliedAwardIds: Array.isArray(parsed.appliedAwardIds)
        ? parsed.appliedAwardIds
        : []
    }
  } catch (err) {
    return emptyPointsStore()
  }
}

function savePointsStore(store) {
  try {
    localStorage.setItem(POINTS_KEY, JSON.stringify(store))
  } catch (err) {
    window.alert('Could not save points on this device.')
  }
}

function getPoints(id) {
  return Number(loadPointsStore().balances[id] || 0)
}

function studentFromAward(award) {
  if (award.studentId) return studentById(award.studentId)
  const q = String(award.name || award.student || '').trim().toLowerCase()
  if (!q) return null
  const exact = students.find((s) => s.displayName.toLowerCase() === q)
  if (exact) return exact
  const partial = students.filter((s) => {
    const name = s.displayName.toLowerCase()
    return name.startsWith(q) || name.split(' ')[0] === q
  })
  if (partial.length === 1) return partial[0]
  return null
}

function applyFileAwards() {
  const file = window.CSD_POINTS
  const awards = file && Array.isArray(file.awards) ? file.awards : []
  if (!awards.length) return
  const store = loadPointsStore()
  let changed = false
  for (const award of awards) {
    if (!award || !award.id) continue
    const student = studentFromAward(award)
    const delta = Number(award.delta)
    if (!student || !Number.isFinite(delta) || !delta) continue
    const applyKey = `${award.id}:${student.id}`
    const firstWithId = awards.find((row) => row && row.id === award.id)
    if (
      store.appliedAwardIds.includes(applyKey) ||
      (firstWithId === award && store.appliedAwardIds.includes(award.id))
    ) {
      continue
    }
    const current = Number(store.balances[student.id] || 0)
    const next = Math.max(0, current + delta)
    const applied = next - current
    store.balances[student.id] = next
    store.appliedAwardIds.push(applyKey)
    if (applied && !award.silent) {
      store.ledger.push({
        studentId: student.id,
        delta: applied,
        note: award.note || (applied > 0 ? 'Points added' : 'Redeemed'),
        at: award.at || new Date().toISOString()
      })
    }
    changed = true
  }
  if (changed) savePointsStore(store)
}

function studentLedger(id) {
  return loadPointsStore()
    .ledger.filter((row) => row.studentId === id)
    .slice(-8)
    .reverse()
}

function formatDay(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function pointsLabel(n) {
  return `${n} pt${n === 1 ? '' : 's'}`
}

function isTeacher() {
  try {
    return sessionStorage.getItem(TEACHER_SESSION_KEY) === '1'
  } catch (err) {
    return false
  }
}

function setTeacher(on) {
  try {
    if (on) sessionStorage.setItem(TEACHER_SESSION_KEY, '1')
    else sessionStorage.removeItem(TEACHER_SESSION_KEY)
  } catch (err) {
    /* file:// or private mode may block sessionStorage */
  }
  renderTeacherChrome()
  if ($('#modal').open && state.modalId) renderModal(state.modalId)
}

function savedPin() {
  try {
    return localStorage.getItem(PIN_KEY) || ''
  } catch (err) {
    return ''
  }
}

function renderTeacherChrome() {
  const on = isTeacher()
  const btn = $('#teacher-btn')
  btn.textContent = on ? 'Teacher on' : 'Teacher'
  btn.classList.toggle('is-on', on)
  $('#points-tools').hidden = !on
  $('#sort-points').classList.toggle('is-on', state.sort === 'points')
}

function openTeacherDialog() {
  const firstTime = !savedPin()
  $('#teacher-dialog-title').textContent = firstTime ? 'Create a teacher PIN' : 'Teacher unlock'
  $('#teacher-dialog-copy').textContent = firstTime
    ? 'This PIN stays on this computer so students cannot award themselves points.'
    : 'Enter your PIN to award and redeem points.'
  $('#teacher-submit').textContent = firstTime ? 'Save PIN' : 'Unlock'
  $('#teacher-pin').value = ''
  $('#teacher-dialog').showModal()
  $('#teacher-pin').focus()
}

function onTeacherSubmit(event) {
  event.preventDefault()
  const pin = $('#teacher-pin').value.trim()
  if (pin.length < 4) {
    window.alert('Use at least 4 characters.')
    return
  }
  const existing = savedPin()
  if (!existing) {
    try {
      localStorage.setItem(PIN_KEY, pin)
    } catch (err) {
      window.alert('Could not save a PIN on this device.')
      return
    }
  } else if (pin !== existing) {
    window.alert('That PIN does not match.')
    return
  }
  $('#teacher-dialog').close()
  setTeacher(true)
}

function applyPoints(studentId, delta, note, isSpend) {
  if (!isTeacher()) return
  const store = loadPointsStore()
  const current = Number(store.balances[studentId] || 0)
  if (isSpend && delta < 0 && current + delta < 0) {
    state.pointsMessage = 'Not enough points yet.'
    renderModal(studentId)
    return
  }
  const next = Math.max(0, current + delta)
  const applied = next - current
  if (!applied) return
  store.balances[studentId] = next
  store.ledger.push({
    studentId,
    delta: applied,
    note: note || (applied > 0 ? 'Points added' : 'Redeemed'),
    at: new Date().toISOString()
  })
  savePointsStore(store)
  state.pointsMessage = ''
  renderCards()
  renderHeroCounts()
  if (state.spotlightId === studentId) {
    const student = studentById(studentId)
    if (student) renderSpotlight(student, false)
  }
  if ($('#modal').open && state.modalId === studentId) {
    renderModal(studentId)
    if ($('#points-note') && !isSpend) $('#points-note').value = note
  }
}

function noteFromModal() {
  const input = $('#points-note')
  return input ? input.value.trim() : ''
}

function exportPoints() {
  const payload = {
    ...loadPointsStore(),
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'csd-points.json'
  link.click()
  URL.revokeObjectURL(url)
}

function importPoints(file) {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result))
      if (!parsed || typeof parsed.balances !== 'object') {
        throw new Error('bad file')
      }
      savePointsStore({
        version: 1,
        balances: parsed.balances || {},
        ledger: Array.isArray(parsed.ledger) ? parsed.ledger : [],
        appliedAwardIds: Array.isArray(parsed.appliedAwardIds)
          ? parsed.appliedAwardIds
          : []
      })
      applyFileAwards()
      renderCards()
      renderHeroCounts()
      if (state.spotlightId) {
        const student = studentById(state.spotlightId)
        if (student) renderSpotlight(student, false)
      }
      if ($('#modal').open && state.modalId) renderModal(state.modalId)
    } catch (err) {
      window.alert('That file does not look like a points export.')
    }
  }
  reader.readAsText(file)
}

function pointsPanelHtml(student) {
  const pts = getPoints(student.id)
  const teacher = isTeacher()
  const history = studentLedger(student.id)
  const prizes = PRIZES.map(
    (prize) => `
      <button
        class='btn btn-tiny'
        type='button'
        data-redeem-cost='${prize.cost}'
        data-redeem-label='${escapeAttr(prize.label)}'
        data-student='${student.id}'
      >
        ${escapeHtml(prize.label)} · ${prize.cost}
      </button>`
  ).join('')

  return `
    <section class='points-panel'>
      <div class='points-head'>
        <p class='kicker'>Prize points</p>
        <p class='points-total'>${pts} <span>${pts === 1 ? 'pt' : 'pts'}</span></p>
      </div>
      ${state.pointsMessage ? `<p class='points-msg'>${escapeHtml(state.pointsMessage)}</p>` : ''}
      ${
        teacher
          ? `
        <div class='points-actions'>
          <button type='button' class='btn btn-small' data-points-delta='1' data-student='${student.id}'>+1</button>
          <button type='button' class='btn btn-small' data-points-delta='5' data-student='${student.id}'>+5</button>
          <button type='button' class='btn btn-small' data-points-delta='10' data-student='${student.id}'>+10</button>
          <button type='button' class='btn btn-ghost btn-small' data-points-delta='-1' data-student='${student.id}'>−1</button>
        </div>
        <label class='points-note'>
          <span class='sr-only'>Note</span>
          <input id='points-note' type='text' maxlength='80' placeholder='Note (quiz, helper, prize…)' />
        </label>
        <p class='points-sub'>Redeem a prize</p>
        <div class='points-actions'>${prizes}</div>
        <div class='points-custom'>
          <input id='points-custom' type='number' min='1' step='1' placeholder='Custom pts' />
          <button type='button' class='btn btn-ghost btn-small' data-points-custom='add' data-student='${student.id}'>Add</button>
          <button type='button' class='btn btn-ghost btn-small' data-points-custom='redeem' data-student='${student.id}'>Redeem</button>
        </div>`
          : `<p class='points-locked'>Ask Mr. Wallis to add or redeem points.</p>`
      }
      ${
        history.length
          ? `
        <ul class='points-log'>
          ${history
            .map(
              (row) => `
            <li>
              <b>${row.delta > 0 ? '+' : ''}${row.delta}</b>
              <span>${escapeHtml(row.note)}</span>
              <time>${formatDay(row.at)}</time>
            </li>`
            )
            .join('')}
        </ul>`
          : ''
      }
    </section>
  `
}

function countBy(list, key) {
  const counts = new Map()
  for (const item of list) {
    const value = typeof key === 'function' ? key(item) : item[key]
    if (!value) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function tokenCounts(kind) {
  const counts = new Map()
  for (const student of students) {
    for (const token of student.tokens[kind] || []) {
      counts.set(token, (counts.get(token) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

function barsHtml(rows) {
  const top = rows.slice(0, 5)
  const max = Math.max(...top.map(([, count]) => count), 1)
  return top
    .map(
      ([label, count]) => `
        <div class='bar'>
          <span>${escapeHtml(label)}</span>
          <span>${count}</span>
          <div class='bar-track'>
            <div class='bar-fill' data-width='${Math.round((count / max) * 100)}'></div>
          </div>
        </div>`
    )
    .join('')
}

function renderPulse() {
  const coding = countBy(students, 'coding')
  const screens = countBy(students, 'screenTime')
  const games = tokenCounts('games')
  const snacks = tokenCounts('snacks')
  $('#pulse-grid').innerHTML = `
    <article class='panel'>
      <h3>Coding experience</h3>
      ${barsHtml(coding)}
    </article>
    <article class='panel'>
      <h3>Screen time / week</h3>
      ${barsHtml(screens)}
    </article>
    <article class='panel'>
      <h3>Most-named games</h3>
      ${barsHtml(games)}
    </article>
    <article class='panel'>
      <h3>Snack attack</h3>
      ${barsHtml(snacks)}
    </article>
  `
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach((el) => {
      el.style.width = `${el.dataset.width}%`
    })
  })
}

function renderWishlist() {
  const titles = {
    posters: 'Posters',
    snacks: 'Snacks',
    prizes: 'Prizes'
  }
  $('#wishlist-grid').innerHTML = Object.entries(data.wishlist)
    .map(
      ([key, items]) => `
        <article class='ticket'>
          <h3>${titles[key]}</h3>
          <ul>
            ${items
              .map((item) => `<li><span>${escapeHtml(item.label)}</span><b>${item.count}</b></li>`)
              .join('')}
          </ul>
        </article>`
    )
    .join('')
}

function renderPrizes() {
  $('#prize-grid').innerHTML = `
    <table class='prize-chart'>
      <thead>
        <tr>
          <th>Prize</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        ${PRIZES.map(
          (prize) => `
            <tr>
              <th scope='row'>${escapeHtml(prize.label)}</th>
              <td><b>${prize.cost}</b> <span>pts</span></td>
            </tr>`
        ).join('')}
      </tbody>
    </table>
  `
}

function matchesFilters(student) {
  if (state.filter !== 'all' && !student.tags.includes(state.filter)) {
    return false
  }
  const q = state.query.trim().toLowerCase()
  if (!q) return true
  const hay = [
    student.displayName,
    student.games,
    student.music,
    student.hobbies,
    student.shows,
    student.apps,
    student.snacks,
    student.hopes,
    student.mbti,
    student.mbtiType,
    student.enneagram
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

function visibleStudents() {
  const list = students.filter(matchesFilters)
  if (state.sort !== 'points') return list
  return [...list].sort((a, b) => {
    const diff = getPoints(b.id) - getPoints(a.id)
    if (diff) return diff
    return a.displayName.localeCompare(b.displayName)
  })
}

function cardHtml(student, delay = 0) {
  const tags = student.tags
    .filter((tag) => tag !== 'a-little-coding' && tag !== 'sometimes-reads')
    .slice(0, 3)
  return `
    <button class='person-card' data-open='${student.id}' style='animation-delay:${delay}ms'>
      <span class='points-badge'>${pointsLabel(getPoints(student.id))}</span>
      <div class='avatar' style='background:${colorFor(student.id)}'>${escapeHtml(student.initials)}</div>
      <h3>${escapeHtml(student.displayName)}</h3>
      <p class='meta'>${escapeHtml(student.games || student.hobbies || 'Profile coming soon')}</p>
      <div class='chip-row'>
        ${student.mbti ? `<span class='chip'>${escapeHtml(student.mbti)}</span>` : ''}
        ${student.coding ? `<span class='chip'>${escapeHtml(student.coding)}</span>` : ''}
        ${tags.map((tag) => `<span class='chip'>${escapeHtml(tag.replaceAll('-', ' '))}</span>`).join('')}
      </div>
    </button>
  `
}

function renderCards() {
  const list = visibleStudents()
  $('#result-count').textContent = `${list.length} of ${students.length}`
  $('#card-grid').innerHTML = list.map((student, i) => cardHtml(student, i * 30)).join('')
}

function renderFilters() {
  $('#filters').innerHTML = FILTERS.map(
    (filter) => `
      <button class='filter-btn ${state.filter === filter.id ? 'is-on' : ''}' data-filter='${filter.id}'>
        ${filter.label}
      </button>`
  ).join('')
}

function studentById(id) {
  return students.find((s) => s.id === id)
}

function overlap(a, b) {
  const shared = []
  for (const kind of ['games', 'music', 'hobbies', 'snacks']) {
    const setB = new Set(b.tokens[kind] || [])
    for (const token of a.tokens[kind] || []) {
      if (setB.has(token)) shared.push(token)
    }
  }
  const mbtiA = (a.mbti || '').replace(/-[AT]$/i, '')
  const mbtiB = (b.mbti || '').replace(/-[AT]$/i, '')
  if (mbtiA && mbtiA === mbtiB) shared.push(mbtiA)
  if (a.enneagram && a.enneagram === b.enneagram) {
    shared.push(`Enneagram ${a.enneagram}`)
  }
  return [...new Set(shared)]
}

function renderMatch() {
  const select = $('#match-select')
  if (!select.dataset.ready) {
    select.innerHTML =
      `<option value=''>Choose a student…</option>` +
      students.map((s) => `<option value='${s.id}'>${escapeHtml(s.displayName)}</option>`).join('')
    select.dataset.ready = '1'
  }

  const chosen = studentById(select.value)
  const box = $('#match-results')
  if (!chosen) {
    box.innerHTML = `<p class='match-empty'>Pick a classmate to see who is on the same wavelength.</p>`
    return
  }

  const matches = students
    .filter((s) => s.id !== chosen.id)
    .map((s) => ({ student: s, shared: overlap(chosen, s) }))
    .filter((row) => row.shared.length)
    .sort((a, b) => b.shared.length - a.shared.length)

  if (!matches.length) {
    box.innerHTML = `<p class='match-empty'>No obvious overlaps yet — still a great person to sit with.</p>`
    return
  }

  box.innerHTML = matches
    .map(
      ({ student, shared }) => `
        <button class='match-card' data-open='${student.id}'>
          <div class='avatar' style='background:${colorFor(student.id)}'>${escapeHtml(student.initials)}</div>
          <div>
            <strong>${escapeHtml(student.displayName)}</strong>
            <div class='chip-row'>${shared
              .map((item) => `<span class='chip'>${escapeHtml(item)}</span>`)
              .join('')}</div>
          </div>
          <span>${shared.length} shared</span>
        </button>`
    )
    .join('')
}

function field(label, value) {
  if (!value) return ''
  return `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`
}

function personalityLabel(student) {
  const bits = []
  if (student.mbti) bits.push(student.mbti)
  if (student.mbtiType) bits.push(student.mbtiType)
  if (student.enneagram) bits.push(`Enneagram ${student.enneagram}`)
  return bits.join(' · ')
}

function profileBits(student) {
  const bits = []
  if (student.coding) bits.push(student.coding)
  if (student.techLove !== '' && student.techLove != null) {
    bits.push(`tech joy ${student.techLove}/10`)
  }
  if (student.screenTime) bits.push(student.screenTime)
  return bits
}

function renderModal(id) {
  const student = studentById(id)
  if (!student) return
  state.modalId = id
  $('#modal-body').innerHTML = `
    <div class='avatar' style='background:${colorFor(student.id)}'>${escapeHtml(student.initials)}</div>
    <h2>${escapeHtml(student.displayName)}</h2>
    ${
      profileBits(student).length
        ? `<p class='spotlight-meta'>${escapeHtml(profileBits(student).join(' · '))}</p>`
        : ''
    }
    ${student.hopes ? `<p class='hope-quote'>${escapeHtml(student.hopes)}</p>` : ''}
    ${pointsPanelHtml(student)}
    <dl class='modal-grid'>
      ${field('Personality', personalityLabel(student))}
      ${field('Games', student.games)}
      ${field('Music', student.music)}
      ${field('Shows', student.shows)}
      ${field('Apps', student.apps)}
      ${field('Websites', student.websites)}
      ${field('Snacks', student.snacks)}
      ${field('Reads', student.book ? `${student.reads} · ${student.book}` : student.reads)}
      ${field('Hobbies', student.hobbies)}
    </dl>
  `
}

function openModal(id) {
  state.pointsMessage = ''
  renderModal(id)
  if (!$('#modal').open) $('#modal').showModal()
}

function renderSpotlight(student, animate) {
  state.spotlightId = student.id
  const card = $('#spotlight')
  $('#spotlight-avatar').textContent = student.initials
  $('#spotlight-avatar').style.background = colorFor(student.id)
  $('#spotlight-name').textContent = student.displayName
  const spotlightMeta = [student.coding, student.games || student.hobbies]
    .filter(Boolean)
    .join(' · ')
  $('#spotlight-meta').textContent = spotlightMeta || 'Profile coming soon'
  $('#spotlight-points').textContent = pointsLabel(getPoints(student.id))
  $('#spotlight-blurb').textContent = student.hopes
  $('#spotlight-chips').innerHTML = student.tags
    .slice(0, 4)
    .map((tag) => `<span class='chip'>${escapeHtml(tag.replaceAll('-', ' '))}</span>`)
    .join('')
  $('#spotlight-open').dataset.open = student.id
  if (animate) {
    card.classList.remove('is-swap')
    void card.offsetWidth
    card.classList.add('is-swap')
  }
}

function spinSpotlight() {
  const others = students.filter((s) => s.id !== state.spotlightId)
  const pick = others[Math.floor(Math.random() * others.length)]
  renderSpotlight(pick, true)
}

function renderHeroCounts() {
  $('#stat-count').textContent = String(students.length)
  $('#stat-roblox').textContent = String(students.filter((s) => s.tags.includes('roblox')).length)
  $('#stat-first').textContent = String(
    students.filter((s) => s.tags.includes('first-time')).length
  )
  $('#stat-points').textContent = String(Math.max(0, ...students.map((s) => getPoints(s.id))))
}

function onClick(event) {
  const teacherBtn = event.target.closest('[data-teacher]')
  if (teacherBtn) {
    if (isTeacher()) setTeacher(false)
    else openTeacherDialog()
    return
  }
  const exportBtn = event.target.closest('[data-points-export]')
  if (exportBtn) {
    exportPoints()
    return
  }
  const importBtn = event.target.closest('[data-points-import]')
  if (importBtn) {
    $('#points-import').click()
    return
  }
  const sortBtn = event.target.closest('[data-sort]')
  if (sortBtn) {
    state.sort = state.sort === 'points' ? 'roster' : 'points'
    renderTeacherChrome()
    renderCards()
    return
  }
  const deltaBtn = event.target.closest('[data-points-delta]')
  if (deltaBtn) {
    const delta = Number(deltaBtn.dataset.pointsDelta)
    const note = noteFromModal() || (delta > 0 ? 'Points added' : 'Correction')
    applyPoints(deltaBtn.dataset.student, delta, note, false)
    return
  }
  const redeemBtn = event.target.closest('[data-redeem-cost]')
  if (redeemBtn) {
    const cost = Number(redeemBtn.dataset.redeemCost)
    const label = redeemBtn.dataset.redeemLabel
    if (!window.confirm(`Redeem ${label} for ${cost} points?`)) return
    applyPoints(redeemBtn.dataset.student, -cost, `Redeemed: ${label}`, true)
    return
  }
  const customBtn = event.target.closest('[data-points-custom]')
  if (customBtn) {
    const amount = Number($('#points-custom') && $('#points-custom').value)
    if (!Number.isFinite(amount) || amount < 1) {
      state.pointsMessage = 'Enter a custom amount first.'
      renderModal(customBtn.dataset.student)
      return
    }
    const isSpend = customBtn.dataset.pointsCustom === 'redeem'
    const note = noteFromModal() || (isSpend ? 'Redeemed' : 'Points added')
    applyPoints(customBtn.dataset.student, isSpend ? -amount : amount, note, isSpend)
    return
  }
  const filterBtn = event.target.closest('[data-filter]')
  if (filterBtn) {
    state.filter = filterBtn.dataset.filter
    renderFilters()
    renderCards()
    return
  }
  const spotlightBtn = event.target.closest('[data-spotlight]')
  if (spotlightBtn) {
    spinSpotlight()
    return
  }
  const openBtn = event.target.closest('[data-open]')
  if (openBtn) {
    openModal(openBtn.dataset.open)
  }
}

function init() {
  applyFileAwards()
  renderHeroCounts()
  renderPulse()
  renderWishlist()
  renderPrizes()
  renderFilters()
  renderCards()
  renderMatch()
  renderTeacherChrome()
  renderSpotlight(students[Math.floor(Math.random() * students.length)], false)

  document.addEventListener('click', onClick)
  $('#search').addEventListener('input', (event) => {
    state.query = event.target.value
    renderCards()
  })
  $('#match-select').addEventListener('change', renderMatch)
  $('#modal-close').addEventListener('click', () => $('#modal').close())
  $('#modal').addEventListener('click', (event) => {
    if (event.target === $('#modal')) $('#modal').close()
  })
  $('#teacher-form').addEventListener('submit', onTeacherSubmit)
  $('#teacher-dialog-close').addEventListener('click', () => $('#teacher-dialog').close())
  $('#teacher-dialog').addEventListener('click', (event) => {
    if (event.target === $('#teacher-dialog')) $('#teacher-dialog').close()
  })
  $('#points-import').addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (file) importPoints(file)
  })
}

init()
