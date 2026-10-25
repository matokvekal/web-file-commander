import type { ChooseResult, Entry, FolderAccess, FolderRef, ListResult } from './FolderAccess';

export interface FakeFolder {
  entries: Entry[];
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
      const folder = {} as FolderRef;
      folders.set(folder, pick);
      return { status: 'ok', folder };
    },

    async listEntries(folder: FolderRef): Promise<ListResult> {
      const found = folders.get(folder);
      if (!found) {
        return { status: 'denied' };
      }
      return { status: 'ok', entries: found.entries.map((entry) => ({ ...entry })) };
    },
  };
}
