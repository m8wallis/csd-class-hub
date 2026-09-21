function escapeCode(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function highlightHtmlTag(tagSrc) {
  let out = '<span class="code-punct">&lt;</span>'
  let i = 1
  if (tagSrc[i] === '/') {
    out += '<span class="code-punct">/</span>'
    i += 1
  }
  const name = tagSrc.slice(i).match(/^[a-zA-Z!][\w:.-]*/)
  if (name) {
    out += `<span class="code-tag">${escapeCode(name[0])}</span>`
    i += name[0].length
  }
  while (i < tagSrc.length) {
    const ch = tagSrc[i]
    if (ch === '>') {
      out += '<span class="code-punct">&gt;</span>'
      break
    }
    if (/\s/.test(ch)) {
      out += ch
      i += 1
      continue
    }
    if (ch === '/') {
      out += '<span class="code-punct">/</span>'
      i += 1
      continue
    }
    const attr = tagSrc.slice(i).match(/^[^\s=>/]+/)
    if (!attr) {
      out += escapeCode(ch)
      i += 1
      continue
    }
    out += `<span class="code-attr">${escapeCode(attr[0])}</span>`
    i += attr[0].length
    while (i < tagSrc.length && /\s/.test(tagSrc[i])) {
      out += tagSrc[i]
      i += 1
    }
    if (tagSrc[i] !== '=') continue
    out += '<span class="code-punct">=</span>'
    i += 1
    while (i < tagSrc.length && /\s/.test(tagSrc[i])) {
      out += tagSrc[i]
      i += 1
    }
    if (tagSrc[i] === '"' || tagSrc[i] === "'") {
      const q = tagSrc[i]
      let j = i + 1
      while (j < tagSrc.length && tagSrc[j] !== q) j += 1
      out += `<span class="code-val">${escapeCode(tagSrc.slice(i, j + 1))}</span>`
      i = j + 1
      continue
    }
    const val = tagSrc.slice(i).match(/^[^\s>]+/)
    if (val) {
      out += `<span class="code-val">${escapeCode(val[0])}</span>`
      i += val[0].length
    }
  }
  return out
}

function highlightHtml(src) {
  const text = String(src)
  let i = 0
  let out = ''
  while (i < text.length) {
    if (text.startsWith('<!--', i)) {
      const end = text.indexOf('-->', i)
      const chunk = end === -1 ? text.slice(i) : text.slice(i, end + 3)
      out += `<span class="code-comment">${escapeCode(chunk)}</span>`
      i += chunk.length
      continue
    }
    if (text[i] === '<') {
      const end = text.indexOf('>', i)
      if (end === -1) {
        out += escapeCode(text.slice(i))
        break
      }
      out += highlightHtmlTag(text.slice(i, end + 1))
      i = end + 1
      continue
    }
    const next = text.indexOf('<', i)
    const chunk = next === -1 ? text.slice(i) : text.slice(i, next)
    out += `<span class="code-content">${escapeCode(chunk)}</span>`
    i += chunk.length
  }
  return out
}

function highlightCss(src) {
  const text = String(src)
  let i = 0
  let out = ''
  let mode = 'selector'

  function takeWhile(test) {
    const start = i
    while (i < text.length && test(text[i])) i += 1
    return text.slice(start, i)
  }

  while (i < text.length) {
    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2)
      const chunk = end === -1 ? text.slice(i) : text.slice(i, end + 2)
      out += `<span class="code-comment">${escapeCode(chunk)}</span>`
      i += chunk.length
      continue
    }
    const ch = text[i]
    if (/\s/.test(ch)) {
      out += ch
      i += 1
      continue
    }
    if (ch === '{') {
      out += '<span class="code-punct">{</span>'
      i += 1
      mode = 'property'
      continue
    }
    if (ch === '}') {
      out += '<span class="code-punct">}</span>'
      i += 1
      mode = 'selector'
      continue
    }
    if (ch === ':') {
      out += '<span class="code-punct">:</span>'
      i += 1
      if (mode === 'property') mode = 'value'
      continue
    }
    if (ch === ';') {
      out += '<span class="code-punct">;</span>'
      i += 1
      mode = 'property'
      continue
    }
    if (mode === 'selector') {
      const chunk = takeWhile((c) => !'\{\}/*'.includes(c) && !/\s/.test(c))
      out += `<span class="code-tag">${escapeCode(chunk)}</span>`
      continue
    }
    if (mode === 'property') {
      const chunk = takeWhile((c) => c !== ':' && c !== '{' && c !== '}' && c !== ';' && !/\s/.test(c))
      out += `<span class="code-attr">${escapeCode(chunk)}</span>`
      continue
    }
    const chunk = takeWhile((c) => c !== ';' && c !== '{' && c !== '}' && !text.startsWith('/*', i))
    out += `<span class="code-val">${escapeCode(chunk)}</span>`
  }
  return out
}

function bindCodeEditor(textarea, highlight) {
  const wrap = textarea.closest('.code-editor')
  const pre = wrap && wrap.querySelector('.code-highlight')
  if (!wrap || !pre) return function () {}

  function paint() {
    pre.innerHTML = highlight(textarea.value) + '\n'
    pre.scrollTop = textarea.scrollTop
    pre.scrollLeft = textarea.scrollLeft
  }

  textarea.addEventListener('input', paint)
  textarea.addEventListener('scroll', () => {
    pre.scrollTop = textarea.scrollTop
    pre.scrollLeft = textarea.scrollLeft
  })
  paint()
  return paint
}

window.CSD_HIGHLIGHT = {
  html: highlightHtml,
  css: highlightCss,
  bindEditor: bindCodeEditor
}
