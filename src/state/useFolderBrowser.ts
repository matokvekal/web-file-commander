import { useCallback, useState } from 'react';
import type { Entry, FolderAccess } from '../access/FolderAccess';

export type BrowserStatus = 'idle' | 'loading' | 'loaded' | 'empty' | 'denied';

export interface FolderBrowser {
  supported: boolean;
  status: BrowserStatus;
  entries: Entry[];
  selectFolder: () => Promise<void>;
}

export function sortEntries(entries: Entry[]): Entry[] {
  const rank = (entry: Entry) => (entry.kind === 'folder' ? 0 : 1);
  return [...entries].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

export default function useFolderBrowser(access: FolderAccess): FolderBrowser {
  const [status, setStatus] = useState<BrowserStatus>('idle');
  const [entries, setEntries] = useState<Entry[]>([]);

  const selectFolder = useCallback(async () => {
    const chosen = await access.chooseFolder();
    if (chosen.status === 'cancelled') {
      return;
    }
    if (chosen.status === 'denied') {
      setEntries([]);
      setStatus('denied');
      return;
    }
    const listed = await access.listEntries(chosen.folder);
    if (listed.status === 'denied') {
      setEntries([]);
      setStatus('denied');
      return;
    }
    const sorted = sortEntries(listed.entries);
    setEntries(sorted);
    setStatus(sorted.length === 0 ? 'empty' : 'loaded');
  }, [access]);

  return { supported: access.isSupported(), status, entries, selectFolder };
}
