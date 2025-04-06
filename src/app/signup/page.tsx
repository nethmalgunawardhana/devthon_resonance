'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    repeatPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      await setDoc(doc(db, 'researches', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        uid: user.uid,
        createdAt: new Date(),
      });

    
      router.push('/signin');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
    
      const userRef = doc(db, 'researches', user.uid);
      
      try {
      
        await setDoc(userRef, {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          username: user.email?.split('@')[0] || '',
          email: user.email,
          createdAt: new Date(),
          lastLogin: new Date(), 
        }, { merge: true });
  
      
        router.push('/');
      } catch (firestoreErr) {
        console.error("Firestore error:", firestoreErr);
    
        if (firestoreErr instanceof Error) {
          if (firestoreErr.message.includes("permission-denied")) {
            setError("Access denied. Please check your Firestore rules.");
          } else {
            setError(`Firestore error: ${firestoreErr.message}`);
          }
        } else {
          setError('Failed to save user data. Please try again.');
        }
  
        return;
      }
    } catch (authErr) {
      console.error("Authentication error:", authErr);
      setError(authErr instanceof Error ? authErr.message : 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Background overlay loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center animate-bounce">
            <svg className="animate-spin h-10 w-10 text-[#770C0C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-800 font-medium mt-4">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="w-1/2 hidden md:block relative">
        <Image 
          src="/signup-cover.jpg" 
          alt="Signup Cover" 
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#770C0C]/30 to-black/40"></div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white relative">
        <div className="w-full max-w-md p-8">
          <div className="mb-8 flex justify-center">
            <Image 
              src="/logo.png" 
              width={180} 
              height={180} 
              alt="Logo" 
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Join Resonance</h2>
          <p className="text-center text-gray-500 mb-6">Create your account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-pulse">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Repeat Password</label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeatPassword"
                  placeholder="Repeat your password"
                  value={form.repeatPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showRepeatPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#770C0C] text-white py-3 rounded-lg font-semibold hover:bg-[#5d0a0a] transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              disabled={loading}
            >
              Create Account
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-3 rounded-lg text-gray-700 hover:bg-gray-50 flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <FcGoogle size={22} /> 
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/signin" className="text-[#770C0C] font-medium hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}