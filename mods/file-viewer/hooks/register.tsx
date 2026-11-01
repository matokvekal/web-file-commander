import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const PANE = 'file-viewer'
const HIDDEN = new Set(['.git', 'node_modules'])
const MAX_ROWS = 300

const openDirs = atom({ plugin: 'file-viewer', key: 'openDirs' } as const, [], {
  shape: 'open-dirs-1',
})

type Row = { path: string; name: string; depth: number; isDir: boolean; size: number }

const formatSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`

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
    const rows: Row[] = []

    const walk = async (dir: string, depth: number) => {
      const entries = (await $.fs.list(dir === '' ? undefined : dir)).filter(
        entry => !HIDDEN.has(entry.name) && entry.kind !== 'other',
      )
      entries.sort((a, b) =>
        a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1,
      )
      for (const entry of entries) {
        if (rows.length >= MAX_ROWS) return
        const path = dir === '' ? entry.name : `${dir}/${entry.name}`
        const isDir = entry.kind === 'dir'
        rows.push({ path, name: entry.name, depth, isDir, size: entry.size })
        if (isDir && open.has(path)) await walk(path, depth + 1)
      }
    }

    await walk('', 0)

    const toggle = (path: string) =>
      update($, openDirs, list =>
        list.includes(path) ? list.filter(one => one !== path) : [...list, path],
      )

    return (
      <Box flexDirection="column">
        {rows.length === 0 && <Text dimColor>No files.</Text>}
        {rows.map(row =>
          row.isDir ? (
            <Button key={row.path} onPress={() => toggle(row.path)}>
              <Text>
                {'  '.repeat(row.depth)}
                {open.has(row.path) ? '▾' : '▸'} {row.name}/
              </Text>
            </Button>
          ) : (
            <Text key={row.path}>
              {'  '.repeat(row.depth)}  {row.name} <Text dimColor>{formatSize(row.size)}</Text>
            </Text>
          ),
        )}
        {rows.length >= MAX_ROWS && <Text dimColor>List cut at {MAX_ROWS} rows.</Text>}
      </Box>
    )
  })
}
