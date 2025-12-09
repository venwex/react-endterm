import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveProfilePictureToFirestore(uid, base64) {
  await setDoc(
    doc(db, "users", uid),
    { photoURL: base64 },
    { merge: true }
  );
}

export async function loadUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
