import { describe, expect, it } from 'vitest'

import {
  MAX_LINES,
  clean,
  formatSize,
  highlightLines,
  isBinary,
  isInside,
  isSafePath,
  langOf,
} from '../mods/file-viewer/hooks/viewer.ts'

const kinds = (line: string, lang: 'ts' | 'css' | 'json') =>
  highlightLines(line, lang)[0].map(token => `${token.kind}:${token.text}`)

describe('file-viewer isSafePath', () => {
  it.each([
    '',
    '.',
    '..',
    '../secret.txt',
    'a/../../secret.txt',
    'src/../../x',
    'a/..',
    '/etc/passwd',
    'C:/Windows/win.ini',
    'C:\\Windows\\win.ini',
    'src\\App.tsx',
    'a//b',
    './a',
    'a/./b',
    '.. ',
    '...',
    'a\u0000b',
    '.git/config',
    'src/.git/x',
    'node_modules/pkg/index.js',
    'a'.repeat(513),
  ])('rejects %j', path => {
    expect(isSafePath(path)).toBe(false)
  })

  it('rejects non-strings', () => {
    expect(isSafePath(undefined)).toBe(false)
    expect(isSafePath(42)).toBe(false)
  })

  it.each(['package.json', 'src/App.tsx', '.gitignore', 'docs/a b.md'])('accepts %j', path => {
    expect(isSafePath(path)).toBe(true)
  })
})

describe('file-viewer isInside', () => {
  it('accepts a file below the root', () => {
    expect(isInside('E:\\proj', 'E:\\proj\\src\\a.ts')).toBe(true)
    expect(isInside('/home/u/p', '/home/u/p/a')).toBe(true)
  })

  it('rejects a sibling with the same prefix, the root itself and outside paths', () => {
    expect(isInside('E:\\proj', 'E:\\proj2\\a.ts')).toBe(false)
    expect(isInside('E:\\proj', 'E:\\proj')).toBe(false)
    expect(isInside('E:\\proj', 'C:\\Windows\\win.ini')).toBe(false)
    expect(isInside('/home/u/p', '/home/u/pp/a')).toBe(false)
    expect(isInside('', '/a')).toBe(false)
  })

  it('folds case on drive paths only', () => {
    expect(isInside('E:\\Proj', 'e:\\proj\\a')).toBe(true)
    expect(isInside('/home/u/P', '/home/u/p/a')).toBe(false)
  })
})

describe('file-viewer isBinary', () => {
  it('detects NUL bytes and replacement characters', () => {
    expect(isBinary('abc\u0000def')).toBe(true)
    expect(isBinary('\ufffd'.repeat(50) + 'text')).toBe(true)
  })

  it('accepts text', () => {
    expect(isBinary('')).toBe(false)
    expect(isBinary('export const a = 1\n')).toBe(false)
  })
})

describe('file-viewer clean', () => {
  it('replaces terminal control characters and expands tabs', () => {
    expect(clean('a\u001b[31mred\u0007')).toBe('a·[31mred·')
    expect(clean('a\tb')).toBe('a  b')
    expect(highlightLines('\u001b]0;x\u0007', undefined)[0][0].text).toBe('·]0;x·')
  })
})

describe('file-viewer helpers', () => {
  it('formats sizes', () => {
    expect(formatSize(12)).toBe('12 B')
    expect(formatSize(2048)).toBe('2.0 KB')
    expect(formatSize(3 * 1024 * 1024)).toBe('3.0 MB')
  })

  it('detects the language from the extension', () => {
    expect(langOf('a/b.TSX')).toBe('ts')
    expect(langOf('x.css')).toBe('css')
    expect(langOf('package.json')).toBe('json')
    expect(langOf('README.md')).toBeUndefined()
  })
})

describe('file-viewer highlightLines', () => {
  it('highlights TypeScript', () => {
    expect(kinds("const a = 'x' // note", 'ts')).toEqual([
      'keyword:const',
      'plain: a = ',
      "string:'x'",
      'plain: ',
      'comment:// note',
    ])
    expect(kinds('return 42', 'ts')).toEqual(['keyword:return', 'plain: ', 'number:42'])
  })

  it('carries a block comment across lines', () => {
    const lines = highlightLines('a /* one\ntwo */ b', 'ts')
    expect(lines[0].at(-1)).toEqual({ text: '/* one', kind: 'comment' })
    expect(lines[1][0]).toEqual({ text: 'two */', kind: 'comment' })
    expect(lines[1].at(-1)).toEqual({ text: ' b', kind: 'plain' })
  })

  it('highlights CSS', () => {
    expect(kinds('color: #fff;', 'css')).toEqual(['key:color', 'plain:: ', 'number:#fff', 'plain:;'])
    expect(kinds('@media', 'css')).toEqual(['keyword:@media'])
  })

  it('highlights JSON keys, strings, numbers and literals', () => {
    expect(kinds('"a": [1, true, "b"]', 'json')).toEqual([
      'key:"a"',
      'plain:: [',
      'number:1',
      'plain:, ',
      'keyword:true',
      'plain:, ',
      'string:"b"',
      'plain:]',
    ])
  })

  it('returns plain lines without a language and caps the line count', () => {
    expect(highlightLines('a\r\nb', undefined)).toEqual([
      [{ text: 'a', kind: 'plain' }],
      [{ text: 'b', kind: 'plain' }],
    ])
    expect(highlightLines('x\n'.repeat(MAX_LINES + 50), 'ts')).toHaveLength(MAX_LINES)
  })

  it('does not loop on an unterminated string', () => {
    expect(kinds('"abc', 'json')).toEqual(['string:"abc'])
  })
})
