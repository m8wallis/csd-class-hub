const VALUES = [
  {
    id: 'string',
    label: 'String',
    name: 'snack',
    value: "'chips'",
    printed: 'chips',
    hint: 'A string is text. The quotes tell JavaScript these letters are words, not code.'
  },
  {
    id: 'number',
    label: 'Number',
    name: 'score',
    value: '12',
    printed: '12',
    hint: 'A number has no quotes. You can add it, compare it, and count with it.'
  },
  {
    id: 'boolean',
    label: 'Boolean',
    name: 'ready',
    value: 'true',
    printed: 'true',
    hint: 'A boolean is only true or false. Conditions in if use this kind of answer.'
  }
]

const FUNCTIONS = [
  {
    id: 'greet',
    label: 'greet',
    inputLabel: 'Name',
    sample: 'CSD',
    explain: 'greet takes a name and returns a sentence. The parameter is name. return sends the sentence back.',
    code: function (input) {
      const name = input || 'CSD'
      return {
        source:
          'function greet(name) {\n' +
          "  return 'Hi, ' + name + '.'\n" +
          '}\n\n' +
          "greet('" + name.replaceAll("'", '') + "')",
        result: 'Hi, ' + name + '.'
      }
    }
  },
  {
    id: 'double',
    label: 'double',
    inputLabel: 'Number',
    sample: '6',
    explain: 'double takes a number and returns that number times 2. The call is double(6). The return value is 12.',
    code: function (input) {
      const n = Number(input)
      const safe = Number.isFinite(n) ? n : 0
      return {
        source: 'function double(n) {\n  return n * 2\n}\n\ndouble(' + safe + ')',
        result: String(safe * 2)
      }
    }
  },
  {
    id: 'prize',
    label: 'prize',
    inputLabel: 'Points',
    sample: '12',
    explain: 'prize asks a yes-or-no question: are the points at least 10? It returns true or false.',
    code: function (input) {
      const n = Number(input)
      const safe = Number.isFinite(n) ? n : 0
      return {
        source: 'function prize(points) {\n  return points >= 10\n}\n\nprize(' + safe + ')',
        result: String(safe >= 10)
      }
    }
  }
]

const SCORES = [
  { id: '4', label: '4', score: 4 },
  { id: '9', label: '9', score: 9 },
  { id: '10', label: '10', score: 10 },
  { id: '15', label: '15', score: 15 }
]

const TRY_SNIPPETS = [
  {
    id: 'log',
    label: 'Log',
    code: "console.log('Hello, class.')\nconsole.log(2 + 2)"
  },
  {
    id: 'variable',
    label: 'Variable',
    code: 'let points = 5\npoints = points + 3\nconsole.log(points)'
  },
  {
    id: 'function',
    label: 'Function',
    code: "function greet(name) {\n  return 'Hi, ' + name + '.'\n}\n\nconsole.log(greet('CSD'))"
  },
  {
    id: 'if',
    label: 'If',
    code: 'let score = 12\nif (score >= 10) {\n  console.log(\'Prize time.\')\n} else {\n  console.log(\'Keep earning.\')\n}'
  },
  {
    id: 'click',
    label: 'Click',
    code: "const button = document.querySelector('button')\nbutton.addEventListener('click', function () {\n  console.log('Clicked!')\n  button.textContent = 'Nice.'\n})"
  },
  {
    id: 'array',
    label: 'Array',
    code: "const snacks = ['chips', 'candy', 'soda']\nconsole.log(snacks[0])\nconsole.log(snacks.length)"
  },
  {
    id: 'object',
    label: 'Object',
    code: "const student = {\n  name: 'Zayan',\n  points: 12\n}\n\nconsole.log(student.name)\nconsole.log(student.points)"
  },
  {
    id: 'loop',
    label: 'Loop',
    code: "const snacks = ['chips', 'candy', 'soda']\n\nfor (let i = 0; i < snacks.length; i = i + 1) {\n  console.log(snacks[i])\n}"
  }
]

const PAGE_HTML =
  '<p id="message">The page is waiting.</p>\n<button type="button">Click me</button>'

const jsState = {
  valueId: 'string',
  valuePart: 'value',
  points: 5,
  lastDelta: 0,
  fnId: 'greet',
  scoreId: '9',
  arrayIndex: 0,
  objectKey: 'name',
  loopStep: 0
}

const SNACKS = ['chips', 'candy', 'soda']

const STUDENT = [
  { key: 'name', value: 'Zayan', shown: "'Zayan'" },
  { key: 'points', value: '12', shown: '12' },
  { key: 'ready', value: 'true', shown: 'true' }
]

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

function renderChips(el, rows, selected, attr) {
  el.innerHTML = rows
    .map((row) => {
      const on = row.id === selected ? ' is-on' : ''
      return `<button class='filter-btn${on}' type='button' ${attr}='${row.id}'>${escapeHtml(row.label)}</button>`
    })
    .join('')
}

function currentValue() {
  return VALUES.find((row) => row.id === jsState.valueId) || VALUES[0]
}

function currentFn() {
  return FUNCTIONS.find((row) => row.id === jsState.fnId) || FUNCTIONS[0]
}

function renderValueStation() {
  const example = currentValue()
  const part = jsState.valuePart
  renderChips($('#value-chips'), VALUES, example.id, 'data-value')

  const bits = [
    { id: 'let', text: 'let' },
    { id: 'name', text: example.name },
    { id: 'eq', text: '=' },
    { id: 'value', text: example.value }
  ]
  $('#value-sandwich').innerHTML = bits
    .map((row) => {
      const mapped = row.id === 'eq' ? '' : row.id
      const on = mapped && mapped === part ? ' is-on' : ''
      const attr = mapped ? ` data-part='${mapped}'` : ''
      const kind = mapped || 'mark'
      return `<button class='tag-piece${on}' type='button' data-kind='${kind}'${attr}>${escapeHtml(row.text)}</button>`
    })
    .join('')

  $('#value-caption').innerHTML = [
    '<span data-cap="let">let</span>',
    '<span data-cap="name">name</span>',
    '<span data-cap="value">value</span>'
  ].join('')
  $('#value-caption')
    .querySelectorAll('[data-cap]')
    .forEach((el) => el.classList.toggle('is-on', el.getAttribute('data-cap') === part))

  $('#value-code').innerHTML =
    `<span class='code-tag'>let</span> <span class='code-attr'>${escapeHtml(example.name)}</span> = ` +
    `<span class='code-val'>${escapeHtml(example.value)}</span>\n` +
    `<span class='code-attr'>console</span>.<span class='code-attr'>log</span>(<span class='code-attr'>${escapeHtml(example.name)}</span>)`

  let explain = example.hint
  if (part === 'let') {
    explain = 'let creates a variable — a labeled box — and gets it ready to store this value.'
  } else if (part === 'name') {
    explain = example.name + ' is the label on the box. Later lines use this name to read what is inside.'
  } else if (part === 'value') {
    explain = example.hint
  }
  $('#value-explain').textContent = explain
  $('#value-console').textContent = example.printed
}

function initValues() {
  $('#value-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-value]')
    if (!btn) return
    jsState.valueId = btn.getAttribute('data-value')
    renderValueStation()
  })
  $('#value-sandwich').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-part]')
    if (!btn) return
    jsState.valuePart = btn.getAttribute('data-part')
    renderValueStation()
  })
  renderValueStation()
}

function renderVarStation() {
  const points = jsState.points
  const delta = jsState.lastDelta
  $('#var-readout').textContent = String(points)
  let step = 'let points = ' + points
  if (delta === 1) step = 'let points = ' + (points - 1) + '\npoints = points + 1'
  if (delta === -1) step = 'let points = ' + (points + 1) + '\npoints = points - 1'
  $('#var-code').innerHTML =
    escapeHtml(step + '\nconsole.log(points)')
      .replace('let', "<span class='code-tag'>let</span>")
      .replaceAll('points', "<span class='code-attr'>points</span>")
  $('#var-console').textContent = String(points)
  $('#var-explain').textContent =
    delta === 0
      ? 'points is the name. 5 is the value stored in the box. console.log prints whatever is inside right now.'
      : delta > 0
        ? 'points = points + 1 reads the current number, adds 1, and stores the new number back in the same box.'
        : 'points = points - 1 reads the current number, subtracts 1, and stores the new number back in the same box.'
}

function initVars() {
  document.querySelector('[data-var]').parentElement.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-var]')
    if (!btn) return
    const action = btn.getAttribute('data-var')
    if (action === 'reset') {
      jsState.points = 5
      jsState.lastDelta = 0
    } else {
      const delta = Number(action)
      jsState.points = Math.max(0, jsState.points + delta)
      jsState.lastDelta = delta
    }
    renderVarStation()
  })
  renderVarStation()
}

function renderFnStation() {
  const fn = currentFn()
  renderChips($('#fn-chips'), FUNCTIONS, fn.id, 'data-fn')
  $('#fn-input-label').textContent = fn.inputLabel
  const built = fn.code($('#fn-input').value)
  $('#fn-code').innerHTML = window.CSD_HIGHLIGHT.js(built.source)
  $('#fn-console').textContent = built.result
  $('#fn-explain').textContent = fn.explain
}

function initFns() {
  $('#fn-input').value = currentFn().sample
  $('#fn-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-fn]')
    if (!btn) return
    jsState.fnId = btn.getAttribute('data-fn')
    $('#fn-input').value = currentFn().sample
    renderFnStation()
  })
  $('#fn-input').addEventListener('input', renderFnStation)
  renderFnStation()
}

function renderIfStation() {
  const row = SCORES.find((item) => item.id === jsState.scoreId) || SCORES[1]
  renderChips($('#if-chips'), SCORES, row.id, 'data-score')
  const yes = row.score >= 10
  const message = yes ? 'Prize time.' : 'Keep earning.'
  const code =
    'let score = ' +
    row.score +
    '\n' +
    'if (score >= 10) {\n' +
    "  console.log('Prize time.')\n" +
    '} else {\n' +
    "  console.log('Keep earning.')\n" +
    '}'
  $('#if-code').innerHTML = window.CSD_HIGHLIGHT.js(code)
  $('#if-console').innerHTML =
    `<span class='${yes ? 'if-yes' : 'if-no'}'>${escapeHtml(message)}</span>`
  $('#if-explain').textContent = yes
    ? row.score + ' is at least 10, so the condition is true. JavaScript runs the if block and skips else.'
    : row.score + ' is below 10, so the condition is false. JavaScript skips if and runs the else block.'
}

function renderArrayStation() {
  const index = jsState.arrayIndex
  $('#array-slots').innerHTML = SNACKS.map((item, i) => {
    const on = i === index ? ' is-on' : ''
    return `<button class='js-slot${on}' type='button' data-index='${i}'><span>${i}</span><strong>${escapeHtml(item)}</strong></button>`
  }).join('')
  const code =
    "const snacks = ['chips', 'candy', 'soda']\n" +
    'console.log(snacks[' +
    index +
    '])\n' +
    'console.log(snacks.length)'
  $('#array-code').innerHTML = window.CSD_HIGHLIGHT.js(code)
  $('#array-console').textContent = SNACKS[index] + '\n' + SNACKS.length
  $('#array-explain').textContent =
    'Index ' +
    index +
    ' is ' +
    SNACKS[index] +
    '. Counting starts at 0, so the last item is index ' +
    (SNACKS.length - 1) +
    '. length is ' +
    SNACKS.length +
    ', the number of items.'
}

function initArrays() {
  $('#array-slots').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-index]')
    if (!btn) return
    jsState.arrayIndex = Number(btn.getAttribute('data-index'))
    renderArrayStation()
  })
  renderArrayStation()
}

function renderObjectStation() {
  const prop = STUDENT.find((row) => row.key === jsState.objectKey) || STUDENT[0]
  $('#object-keys').innerHTML = STUDENT.map((row) => {
    const on = row.key === prop.key ? ' is-on' : ''
    return `<button class='js-slot${on}' type='button' data-key='${row.key}'><span>${escapeHtml(row.key)}</span><strong>${escapeHtml(row.value)}</strong></button>`
  }).join('')
  const code =
    'const student = {\n' +
    "  name: 'Zayan',\n" +
    '  points: 12,\n' +
    '  ready: true\n' +
    '}\n\n' +
    'console.log(student.' +
    prop.key +
    ')'
  $('#object-code').innerHTML = window.CSD_HIGHLIGHT.js(code)
  $('#object-console').textContent = prop.value
  $('#object-explain').textContent =
    'student.' +
    prop.key +
    ' reads the ' +
    prop.key +
    ' property. The name is the label. The value after the colon is what is stored there.'
}

function initObjects() {
  $('#object-keys').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-key]')
    if (!btn) return
    jsState.objectKey = btn.getAttribute('data-key')
    renderObjectStation()
  })
  renderObjectStation()
}

function renderLoopStation() {
  const step = jsState.loopStep
  $('#loop-slots').innerHTML = SNACKS.map((item, i) => {
    const on = step > 0 && i === step - 1 ? ' is-on' : ''
    return `<button class='js-slot${on}' type='button' data-loop-index='${i}'><span>${i}</span><strong>${escapeHtml(item)}</strong></button>`
  }).join('')
  const code =
    "const snacks = ['chips', 'candy', 'soda']\n\n" +
    'for (let i = 0; i < snacks.length; i = i + 1) {\n' +
    '  console.log(snacks[i])\n' +
    '}'
  $('#loop-code').innerHTML = window.CSD_HIGHLIGHT.js(code)
  if (step === 0) {
    $('#loop-console').textContent = 'Press next. The loop has not started.'
    $('#loop-explain').textContent =
      'i starts at 0. The loop keeps going while i is less than snacks.length, which is 3. Each pass logs snacks[i], then adds 1 to i.'
    return
  }
  const logged = SNACKS.slice(0, step)
  $('#loop-console').textContent = logged.join('\n')
  if (step < SNACKS.length) {
    $('#loop-explain').textContent =
      'i is ' +
      (step - 1) +
      ', so snacks[i] is ' +
      SNACKS[step - 1] +
      '. Next, i becomes ' +
      step +
      '. ' +
      step +
      ' is still less than ' +
      SNACKS.length +
      ', so the loop runs again.'
  } else {
    $('#loop-explain').textContent =
      'i is ' +
      step +
      ' after the last item. ' +
      step +
      ' is not less than ' +
      SNACKS.length +
      ', so the loop stops. Every item was logged once.'
  }
}

function initLoops() {
  $('#loop-slots').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-loop-index]')
    if (!btn) return
    jsState.loopStep = Number(btn.getAttribute('data-loop-index')) + 1
    renderLoopStation()
  })
  $('#loop-next').addEventListener('click', () => {
    jsState.loopStep = Math.min(SNACKS.length, jsState.loopStep + 1)
    renderLoopStation()
  })
  $('#loop-reset').addEventListener('click', () => {
    jsState.loopStep = 0
    renderLoopStation()
  })
  renderLoopStation()
}

function initIf() {
  $('#if-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-score]')
    if (!btn) return
    jsState.scoreId = btn.getAttribute('data-score')
    renderIfStation()
  })
  renderIfStation()
}

const PREVIEW_BASE =
  'html,body{margin:0;padding:0;background:#fff7ec;color:#24180f;font-family:Outfit,Avenir Next,system-ui,sans-serif;line-height:1.45}' +
  'body{padding:18px 20px}' +
  'p{margin:0 0 12px}' +
  'button{background:#e25a38;color:white;border:0;border-radius:999px;padding:10px 18px;font-size:16px;font-family:inherit}'

function looksEndless(code) {
  return /while\s*\(\s*(true|1)\s*\)/.test(code) || /for\s*\(\s*;\s*;\s*\)/.test(code)
}

function renderTryFrame(code) {
  const safe = String(code || '').replace(/<\/script/gi, '<\\/script')
  const script =
    'const lines=[]\n' +
    'function send(){parent.postMessage({type:"csd-js-console",lines:lines.slice()},"*")}\n' +
    'function format(v){if(typeof v==="string")return v;if(typeof v==="undefined")return "undefined";try{return JSON.stringify(v)}catch(e){return String(v)}}\n' +
    'console.log=function(){lines.push(Array.from(arguments).map(format).join(" "));send()}\n' +
    'window.addEventListener("error",function(event){lines.push("Error: "+event.message);send()})\n' +
    'try{\n' +
    safe +
    '\n}catch(err){lines.push("Error: "+err.message);send()}\n' +
    'if(!lines.length){lines.push("Ready.");send()}\n'
  $('#try-frame').srcdoc =
    '<!doctype html><html><head><meta charset="utf-8"><style>' +
    PREVIEW_BASE +
    '</style></head><body>' +
    PAGE_HTML +
    '<script>' +
    script +
    '<\/script></body></html>'
}

function showConsole(lines) {
  $('#try-console').textContent = lines.join('\n')
}

function runTry() {
  const code = $('#try-js').value
  if (looksEndless(code)) {
    showConsole(['That loop never ends. Change true to a condition that can become false.'])
    $('#try-frame').srcdoc = ''
    return
  }
  showConsole(['Running…'])
  renderTryFrame(code)
}

function editorDepth(text, pos) {
  let depth = 0
  let i = 0
  while (i < pos && i < text.length) {
    if (text.startsWith('//', i)) {
      const end = text.indexOf('\n', i)
      i = end === -1 ? pos : Math.min(pos, end)
      continue
    }
    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2)
      i = end === -1 ? pos : Math.min(pos, end + 2)
      continue
    }
    const ch = text[i]
    if (ch === '{') depth += 1
    else if (ch === '}') depth = Math.max(0, depth - 1)
    i += 1
  }
  return depth
}

function lineStart(text, pos) {
  return text.lastIndexOf('\n', pos - 1) + 1
}

function replaceRange(textarea, start, end, insert, cursor) {
  textarea.value = textarea.value.slice(0, start) + insert + textarea.value.slice(end)
  const at = cursor == null ? start + insert.length : cursor
  textarea.selectionStart = textarea.selectionEnd = at
}

function onJsEditorKey(event, afterChange) {
  const textarea = event.target
  if (event.key !== 'Tab' && event.key !== 'Enter') return
  event.preventDefault()
  const value = textarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const indentUnit = '  '

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      const startLine = lineStart(value, start)
      const lead = value.slice(startLine, start).match(/^[ \t]*/)?.[0] || ''
      const cut = lead.endsWith('\t') ? 1 : Math.min(2, lead.length)
      if (!cut) return
      replaceRange(textarea, startLine, startLine + cut, '', start - cut)
    } else {
      replaceRange(textarea, start, end, indentUnit)
    }
    afterChange()
    return
  }

  const startLine = lineStart(value, start)
  const before = value.slice(startLine, start)
  const after = value.slice(end)
  const baseIndent = before.match(/^[ \t]*/)?.[0] || ''
  const opened = before.trimEnd().endsWith('{')
  const depth = editorDepth(value, start)
  const innerIndent = indentUnit.repeat(opened ? Math.max(depth, 1) : depth)
  const next = after.trimStart()

  if (opened && !next.startsWith('}')) {
    replaceRange(textarea, start, end, `\n${innerIndent}\n${baseIndent}}`, start + 1 + innerIndent.length)
  } else if (opened && next.startsWith('}')) {
    replaceRange(textarea, start, end, `\n${innerIndent}`)
  } else {
    const keepIndent = depth > 0 ? innerIndent || indentUnit : baseIndent
    replaceRange(textarea, start, end, `\n${keepIndent}`)
  }
  afterChange()
}

function initTry() {
  const first = TRY_SNIPPETS[0]
  renderChips($('#try-chips'), TRY_SNIPPETS, first.id, 'data-try')
  $('#try-js').value = first.code
  const paint = window.CSD_HIGHLIGHT.bindEditor($('#try-js'), window.CSD_HIGHLIGHT.js)
  showConsole(['Press Run.'])

  $('#try-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-try]')
    if (!btn) return
    const snippet = TRY_SNIPPETS.find((row) => row.id === btn.getAttribute('data-try'))
    if (!snippet) return
    $('#try-js').value = snippet.code
    renderChips($('#try-chips'), TRY_SNIPPETS, snippet.id, 'data-try')
    paint()
    runTry()
  })

  $('#try-run').addEventListener('click', runTry)
  $('#try-stop').addEventListener('click', () => {
    $('#try-frame').srcdoc = ''
    showConsole(['Stopped.'])
  })
  $('#try-js').addEventListener('keydown', (event) => {
    onJsEditorKey(event, paint)
  })

  window.addEventListener('message', (event) => {
    const data = event.data
    if (!data || data.type !== 'csd-js-console' || !Array.isArray(data.lines)) return
    if (event.source !== $('#try-frame').contentWindow) return
    showConsole(data.lines)
  })
}

initValues()
initVars()
initFns()
initIf()
initArrays()
initObjects()
initLoops()
initTry()
