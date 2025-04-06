"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function publicProfile() {
  const [userData, setUserData] = useState({
    name: "Gumindu Kulatunga",
    affiliation: "Ministry of Health, Nutrition and Indigenous Medicine",
    works_count: 14,
    citation_count: 121,
    orchid: "https://orcid.org/0000-0003-2164-5361",
    openalex_id: "https://openalex.org/A5023634987",
    summary: {
      "2yr_mean_citedness": 6.5,
      h_index: 6,
      i10_index: 5,
    },
    topics: [
      "Telemedicine and Telehealth Implementation",
      "Mobile Health and mHealth Applications",
      "Biomedical and Engineering Education",
      "Artificial Intelligence in Healthcare",
      "Electronic Health Records Systems",
      "COVID-19 and healthcare impacts",
      "Health Sciences Research and Education",
      "Social Media in Health Education",
      "Healthcare Systems and Reforms",
      "Patient-Provider Communication in Healthcare",
      "Health Literacy and Information Accessibility",
      "Clinical Laboratory Practices and Quality Control",
      "Public Health Policies and Education",
      "Innovations in Medical Education",
      "Healthcare Systems and Public Health",
      "Meta-analysis and systematic reviews",
      "Diverse Scientific Research Studies",
      "Artificial Intelligence in Healthcare and Education",
      "Zoonotic diseases and public health",
      "COVID-19 epidemiological studies",
      "Healthcare cost, quality, practices",
    ],
    profilePicture: null,
  });

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 pt-18">
        {/* Header Section */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-8 flex items-center justify-between">
            {/* Left Section: Profile Info */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {userData.profilePicture ? (
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
                <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-gray-600">{userData.affiliation}</p>
                <div className="flex space-x-4 mt-2">
                  <a
                    href={userData.orchid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    ORCID
                  </a>
                  <a
                    href={userData.openalex_id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenAlex
                  </a>
                </div>
              </div>
            </div>

            {/* Right Section: Research Summary */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Research Summary</h2>
              <p className="text-sm text-gray-600">
                <strong>2-Year Mean Citedness:</strong> {userData.summary["2yr_mean_citedness"]}
              </p>
              <p className="text-sm text-gray-600">
                <strong>H-Index:</strong> {userData.summary.h_index}
              </p>
              <p className="text-sm text-gray-600">
                <strong>i10-Index:</strong> {userData.summary.i10_index}
              </p>
            </div>
          </div>
        </div>

        {/* About and Topics Section */}
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
          {/* About Section */}
          <div className="md:w-1/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600">
              Hi, I'm {userData.name}, affiliated with {userData.affiliation}. I have
              contributed to {userData.works_count} works with a total of{" "}
              {userData.citation_count} citations. My research focuses on various
              topics, including:
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-600">
              {userData.topics.slice(0, 5).map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>

          {/* Research Topics Section */}
          <div className="md:w-3/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Research Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-white shadow-sm rounded-lg p-4 text-gray-600"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}