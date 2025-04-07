'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-18">
        {/* Hero Section */}
        <section className="relative bg-gray-50">
          <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                About Us
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We are a platform dedicated to fostering collaboration among researchers, enabling groundbreaking discoveries, and driving innovation across various fields of study.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
            <img
                src="/logo.png"
                alt="About Us"
                className="w-3/4 h-auto "
              />
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 text-center">
            To empower researchers by providing tools, resources, and a collaborative environment to solve the world's most pressing challenges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: 'Collaboration',
                description: 'Connect with researchers worldwide to share ideas and work together.',
                icon: (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-12 h-12 text-[#770C0C] mx-auto" 
                        viewBox="0 0 16 16"
                    >
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                  </svg>
                ),
              },
              {
                title: 'Innovation',
                description: 'Drive innovation by supporting cutting-edge research projects.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 mx-auto text-[#770C0C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                title: 'Impact',
                description: 'Make a meaningful impact by solving real-world problems.',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 mx-auto text-[#770C0C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4m4-4h4m-16 0h4"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-100 rounded-lg hover:shadow-lg transition"
              >
                {item.icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
              {[
                { name: 'Harindu Hadithya', role: 'Founder & CEO', image: '/team/default-profile.png' },
                { name: 'Nethmal Gunawardhana', role: 'Member', image: '/team/default-profile.png' },
                { name: 'Sachintha Lakmin', role: 'Member', image: '/team/default-profile.png' },
                { name: 'Tharin Edirisinghe', role: 'Member', image: '/team/default-profile.png' },
                { name: 'Garuka Satharasinghe', role: 'Member', image: '/team/default-profile.png' },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  <h3 className="mt-4 text- font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#770C0C] py-16">
          <div className="container mx-auto px-6 text-center text-white">
            <h2 className="text-3xl font-bold">Join Us in Driving Innovation</h2>
            <p className="mt-4 text-lg">
              Be a part of our mission to empower researchers and make a difference in the world.
            </p>
            <button className="mt-6 bg-white text-[#770C0C] py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">
              Get Started
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}