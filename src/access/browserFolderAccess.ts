import type { ChooseResult, Entry, FolderAccess, FolderRef, ListResult } from './FolderAccess';

interface DirectoryEntryHandle {
  readonly name: string;
  readonly kind: 'file' | 'directory';
}

interface DirectoryHandle extends DirectoryEntryHandle {
  values(): AsyncIterable<DirectoryEntryHandle>;
}

interface PickerHost {
  isSecureContext?: boolean;
  showDirectoryPicker?: (options?: { mode?: 'read' }) => Promise<DirectoryHandle>;
}

const host = globalThis as unknown as PickerHost;
const handles = new WeakMap<FolderRef, DirectoryHandle>();

const browserFolderAccess: FolderAccess = {
  isSupported() {
    return host.isSecureContext !== false && typeof host.showDirectoryPicker === 'function';
  },

  async chooseFolder(): Promise<ChooseResult> {
    try {
      const handle = await host.showDirectoryPicker!({ mode: 'read' });
      const folder = {} as FolderRef;
      handles.set(folder, handle);
      return { status: 'ok', folder };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { status: 'cancelled' };
      }
      return { status: 'denied' };
    }
  },

  async listEntries(folder: FolderRef): Promise<ListResult> {
    const handle = handles.get(folder);
    if (!handle) {
      return { status: 'denied' };
    }
    try {
      const entries: Entry[] = [];
      for await (const item of handle.values()) {
        entries.push({ name: item.name, kind: item.kind === 'directory' ? 'folder' : 'file' });
      }
      return { status: 'ok', entries };
    } catch {
      return { status: 'denied' };
    }
  },
};

export default browserFolderAccess;
