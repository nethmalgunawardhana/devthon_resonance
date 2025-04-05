'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';  // Use modular imports
import { initializeApp } from 'firebase/app'; // Firebase initialization
//import { firebaseConfig } from '@/firebase'; // Import your Firebase config

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const auth = getAuth(app);

const SignIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');  // Redirect to the dashboard after login
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
