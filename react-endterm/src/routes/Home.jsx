import "../styles/Home.css";

export default function Home() {
  return (
    <main className="home-wrapper">
      <div className="home-container">
        <h1 className="home-title">Character Explorer</h1>

        <p className="home-subtitle">
          Explore characters across the multiverse — powered by Rick & Morty API.
        </p>

        <ul className="home-features">
          <li>Firebase Authentication + JWT</li>
          <li>Favorites synced (local & cloud Firestore)</li>
          <li>Infinite search with filters & pagination</li>
          <li>React + Redux Toolkit state management</li>
          <li>PWA offline mode — installable on desktop/mobile</li>
          <li>Profile system + avatar uploading</li>
        </ul>
      </div>
    </main>
  );
}
