import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useGlobal } from '../context/GlobalContext';

const Navbar = () => {
  const { user, favorites } = useGlobal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="mr-2">🛍️</span> ShopMaster
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Home</Link>
              <Link to="/products" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Products</Link>
              <Link to="/about" className="hover:bg-indigo-700 px-3 py-2 rounded-md">About Us</Link>
              <Link to="/favorites" className="hover:bg-indigo-700 px-3 py-2 rounded-md relative">
                Favorites
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center hover:bg-indigo-700 px-3 py-2 rounded-md">
                    {user.photoURL && (
                      <img src={user.photoURL} alt="Profile" className="h-6 w-6 rounded-full mr-2 object-cover" />
                    )}
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Login</Link>
                  <Link to="/signup" className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-indigo-700 p-2 rounded-md text-white">
              Menu
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-600">
           <Link to="/" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">Home</Link>
           <Link to="/products" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">Products</Link>
           <Link to="/favorites" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">
             Favorites ({favorites.length})
           </Link>
           {user ? (
             <>
                <Link to="/profile" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left block hover:bg-red-600 bg-red-500 px-3 py-2 rounded-md">Logout</button>
             </>
           ) : (
             <>
               <Link to="/login" className="block hover:bg-indigo-700 px-3 py-2 rounded-md">Login</Link>
               <Link to="/signup" className="block hover:bg-gray-100 bg-white text-indigo-600 px-3 py-2 rounded-md">Sign Up</Link>
             </>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
