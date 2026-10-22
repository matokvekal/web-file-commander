export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Web File Commander</h1>
      </header>
      <main className="app-body">
        <section className="panel panel-tree" aria-label="Folder Tree">
          <h2 className="panel-title">Folder Tree</h2>
          <div className="panel-body" />
        </section>
        <section className="panel panel-list" aria-label="File List">
          <h2 className="panel-title">File List</h2>
          <div className="panel-body" />
        </section>
        <section className="panel panel-preview" aria-label="Preview">
          <h2 className="panel-title">Preview</h2>
          <div className="panel-body" />
        </section>
      </main>
      <footer className="app-status" aria-label="Status bar">
        Ready
      </footer>
    </div>
  );
}
