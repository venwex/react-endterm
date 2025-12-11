import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/dbService';

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Initialize Worker
    const worker = new Worker('/worker.js');

    // Convert file to ArrayBuffer to send to worker
    const reader = new FileReader();
    reader.onload = function(event) {
        if (event.target?.result) {
            // Send to worker
            worker.postMessage({ 
                file: event.target.result, 
                type: file.type 
            });
        }
    };
    reader.readAsArrayBuffer(file);

    worker.onmessage = async (e) => {
        const { blob } = e.data;
        
        // Convert Blob to Base64 for uploadString (simplest for this demo, usually uploadBytes)
        const base64Reader = new FileReader();
        base64Reader.readAsDataURL(blob);
        base64Reader.onloadend = async () => {
            const base64data = base64Reader.result as string;
            
            try {
                if(state.user?.uid) {
                    const url = await dbService.updateProfilePicture(state.user.uid, base64data);
                    // Update global state
                    dispatch({ 
                        type: 'SET_USER', 
                        payload: { ...state.user, photoURL: url } 
                    });
                }
            } catch (err) {
                console.error("Upload failed", err);
                alert("Upload failed");
            } finally {
                setUploading(false);
                worker.terminate();
            }
        };
    };
  };

  if (!state.user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
      <h1 className="text-3xl font-bold mb-8 text-center">Galactic Identification</h1>
      
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-lg bg-gray-700">
            {state.user.photoURL ? (
                <img src={state.user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className="flex items-center justify-center h-full text-4xl text-gray-500">?</div>
            )}
            </div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition shadow"
            >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/png, image/jpeg" 
        />
        {uploading && <p className="text-green-400 mt-2 text-sm animate-pulse">Compressing & Uploading...</p>}
      </div>

      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <label className="text-xs text-gray-500 uppercase font-bold block mb-1">User ID</label>
            <p className="font-mono text-sm break-all text-gray-300">{state.user.uid}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Email Protocol</label>
            <p className="text-gray-300">{state.user.email}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700 flex justify-between items-center">
            <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Collection Size</label>
                <p className="text-2xl font-bold text-green-400">{state.favorites.length} <span className="text-sm font-normal text-gray-400">specimens</span></p>
            </div>
            <div className="text-4xl opacity-20">📦</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
