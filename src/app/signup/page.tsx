'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const roles = ['Researcher', 'Contributor', 'Industry'];

export default function SignUp() {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const role = roles[selectedRoleIndex].toLowerCase();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    repeatPassword: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const email = `${form.username}@resonance.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email,
        role,
      });

      redirectToDashboard(role);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        username: user.email?.split('@')[0],
        email: user.email,
        role,
      });

      redirectToDashboard(role);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const redirectToDashboard = (role: string) => {
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex">

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

          <Tab.Group selectedIndex={selectedRoleIndex} onChange={setSelectedRoleIndex}>
            <Tab.List className="flex justify-around bg-gray-100 rounded-md mb-6 p-1 gap-1">
              {roles.map((roleName) => (
                <Tab
                  key={roleName}
                  className={({ selected }) =>
                    classNames(
                      'w-full py-2 text-sm font-medium rounded-md',
                      selected
                        ? 'bg-white text-[#770C0C]'
                        : 'text-gray-700 hover:bg-gray-200'
                    )
                  }
                >
                  {roleName}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Tharin"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Edirisinghe"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block pb-1.5 text-sm text-gray-800">Username</label>
              <input
                type="text"
                name="username"
                placeholder="tharinEdiri"
                value={form.username}
                onChange={handleChange}
                required
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
                required
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
                required
                className="w-full px-3 py-1.5 text-sm text-black placeholder-gray-400 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#770C0C] text-white py-2 rounded-lg font-semibold hover:bg-[#5d0a0a] transition"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center my-1.5 text-gray-500">or</div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex justify-center items-center gap-2"
          >
            <FcGoogle size={22} />
            Sign in with Google
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
