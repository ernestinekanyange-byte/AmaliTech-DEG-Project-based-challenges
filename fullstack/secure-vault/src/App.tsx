import "./App.css";

export default function App() {
  return (
    <main className="app">
      <header className="app__header">
        <span className="app__brand-mark" aria-hidden="true">S</span>
        <span>SecureVault</span>
        <span className="app__status">Encrypted vault</span>
      </header>
      <section className="app__content">
        <h1>File Explorer</h1>
        <p>Securely browse your vault contents.</p>
      </section>
    </main>
  );
}
