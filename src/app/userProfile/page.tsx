"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase"; // Import Firebase auth and Firestore
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [hIndex, setHIndex] = useState("");
  const [positions, setPositions] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setDisplayName(userData.displayName || "");
          setEmail(userData.email || user.email || "");
          setHIndex(userData.hIndex || "");
          setPositions(userData.positions || "");
          setBio(userData.bio || "");
          setTwitter(userData.twitter || "");
          setLinkedin(userData.linkedin || "");
          setYoutube(userData.youtube || "");
          setWhatsapp(userData.whatsapp || "");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userDoc = doc(db, "users", user.uid);
      await setDoc(
        userDoc,
        {
          displayName,
          email,
          hIndex,
          positions,
          bio,
          twitter,
          linkedin,
          youtube,
          whatsapp,
        },
        { merge: true }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100 pt-18">
      <Navbar />
      {/* Sidebar */}
      <div className="w-1/4 bg-[#770C0C] text-white p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 overflow-hidden">
            {profilePhoto ? (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-500">No Photo</span>
            )}
          </div>
          <h2 className="mt-4 text-lg font-bold">{displayName}</h2>
          <p className="text-sm">{email}</p>
        </div>
        <ul className="space-y-4">
          <li className="font-medium text-gray-200 hover:text-white cursor-pointer">
            General
          </li>
          <li className="font-medium text-gray-200 hover:text-white cursor-pointer">
            Settings
          </li>
          <li className="font-medium text-gray-200 hover:text-white cursor-pointer">
            Account
          </li>
          <li className="font-medium text-gray-200 hover:text-white cursor-pointer">
            Membership
          </li>
          <li className="font-medium text-gray-200 hover:text-white cursor-pointer">
            Language
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-1/4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h1>
        <form className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-2"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>

          {/* H-Index */}
          <div>
            <label className="block text-sm font-medium text-gray-700">H-Index</label>
            <input
              type="number"
              value={hIndex}
              onChange={(e) => setHIndex(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>

          {/* Positions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Positions</label>
            <input
              type="text"
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
              rows={4}
            />
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter</label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#770C0C] text-white py-2 rounded-md hover:bg-[#5d0a0a] transition focus:ring-2 focus:ring-[#770C0C] focus:outline-none"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}