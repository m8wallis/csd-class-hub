const HINTS = [
  'Two things are locked: the tall cabinet and the desk drawer. Read the trash and the calendar before you guess random numbers.',
  'Cabinet combo = the room number on the door (three digits). Drawer PIN = today’s date as month then day, four digits. The clock and the wifi are decoys.',
  'The computer password is the mascot on the wall plus the period number on the whiteboard. Not FOXES. Not the wifi. Not jersey 23.'
]

const HOTSPOTS = [
  {
    id: 'door',
    label: 'Door',
    left: '3%',
    top: '46%',
    width: '15%',
    height: '18%',
    clue: {
      id: 'room',
      title: 'Room 204',
      text: 'The plate on the door says Computer Lab 204. The lock is still engaged.'
    },
    view: () => {
      return (
        '<p>A metal plate: <strong>COMPUTER LAB 204</strong>.</p>' +
        '<p>A red light on the maglock is on. After-hours mode. The door will not open until the lab computer is signed in.</p>' +
        '<p>Someone taped a leftover visitor sticker underneath: <em>RM 204 · sign in at the computer</em>.</p>'
      )
    }
  },
  {
    id: 'window',
    label: 'Window',
    left: '3%',
    top: '12%',
    width: '15%',
    height: '32%',
    view: () => {
      return (
        '<p>Late-afternoon light. Parking lot, a bird, nothing coded on the glass.</p>' +
        '<p>You could maybe smash it, but this is computer science, not demolition hour.</p>'
      )
    }
  },
  {
    id: 'plant',
    label: 'Plant',
    left: '6%',
    top: '52%',
    width: '8%',
    height: '20%',
    view: () => {
      return (
        '<p>A thirsty fern. The pot says <strong>WATER ME</strong>, which is advice, not a password.</p>' +
        '<p>No hidden slip. Just dirt.</p>'
      )
    }
  },
  {
    id: 'board',
    label: 'Whiteboard',
    left: '21%',
    top: '10%',
    width: '30%',
    height: '32%',
    clue: {
      id: 'period',
      title: 'Period 8 · Sept 15',
      text: 'The whiteboard says Tuesday, Sept 15 and PERIOD 8. Someone crossed out “admin”.'
    },
    view: () => {
      return (
        '<p>Marker still squeaky.</p>' +
        '<p><strong>Tue · Sept 15</strong></p>' +
        '<p><strong>PERIOD 8</strong> in fat red letters.</p>' +
        '<p>Under that: “mascot vote Friday.” In the corner, <s>admin</s> with a big X — a password that already failed.</p>'
      )
    }
  },
  {
    id: 'clock',
    label: 'Clock',
    left: '52%',
    top: '9%',
    width: '8%',
    height: '12%',
    clue: {
      id: 'clock',
      title: 'Clock says 3:14',
      text: 'The wall clock is stuck on 3:14. Looks important. Might not be.'
    },
    view: () => {
      return (
        '<p>It has not moved. <strong>3:14</strong> forever. Pi, if you squint.</p>' +
        '<p>A sticky on the back (you check, of course) says <em>battery dead — leave it</em>.</p>'
      )
    }
  },
  {
    id: 'calendar',
    label: 'Calendar',
    left: '53%',
    top: '23%',
    width: '7%',
    height: '16%',
    clue: {
      id: 'date',
      title: 'September 15 is circled',
      text: 'The wall calendar is September. Day 15 is circled and labeled LAB DAY.'
    },
    view: () => {
      return (
        '<p>September. Most squares are empty. <strong>15</strong> is circled in coral marker.</p>' +
        '<p>Tiny label: <em>LAB DAY</em>.</p>'
      )
    }
  },
  {
    id: 'fox',
    label: 'Poster',
    left: '62%',
    top: '10%',
    width: '13%',
    height: '24%',
    clue: {
      id: 'mascot',
      title: 'Go Foxes',
      text: 'A loud poster on the wall: GO FOXES. That is the school mascot.'
    },
    view: () => {
      return (
        '<p>Spirit-week leftover. A fox. Huge type: <strong>GO FOXES</strong>.</p>' +
        '<p>No smaller print. No numbers. Just the mascot, yelling.</p>'
      )
    }
  },
  {
    id: 'wifi',
    label: 'Wi‑Fi poster',
    left: '76%',
    top: '12%',
    width: '10%',
    height: '16%',
    clue: {
      id: 'wifi',
      title: 'Guest wifi 314159',
      text: 'The teal poster lists LabGuest / 314159. That is for phones, not the locked computer.'
    },
    view: () => {
      return (
        '<p>Guest network for visitors.</p>' +
        '<p><strong>LabGuest</strong></p>' +
        '<p>Password printed underneath: <strong>314159</strong></p>' +
        '<p>A second line in pencil: <em>phones only — not the lab login</em>.</p>'
      )
    }
  },
  {
    id: 'shelf',
    label: 'Books',
    left: '63%',
    top: '38%',
    width: '16%',
    height: '20%',
    clue: {
      id: 'books',
      title: 'Books: 22, 1984, π',
      text: 'The shelf spines show Catch-22, 1984, and a math book with π. Classic red-herring numbers.'
    },
    view: () => {
      return (
        '<p>Three spines facing out like they want to be codes:</p>' +
        '<p><strong>Catch-22</strong> · <strong>1984</strong> · a math book stamped <strong>π</strong>.</p>' +
        '<p>Inside the math book: homework, not a password.</p>'
      )
    }
  },
  {
    id: 'cabinet',
    label: 'Cabinet',
    left: '82%',
    top: '30%',
    width: '15%',
    height: '40%',
    view: (state) => {
      if (state.cabinetOpen) {
        return (
          '<p>The cabinet hangs open. Inside: a USB stick labeled <strong>BACKUP</strong> and a crumpled index card.</p>' +
          '<p>The card: <em>“Last character of the login is which period this is.”</em></p>' +
          '<p>The USB, once you open the files: a sticky-note screenshot saying <strong>Drawer next.</strong></p>'
        )
      }
      return (
        '<p>A tall supply cabinet. Combination lock. Three digits.</p>' +
        '<p>A faded sticker on the latch: <em>not the wifi</em>.</p>' +
        '<form class="lock-row" data-lock="cabinet">' +
        '<label class="sr-only" for="cabinet-code">Cabinet combo</label>' +
        '<input id="cabinet-code" name="code" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="###" />' +
        '<button class="btn btn-small btn-primary" type="submit">Try combo</button>' +
        '</form>' +
        '<p class="inspect-feedback" data-feedback></p>'
      )
    }
  },
  {
    id: 'printer',
    label: 'Printer',
    left: '86%',
    top: '70%',
    width: '10%',
    height: '16%',
    view: () => {
      return (
        '<p>Paper jam, obviously.</p>' +
        '<p>The only full page in the tray is a meeting invite: <em>Counseling office, room 118, 3:00.</em></p>' +
        '<p>Wrong room. Wrong hour. Wrong everything.</p>'
      )
    }
  },
  {
    id: 'computer',
    label: 'Computer',
    left: '35%',
    top: '42%',
    width: '22%',
    height: '28%',
    view: (state) => {
      if (state.won) {
        return '<p>Signed in. The maglock on the door clicked. You are free, Period 8.</p>'
      }
      return (
        '<p>The lab login is waiting. Username is already filled: <strong>period8</strong>.</p>' +
        '<p>A yellow sticky on the bezel: <strong>pwd ≠ wifi</strong>.</p>' +
        '<form class="lock-row" data-lock="computer">' +
        '<label class="sr-only" for="computer-code">Password</label>' +
        '<input id="computer-code" name="code" type="text" maxlength="16" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="PASSWORD" />' +
        '<button class="btn btn-small btn-primary" type="submit">Sign in</button>' +
        '</form>' +
        '<p class="inspect-feedback" data-feedback></p>'
      )
    }
  },
  {
    id: 'photo',
    label: 'Photo',
    left: '25%',
    top: '56%',
    width: '8%',
    height: '12%',
    view: () => {
      return (
        '<p>A cheap frame. Last year’s spirit photo. Kids in orange. Caption in the corner: <strong>CSD Foxes</strong>.</p>' +
        '<p>Same mascot as the poster. No extra numbers.</p>'
      )
    }
  },
  {
    id: 'mug',
    label: 'Mug',
    left: '57%',
    top: '60%',
    width: '7%',
    height: '10%',
    view: () => {
      return '<p>World’s Okayest Teacher. Cold coffee. Nothing under it but a coffee ring.</p>'
    }
  },
  {
    id: 'drawer',
    label: 'Drawer',
    left: '23%',
    top: '75%',
    width: '18%',
    height: '12%',
    view: (state) => {
      if (state.drawerOpen) {
        return (
          '<p>Inside: paper clips, a dead battery, and one useful card.</p>' +
          '<p><strong>Login = mascot + period.</strong></p>' +
          '<p>Underlined twice: <em>Look at the walls. Ignore the wifi poster.</em></p>'
        )
      }
      return (
        '<p>The desk drawer has a four-digit PIN pad.</p>' +
        '<p>Tape on the underside (you check): <strong>PIN = today’s date MMDD</strong>.</p>' +
        '<form class="lock-row" data-lock="drawer">' +
        '<label class="sr-only" for="drawer-code">Drawer PIN</label>' +
        '<input id="drawer-code" name="code" inputmode="numeric" maxlength="5" autocomplete="off" placeholder="MMDD" />' +
        '<button class="btn btn-small btn-primary" type="submit">Try PIN</button>' +
        '</form>' +
        '<p class="inspect-feedback" data-feedback></p>'
      )
    }
  },
  {
    id: 'chair',
    label: 'Jersey',
    left: '72%',
    top: '66%',
    width: '12%',
    height: '24%',
    clue: {
      id: 'jersey',
      title: 'Jersey number 23',
      text: 'A basketball jersey on the chair is number 23. It looks like a code. It is just gym clothes.'
    },
    view: () => {
      return (
        '<p>Someone left a rec-league jersey on the chair. Big <strong>23</strong>.</p>' +
        '<p>Pockets empty. Smells like gym. Not a clue unless you want it to be, which you should not.</p>'
      )
    }
  },
  {
    id: 'trash',
    label: 'Trash',
    left: '8%',
    top: '72%',
    width: '8%',
    height: '16%',
    clue: {
      id: 'trash',
      title: 'Trash note about the combo',
      text: 'A crumpled note in the trash: “Forgot the cabinet combo so I used the room #.”'
    },
    view: () => {
      return (
        '<p>Mostly wrappers. One crumpled sticky, still readable:</p>' +
        '<p><strong>Forgot the cabinet combo so I used the room #.</strong></p>' +
        '<p>Then, smaller: <em>don’t tell Rivera.</em></p>'
      )
    }
  },
  {
    id: 'bag',
    label: 'Backpack',
    left: '14%',
    top: '78%',
    width: '10%',
    height: '14%',
    view: () => {
      return (
        '<p>A backpack that is not yours. Planner open to a page of doodles: 314, 23, password123 — all scribbled out.</p>' +
        '<p>A bag of chips. Not a prize. Stay focused.</p>'
      )
    }
  }
]

const EXTRA_CLUES = {
  cabinet: {
    id: 'usb',
    title: 'USB + period hint',
    text: 'Inside the cabinet: “Last character of the login is which period this is.” A file on the USB says Drawer next.'
  },
  drawer: {
    id: 'formula',
    title: 'Login formula',
    text: 'The drawer card says: login = mascot + period. Look at the walls. Ignore the wifi poster.'
  },
  pin: {
    id: 'pin',
    title: 'Drawer PIN format',
    text: 'Tape under the drawer: PIN = today’s date as MMDD.'
  }
}

function createState() {
  return {
    started: false,
    startedAt: 0,
    elapsed: 0,
    inspected: {},
    clues: {},
    cabinetOpen: false,
    drawerOpen: false,
    won: false,
    hintIndex: 0,
    current: '',
    tick: null
  }
}

let state = createState()

function $(sel, root) {
  return (root || document).querySelector(sel)
}

function $all(sel, root) {
  return Array.from((root || document).querySelectorAll(sel))
}

function hotspotById(id) {
  return HOTSPOTS.find(function (item) {
    return item.id === id
  })
}

function addClue(clue) {
  if (!clue || state.clues[clue.id]) return
  state.clues[clue.id] = clue
  renderNotebook()
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000)
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return m + ':' + s
}

function setOverlayOpen(open) {
  document.body.classList.toggle('has-overlay', open)
}

function startTimer() {
  if (state.tick) clearInterval(state.tick)
  state.startedAt = Date.now()
  state.tick = setInterval(function () {
    if (state.won) return
    state.elapsed = Date.now() - state.startedAt
    $('#timer').textContent = formatTime(state.elapsed)
  }, 250)
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function normalizePass(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

function computerMessage(code) {
  if (code === 'FOX8') return 'ok'
  if (code === 'FOX' || code === 'FOXES') {
    return 'Mascot is right. You still need the period number from the whiteboard.'
  }
  if (code === 'FOXES8') return 'Too many letters. Just the mascot word, then the period.'
  if (code === '8' || code === 'PERIOD8' || code === 'P8') {
    return 'Period is right. The first part is on a poster, not the keyboard.'
  }
  if (code === '314159' || code === 'LABGUEST' || code === 'WIFI') {
    return 'That is the guest wifi. The sticky on the monitor already warned you.'
  }
  if (code === '314' || code === '3:14' || code === 'PI') {
    return 'The clock is decorative. And dead.'
  }
  if (code === '23' || code === 'JERSEY23') return 'That jersey is gym clothes, not a login.'
  if (code === '204' || code === 'FOX204' || code === 'LAB204') {
    return '204 opens the cabinet, not the computer.'
  }
  if (code === '0915' || code === '915' || code === 'SEPT15') {
    return 'That is a drawer PIN. The computer wants a word plus a number.'
  }
  if (code === 'ADMIN' || code === 'PASSWORD' || code === 'PASSWORD123') {
    return 'Already tried. The whiteboard even crossed it out.'
  }
  if (code === '1984' || code === '22' || code === 'CATCH22') {
    return 'Nice books. Wrong login.'
  }
  return 'Nope. Look at the walls, then connect two true things.'
}

function tryLock(kind, raw) {
  const feedback = $('[data-feedback]')
  if (kind === 'cabinet') {
    const code = digits(raw)
    if (code === '204') {
      state.cabinetOpen = true
      addClue(EXTRA_CLUES.cabinet)
      $('#cabinet-prop').classList.add('is-open')
      renderProgress()
      renderLookList()
      inspect('cabinet')
      return
    }
    if (feedback) {
      feedback.className = 'inspect-feedback is-bad'
      feedback.textContent =
        code === '314' || code === '314159'
          ? 'Not the clock. Not the wifi. Check the door.'
          : 'Wrong combo. Three digits. Start with the door.'
    }
    return
  }

  if (kind === 'drawer') {
    const code = digits(raw)
    if (code === '0915' || code === '915') {
      state.drawerOpen = true
      addClue(EXTRA_CLUES.drawer)
      $('#drawer-prop').classList.add('is-open')
      renderProgress()
      renderLookList()
      inspect('drawer')
      return
    }
    if (feedback) {
      feedback.className = 'inspect-feedback is-bad'
      feedback.textContent =
        code === '1509'
          ? 'Close — month first, then day.'
          : 'Wrong PIN. Four digits. The calendar is yelling the date.'
    }
    return
  }

  if (kind === 'computer') {
    const code = normalizePass(raw)
    const msg = computerMessage(code)
    if (msg === 'ok') {
      win()
      return
    }
    if (feedback) {
      feedback.className = 'inspect-feedback is-bad'
      feedback.textContent = msg
    }
  }
}

function win() {
  state.won = true
  state.elapsed = Date.now() - state.startedAt
  if (state.tick) clearInterval(state.tick)
  $('#timer').textContent = formatTime(state.elapsed)
  $('#computer-prop').classList.add('is-unlocked')
  $('.prop-door .door-lock').textContent = 'OPEN'
  $('.scene').classList.add('is-escaped')
  renderProgress()
  inspect('computer')
  const minutes = Math.max(1, Math.round(state.elapsed / 60000))
  $('#win-time').textContent =
    'Signed in after ' + formatTime(state.elapsed) + ' (' + minutes + ' min).'
  $('#win').classList.add('is-open')
  setOverlayOpen(true)
}

function inspect(id) {
  const item = hotspotById(id)
  if (!item) return
  state.current = id
  state.inspected[id] = true
  if (item.clue) addClue(item.clue)
  if (id === 'drawer' && !state.drawerOpen) addClue(EXTRA_CLUES.pin)

  $('#inspect-kicker').textContent = 'Inspect'
  $('#inspect-title').textContent = item.label
  $('#inspect-body').innerHTML = item.view(state)

  $all('.hotspot').forEach(function (btn) {
    btn.classList.toggle('is-active', btn.dataset.id === id)
  })
  renderLookList()

  const input = $('#inspect-body input')
  if (input) input.focus()
}

function renderLookList() {
  const wrap = $('#look-list')
  wrap.innerHTML = HOTSPOTS.map(function (item) {
    const seen = state.inspected[item.id] ? ' is-seen' : ''
    const opened =
      (item.id === 'cabinet' && state.cabinetOpen) ||
      (item.id === 'drawer' && state.drawerOpen) ||
      (item.id === 'computer' && state.won)
        ? ' is-open-item'
        : ''
    const current = item.id === state.current ? ' aria-current="true"' : ''
    return (
      '<button type="button" data-id="' +
      item.id +
      '" class="' +
      (seen + opened).trim() +
      '"' +
      current +
      '>' +
      item.label +
      '</button>'
    )
  }).join('')
}

function renderHotspots() {
  $('#hotspots').innerHTML = HOTSPOTS.map(function (item) {
    return (
      '<button class="hotspot" type="button" data-id="' +
      item.id +
      '" data-label="' +
      item.label +
      '" style="left:' +
      item.left +
      ';top:' +
      item.top +
      ';width:' +
      item.width +
      ';height:' +
      item.height +
      '" aria-label="' +
      item.label +
      '"></button>'
    )
  }).join('')
}

function renderNotebook() {
  const list = $('#clue-list')
  const clues = Object.keys(state.clues).map(function (id) {
    return state.clues[id]
  })
  if (!clues.length) {
    list.innerHTML = '<li class="clue-empty">Nothing in the notebook yet. Start clicking.</li>'
    return
  }
  list.innerHTML = clues
    .map(function (clue) {
      return '<li><strong>' + clue.title + '</strong><p>' + clue.text + '</p></li>'
    })
    .join('')
}

function renderProgress() {
  $all('#progress-list li').forEach(function (li) {
    const flag = li.getAttribute('data-flag')
    li.classList.toggle('is-done', Boolean(state[flag]))
  })
}

function showHint() {
  const banner = $('#hint-banner')
  const next = Math.min(state.hintIndex, HINTS.length - 1)
  banner.hidden = false
  banner.textContent = 'Hint ' + (next + 1) + ': ' + HINTS[next]
  if (state.hintIndex < HINTS.length - 1) state.hintIndex += 1
}

function resetGame() {
  if (state.tick) clearInterval(state.tick)
  state = createState()
  $('#timer').textContent = '00:00'
  $('#hint-banner').hidden = true
  $('#hint-banner').textContent = ''
  $('#win').classList.remove('is-open')
  $('#intro').classList.add('is-open')
  setOverlayOpen(true)
  $('#cabinet-prop').classList.remove('is-open')
  $('#drawer-prop').classList.remove('is-open')
  $('#computer-prop').classList.remove('is-unlocked')
  $('.scene').classList.remove('is-escaped')
  $('.prop-door .door-lock').textContent = 'LOCKED'
  $('#inspect-title').textContent = 'Pick something'
  $('#inspect-body').innerHTML =
    '<p>Click an object in the lab — or a name in the list — and the details show up here. Useful clues get copied into the notebook below.</p>'
  renderLookList()
  renderNotebook()
  renderProgress()
}

function startGame() {
  state.started = true
  $('#intro').classList.remove('is-open')
  setOverlayOpen(false)
  startTimer()
}

function onInspectClick(event) {
  const btn = event.target.closest('[data-id]')
  if (!btn || !btn.dataset.id) return
  inspect(btn.dataset.id)
}

function onInspectSubmit(event) {
  const form = event.target.closest('form[data-lock]')
  if (!form) return
  event.preventDefault()
  const input = form.querySelector('input')
  tryLock(form.getAttribute('data-lock'), input ? input.value : '')
}

function init() {
  renderHotspots()
  renderLookList()
  renderNotebook()
  renderProgress()

  $('#hotspots').addEventListener('click', onInspectClick)
  $('#look-list').addEventListener('click', onInspectClick)
  $('#inspect').addEventListener('submit', onInspectSubmit)
  $('#start-btn').addEventListener('click', startGame)
  $('#hint-btn').addEventListener('click', showHint)
  $('#reset-btn').addEventListener('click', resetGame)
  $('#play-again-btn').addEventListener('click', resetGame)
  setOverlayOpen(true)
}

init()
