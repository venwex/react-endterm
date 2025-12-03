// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Rl_5K3U-iz9oPwWmeTMnhfYMYGYBj6w",
  authDomain: "project-ba88a.firebaseapp.com",
  projectId: "project-ba88a",
  storageBucket: "project-ba88a.firebasestorage.app",
  messagingSenderId: "585522637872",
  appId: "1:585522637872:web:590a57bcf9c828d36c11f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);