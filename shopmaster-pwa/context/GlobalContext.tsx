import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { UserProfile } from '../types';
import { favoritesService } from '../services/favoritesService';

interface GlobalContextType {
  user: UserProfile | null;
  loading: boolean;
  favorites: number[];
  toggleFavorite: (id: number) => Promise<void>;
  mergeMessage: string | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mergeMessage, setMergeMessage] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // User logged in
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });

        // Merge logic
        const localFavs = favoritesService.getLocalFavorites();
        if (localFavs.length > 0) {
          await favoritesService.mergeFavorites(currentUser.uid, localFavs);
          setMergeMessage("Your local favorites were merged with your account.");
          setTimeout(() => setMergeMessage(null), 5000);
        }

        // Fetch user favorites
        const userFavs = await favoritesService.getUserFavorites(currentUser.uid);
        setFavorites(userFavs);
      } else {
        // Guest
        setUser(null);
        setFavorites(favoritesService.getLocalFavorites());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (id: number) => {
    const isFav = favorites.includes(id);
    let newFavs = [];

    if (user) {
      // Optimistic update
      if (isFav) {
        setFavorites(prev => prev.filter(fid => fid !== id));
        await favoritesService.removeFromUser(user.uid, id);
      } else {
        setFavorites(prev => [...prev, id]);
        await favoritesService.addToUser(user.uid, id);
      }
    } else {
      // Local storage
      if (isFav) {
        newFavs = favoritesService.removeFromLocal(id);
      } else {
        newFavs = favoritesService.addToLocal(id);
      }
      setFavorites(newFavs);
    }
  };

  return (
    <GlobalContext.Provider value={{ user, loading, favorites, toggleFavorite, mergeMessage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};