import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function loadUserFavorites(uid) {
  const ref = doc(db, "users", uid, "data", "favorites");
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return snap.data().items || [];
}

export async function saveFavoritesToFirestore(uid, items) {
  const ref = doc(db, "users", uid, "data", "favorites");
  await setDoc(ref, { items }, { merge: true });
}
