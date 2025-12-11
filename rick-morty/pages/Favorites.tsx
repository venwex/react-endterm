import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { Character } from '../types';
import { CharacterCard } from '../components/CharacterCard';

const Favorites: React.FC = () => {
  const { state } = useApp();
  const [favoritesList, setFavoritesList] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavs = async () => {
      if (state.favorites.length === 0) {
        setFavoritesList([]);
        return;
      }
      setLoading(true);
      try {
        const chars = await apiService.getMultipleCharacters(state.favorites);
        setFavoritesList(chars);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [state.favorites]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Your Collection</h2>
      
      {state.favorites.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No favorites yet.</p>
          <p>Explore the multiverse and add some!</p>
        </div>
      ) : loading ? (
         <div className="flex justify-center mt-10"><div className="animate-spin h-10 w-10 border-2 border-green-500 rounded-full border-t-transparent"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoritesList.map(char => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
