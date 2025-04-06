'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    repeatPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading

    // Validate form fields
    if (!form.firstName || !form.lastName || !form.username || !form.password || !form.repeatPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    if (form.password !== form.repeatPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.username + '@resonance.com',
        form.password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        uid: user.uid,
        createdAt: new Date(),
      });

      router.push('/'); // Redirect to homepage after successful sign-up
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        username: user.email?.split('@')[0],
        email: user.email,
      });

      router.push('/'); // Redirect to homepage
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Popup Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
            <p className="text-white mt-4">Processing...</p>
          </div>
        </div>
      )}

      <div className="w-1/2 hidden md:block">
        <img
          src="/signup-cover.jpg"
          alt="Signup Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-md p-8">
          <div className="m-10 align-items-center flex justify-center">
            <Image src="/logo.png" width={200} height={200} alt="Logo" />
          </div>
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div>
              <label className="block pb-1.5 text-sm text-gray-800">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Repeat Password</label>
              <input
                type="password"
                name="repeatPassword"
                placeholder="Repeat your password"
                value={form.repeatPassword}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#770C0C] text-white py-2 rounded-lg font-semibold hover:bg-[#5d0a0a] transition"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center my-1.5 text-gray-500">or</div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex justify-center items-center gap-2"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing Up...' : <><FcGoogle size={22} /> Sign in with Google</>}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/signin" className="text-[#770C0C] hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}