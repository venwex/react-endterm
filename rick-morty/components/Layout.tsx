import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Will be HashRouter
import { useApp } from '../context/AppContext';
import { auth } from '../firebaseConfig';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  const location = useLocation();

  const handleLogout = () => auth.signOut();

  const isActive = (path: string) => location.pathname === path ? 'text-green-400 font-bold' : 'text-gray-300 hover:text-white';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-900">
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-400 tracking-tighter">
            R&M<span className="text-white">Galaxy</span>
          </Link>

          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/characters" className={isActive('/characters')}>Characters</Link>
            <Link to="/favorites" className={isActive('/favorites')}>
              Favorites {state.favorites.length > 0 && <span className="bg-green-600 text-xs px-1.5 py-0.5 rounded-full ml-1">{state.favorites.length}</span>}
            </Link>
            
            {state.isAuthenticated ? (
              <>
                <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login')}>Login</Link>
                <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          {/* Mobile menu toggle would go here */}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Rick & Morty API. Wubba Lubba Dub Dub!</p>
        </div>
      </footer>
    </div>
  );
};
