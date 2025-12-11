import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

export const dbService = {
  async getUserProfile(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize user profile
      const initialData = { favorites: [], photoURL: null };
      await setDoc(docRef, initialData);
      return initialData;
    }
  },

  async syncFavorites(uid: string, localFavorites: number[]) {
    const docRef = doc(db, 'users', uid);
    // Merge local favorites into cloud
    await updateDoc(docRef, {
      favorites: arrayUnion(...localFavorites)
    });
    // Return updated list
    const updatedSnap = await getDoc(docRef);
    return updatedSnap.data()?.favorites || [];
  },

  async addFavorite(uid: string, characterId: number) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { favorites: arrayUnion(characterId) });
  },

  async removeFavorite(uid: string, characterId: number) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { favorites: arrayRemove(characterId) });
  },

  async updateProfilePicture(uid: string, base64Image: string) {
    const storageRef = ref(storage, `profiles/${uid}.jpg`);
    await uploadString(storageRef, base64Image, 'data_url');
    const url = await getDownloadURL(storageRef);
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { photoURL: url });
    return url;
  }
};
