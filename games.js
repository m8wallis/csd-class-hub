const ROUNDS = [
  {
    fact: "color = 'red'",
    code: "if (color === 'red') {\n  left door\n} else {\n  right door\n}",
    yes: true,
    why: "color is 'red', so the condition is true. The if door is the one."
  },
  {
    fact: 'points = 8',
    code: 'if (points >= 10) {\n  left door\n} else {\n  right door\n}',
    yes: false,
    why: '8 is not at least 10, so the condition is false. Skip if and take else.'
  },
  {
    fact: 'ready = true',
    code: 'if (ready) {\n  left door\n} else {\n  right door\n}',
    yes: true,
    why: 'ready is true, so the if door opens. Else waits for a false answer.'
  },
  {
    fact: "snack = 'candy'",
    code: "if (snack === 'chips') {\n  left door\n} else {\n  right door\n}",
    yes: false,
    why: "snack is 'candy', not 'chips'. The condition is false, so take else."
  },
  {
    fact: 'lives = 3',
    code: 'if (lives > 0) {\n  left door\n} else {\n  right door\n}',
    yes: true,
    why: '3 is greater than 0. The condition is true. Take the if door.'
  },
  {
    fact: 'hour = 9',
    code: 'if (hour < 8) {\n  left door\n} else {\n  right door\n}',
    yes: false,
    why: '9 is not less than 8. The condition is false, so the else door is right.'
  },
  {
    fact: 'winner = false',
    code: 'if (winner) {\n  left door\n} else {\n  right door\n}',
    yes: false,
    why: 'winner is false. If does not run. Else does.'
  },
  {
    fact: 'score = 12',
    code: 'if (score >= 10) {\n  left door\n} else {\n  right door\n}',
    yes: true,
    why: '12 is at least 10. The condition is true. Walk through if.'
  }
]

const game = {
  index: 0,
  correct: 0,
  busy: false,
  over: false
}

function $(sel) {
  return document.querySelector(sel)
}

function renderRound() {
  const round = ROUNDS[game.index]
  $('#game-fact').textContent = round.fact
  $('#game-code').textContent = round.code
  $('#game-progress').textContent = 'Round ' + (game.index + 1) + ' of ' + ROUNDS.length
  $('#door-if').classList.remove('is-right', 'is-wrong')
  $('#door-else').classList.remove('is-right', 'is-wrong')
  $('#game-bot').classList.remove('is-left', 'is-right', 'is-bump')
}

function finish() {
  game.over = true
  $('#game-fact').textContent = game.correct + ' of ' + ROUNDS.length
  $('#game-code').textContent = 'if (you followed the rule) {\n  nice\n} else {\n  read the facts again\n}'
  $('#game-progress').textContent = 'Done'
  $('#game-status').textContent = 'That is if and else. Press Play again to walk the doors once more.'
}

function choose(branch) {
  if (game.busy || game.over) return
  const round = ROUNDS[game.index]
  const right = round.yes ? 'if' : 'else'
  const ok = branch === right
  game.busy = true
  if (ok) game.correct += 1
  const bot = $('#game-bot')
  bot.classList.remove('is-bump')
  bot.classList.add(branch === 'if' ? 'is-left' : 'is-right')
  $('#door-if').classList.toggle('is-right', right === 'if')
  $('#door-else').classList.toggle('is-right', right === 'else')
  if (!ok) {
    $('#door-' + branch).classList.add('is-wrong')
    bot.classList.add('is-bump')
  }
  $('#game-status').textContent = (ok ? 'Yes. ' : 'Not that door. ') + round.why
  window.setTimeout(() => {
    game.busy = false
    game.index += 1
    if (game.index >= ROUNDS.length) finish()
    else renderRound()
  }, 1100)
}

function restart() {
  game.index = 0
  game.correct = 0
  game.busy = false
  game.over = false
  $('#game-status').textContent = 'Left arrow is if. Right arrow is else.'
  renderRound()
}

function onKey(event) {
  if (!event.key.startsWith('Arrow')) return
  const inDoors = event.target.closest && event.target.closest('#if-else')
  if (inDoors) {
    event.preventDefault()
    if (event.key === 'ArrowLeft') choose('if')
    if (event.key === 'ArrowRight') choose('else')
    return
  }
  event.preventDefault()
  moveQuest(event.key)
}

$('#door-if').addEventListener('click', () => choose('if'))
$('#door-else').addEventListener('click', () => choose('else'))
$('#game-restart').addEventListener('click', restart)
window.addEventListener('keydown', onKey)
renderRound()

const QUEST_ROWS = [
  '########################',
  '#@.....................#',
  '#......................#',
  '#..k....##........g....#',
  '#.......##.............#',
  '#......................#',
  '#....##..........##....#',
  '#....##....b.....##....#',
  '#......................#',
  '#......................#',
  '#......................#',
  '#......................#',
  '############DD##########',
  '#......................#',
  '#....w.................#',
  '#.................e....#',
  '#.................X....#',
  '########################'
]

const quest = {
  grid: [],
  x: 1,
  y: 1,
  facing: 'down',
  hasKey: false,
  hasGem: false,
  hasBook: false,
  hasSword: false,
  won: false
}

function freshQuest() {
  quest.grid = QUEST_ROWS.map((row) => row.split(''))
  quest.facing = 'down'
  quest.hasKey = false
  quest.hasGem = false
  quest.hasBook = false
  quest.hasSword = false
  quest.won = false
  for (let y = 0; y < quest.grid.length; y += 1) {
    const x = quest.grid[y].indexOf('@')
    if (x !== -1) {
      quest.x = x
      quest.y = y
      quest.grid[y][x] = '.'
    }
  }
}

function tileAt(x, y) {
  if (y < 0 || x < 0 || y >= quest.grid.length || x >= quest.grid[0].length) return '#'
  return quest.grid[y][x]
}

function gearReady() {
  return quest.hasKey && quest.hasGem && quest.hasBook
}

function questCode() {
  if (quest.hasSword || quest.y >= 13) {
    return 'if (hasSword) {\n  defeat the enemy\n} else {\n  the enemy blocks the path\n}'
  }
  return 'if (hasKey && hasGem && hasBook) {\n  door opens\n} else {\n  door stays shut\n}'
}

function renderQuest() {
  const cols = quest.grid[0].length
  const rows = quest.grid.length
  const grid = $('#quest-grid')
  const map = $('#quest-map')
  map.style.aspectRatio = cols + ' / ' + rows
  grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'
  grid.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)'
  grid.innerHTML = quest.grid
    .map((row) => row.map((ch) => {
      let kind = 'grass'
      if (ch === '#') kind = 'wall'
      else if (ch === 'k') kind = 'grass item key'
      else if (ch === 'g') kind = 'grass item gem'
      else if (ch === 'b') kind = 'grass item book'
      else if (ch === 'D') kind = gearReady() ? 'door open' : 'door'
      else if (ch === 'w') kind = 'grass item sword'
      else if (ch === 'e') kind = 'enemy'
      else if (ch === 'X') kind = 'goal'
      return `<div class='tile ${kind}'></div>`
    }).join(''))
    .join('')
  const player = $('#quest-player')
  player.style.width = 100 / cols + '%'
  player.style.height = 100 / rows + '%'
  player.style.left = (quest.x / cols) * 100 + '%'
  player.style.top = (quest.y / rows) * 100 + '%'
  player.className = 'quest-player face-' + quest.facing + (quest.hasSword ? ' armed' : '')
  $('#quest-facts').textContent =
    'hasKey = ' + quest.hasKey +
    '\nhasGem = ' + quest.hasGem +
    '\nhasBook = ' + quest.hasBook +
    '\nhasSword = ' + quest.hasSword
  $('#quest-code').textContent = questCode()
  $('#quest-where').textContent = quest.won
    ? 'The end'
    : quest.y >= 13
      ? 'Past the door'
      : 'Find three things'
}

function questSay(text) {
  $('#quest-status').textContent = text
}

function moveQuest(key) {
  if (quest.won) return
  const step = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }[key]
  if (!step) return
  quest.facing = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  }[key]
  const x = quest.x + step[0]
  const y = quest.y + step[1]
  const tile = tileAt(x, y)
  if (tile === '#') {
    renderQuest()
    return
  }
  if (tile === 'D' && !gearReady()) {
    const missing = []
    if (!quest.hasKey) missing.push('key')
    if (!quest.hasGem) missing.push('gem')
    if (!quest.hasBook) missing.push('book')
    questSay('else runs. The door stays shut until you have the ' + missing.join(', ') + '.')
    renderQuest()
    return
  }
  if (tile === 'e' && !quest.hasSword) {
    questSay('hasSword is false, so else runs. The enemy blocks the path. Get the sword first.')
    renderQuest()
    return
  }
  quest.x = x
  quest.y = y
  if (tile === 'k') {
    quest.hasKey = true
    quest.grid[y][x] = '.'
    questSay('Key collected. hasKey is true.')
  } else if (tile === 'g') {
    quest.hasGem = true
    quest.grid[y][x] = '.'
    questSay('Gem collected. hasGem is true.')
  } else if (tile === 'b') {
    quest.hasBook = true
    quest.grid[y][x] = '.'
    questSay('Book collected. hasBook is true.')
  } else if (tile === 'D') {
    questSay('hasKey, hasGem, and hasBook are all true, so if runs. The door opens.')
  } else if (tile === 'w') {
    quest.hasSword = true
    quest.grid[y][x] = '.'
    questSay('You took the sword. hasSword is true, so you can face the enemy.')
  } else if (tile === 'e') {
    quest.grid[y][x] = '.'
    questSay('hasSword is true, so if runs. The enemy is defeated.')
  } else if (tile === 'X') {
    quest.won = true
    questSay('The path is clear. Key, gem, and book opened the door. The sword cleared the enemy.')
  }
  renderQuest()
}

document.querySelector('.quest-pad').addEventListener('click', (event) => {
  const btn = event.target.closest('[data-move]')
  if (!btn) return
  moveQuest(btn.getAttribute('data-move'))
})
$('#quest-restart').addEventListener('click', () => {
  freshQuest()
  questSay('Arrow keys move. Collect the key, the gem, and the book.')
  renderQuest()
})
freshQuest()
renderQuest()
