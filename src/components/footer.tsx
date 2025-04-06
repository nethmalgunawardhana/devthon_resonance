// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-10 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-red-700 mb-2">Resonance</div>
          <p>Aliquam rhoncus ligula est, non pulvinar elit convallis nec. Donec mattis odio at.</p>
          <div className="flex space-x-2 mt-4">
            <button className="bg-gray-800 p-2 rounded">📘</button>
            <button className="bg-gray-800 p-2 rounded">📷</button>
            <button className="bg-gray-800 p-2 rounded">🔗</button>
            <button className="bg-gray-800 p-2 rounded">▶️</button>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/become-researcher" className="hover:underline">Become Researcher</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Download Our App</h4>
          <div className="space-y-2">
            <button className="bg-gray-800 p-2 w-full text-left rounded">App Store</button>
            <button className="bg-gray-800 p-2 w-full text-left rounded">Play Store</button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">© 2025 - Designed by VirtualKnights. All rights reserved.</div>
    </footer>
  );
}
