"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicProfile() {
  const [userData, setUserData] = useState(null); // Researcher details
  const [works, setWorks] = useState([]); // Research works
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/researchers?name=harindu");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.researcher); // Set researcher details
        setWorks(data.works); // Set research works
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold">No data available.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 pt-18">
        {/* Header Section */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-gray-500"
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
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData?.name}</h1>
                <p className="text-gray-600">{userData?.affiliation}</p>
                <div className="flex space-x-4 mt-2">
                  <a
                    href={userData?.orchid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    ORCID
                  </a>
                  <a
                    href={userData?.openalex_id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenAlex
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Research Summary</h2>
              <p className="text-sm text-gray-600">
                <strong>2-Year Mean Citedness:</strong> {userData?.summary?.["2yr_mean_citedness"]}
              </p>
              <p className="text-sm text-gray-600">
                <strong>H-Index:</strong> {userData?.summary?.h_index}
              </p>
              <p className="text-sm text-gray-600">
                <strong>i10-Index:</strong> {userData?.summary?.i10_index}
              </p>
            </div>
          </div>
        </div>

        {/* Research Works Section */}
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Research Works</h2>
          {works.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {works.map((work, index) => (
                <div
                  key={index}
                  className="bg-white text-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-800">{work.title}</h3>
                    <span className="inline-block mt-2 bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                      {work.type || "Unknown Type"}
                    </span>
                  </div>
                  {/* Card Body */}
                  <div className="p-4 flex-1">
                    <p className="text-sm mb-4">
                      <strong>Authors:</strong> {work.authors.join(", ")}
                    </p>
                  </div>
                  {/* Card Footer */}
                  <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-t border-gray-200">
                    {/* Publication Date */}
                    <span className="text-sm text-gray-600">
                      {work.publication_date || "N/A"}
                    </span>
                    {/* Citation Count */}
                    <span className="text-sm text-gray-600">
                    <strong>Citations:</strong> {work.citation_count || 0}
                    </span>
                  </div>
                  {/* Button */}
                  <a
                    href={`https://doi.org/${work.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-[#770C0C] text-white font-medium px-4 py-2 text-center hover:bg-[#5d0a0a] transition"
                  >
                    View Work
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No research works available.</p>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}