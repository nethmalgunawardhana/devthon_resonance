'use client';

import Link from 'next/link';
import { FiBell, FiBookmark, FiUser, FiSearch } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase'; 
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true);
        const email = user.email || '';
        const extractedUsername = email.split('@')[0];
        setUsername(user.displayName || extractedUsername);
      } else {
        setIsSignedIn(false);
        setUsername(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      setIsSignedIn(false);
      setUsername(null);
      router.push('/'); // Redirect to the homepage after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <nav className="bg-white border border-b-1 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Resonance Logo" className="h-8 mr-2" />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-sm font-medium text-[#770C0C]">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-800 hover:text-[#770C0C]">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-[#770C0C]">
            Contact
          </Link>
          <Link href="/researchcreate" className="text-sm font-medium text-gray-800 hover:text-[#770C0C]">
            Become Researcher
          </Link>
          <Link href="/Q&A" className="text-sm font-medium text-gray-800 hover:text-[#770C0C]">
            FAQ
          </Link>
        </div>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-4">
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            onClick={handleSearchClick}
          >
            <div className="flex items-center justify-center p-2 rounded-full bg-[#FDECEC] cursor-pointer hover:bg-[#fbd2d2] transition-all duration-300 transform hover:scale-105">
              <FiSearch className="text-[#770C0C] text-xl" />
            </div>
            
            {/* Hover Text */}
            <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-[#770C0C] text-white text-xs font-medium rounded-lg whitespace-nowrap transition-opacity duration-200 ${isSearchHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Search Research
              {/* Arrow pointing up */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#770C0C] rotate-45"></div>
            </div>
          </div>

          {isSignedIn ? (
            <>
              <FiBell className="text-gray-800 text-xl cursor-pointer hover:text-[#770C0C]" />
              <FiBookmark className="text-gray-800 text-xl cursor-pointer hover:text-[#770C0C]" />
              <div className="flex items-center space-x-2 cursor-pointer">
                <FiUser className="text-gray-800 text-xl hover:text-[#770C0C]" />
                <span className="text-sm font-medium text-gray-800 hover:text-[#770C0C]">
                  {username}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-[#770C0C] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5d0a0a] transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signup">
                <button className="bg-[#FDECEC] text-[#770C0C] py-2 px-4 rounded-lg font-medium hover:bg-[#fbd2d2] transition">
                  Create Account
                </button>
              </Link>
              <Link href="/signin">
                <button className="bg-[#770C0C] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5d0a0a] transition">
                  Sign In
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}