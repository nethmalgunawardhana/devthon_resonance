'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { FaFlask, FaBook, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { GiMagnifyingGlass, GiChemicalDrop, GiArchiveResearch } from 'react-icons/gi';
import { MdOutlineScience } from 'react-icons/md';

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-18">
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="flex flex-col md:flex-row items-stretch h-[80vh]">
            {/* Left Content */}
            <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-12">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Breakthrough science through collaboration
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We bring great minds together to collaborate, secure funding, and connect with researchers to drive groundbreaking discoveries.
              </p>
              <div className="mt-6">
                <button className="bg-[#770C0C] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5d0a0a] transition">
                  Create Account
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/hero-image.jpg')", // Replace with your image path
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)",
                }}
              ></div>
            </div>
          </div>
        </section>

        {/* Research Categories */}
        <section className="container mx-auto p-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Browse top research category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { name: 'Applied Research', icon: <FaFlask className="text-[#770C0C] text-2xl" /> },
              { name: 'Basic Research', icon: <FaBook className="text-[#770C0C] text-2xl" /> },
              { name: 'Correlational Research', icon: <FaChartLine className="text-[#770C0C] text-2xl" /> },
              { name: 'Descriptive Research', icon: <FaClipboardList className="text-[#770C0C] text-2xl" /> },
              { name: 'Grounded Theory', icon: <GiMagnifyingGlass className="text-[#770C0C] text-2xl" /> },
              { name: 'Exploratory Research', icon: <GiChemicalDrop className="text-[#770C0C] text-2xl" /> },
              { name: 'Experimental Research', icon: <MdOutlineScience className="text-[#770C0C] text-2xl" /> },
              { name: 'Ethnographic Research', icon: <GiArchiveResearch className="text-[#770C0C] text-2xl" /> },
              { name: 'Historical Research', icon: <FaBook className="text-[#770C0C] text-2xl" /> },
              { name: 'Phenomenological Research', icon: <FaFlask className="text-[#770C0C] text-2xl" /> },
              { name: 'Qualitative Research', icon: <FaChartLine className="text-[#770C0C] text-2xl" /> },
              { name: 'Quantitative Research', icon: <FaClipboardList className="text-[#770C0C] text-2xl" /> },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 hover:shadow-lg transition flex flex-col items-center text-center"
              >
                {category.icon}
                <h3 className="text-md font-semibold text-gray-800 mt-2">{category.name}</h3>
                <p className="text-sm text-gray-600">12,345 Researchers</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Research */}
        <section className="bg-gray-50 p-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Trending Research</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <Image
                      src="/research-thumbnail.jpg"
                      alt="Research Thumbnail"
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">
                      Advancements in Quantum Computing
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">March 2025</p>
                    <p className="text-sm text-gray-600">1.2K Citations</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto p-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {[
              'AI-Driven Research Discovery',
              'Decentralized Research Funding',
              'Q&A Forum',
              'Industry-Academia Integration',
              'Mentorship and Knowledge Base',
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
              >
                <Image
                  src="/feature-icon.png"
                  alt="Feature Icon"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{feature}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Create New Research and Fund a Research Section */}
        <section className="container mx-auto py-16 px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-32 py-16">
            {/* Create New Research */}
            <div className="flex flex-col items-start">
              <h2 className="text-3xl font-bold text-gray-800">Create New Research</h2>
              <p className="mt-4 text-gray-600">
                Turn your ideas into impactful research projects. Connect with a network of experts, access essential resources, and bring your vision to life with global collaboration.
              </p>
              <button className="mt-6 bg-[#770C0C] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#5d0a0a] transition">
                Get Started
              </button>
            </div>
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-64 h-64"
                fill="none"
              >
                <rect x="10" y="10" width="44" height="44" rx="4" fill="#FDECEC" />
                <path
                  d="M20 20h24v4H20zM20 28h24v4H20zM20 36h16v4H20z"
                  fill="#770C0C"
                />
                <circle cx="48" cy="48" r="6" fill="#770C0C" />
                <path
                  d="M46 46h4v4h-4z"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center m-16">
            {/* Fund a Research */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-64 h-64"
                fill="none"
              >
                <path
                  d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26 26-11.64 26-26S46.36 4 32 4zm0 48c-12.15 0-22-9.85-22-22S19.85 8 32 8s22 9.85 22 22-9.85 22-22 22z"
                  fill="#FDECEC"
                />
                <path
                  d="M32 16c-7.73 0-14 6.27-14 14s6.27 14 14 14 14-6.27 14-14-6.27-14-14-14zm0 24c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
                  fill="#770C0C"
                />
                <path
                  d="M28 28h8v8h-8z"
                  fill="#fff"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-3xl font-bold text-gray-800">Fund a Research</h2>
              <p className="mt-4 text-gray-600">
                Support groundbreaking research and drive innovation. Contribute to projects that align with your interests and help researchers make meaningful discoveries.
              </p>
              <button className="mt-6 bg-[#770C0C] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#5d0a0a] transition">
                Get Started
              </button>
            </div>
          </div>
        </section>

       <Footer />
      </div>
    </div>
  );
}