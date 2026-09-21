const RULE_EXAMPLES = [
  {
    id: 'p',
    label: 'Element',
    selector: 'p',
    property: 'color',
    value: '#e25a38',
    hint: 'p picks every paragraph. Element selectors are just the tag name — no extra marks.'
  },
  {
    id: 'class',
    label: 'Class',
    selector: '.chip',
    property: 'background',
    value: '#d9a21b',
    hint: 'A class starts with a dot. Many elements can share .chip. In HTML you write class="chip".'
  },
  {
    id: 'id',
    label: 'ID',
    selector: '#hero',
    property: 'font-size',
    value: '32px',
    hint: 'An ID starts with a hash. It should be unique on the page. In HTML you write id="hero".'
  }
]

const PAINT_PROPS = [
  {
    id: 'color',
    label: 'color',
    explain: 'color is the letters themselves — the ink.',
    values: [
      { id: 'ink', label: 'ink', css: '#24180f' },
      { id: 'coral', label: 'coral', css: '#e25a38' },
      { id: 'teal', label: 'teal', css: '#1b8a80' },
      { id: 'gold', label: 'gold', css: '#d9a21b' }
    ]
  },
  {
    id: 'background',
    label: 'background',
    explain: 'background is the paper behind the words.',
    values: [
      { id: 'cream', label: 'cream', css: '#fff7ec' },
      { id: 'paper', label: 'paper', css: '#f4e6cf' },
      { id: 'stamp', label: 'stamp', css: '#2c221b' },
      { id: 'teal', label: 'teal', css: '#1b8a80' }
    ]
  },
  {
    id: 'font-size',
    label: 'font-size',
    explain: 'font-size is how big the type is. px means pixels.',
    values: [
      { id: 's', label: '16px', css: '16px' },
      { id: 'm', label: '22px', css: '22px' },
      { id: 'l', label: '32px', css: '32px' },
      { id: 'xl', label: '42px', css: '42px' }
    ]
  },
  {
    id: 'text-align',
    label: 'text-align',
    explain: 'text-align slides the words left, center, or right inside the box.',
    values: [
      { id: 'left', label: 'left', css: 'left' },
      { id: 'center', label: 'center', css: 'center' },
      { id: 'right', label: 'right', css: 'right' }
    ]
  }
]

const BOX_EXPLAIN = {
  margin: 'Margin is empty space outside the border. It pushes other boxes away.',
  border: 'Border is the visible edge. Thickness uses px. Color is a separate choice.',
  padding: 'Padding is space inside, between the content and the border. The words get a cushion.'
}

const LAYOUT_EXAMPLES = [
  {
    id: 'block',
    label: 'block',
    css: 'display: block;',
    explain:
      'Block takes the whole row. The next box starts underneath — like paragraphs stacked in a paper.'
  },
  {
    id: 'inline-block',
    label: 'inline-block',
    css: 'display: inline-block;',
    explain:
      'inline-block keeps a box (padding still works) but boxes can sit next to each other on one line.'
  },
  {
    id: 'flex',
    label: 'flex',
    css: 'display: flex;\n  gap: 10px;',
    explain:
      'flex lines the children up as a row. gap is the space between them — no extra margin math.'
  }
]

const TRY_SNIPPETS = [
  {
    id: 'hello',
    label: 'Hello',
    html: '<h1>Hello, class.</h1>\n<p>This is a paragraph.</p>',
    css: 'h1 {\n  color: #e25a38;\n}\n\np {\n  font-size: 18px;\n}'
  },
  {
    id: 'card',
    label: 'Card',
    html: '<article class="card">\n  <h2>Meet the room.</h2>\n  <p>Chips, Roblox, and curiosity.</p>\n</article>',
    css: '.card {\n  background: #fff7ec;\n  padding: 20px;\n  border-radius: 18px;\n  border: 4px solid #1b8a80;\n}\n\nh2 {\n  margin: 0 0 8px;\n  color: #24180f;\n}'
  },
  {
    id: 'button',
    label: 'Button',
    html: '<p>Ready to browse?</p>\n<button type="button">Spin a spotlight</button>',
    css: 'button {\n  background: #e25a38;\n  color: white;\n  border: 0;\n  border-radius: 999px;\n  padding: 10px 18px;\n  font-size: 16px;\n}'
  },
  {
    id: 'row',
    label: 'Row',
    html: '<div class="row">\n  <span class="chip">Chips</span>\n  <span class="chip">Roblox</span>\n  <span class="chip">Code</span>\n</div>',
    css: '.row {\n  display: flex;\n  gap: 10px;\n}\n\n.chip {\n  background: #2c221b;\n  color: #fff7ec;\n  padding: 8px 14px;\n  border-radius: 999px;\n}'
  }
]

const PREVIEW_BASE =
  'html,body{margin:0;padding:0;background:#fff7ec;color:#24180f;font-family:Outfit,Avenir Next,system-ui,sans-serif;line-height:1.45}' +
  'body{padding:18px 20px}' +
  'h1,h2,h3{font-family:Fraunces,Georgia,serif;letter-spacing:-0.03em;line-height:1.15;margin:0 0 10px}' +
  'p{margin:0 0 10px}'

const cssState = {
  ruleId: 'p',
  rulePart: 'selector',
  paintProp: 'color',
  paint: {
    color: '#e25a38',
    background: '#fff7ec',
    'font-size': '22px',
    'text-align': 'left'
  },
  boxLayer: 'padding',
  padding: 16,
  border: 8,
  margin: 18,
  layoutId: 'flex'
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

function renderChips(el, rows, selected, attr) {
  el.innerHTML = rows
    .map((row) => {
      const on = row.id === selected ? ' is-on' : ''
      return `<button class='filter-btn${on}' type='button' ${attr}='${row.id}'>${escapeHtml(row.label)}</button>`
    })
    .join('')
}

function currentRule() {
  return RULE_EXAMPLES.find((row) => row.id === cssState.ruleId) || RULE_EXAMPLES[0]
}

function currentPaintProp() {
  return PAINT_PROPS.find((row) => row.id === cssState.paintProp) || PAINT_PROPS[0]
}

function currentLayout() {
  return LAYOUT_EXAMPLES.find((row) => row.id === cssState.layoutId) || LAYOUT_EXAMPLES[0]
}

function renderRuleStation() {
  const example = currentRule()
  const part = cssState.rulePart
  renderChips($('#rule-chips'), RULE_EXAMPLES, example.id, 'data-rule')

  const bits = [
    { id: 'selector', text: example.selector },
    { id: 'brace', text: '{' },
    { id: 'property', text: example.property },
    { id: 'colon', text: ':' },
    { id: 'value', text: example.value },
    { id: 'semi', text: ';' },
    { id: 'end', text: '}' }
  ]
  $('#rule-sandwich').innerHTML = bits
    .map((row) => {
      const mapped =
        row.id === 'colon' || row.id === 'semi' || row.id === 'brace' || row.id === 'end'
          ? ''
          : row.id
      const on = mapped && mapped === part ? ' is-on' : ''
      const attr = mapped ? ` data-part='${mapped}'` : ''
      const kind = mapped || 'mark'
      return `<button class='tag-piece${on}' type='button' data-kind='${kind}'${attr}>${escapeHtml(row.text)}</button>`
    })
    .join('')

  $('#rule-caption').innerHTML = [
    '<span data-cap="selector">selector</span>',
    '<span data-cap="property">property</span>',
    '<span data-cap="value">value</span>'
  ].join('')
  $('#rule-caption')
    .querySelectorAll('[data-cap]')
    .forEach((el) => el.classList.toggle('is-on', el.getAttribute('data-cap') === part))

  $('#rule-code').innerHTML =
    `<span class='code-tag'>${escapeHtml(example.selector)}</span> {\n` +
    `  <span class='code-attr'>${escapeHtml(example.property)}</span>: ` +
    `<span class='code-val'>${escapeHtml(example.value)}</span>;\n}`

  let explain = example.hint
  if (part === 'selector') {
    explain = `The selector picks the HTML. ${example.hint}`
  } else if (part === 'property') {
    explain = `${example.property} is the kind of style. Common ones: color, background, font-size, padding, margin.`
  } else if (part === 'value') {
    explain = `${example.value} is the choice for ${example.property}. Colors can be names or #hex codes. Sizes often use px.`
  }
  $('#rule-explain').textContent = explain

  const preview = $('#rule-preview')
  preview.replaceChildren()
  const kicker = document.createElement('p')
  kicker.textContent = 'Class pulse'
  const heading = document.createElement('h2')
  heading.id = 'hero'
  heading.textContent = 'Meet the room.'
  const chip = document.createElement('span')
  chip.className = 'chip'
  chip.textContent = 'Roblox'
  chip.style.display = 'inline-block'
  chip.style.padding = '4px 10px'
  chip.style.borderRadius = '999px'
  chip.style.marginRight = '8px'
  const para = document.createElement('p')
  para.textContent = 'A yearbook for CSD.'
  if (example.id === 'p') para.style.color = example.value
  if (example.id === 'class') {
    chip.style.background = example.value
    chip.style.color = '#24180f'
  }
  if (example.id === 'id') heading.style.fontSize = example.value
  preview.append(kicker, heading, chip, para)
}

function initRules() {
  $('#rule-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-rule]')
    if (!btn) return
    cssState.ruleId = btn.getAttribute('data-rule')
    renderRuleStation()
  })
  $('#rule-sandwich').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-part]')
    if (!btn) return
    cssState.rulePart = btn.getAttribute('data-part')
    renderRuleStation()
  })
  renderRuleStation()
}

function renderPaintStation() {
  const prop = currentPaintProp()
  renderChips($('#paint-props'), PAINT_PROPS, prop.id, 'data-paint-prop')
  const selected = cssState.paint[prop.id]
  const valueId = (prop.values.find((row) => row.css === selected) || prop.values[0]).id
  renderChips($('#paint-values'), prop.values, valueId, 'data-paint-value')

  const card = $('#paint-card')
  card.style.color = cssState.paint.color
  card.style.background = cssState.paint.background
  card.style.fontSize = cssState.paint['font-size']
  card.style.textAlign = cssState.paint['text-align']
  card.querySelector('h2').style.fontSize = '1.35em'

  $('#paint-code').innerHTML =
    `<span class='code-tag'>.card</span> {\n` +
    `  <span class='code-attr'>color</span>: <span class='code-val'>${cssState.paint.color}</span>;\n` +
    `  <span class='code-attr'>background</span>: <span class='code-val'>${cssState.paint.background}</span>;\n` +
    `  <span class='code-attr'>font-size</span>: <span class='code-val'>${cssState.paint['font-size']}</span>;\n` +
    `  <span class='code-attr'>text-align</span>: <span class='code-val'>${cssState.paint['text-align']}</span>;\n}`

  $('#paint-explain').textContent = prop.explain
}

function initPaint() {
  $('#paint-props').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-paint-prop]')
    if (!btn) return
    cssState.paintProp = btn.getAttribute('data-paint-prop')
    renderPaintStation()
  })
  $('#paint-values').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-paint-value]')
    if (!btn) return
    const prop = currentPaintProp()
    const value = prop.values.find((row) => row.id === btn.getAttribute('data-paint-value'))
    if (!value) return
    cssState.paint[prop.id] = value.css
    renderPaintStation()
  })
  renderPaintStation()
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function renderBoxStation() {
  const layer = cssState.boxLayer
  const marginBtn = $('#box-stage .box-margin')
  const borderEl = $('#box-stage .box-border')
  const paddingEl = $('#box-stage .box-padding')
  marginBtn.style.padding = `${cssState.margin}px`
  borderEl.style.padding = `${cssState.border}px`
  paddingEl.style.padding = `${cssState.padding}px`

  ;['margin', 'border', 'padding'].forEach((name) => {
    $('#box-stage')
      .querySelector(`[data-box='${name}']`)
      .classList.toggle('is-on', name === layer)
  })

  $('#box-code').innerHTML =
    `<span class='code-tag'>.card</span> {\n` +
    `  <span class='code-attr'>margin</span>: <span class='code-val'>${cssState.margin}px</span>;\n` +
    `  <span class='code-attr'>border</span>: <span class='code-val'>${cssState.border}px solid #e25a38</span>;\n` +
    `  <span class='code-attr'>padding</span>: <span class='code-val'>${cssState.padding}px</span>;\n}`

  $('#box-explain').textContent = BOX_EXPLAIN[layer]
  const size =
    layer === 'margin'
      ? cssState.margin
      : layer === 'border'
        ? cssState.border
        : cssState.padding
  $('#box-status').textContent = `${layer} is ${size}px. Use the buttons to grow or shrink it.`
}

function initBox() {
  $('#box-stage').addEventListener('click', (event) => {
    const layer = event.target.closest('[data-box]')
    if (!layer) return
    event.preventDefault()
    cssState.boxLayer = layer.getAttribute('data-box')
    renderBoxStation()
  })
  $('#box-stage').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const layer = event.target.closest('[data-box]')
    if (!layer) return
    event.preventDefault()
    cssState.boxLayer = layer.getAttribute('data-box')
    renderBoxStation()
  })
  document.querySelectorAll('[data-box-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const delta = Number(btn.getAttribute('data-box-nudge'))
      if (cssState.boxLayer === 'margin') {
        cssState.margin = clamp(cssState.margin + delta, 4, 40)
      } else if (cssState.boxLayer === 'border') {
        cssState.border = clamp(cssState.border + delta, 2, 20)
      } else {
        cssState.padding = clamp(cssState.padding + delta, 4, 40)
      }
      renderBoxStation()
    })
  })
  renderBoxStation()
}

function renderLayoutStation() {
  const example = currentLayout()
  renderChips($('#layout-chips'), LAYOUT_EXAMPLES, example.id, 'data-layout')
  const row = $('#layout-row')
  row.setAttribute('data-display', example.id)

  if (example.id === 'flex') {
    $('#layout-code').innerHTML =
      `<span class='code-tag'>.row</span> {\n  <span class='code-attr'>display</span>: <span class='code-val'>flex</span>;\n  <span class='code-attr'>gap</span>: <span class='code-val'>10px</span>;\n}`
  } else if (example.id === 'inline-block') {
    $('#layout-code').innerHTML =
      `<span class='code-tag'>.item</span> {\n  <span class='code-attr'>display</span>: <span class='code-val'>inline-block</span>;\n}`
  } else {
    $('#layout-code').innerHTML =
      `<span class='code-tag'>.item</span> {\n  <span class='code-attr'>display</span>: <span class='code-val'>block</span>;\n}`
  }
  $('#layout-explain').textContent = example.explain
}

function initLayout() {
  $('#layout-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-layout]')
    if (!btn) return
    cssState.layoutId = btn.getAttribute('data-layout')
    renderLayoutStation()
  })
  renderLayoutStation()
}

function soften(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(?:body|html)>/gi, '')
}

function renderTry(html, css) {
  $('#try-frame').srcdoc =
    '<!doctype html><html><head><meta charset="utf-8"><style>' +
    PREVIEW_BASE +
    '\n' +
    String(css || '') +
    '</style></head><body>' +
    soften(html) +
    '</body></html>'
}

function cssEditorDepth(text, pos) {
  let depth = 0
  let i = 0
  while (i < pos && i < text.length) {
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

function cssEditorLineStart(text, pos) {
  return text.lastIndexOf('\n', pos - 1) + 1
}

function replaceCssRange(textarea, start, end, insert, cursor) {
  textarea.value = textarea.value.slice(0, start) + insert + textarea.value.slice(end)
  const at = cursor == null ? start + insert.length : cursor
  textarea.selectionStart = textarea.selectionEnd = at
}

function onCssEditorKey(event, afterChange) {
  const textarea = event.target
  if (event.key !== 'Tab' && event.key !== 'Enter') return
  event.preventDefault()

  const value = textarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const indentUnit = '  '

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      const lineStart = cssEditorLineStart(value, start)
      const lead = value.slice(lineStart, start).match(/^[ \t]*/)?.[0] || ''
      const cut = lead.endsWith('\t') ? 1 : Math.min(2, lead.length)
      if (!cut) return
      replaceCssRange(textarea, lineStart, lineStart + cut, '', start - cut)
    } else if (start !== end) {
      replaceCssRange(textarea, start, end, indentUnit)
    } else {
      const lineStart = cssEditorLineStart(value, start)
      const before = value.slice(lineStart, start)
      if (/^[ \t]*$/.test(before)) {
        const depth = cssEditorDepth(value, start)
        const wanted = indentUnit.repeat(depth)
        if (depth > 0 && before !== wanted) {
          replaceCssRange(textarea, lineStart, start, wanted)
        } else {
          replaceCssRange(textarea, start, end, indentUnit)
        }
      } else {
        replaceCssRange(textarea, start, end, indentUnit)
      }
    }
    afterChange()
    return
  }

  const lineStart = cssEditorLineStart(value, start)
  const before = value.slice(lineStart, start)
  const after = value.slice(end)
  const baseIndent = before.match(/^[ \t]*/)?.[0] || ''
  const opened = before.trimEnd().endsWith('{')
  const depth = cssEditorDepth(value, start)
  const innerIndent = indentUnit.repeat(opened ? Math.max(depth, 1) : depth)
  const next = after.trimStart()

  if (opened && !next.startsWith('}')) {
    replaceCssRange(
      textarea,
      start,
      end,
      `\n${innerIndent}\n${baseIndent}}`,
      start + 1 + innerIndent.length
    )
  } else if (opened && next.startsWith('}')) {
    replaceCssRange(textarea, start, end, `\n${innerIndent}`)
  } else {
    const keepIndent = depth > 0 ? innerIndent || indentUnit : baseIndent
    replaceCssRange(textarea, start, end, `\n${keepIndent}`)
  }
  afterChange()
}

function initTry() {
  const first = TRY_SNIPPETS[0]
  renderChips($('#try-chips'), TRY_SNIPPETS, first.id, 'data-try')
  $('#try-html').value = first.html
  $('#try-css').value = first.css
  renderTry(first.html, first.css)
  const paintHtml = window.CSD_HIGHLIGHT.bindEditor($('#try-html'), window.CSD_HIGHLIGHT.html)
  const paintCss = window.CSD_HIGHLIGHT.bindEditor($('#try-css'), window.CSD_HIGHLIGHT.css)

  $('#try-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-try]')
    if (!btn) return
    const snippet = TRY_SNIPPETS.find((row) => row.id === btn.getAttribute('data-try'))
    if (!snippet) return
    $('#try-html').value = snippet.html
    $('#try-css').value = snippet.css
    renderChips($('#try-chips'), TRY_SNIPPETS, snippet.id, 'data-try')
    renderTry(snippet.html, snippet.css)
    paintHtml()
    paintCss()
  })
  function previewNow() {
    renderTry($('#try-html').value, $('#try-css').value)
  }
  $('#try-html').addEventListener('input', previewNow)
  $('#try-css').addEventListener('input', previewNow)
  $('#try-css').addEventListener('keydown', (event) => {
    onCssEditorKey(event, () => {
      paintCss()
      previewNow()
    })
  })
}

initRules()
initPaint()
initBox()
initLayout()
initTry()
