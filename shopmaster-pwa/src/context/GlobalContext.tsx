import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { UserProfile } from '../types';
import { favoritesService } from '../services/favoritesService';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

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

  // auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentAuthUser) => {
      setLoading(true);

      if (currentAuthUser) {
        // 1. gettin firestore profile
        const userRef = doc(db, "users", currentAuthUser.uid);
        const userSnap = await getDoc(userRef);

        // 2. combine auth + firestore
        const profileData = userSnap.data() || {};

        setUser({
          uid: currentAuthUser.uid,
          email: currentAuthUser.email,
          displayName: currentAuthUser.displayName || profileData.displayName || null,
          photoURL: profileData.photoURL || currentAuthUser.photoURL || null
        });

        // -favrites merge logic
        const localFavs = favoritesService.getLocalFavorites();
        if (localFavs.length > 0) {
          await favoritesService.mergeFavorites(currentAuthUser.uid, localFavs);
          setMergeMessage("Your local favorites were merged with your account.");
          setTimeout(() => setMergeMessage(null), 5000);
        }

        // fetching favorites
        const userFavs = await favoritesService.getUserFavorites(currentAuthUser.uid);
        setFavorites(userFavs);

        // 3. realtime listener for profile updates
        onSnapshot(userRef, (snap) => {
          const data = snap.data();
          if (data) {
            setUser(prev => prev ? { ...prev, ...data } : prev);
          }
        });

      } else {
        // guest
        setUser(null);
        setFavorites(favoritesService.getLocalFavorites());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // favories
  const toggleFavorite = async (id: number) => {
    const isFav = favorites.includes(id);

    if (user) {
      if (isFav) {
        setFavorites(prev => prev.filter(fid => fid !== id));
        await favoritesService.removeFromUser(user.uid, id);
      } else {
        setFavorites(prev => [...prev, id]);
        await favoritesService.addToUser(user.uid, id);
      }
    } else {
      const updated = isFav
        ? favoritesService.removeFromLocal(id)
        : favoritesService.addToLocal(id);
      setFavorites(updated);
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
