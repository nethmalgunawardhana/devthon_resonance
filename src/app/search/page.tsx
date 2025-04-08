"use client";

import { useState, useEffect } from "react";
import SearchBarSection from "@/components/SearchBarSection";
import ResearchCard from "@/components/ResearchCard";
import { fetchResearchProjects, ResearchProject, fetchTrendingResearchProjects } from "../../../services/researchService";
import { getResearcherById } from "../../../services/researcherIdService";
import { fetchPublishedResearches, ResearchItem } from "../../../services/arxivService";

export default function Search() {
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);
  const [publishedPapers, setPublishedPapers] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingResearchProjects, setTrendingResearchProjects] = useState<ResearchProject[]>([]);

  useEffect(() => {
    const fetchTrendingProjects = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingResearchProjects();
        const researcherPromises = data.map((project) => getResearcherById(project.createdBy));
        const researchers = await Promise.all(researcherPromises);
        const projectsWithResearchers = data.map((project, index) => ({
          ...project,
          createdBy: researchers[index].firstName + " " + researchers[index].lastName,
        }));
        setTrendingResearchProjects(projectsWithResearchers);
      } catch (error) {
        console.error("Failed to fetch trending research projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingProjects();
  }, []);

  const getProjects = async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await fetchResearchProjects(searchQuery);
      const researcherPromises = data.map((project) => getResearcherById(project.createdBy));
      const researchers = await Promise.all(researcherPromises);
      const projectsWithResearchers = data.map((project, index) => ({
        ...project,
        createdBy: researchers[index].firstName + " " + researchers[index].lastName,
      }));

      const publishedResearches = await fetchPublishedResearches(searchQuery);

      setResearchProjects(projectsWithResearchers);
      setPublishedPapers(publishedResearches);
    } catch (error) {
      console.error("Failed to fetch research projects or published papers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      {/* Search Bar */}
      <SearchBarSection onSearch={getProjects} />

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-20 min-h-screen">
          <div className="spinner"></div>
        </div>
      )}

      {/* Local Repository Section */}
      {!loading && researchProjects.length > 0 && (
        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-[#1D2026]">From Local Repository</h2>
          <div className="flex flex-wrap gap-6">
            {researchProjects.map((project) => (
              <ResearchCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Published Papers Section */}
      {!loading && publishedPapers.length > 0 && (
        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-[#1D2026]">Published Papers</h2>
          <ul className="space-y-6">
            {publishedPapers.map((paper, index) => (
              <li key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-[#1D2026]">{paper.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Authors: {paper.authors}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Published: {new Date(paper.published).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-4">{paper.summary}</p>
                <div className="flex space-x-4">
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#564FFD] hover:underline"
                  >
                    View Paper
                  </a>
                  <a
                    href={paper.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#770C0C] hover:underline"
                  >
                    Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Research Section */}
      {!loading && trendingResearchProjects.length > 0 && (
        <div className="px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-[#1D2026]">Trending Researches</h2>
          <div className="flex flex-wrap gap-6">
            {trendingResearchProjects.map((project) => (
              <ResearchCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
