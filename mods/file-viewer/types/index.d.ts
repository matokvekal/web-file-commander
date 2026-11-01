export type OpenDirs = string[]

declare module 'claude-code' {
  interface PluginState {
    'file-viewer': { openDirs: Shaped<OpenDirs> }
  }
}
