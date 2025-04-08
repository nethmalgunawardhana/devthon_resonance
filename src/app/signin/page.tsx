'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword,GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth, db } from '@/firebase';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { collection, doc, getDoc, query, where, getDocs, setDoc } from 'firebase/firestore';

export default function SignIn() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.email);
        fetchUserData(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user: User) => {
    try {
      // First, check in the users collection (preferred location)
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // User data found in users collection
        const userData = userDoc.data();
        
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userData', JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          profileComplete: userData.profileComplete || false,
          // Include other user data as needed
        }));
        console.log('User data found in users collection');
        router.push('/');
        return;
      }
      
      // Fallback: check in researches collection (legacy)
      const researchesRef = collection(db, 'researches');
      const q = query(researchesRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Use the first matching document
        const researchDoc = querySnapshot.docs[0];
        const researchData = researchDoc.data();
        const documentId = researchDoc.id;
        
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userDocId', documentId); // Store Firestore doc ID separately
        localStorage.setItem('userData', JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName: researchData.firstName || '',
          lastName: researchData.lastName || '',
          researchId: documentId,
          // Include other user data as needed
        }));
        console.log('User data found in researches collection');
        router.push('/');
        return;
      }
      
      // No user data found in either collection
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        profileComplete: false
      }));
      console.log('No user data found, storing basic info');
      
    
      router.push('/complete-profile');
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      // Save basic auth info
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
        profileComplete: false
      }));
      router.push('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true); 
    try {
  
      await signInWithEmailAndPassword(auth, form.email, form.password);
   
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
     
        if (err.message.includes('user-not-found') || err.message.includes('wrong-password')) {
          setError('Invalid email or password');
        } else if (err.message.includes('too-many-requests')) {
          setError('Too many failed login attempts. Please try again later.');
        } else {
          setError(err.message || 'Invalid credentials');
        }
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); 
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = result.user;
  
      const userRef = doc(db, 'researches', user.uid);

       try {
        await setDoc(userRef, {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
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

      
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError('Google Sign-In failed: ' + err.message);
      } else {
        setError('Google Sign-In failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 hidden md:block relative">
        <Image
          src="/signin-cover.jpg"
          alt="Visual"
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#770C0C]/50"></div>
      </div>
      <div className="w-full bg-white md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center">
              <Image src="/logo.png" alt="Logo" width={200} height={200} className="mb-6 transform hover:scale-105 transition-transform duration-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770C0C]/30 focus:border-[#770C0C] transition-all"
                  placeholder="Enter your password"
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

            <div className="flex justify-end">
              <a href="#" className="text-sm text-[#770C0C] hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#770C0C] text-white py-3 rounded-lg font-semibold hover:bg-[#5d0a0a] transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-3 rounded-lg text-gray-700 hover:bg-gray-50 flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              <>
                <FcGoogle className="text-xl" /> 
                Sign in with Google
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-[#770C0C] font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}