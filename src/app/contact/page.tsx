'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Contact() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-18">
        {/* Hero Section */}
        <section className="bg-[#770C0C] py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-white">Contact Us</h1>
            <p className="mt-4 text-lg text-white">
              Have questions or need assistance? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto md:w-1/2 px-6 py-16">
          
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#770C0C] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5d0a0a] transition"
                >
                  Send Message
                </button>
              </form>
            </div>

        </section>
      </div>
      <Footer />
    </div>
  );
}