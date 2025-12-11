import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  character: Character;
}

export const CharacterCard: React.FC<Props> = ({ character }) => {
  const { state, toggleFavorite } = useApp();
  const isFavorite = state.favorites.includes(character.id);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-green-500 transition duration-300 flex flex-col">
      <div className="relative">
        <img src={character.image} alt={character.name} className="w-full h-48 object-cover" loading="lazy" />
        <button 
          onClick={(e) => { e.preventDefault(); toggleFavorite(character.id); }}
          className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-green-500 text-white' : 'bg-gray-900/80 text-gray-400 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/character/${character.id}`} className="text-xl font-bold hover:text-green-400 truncate block">
          {character.name}
        </Link>
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <span className={`w-2 h-2 rounded-full mr-2 ${character.status === 'Alive' ? 'bg-green-500' : character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
          {character.status} - {character.species}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          <p>Last known location:</p>
          <p className="text-gray-300 truncate">{character.location.name}</p>
        </div>
      </div>
    </div>
  );
};
