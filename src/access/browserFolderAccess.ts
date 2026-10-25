import type {
  ChooseResult,
  Entry,
  FolderAccess,
  FolderRef,
  ListResult,
  OpenResult,
} from './FolderAccess';

interface DirectoryEntryHandle {
  readonly name: string;
  readonly kind: 'file' | 'directory';
}

interface DirectoryHandle extends DirectoryEntryHandle {
  values(): AsyncIterable<DirectoryEntryHandle>;
  getDirectoryHandle(name: string): Promise<DirectoryHandle>;
}

interface PickerHost {
  isSecureContext?: boolean;
  showDirectoryPicker?: (options?: { mode?: 'read' }) => Promise<DirectoryHandle>;
}

const host = globalThis as unknown as PickerHost;
const handles = new WeakMap<FolderRef, DirectoryHandle>();

function wrap(handle: DirectoryHandle): FolderRef {
  const folder = {} as FolderRef;
  handles.set(folder, handle);
  return folder;
}

const browserFolderAccess: FolderAccess = {
  isSupported() {
    return host.isSecureContext !== false && typeof host.showDirectoryPicker === 'function';
  },

  async chooseFolder(): Promise<ChooseResult> {
    try {
      const handle = await host.showDirectoryPicker!({ mode: 'read' });
      return { status: 'ok', folder: wrap(handle), name: handle.name };
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

  async openFolder(parent: FolderRef, name: string): Promise<OpenResult> {
    const handle = handles.get(parent);
    if (!handle) {
      return { status: 'denied' };
    }
    try {
      return { status: 'ok', folder: wrap(await handle.getDirectoryHandle(name)) };
    } catch {
      return { status: 'denied' };
    }
  },
};

export default browserFolderAccess;
