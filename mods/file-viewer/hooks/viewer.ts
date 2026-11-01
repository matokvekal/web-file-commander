export const MAX_BYTES = 200 * 1024
export const MAX_LINES = 500
export const HIDDEN = ['.git', 'node_modules']

export type Lang = 'ts' | 'css' | 'json'
export type Kind = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'key'
export type Token = { text: string; kind: Kind }

export const formatSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`

export const isSafePath = (path: unknown): path is string => {
  if (typeof path !== 'string' || path === '' || path.length > 512) return false
  if (/[\u0000-\u001f\\:]/.test(path) || path.startsWith('/')) return false
  return path
    .split('/')
    .every(part => !/^[. ]*$/.test(part) && !HIDDEN.includes(part.trim()))
}

export const clean = (text: string) =>
  text.replace(/[\t]/g, '  ').replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, '·')

const normalize = (path: string) => path.replace(/\\/g, '/').replace(/\/+$/, '')

export const isInside = (root: string, real: string) => {
  const a = normalize(root)
  const b = normalize(real)
  const fold = /^[A-Za-z]:/.test(a)
  const base = fold ? a.toLowerCase() : a
  const target = fold ? b.toLowerCase() : b
  return base !== '' && target.startsWith(`${base}/`)
}

export const isBinary = (text: string) => {
  const sample = text.slice(0, 8192)
  if (sample.includes('\u0000')) return true
  let bad = 0
  for (const char of sample) if (char.charCodeAt(0) === 0xfffd) bad++
  return sample.length > 0 && bad / sample.length > 0.01
}

export const langOf = (path: string): Lang | undefined => {
  const name = path.toLowerCase()
  if (/\.(ts|tsx|mts|cts)$/.test(name)) return 'ts'
  if (name.endsWith('.css')) return 'css'
  if (name.endsWith('.json')) return 'json'
  return undefined
}

const TS_KEYWORDS = new Set(
  'import export from default const let var function return if else for while do switch case break continue new class extends implements interface type enum async await try catch finally throw typeof instanceof in of as void null undefined true false this static public private readonly'.split(
    ' ',
  ),
)

const RULES: Record<Lang, [Kind, RegExp][]> = {
  ts: [
    ['comment', /\/\/.*/y],
    ['string', /"(?:[^"\\]|\\.)*"?/y],
    ['string', /'(?:[^'\\]|\\.)*'?/y],
    ['string', /`(?:[^`\\]|\\.)*`?/y],
    ['number', /\d[\d_.]*/y],
    ['keyword', /[A-Za-z_$][\w$]*/y],
  ],
  css: [
    ['string', /"(?:[^"\\]|\\.)*"?/y],
    ['string', /'(?:[^'\\]|\\.)*'?/y],
    ['keyword', /@[\w-]+/y],
    ['number', /#[0-9a-fA-F]{3,8}\b/y],
    ['key', /[A-Za-z-][\w-]*(?=\s*:)/y],
    ['number', /-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?/y],
  ],
  json: [
    ['key', /"(?:[^"\\]|\\.)*"(?=\s*:)/y],
    ['string', /"(?:[^"\\]|\\.)*"?/y],
    ['keyword', /\b(?:true|false|null)\b/y],
    ['number', /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
  ],
}

const BLOCK_START = /\/\*.*?(\*\/|$)/y
const BLOCK_END = /.*?\*\//y

const push = (tokens: Token[], text: string, kind: Kind) => {
  const last = tokens[tokens.length - 1]
  if (last && last.kind === kind) last.text += text
  else tokens.push({ text, kind })
}

export const highlightLines = (text: string, lang: Lang | undefined): Token[][] => {
  const lines = text
    .split(/\r?\n/)
    .slice(0, MAX_LINES)
    .map(clean)
  if (lang === undefined) return lines.map(line => [{ text: line, kind: 'plain' }])
  let inBlock = false
  return lines.map(line => {
    const tokens: Token[] = []
    let pos = 0
    while (pos < line.length) {
      if (inBlock) {
        BLOCK_END.lastIndex = pos
        const end = BLOCK_END.exec(line)
        const stop = end ? pos + end[0].length : line.length
        push(tokens, line.slice(pos, stop), 'comment')
        inBlock = !end
        pos = stop
        continue
      }
      if (lang !== 'json') {
        BLOCK_START.lastIndex = pos
        const start = BLOCK_START.exec(line)
        if (start) {
          push(tokens, start[0], 'comment')
          inBlock = start[1] !== '*/'
          pos += start[0].length
          continue
        }
      }
      let matched = false
      for (const [kind, rule] of RULES[lang]) {
        rule.lastIndex = pos
        const hit = rule.exec(line)
        if (hit && hit[0] !== '') {
          const isKeyword = kind === 'keyword' && lang === 'ts'
          push(tokens, hit[0], isKeyword && !TS_KEYWORDS.has(hit[0]) ? 'plain' : kind)
          pos += hit[0].length
          matched = true
          break
        }
      }
      if (!matched) {
        push(tokens, line[pos], 'plain')
        pos++
      }
    }
    return tokens
  })
}
