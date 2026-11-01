import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import {
  HIDDEN,
  MAX_BYTES,
  MAX_LINES,
  clean,
  formatSize,
  highlightLines,
  isBinary,
  isInside,
  isSafePath,
  langOf,
} from './viewer.ts'
import type { Kind, Token } from './viewer.ts'

const PANE = 'file-viewer'
const HIDDEN_NAMES = new Set(HIDDEN)
const MAX_ROWS = 300

const openDirs = atom({ plugin: 'file-viewer', key: 'openDirs' } as const, [], {
  shape: 'open-dirs-1',
})

const selectedFile = atom({ plugin: 'file-viewer', key: 'selected' } as const, '', {
  shape: 'selected-1',
})

type Row = { path: string; name: string; depth: number; isDir: boolean; size: number }

type Detail = { path: string; size?: number; message?: string; lines?: Token[][] }

const COLORS: Record<Kind, string | undefined> = {
  plain: undefined,
  keyword: 'suggestion',
  string: 'success',
  number: 'warning',
  comment: 'inactive',
  key: 'permission',
}

const insideProject = async ($: EngineInterface, path: string) => {
  if (!isSafePath(path)) return undefined
  try {
    const root = await $.session.root()
    const stat = await $.fs.stat(path, { resolve: true })
    return stat.realPath !== undefined && isInside(root, stat.realPath) ? stat : undefined
  } catch {
    return undefined
  }
}

const loadFile = async ($: EngineInterface, path: string): Promise<Detail> => {
  const stat = await insideProject($, path)
  if (stat === undefined) {
    return { path: '(rejected)', message: 'Rejected: the path is not inside the project root.' }
  }
  try {
    if (stat.kind !== 'file') return { path, message: 'Not a regular file.' }
    if (stat.size > MAX_BYTES) {
      return {
        path,
        size: stat.size,
        message: `File is too large to preview (${formatSize(stat.size)}; the limit is ${formatSize(MAX_BYTES)}).`,
      }
    }
    const text = await $.fs.read(path)
    if (isBinary(text)) return { path, size: stat.size, message: 'Binary file: no preview.' }
    return { path, size: stat.size, lines: highlightLines(text, langOf(path)) }
  } catch {
    return { path, message: 'This file cannot be read.' }
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'file-viewer',
      description: 'Open the project file tree in a pane beside the chat',
    })

    return next(e)
  })

  on('command.run', { command: 'file-viewer' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Files' })

    return { text: 'File viewer pane opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const open = new Set(await read($, openDirs))
    const selected = await read($, selectedFile)
    const rows: Row[] = []

    const walk = async (dir: string, depth: number) => {
      const entries = (await $.fs.list(dir === '' ? undefined : dir)).filter(
        entry => !HIDDEN_NAMES.has(entry.name) && entry.kind !== 'other',
      )
      entries.sort((a, b) =>
        a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1,
      )
      for (const entry of entries) {
        if (rows.length >= MAX_ROWS) return
        const path = dir === '' ? entry.name : `${dir}/${entry.name}`
        const isDir = entry.kind === 'dir'
        rows.push({ path, name: entry.name, depth, isDir, size: entry.size })
        if (isDir && open.has(path) && (await insideProject($, path))) await walk(path, depth + 1)
      }
    }

    await walk('', 0)

    const detail = selected === '' ? undefined : await loadFile($, selected)

    const toggle = (path: string) =>
      update($, openDirs, list =>
        list.includes(path) ? list.filter(one => one !== path) : [...list, path],
      )

    const select = (path: string) => update($, selectedFile, () => path)

    const width = String(detail?.lines?.length ?? 0).length

    return (
      <Box flexDirection="column">
        {rows.length === 0 && <Text dimColor>No files.</Text>}
        {rows.map(row =>
          row.isDir ? (
            <Button key={row.path} onPress={() => toggle(row.path)}>
              <Text>
                {'  '.repeat(row.depth)}
                {open.has(row.path) ? '▾' : '▸'} {clean(row.name)}/
              </Text>
            </Button>
          ) : (
            <Button key={row.path} onPress={() => select(row.path)}>
              <Text inverse={row.path === selected}>
                {'  '.repeat(row.depth)}  {clean(row.name)} <Text dimColor>{formatSize(row.size)}</Text>
              </Text>
            </Button>
          ),
        )}
        {rows.length >= MAX_ROWS && <Text dimColor>List cut at {MAX_ROWS} rows.</Text>}
        {detail && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>{clean(detail.path)}</Text>
            {detail.size !== undefined && <Text dimColor>{formatSize(detail.size)}</Text>}
            {detail.message && <Text color="warning">{detail.message}</Text>}
            {detail.lines?.map((tokens, index) => (
              <Text key={String(index)}>
                <Text dimColor>{String(index + 1).padStart(width)} </Text>
                {tokens.map((token, at) => (
                  <Text key={String(at)} color={COLORS[token.kind]}>
                    {token.text}
                  </Text>
                ))}
              </Text>
            ))}
            {detail.lines && detail.lines.length >= MAX_LINES && (
              <Text dimColor>Showing the first {MAX_LINES} lines.</Text>
            )}
          </Box>
        )}
      </Box>
    )
  })
}
