import type {
  ChooseResult,
  Entry,
  FolderAccess,
  FolderRef,
  ListResult,
  OpenResult,
} from './FolderAccess';

export interface FakeFolder {
  name?: string;
  entries: Entry[];
  children?: Record<string, FakeFolder>;
  delayMs?: number;
  failListing?: boolean;
}

export type FakePick = FakeFolder | 'cancelled' | 'denied';

export interface FakeOptions {
  supported?: boolean;
  picks?: FakePick[];
}

export default function createFakeFolderAccess(options: FakeOptions = {}): FolderAccess {
  const supported = options.supported ?? true;
  const picks = [...(options.picks ?? [])];
  const folders = new WeakMap<FolderRef, FakeFolder>();

  function wrap(folder: FakeFolder): FolderRef {
    const ref = {} as FolderRef;
    folders.set(ref, folder);
    return ref;
  }

  return {
    isSupported() {
      return supported;
    },

    async chooseFolder(): Promise<ChooseResult> {
      const pick = picks.shift();
      if (pick === undefined || pick === 'cancelled') {
        return { status: 'cancelled' };
      }
      if (pick === 'denied') {
        return { status: 'denied' };
      }
      return { status: 'ok', folder: wrap(pick), name: pick.name ?? 'folder' };
    },

    async listEntries(folder: FolderRef): Promise<ListResult> {
      const found = folders.get(folder);
      if (!found) {
        return { status: 'denied' };
      }
      if (found.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, found.delayMs));
      }
      if (found.failListing) {
        return { status: 'denied' };
      }
      return { status: 'ok', entries: found.entries.map((entry) => ({ ...entry })) };
    },

    async openFolder(parent: FolderRef, name: string): Promise<OpenResult> {
      const child = folders.get(parent)?.children?.[name];
      if (!child) {
        return { status: 'denied' };
      }
      return { status: 'ok', folder: wrap(child) };
    },
  };
}
