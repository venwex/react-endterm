import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6 animate-pulse">
        Wubba Lubba Dub Dub!
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8">
        The ultimate compendium of characters from across the multiverse. 
        Sign up to save your favorites across dimensions!
      </p>
      <div className="flex gap-4">
        <Link to="/characters" className="px-8 py-3 bg-green-600 rounded-lg text-lg font-bold hover:bg-green-700 transition transform hover:scale-105 shadow-green-500/20 shadow-lg">
          Explore Characters
        </Link>
        <Link to="/signup" className="px-8 py-3 bg-gray-700 rounded-lg text-lg font-bold hover:bg-gray-600 transition transform hover:scale-105">
          Join the Citadell
        </Link>
      </div>
    </div>
  );
};

export default Home;
