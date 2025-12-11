import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

const LOCAL_STORAGE_KEY = 'shopmaster_guest_favorites';

export const favoritesService = {
  // Guest Logic
  getLocalFavorites: (): number[] => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addToLocal: (id: number): number[] => {
    const current = favoritesService.getLocalFavorites();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  },

  removeFromLocal: (id: number): number[] => {
    const current = favoritesService.getLocalFavorites();
    const updated = current.filter(item => item !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearLocal: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },

  // Auth Logic
  getUserFavorites: async (uid: string): Promise<number[]> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().favorites || [];
      } else {
        // Create user doc if not exists
        await setDoc(docRef, { favorites: [] });
        return [];
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      return [];
    }
  },

  mergeFavorites: async (uid: string, localFavorites: number[]) => {
    if (localFavorites.length === 0) return;
    
    const docRef = doc(db, 'users', uid);
    // Use arrayUnion to add unique items
    await updateDoc(docRef, {
      favorites: arrayUnion(...localFavorites)
    });
    favoritesService.clearLocal();
  },

  addToUser: async (uid: string, id: number) => {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      favorites: arrayUnion(id)
    });
  },

  removeFromUser: async (uid: string, id: number) => {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      favorites: arrayRemove(id)
    });
  }
};
