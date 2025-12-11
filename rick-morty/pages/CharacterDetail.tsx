import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Character } from '../types';
import { useApp } from '../context/AppContext';

const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const [char, setChar] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, toggleFavorite } = useApp();

  useEffect(() => {
    if (id) {
      apiService.getCharacterById(parseInt(id))
        .then(setChar)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-green-400 text-xl">Loading DNA data...</div>;
  if (!char) return <div className="text-center mt-20 text-red-400">Character not found.</div>;

  const isFav = state.favorites.includes(char.id);

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold mb-2 text-white">{char.name}</h1>
            <button 
              onClick={() => toggleFavorite(char.id)}
              className={`p-2 rounded-full border ${isFav ? 'bg-green-500 border-green-500 text-white' : 'border-gray-500 text-gray-400 hover:text-white'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </button>
          </div>
          
          <div className="space-y-4 text-gray-300 mt-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="text-gray-500 text-sm uppercase font-semibold">Status</span>
                  <p className="text-lg flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${char.status === 'Alive' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {char.status}
                  </p>
               </div>
               <div>
                  <span className="text-gray-500 text-sm uppercase font-semibold">Species</span>
                  <p className="text-lg">{char.species}</p>
               </div>
               <div>
                  <span className="text-gray-500 text-sm uppercase font-semibold">Gender</span>
                  <p className="text-lg">{char.gender}</p>
               </div>
               <div>
                  <span className="text-gray-500 text-sm uppercase font-semibold">Type</span>
                  <p className="text-lg">{char.type || 'Standard'}</p>
               </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <span className="text-gray-500 text-sm uppercase font-semibold">Origin</span>
                <p className="text-lg text-green-400 hover:underline cursor-pointer">{char.origin.name}</p>
            </div>

             <div className="border-t border-gray-700 pt-4">
                <span className="text-gray-500 text-sm uppercase font-semibold">Current Location</span>
                <p className="text-lg text-green-400 hover:underline cursor-pointer">{char.location.name}</p>
            </div>

             <div className="border-t border-gray-700 pt-4">
                <span className="text-gray-500 text-sm uppercase font-semibold">Episodes</span>
                <p className="text-lg">{char.episode.length} appearances</p>
            </div>
          </div>
          
          <div className="mt-8">
             <Link to="/characters" className="text-green-400 hover:text-green-300 font-semibold">← Back to Roster</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
