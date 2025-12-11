import React, { useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage, db } from '../services/firebase';
import { useImageCompression } from '../hooks/useWorker';
import { doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const { user } = useGlobal();
  const { compressImage } = useImageCompression();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return null; // Should be handled by router guard, but safe check

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      setUploading(true);
      setMessage('Compressing image via Web Worker...');

      try {
        // 1. Compress via Web Worker
        const compressedBlob = await compressImage(originalFile);
        
        // 2. Upload to Firebase Storage
        setMessage('Uploading to Firebase...');
        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, compressedBlob);
        
        // 3. Get URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // 4. Update Auth Profile
        if (auth.currentUser) {
           await updateProfile(auth.currentUser, { photoURL: downloadURL });
        }
        
        // 5. Update Firestore (optional sync)
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });

        setMessage('Profile picture updated successfully! Refresh to see changes.');
        // Force reload to update context or implement set user in context
        window.location.reload(); 

      } catch (error) {
        console.error(error);
        setMessage('Error uploading image.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img 
              src={user.photoURL || 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-lg font-medium text-gray-900">{user.email}</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500">User ID</label>
              <div className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">{user.uid}</div>
            </div>
            {message && (
              <div className={`p-3 rounded text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            {uploading && <p className="text-sm text-indigo-600 mt-2">Processing...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
