const TAG_EXAMPLES = [
  {
    id: 'p',
    label: 'Paragraph',
    tag: 'p',
    content: 'Hello, CSD.',
    hint: 'p means paragraph — a block of ordinary text.'
  },
  {
    id: 'h1',
    label: 'Heading',
    tag: 'h1',
    content: 'Meet the room.',
    hint: 'h1 is the biggest heading. A page usually has one.'
  },
  {
    id: 'a',
    label: 'Link',
    tag: 'a',
    attrs: [{ name: 'href', value: 'lab.html' }],
    content: 'Open the lab',
    hint: 'a is a link. The href attribute is where it goes.'
  },
  {
    id: 'strong',
    label: 'Important',
    tag: 'strong',
    content: 'important',
    hint: 'strong marks a word as important. Browsers usually bold it.'
  },
  {
    id: 'button',
    label: 'Button',
    tag: 'button',
    attrs: [{ name: 'type', value: 'button' }],
    content: 'Spin a spotlight',
    hint: 'button makes something you can click.'
  },
  {
    id: 'img',
    label: 'Image',
    tag: 'img',
    void: true,
    attrs: [
      { name: 'src', value: 'cat.jpg' },
      { name: 'alt', value: 'A cat' }
    ],
    hint: 'img is a void tag — no closing tag, and nothing in between.'
  }
]

const NEST_EXAMPLES = [
  {
    id: 'article',
    label: 'Article',
    explain:
      'The article is the outer box. The heading and paragraph are elements nested inside it.',
    tree: {
      id: 'article',
      tag: 'article',
      kids: [
        { id: 'h2', tag: 'h2', text: 'Meet the room.' },
        { id: 'p', tag: 'p', text: 'A yearbook for CSD.' }
      ]
    }
  },
  {
    id: 'list',
    label: 'List',
    explain: 'ul is the list. Each li is an item nested inside. Close every li before you close ul.',
    tree: {
      id: 'ul',
      tag: 'ul',
      kids: [
        { id: 'li1', tag: 'li', text: 'Games' },
        { id: 'li2', tag: 'li', text: 'Music' },
        { id: 'li3', tag: 'li', text: 'Snacks' }
      ]
    }
  },
  {
    id: 'inline',
    label: 'Inline',
    explain:
      'Nesting is not only boxes in boxes. A strong element can sit inside a paragraph — still close the inner tag first.',
    tree: {
      id: 'p',
      tag: 'p',
      kids: [
        { id: 'text', tag: '#text', text: 'Earn points, then redeem them on the ' },
        { id: 'strong', tag: 'strong', text: 'prize board' },
        { id: 'end', tag: '#text', text: '.' }
      ]
    }
  }
]

const ATTR_KINDS = [
  { id: 'a', label: 'Link' },
  { id: 'img', label: 'Image' }
]

const IMG_PRESETS = [
  { id: 'cat', label: 'Cat', color: '#1b8a80', word: '🐱' },
  { id: 'snack', label: 'Snack', color: '#e25a38', word: '🍿' },
  { id: 'game', label: 'Game', color: '#d9a21b', word: '🎮' }
]

const PAGE_LINES = [
  {
    id: 'doctype',
    html: '<span class="code-tag">&lt;!DOCTYPE html&gt;</span>',
    explain: 'This tells the browser “this file is HTML5.” Put it on the very first line.'
  },
  {
    id: 'html',
    html: '<span class="code-tag">&lt;html lang="en"&gt;</span>',
    explain: 'The html element wraps the whole document. lang helps the browser (and screen readers).'
  },
  {
    id: 'head',
    html: '  <span class="code-tag">&lt;head&gt;</span>',
    explain: 'The head is setup. People don’t see it on the page — the tab title lives here.'
  },
  {
    id: 'title',
    html: '    <span class="code-tag">&lt;title&gt;</span><span class="code-content">My first page</span><span class="code-tag">&lt;/title&gt;</span>',
    explain: 'title is the name on the browser tab. Click the tab in the mini browser — that’s this line.'
  },
  {
    id: 'head-close',
    html: '  <span class="code-tag">&lt;/head&gt;</span>',
    explain: 'Closing the head. Setup is done. Next comes what people actually see.'
  },
  {
    id: 'body',
    html: '  <span class="code-tag">&lt;body&gt;</span>',
    explain: 'The body is the visible page: headings, paragraphs, links, images — all of it.'
  },
  {
    id: 'hello',
    html: '    <span class="code-tag">&lt;h1&gt;</span><span class="code-content">Hello, class.</span><span class="code-tag">&lt;/h1&gt;</span>',
    explain: 'This heading is inside the body, so it shows up in the page — not in the tab.'
  },
  {
    id: 'body-close',
    html: '  <span class="code-tag">&lt;/body&gt;</span>',
    explain: 'Close the body when the visible content is finished.'
  },
  {
    id: 'html-close',
    html: '<span class="code-tag">&lt;/html&gt;</span>',
    explain: 'Last closing tag. The document is complete.'
  }
]

const TRY_SNIPPETS = [
  {
    id: 'hello',
    label: 'Hello',
    html: '<h1>Hello, class.</h1>\n<p>This is a paragraph.</p>'
  },
  {
    id: 'link',
    label: 'Link',
    html: '<p>Visit the <a href="lab.html">processing lab</a>.</p>'
  },
  {
    id: 'list',
    label: 'List',
    html: '<h2>Class pulse</h2>\n<ul>\n  <li>Games</li>\n  <li>Music</li>\n  <li>Snacks</li>\n</ul>'
  },
  {
    id: 'image',
    label: 'Image',
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="128">\n  <rect fill="#1b8a80" width="220" height="128" rx="14"/>\n  <text x="110" y="76" text-anchor="middle" fill="#fff7ec" font-size="28">photo</text>\n</svg>'
  },
  {
    id: 'page',
    label: 'Tiny page',
    html: '<h1>CSD Class Hub</h1>\n<p>Meet the room.</p>\n<p><a href="index.html">Back to the hub</a></p>\n<ul>\n  <li>Browse classmates</li>\n  <li>Spin a spotlight</li>\n</ul>'
  }
]

const PREVIEW_CSS =
  'html,body{margin:0;padding:0;background:#fff7ec;color:#24180f;font-family:Outfit,Avenir Next,system-ui,sans-serif;line-height:1.45}' +
  'body{padding:18px 20px}' +
  'h1,h2,h3{font-family:Fraunces,Georgia,serif;letter-spacing:-0.03em;line-height:1.15;margin:0 0 10px}' +
  'h1{font-size:32px}h2{font-size:24px}p{margin:0 0 10px}' +
  'a{color:#146f67;font-weight:600}' +
  'ul{margin:8px 0 0;padding-left:1.2em}' +
  'img{max-width:100%;height:auto;border-radius:12px}' +
  'button{border:0;border-radius:999px;padding:8px 14px;background:#e25a38;color:#fff;font:inherit;font-weight:600}'

const htmlState = {
  tagId: 'p',
  tagPart: 'open',
  nestId: 'article',
  nestEl: 'article',
  attrKind: 'a',
  attrBit: 'attr',
  linkText: 'Open the lab',
  href: 'lab.html',
  imgPreset: 'cat',
  alt: 'A cat',
  pagePart: 'body'
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

function attrString(attrs) {
  if (!attrs || !attrs.length) return ''
  return attrs
    .map((row) => ` <span class='code-attr'>${escapeHtml(row.name)}</span>=<span class='code-val'>"${escapeHtml(row.value)}"</span>`)
    .join('')
}

function currentTag() {
  return TAG_EXAMPLES.find((row) => row.id === htmlState.tagId) || TAG_EXAMPLES[0]
}

function currentNest() {
  return NEST_EXAMPLES.find((row) => row.id === htmlState.nestId) || NEST_EXAMPLES[0]
}

function currentImg() {
  return IMG_PRESETS.find((row) => row.id === htmlState.imgPreset) || IMG_PRESETS[0]
}

function svgPhoto(preset) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="128">` +
    `<rect fill="${preset.color}" width="220" height="128" rx="14"/>` +
    `<text x="110" y="76" text-anchor="middle" font-size="42">${preset.word}</text>` +
    `</svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

function renderChips(el, rows, selected, attr) {
  el.innerHTML = rows
    .map((row) => {
      const on = row.id === selected ? ' is-on' : ''
      return `<button class='filter-btn${on}' type='button' ${attr}='${row.id}'>${escapeHtml(row.label)}</button>`
    })
    .join('')
}

function renderTagStation() {
  const example = currentTag()
  const part = htmlState.tagPart
  renderChips($('#tag-chips'), TAG_EXAMPLES, example.id, 'data-tag')

  const attrs = example.attrs
    ? example.attrs.map((row) => ` ${row.name}="${row.value}"`).join('')
    : ''
  const openLabel = `<${example.tag}${attrs}>`
  const closeLabel = `</${example.tag}>`

  let pieces = `<button class='tag-piece${part === 'open' ? ' is-on' : ''}' type='button' data-part='open'>${escapeHtml(openLabel)}</button>`
  if (!example.void) {
    pieces += `<button class='tag-piece${part === 'content' ? ' is-on' : ''}' type='button' data-part='content'>${escapeHtml(example.content)}</button>`
    pieces += `<button class='tag-piece${part === 'close' ? ' is-on' : ''}' type='button' data-part='close'>${escapeHtml(closeLabel)}</button>`
  }
  $('#tag-sandwich').innerHTML = pieces

  const captions = ['<span data-cap="open">opening tag</span>']
  if (!example.void) {
    captions.push('<span data-cap="content">content</span>')
    captions.push('<span data-cap="close">closing tag</span>')
  } else {
    captions[0] = '<span data-cap="open">void tag — no closing pair</span>'
  }
  $('#tag-caption').innerHTML = captions.join('')
  $('#tag-caption')
    .querySelectorAll('[data-cap]')
    .forEach((el) => el.classList.toggle('is-on', el.getAttribute('data-cap') === part))

  $('#tag-code').innerHTML =
    `<span class='code-tag'>&lt;${escapeHtml(example.tag)}</span>${attrString(example.attrs)}<span class='code-tag'>&gt;</span>` +
    (example.void
      ? ''
      : `<span class='code-content'>${escapeHtml(example.content)}</span><span class='code-tag'>&lt;/${escapeHtml(example.tag)}&gt;</span>`)

  let explain = example.hint
  if (part === 'open') {
    explain = example.void
      ? `The opening tag is the whole element here. ${example.hint}`
      : `The opening tag starts the element. The name ${example.tag} is the label.`
  } else if (part === 'content') {
    explain = 'Content is what people actually see. The tags around it stay hidden.'
  } else if (part === 'close') {
    explain = `The slash in ${closeLabel} means “we’re done with this ${example.tag}.”`
  }
  $('#tag-explain').textContent = explain

  const preview = $('#tag-preview')
  preview.replaceChildren()
  if (example.void) {
    const fig = document.createElement('div')
    fig.className = 'fake-img'
    fig.textContent = 'cat.jpg'
    preview.appendChild(fig)
    return
  }
  const node = document.createElement(example.tag)
  node.textContent = example.content
  if (example.tag === 'a') {
    node.href = '#'
    node.addEventListener('click', (event) => event.preventDefault())
  }
  if (example.tag === 'button') node.type = 'button'
  preview.appendChild(node)
}

function initTags() {
  $('#tag-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-tag]')
    if (!btn) return
    htmlState.tagId = btn.getAttribute('data-tag')
    const example = currentTag()
    if (example.void) htmlState.tagPart = 'open'
    renderTagStation()
  })
  $('#tag-sandwich').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-part]')
    if (!btn) return
    htmlState.tagPart = btn.getAttribute('data-part')
    renderTagStation()
  })
  renderTagStation()
}

function nestCode(node, selected, indent) {
  const pad = '  '.repeat(indent)
  if (node.tag === '#text') {
    const lit = node.id === selected ? ' is-lit' : ''
    return `<span class='code-line${lit}'>${pad}<span class='code-content'>${escapeHtml(node.text)}</span></span>`
  }
  const lit = node.id === selected ? ' is-lit' : ''
  if (!node.kids) {
    return `<span class='code-line${lit}'>${pad}<span class='code-tag'>&lt;${node.tag}&gt;</span><span class='code-content'>${escapeHtml(node.text)}</span><span class='code-tag'>&lt;/${node.tag}&gt;</span></span>`
  }
  const open = `<span class='code-line${lit}'>${pad}<span class='code-tag'>&lt;${node.tag}&gt;</span></span>`
  const kids = node.kids.map((kid) => nestCode(kid, selected, indent + 1)).join('')
  const close = `<span class='code-line${lit}'>${pad}<span class='code-tag'>&lt;/${node.tag}&gt;</span></span>`
  return open + kids + close
}

function nestBox(node, selected) {
  if (node.tag === '#text') return escapeHtml(node.text)
  const on = node.id === selected ? ' is-on' : ''
  if (node.tag === 'strong') {
    return `<span class='nest nest-inline${on}' data-el='${node.id}' role='button' tabindex='0'><span class='nest-label'>${node.tag}</span>${escapeHtml(node.text)}</span>`
  }
  const inner = node.kids
    ? node.kids.map((kid) => nestBox(kid, selected)).join('')
    : `<span class='nest-text'>${escapeHtml(node.text)}</span>`
  return `<div class='nest${on}' data-el='${node.id}' role='button' tabindex='0'><span class='nest-label'>${node.tag}</span>${inner}</div>`
}

function findNode(node, id) {
  if (node.id === id) return node
  if (!node.kids) return null
  for (const kid of node.kids) {
    const found = findNode(kid, id)
    if (found) return found
  }
  return null
}

function renderNestStation() {
  const example = currentNest()
  renderChips($('#nest-chips'), NEST_EXAMPLES, example.id, 'data-nest')
  $('#nest-stage').innerHTML = nestBox(example.tree, htmlState.nestEl)
  $('#nest-code').innerHTML = nestCode(example.tree, htmlState.nestEl, 0)
  const node = findNode(example.tree, htmlState.nestEl)
  if (!node || node.tag === '#text') {
    $('#nest-status').textContent = 'That part is plain text sitting inside the paragraph.'
    $('#nest-explain').textContent = example.explain
    return
  }
  const hasKids = Boolean(node.kids)
  $('#nest-status').textContent = hasKids
    ? `<${node.tag}> is a parent. Everything inside it is nested.`
    : `<${node.tag}> is an element: opening tag, content, closing tag.`
  $('#nest-explain').textContent = example.explain
}

function initNest() {
  $('#nest-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-nest]')
    if (!btn) return
    htmlState.nestId = btn.getAttribute('data-nest')
    htmlState.nestEl = currentNest().tree.id
    renderNestStation()
  })
  function selectNest(event) {
    const box = event.target.closest('[data-el]')
    if (!box || !$('#nest-stage').contains(box)) return
    htmlState.nestEl = box.getAttribute('data-el')
    renderNestStation()
  }
  $('#nest-stage').addEventListener('click', selectNest)
  $('#nest-stage').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    selectNest(event)
  })
  renderNestStation()
}

function attrBits() {
  if (htmlState.attrKind === 'img') {
    const preset = currentImg()
    const src = `${preset.id}.jpg`
    return [
      { id: 'tag', bit: 'tag', text: '<img' },
      { id: 'attr', bit: 'attr', text: 'src' },
      { id: 'eq', bit: 'attr', text: '=' },
      { id: 'val', bit: 'val', text: `"${src}"` },
      { id: 'altn', bit: 'attr', text: 'alt' },
      { id: 'alteq', bit: 'attr', text: '=' },
      { id: 'altv', bit: 'val', text: `"${htmlState.alt}"` },
      { id: 'end', bit: 'tag', text: '>' }
    ]
  }
  return [
    { id: 'tag', bit: 'tag', text: '<a' },
    { id: 'attr', bit: 'attr', text: 'href' },
    { id: 'eq', bit: 'attr', text: '=' },
    { id: 'val', bit: 'val', text: `"${htmlState.href}"` },
    { id: 'end', bit: 'tag', text: '>' },
    { id: 'content', bit: 'content', text: htmlState.linkText },
    { id: 'close', bit: 'tag', text: '</a>' }
  ]
}

function renderAttrFields() {
  if (htmlState.attrKind === 'img') {
    $('#attr-fields').innerHTML =
      `<label class='html-field'><span>src — which file</span><select id='attr-src'>${IMG_PRESETS.map(
        (row) =>
          `<option value='${row.id}'${row.id === htmlState.imgPreset ? ' selected' : ''}>${row.label} (${row.id}.jpg)</option>`
      ).join('')}</select></label>` +
      `<label class='html-field'><span>alt — describe the picture</span><input id='attr-alt' type='text' value='${escapeHtml(htmlState.alt)}'></label>`
    $('#attr-src').addEventListener('change', (event) => {
      htmlState.imgPreset = event.target.value
      renderAttrStation()
    })
    $('#attr-alt').addEventListener('input', (event) => {
      htmlState.alt = event.target.value
      renderAttrStation(true)
    })
    return
  }
  $('#attr-fields').innerHTML =
    `<label class='html-field'><span>Link text — the content</span><input id='attr-text' type='text' value='${escapeHtml(htmlState.linkText)}'></label>` +
    `<label class='html-field'><span>href — where it goes</span><input id='attr-href' type='text' value='${escapeHtml(htmlState.href)}'></label>`
  $('#attr-text').addEventListener('input', (event) => {
    htmlState.linkText = event.target.value
    renderAttrStation(true)
  })
  $('#attr-href').addEventListener('input', (event) => {
    htmlState.href = event.target.value
    renderAttrStation(true)
  })
}

function renderAttrStation(keepFields) {
  renderChips($('#attr-kinds'), ATTR_KINDS, htmlState.attrKind, 'data-attr-kind')
  if (!keepFields) renderAttrFields()

  const bits = attrBits()
  $('#attr-anatomy').innerHTML = bits
    .map((row) => {
      const on = row.bit === htmlState.attrBit ? ' is-on' : ''
      return `<button class='attr-bit${on}' type='button' data-bit='${row.bit}'>${escapeHtml(row.text)}</button>`
    })
    .join('')

  if (htmlState.attrKind === 'img') {
    const preset = currentImg()
    const src = `${preset.id}.jpg`
    $('#attr-code').innerHTML =
      `<span class='code-tag'>&lt;img</span> <span class='code-attr'>src</span>=<span class='code-val'>"${escapeHtml(src)}"</span> <span class='code-attr'>alt</span>=<span class='code-val'>"${escapeHtml(htmlState.alt)}"</span><span class='code-tag'>&gt;</span>`
    const img = document.createElement('img')
    img.src = svgPhoto(preset)
    img.alt = htmlState.alt
    img.width = 220
    img.height = 128
    $('#attr-preview').replaceChildren(img)
  } else {
    $('#attr-code').innerHTML =
      `<span class='code-tag'>&lt;a</span> <span class='code-attr'>href</span>=<span class='code-val'>"${escapeHtml(htmlState.href)}"</span><span class='code-tag'>&gt;</span><span class='code-content'>${escapeHtml(htmlState.linkText)}</span><span class='code-tag'>&lt;/a&gt;</span>`
    const link = document.createElement('a')
    link.href = htmlState.href || '#'
    link.textContent = htmlState.linkText || '(empty content)'
    link.addEventListener('click', (event) => event.preventDefault())
    $('#attr-preview').replaceChildren(link)
  }

  const notes = {
    tag: 'The tag name says what kind of element this is — a link, an image, a paragraph.',
    attr: 'The attribute name is the kind of extra instruction: href, src, alt, type…',
    val: 'The value sits in quotes. Always quote it, even when it’s a file name.',
    content: 'Content sits between the tags. Image tags skip this — they have no inner text.'
  }
  $('#attr-explain').textContent = notes[htmlState.attrBit] || notes.attr
}

function initAttrs() {
  $('#attr-kinds').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-attr-kind]')
    if (!btn) return
    htmlState.attrKind = btn.getAttribute('data-attr-kind')
    htmlState.attrBit = 'attr'
    renderAttrStation()
  })
  $('#attr-anatomy').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-bit]')
    if (!btn) return
    htmlState.attrBit = btn.getAttribute('data-bit')
    renderAttrStation(true)
  })
  renderAttrStation()
}

function pageHighlight(part) {
  if (part === 'title') return 'title'
  if (part === 'head' || part === 'head-close') return 'head'
  if (part === 'hello' || part === 'body' || part === 'body-close') return 'body'
  if (part === 'doctype' || part === 'html' || part === 'html-close') return 'html'
  return part
}

function renderPageStation() {
  $('#page-code').innerHTML = PAGE_LINES.map((row) => {
    const on = row.id === htmlState.pagePart ? ' is-lit' : ''
    return `<span class='code-line${on}' data-page-line='${row.id}'>${row.html}</span>`
  }).join('\n')

  const row = PAGE_LINES.find((item) => item.id === htmlState.pagePart) || PAGE_LINES[5]
  $('#page-explain').textContent = row.explain

  const lit = pageHighlight(htmlState.pagePart)
  $('#page-browser').querySelectorAll('[data-page-part]').forEach((el) => {
    el.classList.toggle('is-on', el.getAttribute('data-page-part') === lit)
  })
}

function initPage() {
  $('#page-code').addEventListener('click', (event) => {
    const line = event.target.closest('[data-page-line]')
    if (!line) return
    htmlState.pagePart = line.getAttribute('data-page-line')
    renderPageStation()
  })
  $('#page-browser').addEventListener('click', (event) => {
    const region = event.target.closest('[data-page-part]')
    if (!region) return
    htmlState.pagePart = region.getAttribute('data-page-part')
    renderPageStation()
  })
  renderPageStation()
}

function soften(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(?:body|html)>/gi, '')
}

function renderTry(html) {
  $('#try-frame').srcdoc =
    '<!doctype html><html><head><meta charset="utf-8"><style>' +
    PREVIEW_CSS +
    '</style></head><body>' +
    soften(html) +
    '</body></html>'
}

function initTry() {
  renderChips($('#try-chips'), TRY_SNIPPETS, TRY_SNIPPETS[0].id, 'data-try')
  $('#try-input').value = TRY_SNIPPETS[0].html
  renderTry(TRY_SNIPPETS[0].html)

  $('#try-chips').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-try]')
    if (!btn) return
    const snippet = TRY_SNIPPETS.find((row) => row.id === btn.getAttribute('data-try'))
    if (!snippet) return
    $('#try-input').value = snippet.html
    renderChips($('#try-chips'), TRY_SNIPPETS, snippet.id, 'data-try')
    renderTry(snippet.html)
  })
  $('#try-input').addEventListener('input', (event) => {
    renderTry(event.target.value)
  })
}

initTags()
initNest()
initAttrs()
initPage()
initTry()
