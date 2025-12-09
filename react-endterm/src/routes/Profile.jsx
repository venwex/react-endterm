import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { saveProfilePictureToFirestore } from "../services/profileService";
import { setUser } from "../store/authSlice";
import "../styles/Profile.css";

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function selectFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;

      await saveProfilePictureToFirestore(user.uid, base64);
      dispatch(setUser({ ...user, photoURL: base64 }));

      setLoading(false);
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="profile-container">
      <h1 className="profile-title">Profile</h1>

      {user.photoURL && (
        <img src={user.photoURL} alt="avatar" className="profile-img" />
      )}

      <label className="upload-label">
        Upload new avatar
        <div className="profile-upload-btn">
          <span>Choose file</span>
          <input
            type="file"
            accept="image/*"
            onChange={selectFile}
          />
        </div>
      </label>

      {loading && <p className="profile-uploading">Uploading...</p>}
    </main>
  );
}
