import { useCallback, useRef, useState } from 'react';
import type { Entry, FolderAccess, FolderRef } from '../access/FolderAccess';

export type BrowserStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'denied';

interface Level {
  folder: FolderRef | null;
  name: string;
}

export interface FolderBrowser {
  supported: boolean;
  status: BrowserStatus;
  entries: Entry[];
  folderName: string | null;
  canGoBack: boolean;
  selectFolder: () => Promise<void>;
  openFolder: (name: string) => Promise<void>;
  goBack: () => Promise<void>;
}

export function sortEntries(entries: Entry[]): Entry[] {
  const rank = (entry: Entry) => (entry.kind === 'folder' ? 0 : 1);
  return [...entries].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

export default function useFolderBrowser(access: FolderAccess): FolderBrowser {
  const [status, setStatus] = useState<BrowserStatus>('idle');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stack, setStack] = useState<Level[]>([]);
  const stackRef = useRef<Level[]>([]);
  const latestRequest = useRef(0);

  const show = useCallback(
    async (next: Level[]) => {
      const request = ++latestRequest.current;
      stackRef.current = next;
      setStack(next);
      const top = next[next.length - 1];
      if (!top || !top.folder) {
        setEntries([]);
        setStatus('denied');
        return;
      }
      setStatus('loading');
      const listed = await access.listEntries(top.folder);
      if (request !== latestRequest.current) {
        return;
      }
      if (listed.status === 'denied') {
        setEntries([]);
        setStatus('denied');
        return;
      }
      const sorted = sortEntries(listed.entries);
      setEntries(sorted);
      setStatus(sorted.length === 0 ? 'empty' : 'loaded');
    },
    [access],
  );

  const selectFolder = useCallback(async () => {
    const chosen = await access.chooseFolder();
    if (chosen.status === 'cancelled') {
      return;
    }
    if (chosen.status === 'denied') {
      latestRequest.current += 1;
      stackRef.current = [];
      setStack([]);
      setEntries([]);
      setStatus('denied');
      return;
    }
    await show([{ folder: chosen.folder, name: chosen.name }]);
  }, [access, show]);

  const openFolder = useCallback(
    async (name: string) => {
      const current = stackRef.current;
      const top = current[current.length - 1];
      if (!top || !top.folder) {
        return;
      }
      const opened = await access.openFolder(top.folder, name);
      if (stackRef.current !== current) {
        return;
      }
      await show([...current, { folder: opened.status === 'ok' ? opened.folder : null, name }]);
    },
    [access, show],
  );

  const goBack = useCallback(async () => {
    const current = stackRef.current;
    if (current.length < 2) {
      return;
    }
    await show(current.slice(0, -1));
  }, [show]);

  return {
    supported: access.isSupported(),
    status,
    entries,
    folderName: stack.length > 0 ? stack[stack.length - 1].name : null,
    canGoBack: stack.length > 1,
    selectFolder,
    openFolder,
    goBack,
  };
}
