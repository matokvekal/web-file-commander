import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
import createFakeFolderAccess from './access/fakeFolderAccess';
import type { FakeOptions } from './access/fakeFolderAccess';
import { sortEntries } from './state/useFolderBrowser';

afterEach(cleanup);

function renderApp(options: FakeOptions = {}) {
  return render(<App access={createFakeFolderAccess(options)} />);
}

const mixedFolder = {
  entries: [
    { name: 'notes.txt', kind: 'file' as const },
    { name: 'Photos', kind: 'folder' as const },
    { name: 'a.md', kind: 'file' as const },
    { name: 'Docs', kind: 'folder' as const },
    { name: 'b.md', kind: 'file' as const },
  ],
};

describe('App', () => {
  it('renders the application name', () => {
    const { container } = renderApp();
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe('Web File Commander');
  });

  it('shows the start state with empty Folder Tree and Preview panels', () => {
    const { container } = renderApp();
    expect(screen.getByText('Select a folder to start.')).not.toBeNull();
    expect(screen.getByLabelText('Status bar').textContent).toBe('Ready');
    expect(screen.getByRole('button', { name: 'Select Folder' })).not.toBeNull();
    const bodies = container.querySelectorAll('.panel-tree .panel-body, .panel-preview .panel-body');
    expect(bodies).toHaveLength(2);
    bodies.forEach((body) => expect(body.textContent).toBe(''));
  });

  it('lists all entries once, subfolders first, then files, each alphabetical', async () => {
    const { container } = renderApp({ picks: [mixedFolder] });
    fireEvent.click(screen.getByRole('button', { name: 'Select Folder' }));
    await screen.findByText('Docs/');
    const rows = Array.from(container.querySelectorAll('.entry-row'));
    expect(rows.map((row) => row.textContent)).toEqual(['Docs/', 'Photos/', 'a.md', 'b.md', 'notes.txt']);
    expect(rows[0].classList.contains('entry-folder')).toBe(true);
    expect(rows[2].classList.contains('entry-folder')).toBe(false);
    expect(screen.getByLabelText('Status bar').textContent).toBe('5 items');
  });

  it('shows the empty-folder message for a folder with no entries', async () => {
    renderApp({ picks: [{ entries: [] }] });
    fireEvent.click(screen.getByRole('button', { name: 'Select Folder' }));
    await screen.findByText('This folder is empty.');
    expect(screen.getByLabelText('Status bar').textContent).toBe('0 items');
  });

  it('replaces the list when a different folder is selected', async () => {
    const { container } = renderApp({
      picks: [mixedFolder, { entries: [{ name: 'only.txt', kind: 'file' }] }],
    });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    await screen.findByText('Docs/');
    fireEvent.click(button);
    await screen.findByText('only.txt');
    const rows = Array.from(container.querySelectorAll('.entry-row'));
    expect(rows.map((row) => row.textContent)).toEqual(['only.txt']);
  });

  it('keeps the previous state when the picker is cancelled', async () => {
    renderApp({ picks: [mixedFolder, 'cancelled'] });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    await screen.findByText('Docs/');
    fireEvent.click(button);
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.getByText('Docs/')).not.toBeNull();
    expect(screen.getByLabelText('Status bar').textContent).toBe('5 items');
  });

  it('shows the unsupported-browser message and disables Select Folder', () => {
    renderApp({ supported: false });
    expect(
      screen.getByText("This browser can't open folders. Use Chrome or Edge on localhost or HTTPS."),
    ).not.toBeNull();
    const button = screen.getByRole('button', { name: 'Select Folder' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByLabelText('Status bar').textContent).toBe('Ready');
  });
});

function listText(container: HTMLElement) {
  return container.querySelector('.panel-list .panel-body')?.textContent;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('loading and access denied', () => {
  it('shows Loading… while a folder loads, then the entries', async () => {
    const { container } = renderApp({
      picks: [{ entries: [{ name: 'a.txt', kind: 'file' }], delayMs: 60 }],
    });
    fireEvent.click(screen.getByRole('button', { name: 'Select Folder' }));
    await waitFor(() => expect(listText(container)).toBe('Loading…'));
    expect(screen.getByLabelText('Status bar').textContent).toBe('Loading…');
    await screen.findByText('a.txt');
    expect(container.textContent).not.toContain('Loading…');
    expect(screen.getByLabelText('Status bar').textContent).toBe('1 item');
  });

  it('shows Access Denied in bold with no entries when the user denies access', async () => {
    const { container } = renderApp({ picks: ['denied'] });
    fireEvent.click(screen.getByRole('button', { name: 'Select Folder' }));
    await screen.findByText('Access Denied');
    expect(screen.getByText('Access Denied').classList.contains('panel-message-strong')).toBe(true);
    expect(container.querySelectorAll('.entry-row')).toHaveLength(0);
    expect(screen.getByLabelText('Status bar').textContent).toBe('Access denied');
  });

  it('shows the same message when reading the folder fails, and clears the old list', async () => {
    const { container } = renderApp({
      picks: [mixedFolder, { entries: [], failListing: true }],
    });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    await screen.findByText('Docs/');
    fireEvent.click(button);
    await screen.findByText('Access Denied');
    expect(container.querySelectorAll('.entry-row')).toHaveLength(0);
  });

  it('recovers after a denial when a readable folder is picked', async () => {
    renderApp({ picks: ['denied', mixedFolder] });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    await screen.findByText('Access Denied');
    fireEvent.click(button);
    await screen.findByText('Docs/');
    expect(screen.queryByText('Access Denied')).toBeNull();
  });

  it('cancelling the picker neither shows Access Denied nor clears the list', async () => {
    renderApp({ picks: [mixedFolder, 'cancelled'] });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    await screen.findByText('Docs/');
    fireEvent.click(button);
    await wait(20);
    expect(screen.queryByText('Access Denied')).toBeNull();
    expect(screen.getByText('Docs/')).not.toBeNull();
    expect(screen.getByLabelText('Status bar').textContent).toBe('5 items');
  });

  it('ignores a slow earlier load that finishes after a newer one', async () => {
    const { container } = renderApp({
      picks: [
        { entries: [{ name: 'slow.txt', kind: 'file' }], delayMs: 80 },
        { entries: [{ name: 'fast.txt', kind: 'file' }] },
      ],
    });
    const button = screen.getByRole('button', { name: 'Select Folder' });
    fireEvent.click(button);
    fireEvent.click(button);
    await screen.findByText('fast.txt');
    await wait(150);
    expect(container.querySelector('.panel-list .panel-body')?.textContent).toBe('fast.txt');
  });

  it('announces messages through a polite live region', () => {
    const { container } = renderApp();
    expect(container.querySelector('.panel-list .panel-body')?.getAttribute('aria-live')).toBe('polite');
  });
});

const tree = {
  name: 'Root',
  entries: [
    { name: 'Docs', kind: 'folder' as const },
    { name: 'Locked', kind: 'folder' as const },
    { name: 'readme.txt', kind: 'file' as const },
  ],
  children: {
    Docs: {
      entries: [
        { name: 'guide.md', kind: 'file' as const },
        { name: 'Deep', kind: 'folder' as const },
      ],
      children: { Deep: { entries: [{ name: 'deep.txt', kind: 'file' as const }] } },
    },
    Locked: { entries: [], failListing: true },
  },
};

async function openRoot() {
  const view = renderApp({ picks: [tree] });
  fireEvent.click(screen.getByRole('button', { name: 'Select Folder' }));
  await screen.findByText('Docs/');
  return view;
}

describe('subfolders and going back', () => {
  it('shows the selected folder name and no Back button at the chosen folder', async () => {
    const { container } = await openRoot();
    expect(container.querySelector('.folder-name')?.textContent).toBe('Root');
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('opens a subfolder on click and shows its entries, name and Back', async () => {
    const { container } = await openRoot();
    fireEvent.click(screen.getByText('Docs/'));
    await screen.findByText('guide.md');
    expect(container.querySelector('.folder-name')?.textContent).toBe('Docs');
    expect(screen.getByRole('button', { name: 'Back' })).not.toBeNull();
    expect(screen.getByLabelText('Status bar').textContent).toBe('2 items');
  });

  it('exposes each subfolder row as a button with the folder name', async () => {
    await openRoot();
    const button = screen.getByRole('button', { name: 'Docs/' });
    expect(button.tagName).toBe('BUTTON');
    fireEvent.click(button);
    await screen.findByText('guide.md');
  });

  it('does nothing when a file row is clicked or Enter is pressed', async () => {
    const { container } = await openRoot();
    expect(screen.queryByRole('button', { name: 'readme.txt' })).toBeNull();
    fireEvent.click(screen.getByText('readme.txt'));
    fireEvent.keyDown(screen.getByText('readme.txt'), { key: 'Enter' });
    await wait(20);
    expect(container.querySelector('.folder-name')?.textContent).toBe('Root');
    expect(screen.getByText('Docs/')).not.toBeNull();
  });

  it('goes back to the parent folder and hides Back at the chosen folder', async () => {
    const { container } = await openRoot();
    fireEvent.click(screen.getByText('Docs/'));
    await screen.findByText('guide.md');
    fireEvent.click(screen.getByText('Deep/'));
    await screen.findByText('deep.txt');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await screen.findByText('guide.md');
    expect(container.querySelector('.folder-name')?.textContent).toBe('Docs');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await screen.findByText('readme.txt');
    expect(container.querySelector('.folder-name')?.textContent).toBe('Root');
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('shows Access Denied for a refused subfolder and still lets the user go back', async () => {
    await openRoot();
    fireEvent.click(screen.getByText('Locked/'));
    await screen.findByText('Access Denied');
    expect(screen.getByLabelText('Status bar').textContent).toBe('Access denied');
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await screen.findByText('readme.txt');
  });

  it('makes every entry row reachable by keyboard', async () => {
    const { container } = await openRoot();
    const rows = Array.from(container.querySelectorAll('.entry-row'));
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      const label = row.querySelector('.entry-label') as HTMLElement;
      expect(label.tagName === 'BUTTON' || label.getAttribute('tabindex') === '0').toBe(true);
    });
  });
});

describe('sortEntries', () => {
  it('does not change the input array', () => {
    const input = [...mixedFolder.entries];
    sortEntries(input);
    expect(input).toEqual(mixedFolder.entries);
  });
});

describe('architecture guard (AD-2)', () => {
  it('keeps browser file APIs inside src/access/', () => {
    const sources = import.meta.glob('./**/*.{ts,tsx}', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    const offenders = Object.entries(sources)
      .filter(([path]) => !path.startsWith('./access/') && !path.includes('.test.'))
      .filter(([, text]) => /showDirectoryPicker|FileSystemDirectoryHandle|FileSystemFileHandle/.test(text))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it('exposes no write operations on the FolderAccess port', () => {
    const sources = import.meta.glob('./access/FolderAccess.ts', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    const text = Object.values(sources)[0];
    expect(/write|delete|remove|move|upload/i.test(text)).toBe(false);
  });
});
