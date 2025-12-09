import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/ItemDetails.css";

export default function ItemDetails() {
  const { id } = useParams();
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setChar(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="details-loading">Loading...</div>;
  if (!char) return <div className="details-loading">Character not found</div>;

  return (
    <main className="details-container">
      <h1 className="details-title">{char.name}</h1>

      <img
        className="details-img"
        src={char.image}
        alt={char.name}
      />

      <ul className="details-list">
        <li><strong>Status:</strong> {char.status}</li>
        <li><strong>Gender:</strong> {char.gender}</li>
        <li><strong>Species:</strong> {char.species}</li>
        <li><strong>Origin:</strong> {char.origin?.name}</li>
        <li><strong>Last location:</strong> {char.location?.name}</li>
        <li><strong>Episode count:</strong> {char.episode?.length}</li>
      </ul>
    </main>
  );
}
