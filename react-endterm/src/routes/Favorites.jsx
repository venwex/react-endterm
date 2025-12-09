import { useSelector, useDispatch } from "react-redux";
import { removeFavorite } from "../store/favoritesSlice";
import "../styles/Favorites.css";

export default function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.items);

  return (
    <main className="favorites-container">
      <h1 className="favorites-title">Your Favorites</h1>

      {favorites.length === 0 && (
        <p className="favorites-empty">No favorites yet.</p>
      )}

      <div className="favorites-list">
        {favorites.map((char) => (
          <div key={char.id} className="favorite-card">
            <div className="favorite-info">
              <strong>{char.name}</strong>
              <span>{char.status} / {char.gender}</span>
            </div>

            <button
              className="favorite-remove-btn"
              onClick={() => dispatch(removeFavorite(char.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
