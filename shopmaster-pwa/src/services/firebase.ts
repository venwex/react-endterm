import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyC6Rl_5K3U-iz9oPwWmeTMnhfYMYGYBj6w",
  authDomain: "project-ba88a.firebaseapp.com",
  projectId: "project-ba88a",
  storageBucket: "project-ba88a.appspot.com",
  messagingSenderId: "585522637872",
  appId: "1:585522637872:web:590a57bcf9c828d36c11f5"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
