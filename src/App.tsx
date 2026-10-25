import type { FolderAccess } from './access/FolderAccess';
import useFolderBrowser from './state/useFolderBrowser';

interface AppProps {
  access: FolderAccess;
}

export default function App({ access }: AppProps) {
  const { supported, status, entries, folderName, canGoBack, selectFolder, openFolder, goBack } =
    useFolderBrowser(access);

  let listBody;
  let statusText = 'Ready';
  if (!supported) {
    listBody = (
      <p className="panel-message">
        This browser can't open folders. Use Chrome or Edge on localhost or HTTPS.
      </p>
    );
  } else if (status === 'idle') {
    listBody = <p className="panel-message">Select a folder to start.</p>;
  } else if (status === 'loading') {
    listBody = <p className="panel-message">Loading…</p>;
    statusText = 'Loading…';
  } else if (status === 'denied') {
    listBody = <p className="panel-message panel-message-strong">Access Denied</p>;
    statusText = 'Access denied';
  } else if (status === 'empty') {
    listBody = <p className="panel-message">This folder is empty.</p>;
    statusText = '0 items';
  } else if (status === 'loaded') {
    listBody = (
      <ul className="entry-list">
        {entries.map((entry) => (
          <li
            key={`${entry.kind}:${entry.name}`}
            className={entry.kind === 'folder' ? 'entry-row entry-folder' : 'entry-row'}
          >
            {entry.kind === 'folder' ? (
              <button
                type="button"
                className="entry-label entry-open"
                onClick={() => void openFolder(entry.name)}
              >
                {`${entry.name}/`}
              </button>
            ) : (
              <span className="entry-label" tabIndex={0}>
                {entry.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
    statusText = `${entries.length} ${entries.length === 1 ? 'item' : 'items'}`;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Web File Commander</h1>
        <button
          type="button"
          className="button"
          disabled={!supported}
          onClick={() => void selectFolder()}
        >
          Select Folder
        </button>
      </header>
      <main className="app-body">
        <section className="panel panel-tree" aria-label="Folder Tree">
          <h2 className="panel-title">Folder Tree</h2>
          <div className="panel-body" />
        </section>
        <section className="panel panel-list" aria-label="File List">
          <h2 className="panel-title">File List</h2>
          {folderName !== null && (
            <div className="list-bar">
              {canGoBack && (
                <button type="button" className="button" onClick={() => void goBack()}>
                  Back
                </button>
              )}
              <span className="folder-name">{folderName}</span>
            </div>
          )}
          <div className="panel-body" aria-live="polite">
            {listBody}
          </div>
        </section>
        <section className="panel panel-preview" aria-label="Preview">
          <h2 className="panel-title">Preview</h2>
          <div className="panel-body" />
        </section>
      </main>
      <footer className="app-status" aria-label="Status bar">
        {statusText}
      </footer>
    </div>
  );
}
