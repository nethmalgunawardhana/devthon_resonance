"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { FaFacebookF } from "react-icons/fa";
import { TiSocialLinkedin } from "react-icons/ti";
import { MdEmail } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { SiOrcid } from "react-icons/si";
import { useSearchParams } from "next/navigation";
import { getResearcherById, Researcher } from "../../../services/researcherIdService";
import { getOpenAlexResearcher, OpenAlexResearcher } from "../../../services/openAlexService";
import { fetchResearchProjectForResearcher, ResearchProject } from "../../../services/researchService2" 
import ResearchCard from "@/components/ResearchCard";

// Client component that uses search params
function ResearcherProfileContent() {
  const [activeTab, setActiveTab] = useState("researches");
  const [copied, setCopied] = useState(false);
  const [researcher, setResearcher] = useState<Researcher>();
  const searchParams = useSearchParams();
  const uid = searchParams.get("id") as string;
  const [loading, setLoading] = useState(true);
  const [openAlexData, setOpenAlexData] = useState<OpenAlexResearcher>();
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getResearcherById(uid);
        setResearcher(response);

        try {
          const openAlexData = await getOpenAlexResearcher(response.firstName);
          setOpenAlexData(openAlexData);

          const projects = await fetchResearchProjectForResearcher(uid);
          setResearchProjects(Array.isArray(projects) ? projects : [projects]);
          console.log("Research Projects:", projects);
        } catch (err) {
          console.warn("OpenAlex data not found:", err);
        }
      } catch (error) {
        console.error("Error fetching researcher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      loadData();
    }
  }, [uid]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {loading ? (
        <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
      ) : !researcher ? (
        <div className="flex items-center justify-center h-screen text-gray-500">No Researcher Found</div>
      ) : (
        <div className="flex-1 p-24 text-[#1D2026] mt-12">
          <div className="flex items-start gap-10 border-b pb-8">
            {researcher.imageUrl ? (
              <img
                src={researcher.imageUrl}
                alt="Researcher"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden">
                <RxAvatar className="w-full h-full text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-semibold">
                {researcher.firstName} {researcher.lastName}
              </h1>
              {openAlexData && (
                <p className="text-gray-600 mt-1">
                  Last recognized affiliation: {openAlexData.affiliation}
                </p>
              )}
              {openAlexData && (
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-[#1D2026] font-semibold">Citations: {openAlexData.citation_count}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-[#1D2026] font-semibold">h-index: {openAlexData.summary.h_index}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-[#1D2026] font-semibold">i10_index: {openAlexData.summary.i10_index}</span>
                </div>
              )}

              {/* Social Icons */}
              <div className="mt-4">
                <p className="text-sm text-[#1D2026] mb-3">Share this profile or Connect:</p>
                <div className="flex space-x-3">
                  <button
                    className="flex items-center text-sm text-gray-600 border border-gray-200 rounded px-3 py-1
                    hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
                    onClick={handleCopyUrl}
                  >
                    <FaCopy className="h-4 w-4 text-gray-600 mr-2" />
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
                    onClick={() => window.open(`https://orcid.org/${openAlexData?.orchid}`, "_blank")}
                  >
                    <SiOrcid className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded
                    hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition"
                    onClick={() => window.open(`mailto:${researcher.email}`, "_blank")}
                  >
                    <MdEmail className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition">
                    <TiSocialLinkedin className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition">
                    <FaFacebookF className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Section & Tabs */}
          <div className="flex flex-col lg:flex-row gap-10 mt-10">
            {/* About */}
            <div className="lg:w-1/3 pr-10">
              <h2 className="text-xl font-semibold mb-4">ABOUT RESEARCHER</h2>
              <p className="text-gray-600 text-sm leading-6">{researcher.about}</p>
            </div>

            {/* Tabs & Cards */}
            <div className="lg:w-2/3">
              <div className="flex mb-6">
                <button
                  className={`pb-2 px-6 text-sm font-medium border-b-2 transition ${
                    activeTab === "researches"
                      ? "border-[#ff5d2c] text-[#1D2026]"
                      : "border-transparent text-gray-500 hover:text-[#1D2026]"
                  }`}
                  onClick={() => setActiveTab("researches")}
                >
                  Local Repository
                </button>
                <button
                  className={`pb-2 px-6 text-sm font-medium border-b-2 transition ${
                    activeTab === "collaborations"
                      ? "border-[#ff5d2c] text-[#1D2026]"
                      : "border-transparent text-gray-500 hover:text-[#1D2026]"
                  }`}
                  onClick={() => setActiveTab("collaborations")}
                >
                  Published Papers
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeTab === "researches" && <>
                  {researchProjects.length > 0 ? (
                    researchProjects.map((project) => (
                      <ResearchCard key={project.id} project={project} />
                    ))
                  ) : (
                    <p>No research projects available yet.</p>
                  )}
                </>}
                {activeTab === "collaborations" && (
                  <>
                  {openAlexData?.works && openAlexData.works.length > 0 ? (
                    openAlexData.works.map((work, index) => (
                      <div
                        key={index}
                        className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
                      >
                        <h3 className="text-xl font-semibold text-[#1D2026] mb-2">{work.title}</h3>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p><span className="font-medium text-gray-700">Authors:</span> {work.authors.join(", ")}</p>
                          <p><span className="font-medium text-gray-700">Published:</span> {new Date(work.publication_date).toLocaleDateString()}</p>
                          <p><span className="font-medium text-gray-700">Citations:</span> {work.citation_count}</p>
                          <p><span className="font-medium text-gray-700">Type:</span> {work.type}</p>
                        </div>

                        <a
                          href={work.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          View Full Paper
                        </a>
                      </div>
                    ))
                  ) : (
                    <p>No published papers available yet.</p>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Main component with suspense boundary
export default function ResearcherProfile() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-500">Loading profile...</div>}>
      <ResearcherProfileContent />
    </Suspense>
  );
}