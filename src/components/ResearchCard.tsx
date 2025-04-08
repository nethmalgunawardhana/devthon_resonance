"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ResearchProject } from "../../services/researchService";

interface ResearchCardProps {
  project: ResearchProject;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ project }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/ResearchView?id=${project.id}`);
  };

  return (
    <div
      className="border shadow-md bg-white hover:shadow-lg transition cursor-pointer w-80 h-120 flex flex-col"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-[#1D2026] mb-1">{project.title}</h3>
        <p className="text-gray-500 text-sm">
          Created by: <span className="font-medium">{project.createdBy}</span>
        </p>
        <p className="text-gray-500 text-sm mb-2">
          Date: {new Date(project.createdAt._seconds*1000).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
            {project.description.length > 150
              ? `${project.description.slice(0, 150)}...`
              : project.description}
          </p>
        <button
          className="text-sm text-[#770C0C] font-semibold hover:underline self-start"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            router.push(`/ResearchView?id=${project.id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ResearchCard;