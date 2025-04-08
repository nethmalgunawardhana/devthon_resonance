// components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-700">Resonance</div>

        {/* Nav */}
        <nav className="space-x-6 hidden md:flex text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <Link href="/about" className="hover:text-red-600">About</Link>
          <Link href="/contact" className="hover:text-red-600">Contact</Link>
          <Link href="/become-researcher" className="hover:text-red-600">Become Researcher</Link>
        </nav>

        {/* Buttons */}
        <div className="space-x-3">
          <button
            disabled
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 text-sm cursor-not-allowed"
          >
            Create Account
          </button>
          <button className="px-4 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-red-800">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
