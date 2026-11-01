export type OpenDirs = string[]
export type SelectedFile = string

declare module 'claude-code' {
  interface PluginState {
    'file-viewer': {
      openDirs: Shaped<OpenDirs>
      selected: Shaped<SelectedFile>
    }
  }
}
