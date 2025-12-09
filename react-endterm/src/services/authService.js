import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export function mapFirebaseUser(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
  };
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(mapFirebaseUser(firebaseUser));
  });
}

export async function signUpWithEmail({ email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (!cred.user.displayName) {
    await updateProfile(cred.user, {
      displayName: email.split("@")[0],
    });
  }

  return mapFirebaseUser(cred.user);
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(cred.user);
}

export async function signOutUser() {
  await signOut(auth);
}
