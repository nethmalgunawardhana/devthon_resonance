"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import { getAllResearchers } from "../../services/researcherIdService"; 

type Researcher = {
  uid: string;
  name: string;
  university: string;
  imageUrl: string;
};

type SearchBarSectionProps = {
  onSearch: (searchQuery: string) => void;
};

const ResearchCategories = [
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Vision",
  "Robotics",
  "Bioinformatics",
  "Econometrics",
  "Economics",
  "Game Theory",
  "Number Theory",
  "Astrophysics",
  "Quantum Physics",
  "High Energy Physics",
];


const SearchBarSection = ({onSearch}: SearchBarSectionProps) => {
  const [filter, setFilter] = useState("Research Papers");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Researcher[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Reset search query and hide suggestions when filter changes
    setSearchQuery("");
    setShowSuggestions(false);
  }, [filter]);

  useEffect(() => {
    if (filter === "Researches" && searchQuery.trim()) {
      const fetchResearchers = async () => {
        try {
          const researchers = await getAllResearchers();
          const matches = researchers.filter((researcher) =>
            `${researcher.firstName} ${researcher.lastName}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
          setSuggestions(
            matches.map((researcher) => ({
              uid: researcher.uid,
              name: `${researcher.firstName} ${researcher.lastName}`,
              university: "Unknown University",
              imageUrl: researcher.imageUrl || "",
            }))
          );
        }
        catch (error) { 
          console.error("Error fetching researchers:", error);
        }
      }
      fetchResearchers();
      setShowSuggestions(true);
    } else if (filter === "Research Papers" && searchQuery.trim()) {
      const matches = ResearchCategories.filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(
        matches.map((category) => ({
          uid: "",
          name: category,
          university: "",
          imageUrl: "",
        }))
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, filter]);

  const handleSearch = () => {
    onSearch(searchQuery);

  };

  const handleSelectResearcher = (item: Researcher) => {
    setSearchQuery(item.name);
    setShowSuggestions(false);
    console.log(item.imageUrl);
    router.push(`/publicProfile?id=${encodeURIComponent(item.uid)}`);
  };

  const handleSelectCategory = (category: string) => {
    setSearchQuery(category);
    setShowSuggestions(false);
    console.log(`Category selected: ${category}`);
  };

  return (
    <div className="w-full bg-white py-10 px-4 text-center relative " ref={searchBarRef}>
      <h1 className="text-3xl font-semibold mb-1 text-[#1D2026]">
        Breakthrough Science Through Collaboration
      </h1>
      <p className="text-gray-600 mb-6">
        Explore research papers and projects that are shaping the future.
      </p>
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center border overflow-hidden relative">
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-100 text-[#1D2026] px-4 py-3 border-r focus:outline-none"
          >
            <option value="Research Papers">Research Papers</option>
            <option value="Researches">Researchers</option>
          </select>

          {/* Search Icon */}
          <div className="pl-3 pr-3">
            <Image src="/MagnifyingGlass.svg" alt="Search Icon" width={20} height={20} />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              filter === "Researches"
                ? "Search for researchers..."
                : "What do you want to learn..."
            }
            className="flex-1 px-3 py-3 text-[#1D2026] focus:outline-none"
          />

          {/* Search Button (Only for Research Papers) */}
          {filter === "Research Papers" && (
            <button onClick={handleSearch} className="bg-[#770C0C] cursor-pointer text-white px-5 py-3 h-full hover:bg-[#990F0F] active:bg-gray-200 active:scale-95 transition focus:outline-none duration-300 ease-in-out">
              Search
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <ul className="absolute z-10 mt-1 bg-white border w-full text-left shadow-lg rounded-md">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <li
                  key={item.name}
                  onClick={() =>
                    filter === "Researches"
                      ? handleSelectResearcher(item)
                      : handleSelectCategory(item.name)
                  }
                  className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
                >
                  {/* Avatar */}
                  {filter === "Researches" && item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : filter === "Researches" ? (
                    <div className="w-10 h-10 rounded-full text-[#1D2026] bg-gray-200 flex items-center justify-center">
                      <RxAvatar size={24} />
                    </div>
                  ) : null}

                  {/* Name & University */}
                  <div className="text-sm">
                    <div className="font-semibold text-[#1D2026]">{item.name}</div>
                    {filter === "Researches" && (
                      <div className="text-gray-500 text-xs truncate max-w-[250px]">
                        {item.university}
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBarSection;
