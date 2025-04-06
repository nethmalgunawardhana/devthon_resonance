'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const router = useRouter();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const userRole = docSnap.data().role || 'researcher';
          router.push(`/dashboard/${userRole.toLowerCase().replace(" ", "")}`);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const email = form.username + "@resonance.com";
      await signInWithEmailAndPassword(auth, email, form.password);
      router.push('/');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Invalid credentials");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError("Google Sign-In failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 hidden md:block relative">
        <Image
          src="/signin-cover.jpg"
          alt="Visual"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-full bg-white md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Image src="/logo.png" alt="Logo" width={200} height={200} className="mx-auto mb-10" />
            <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#770C0C] text-white py-2 rounded-lg font-semibold hover:bg-[#5d0a0a] transition"
            >
              Sign In
            </button>
          </form>

          <div className="text-center my-2 text-gray-500">or</div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex justify-center items-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
