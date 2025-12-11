import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', repeatPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    // 8 chars, 1 special, 1 number
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be 8+ chars, include 1 number and 1 special char.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/profile');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('Email already registered.');
      else setError('Failed to create account. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6">Citizen Registration</h2>
      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input 
            type="email" required 
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input 
            type="password" required 
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 number, 1 special char.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Repeat Password</label>
          <input 
            type="password" required 
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500"
            value={formData.repeatPassword}
            onChange={e => setFormData({...formData, repeatPassword: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">
          Join Multiverse
        </button>
      </form>
    </div>
  );
};

export default Signup;
