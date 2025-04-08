"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import ResearchCard from "@/components/ResearchCard";
import { fetchTrendingResearchProjects } from "../../services/researchService2";
import { getResearcherById } from "../../services/researcherIdService";

import { FaFlask, FaBook, FaChartLine, FaClipboardList } from "react-icons/fa";
import {
  GiMagnifyingGlass,
  GiChemicalDrop,
  GiArchiveResearch,
} from "react-icons/gi";
import { MdOutlineScience } from "react-icons/md";

export default function Home() {
  const [trendingResearchProjects, setTrendingResearchProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // @ts-ignore
        setTrendingResearchProjects(projectsWithResearchers);
      } catch (error) {
        console.error("Failed to fetch trending research projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingProjects();
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-18">
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="flex flex-col-reverse md:flex-row items-stretch h-[80vh]">
            {/* Left Content */}
            <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-8 md:py-0">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Breakthrough science through collaboration
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We bring great minds together to collaborate, secure funding,
                and connect with researchers to drive groundbreaking
                discoveries.
              </p>
              <div className="mt-6">
                <button className="bg-[#770C0C] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5d0a0a] transition">
                  Create Account
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 relative h-96 md:h-auto max-md:bg-[#770C0C]">
              <div
                className="absolute inset-0 bg-cover bg-center "
                style={{
                  backgroundImage: "url('/hero-image.jpg')",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)",
                }}
              ></div>
            </div>
          </div>
        </section>

        {/* Research Categories */}
        <section className="container mx-auto p-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Browse top research category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              {
                name: "Applied Research",
                icon: <FaFlask className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Basic Research",
                icon: <FaBook className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Correlational Research",
                icon: <FaChartLine className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Descriptive Research",
                icon: <FaClipboardList className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Grounded Theory",
                icon: <GiMagnifyingGlass className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Exploratory Research",
                icon: <GiChemicalDrop className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Experimental Research",
                icon: <MdOutlineScience className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Ethnographic Research",
                icon: <GiArchiveResearch className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Historical Research",
                icon: <FaBook className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Phenomenological Research",
                icon: <FaFlask className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Qualitative Research",
                icon: <FaChartLine className="text-[#770C0C] text-2xl" />,
              },
              {
                name: "Quantitative Research",
                icon: <FaClipboardList className="text-[#770C0C] text-2xl" />,
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 hover:shadow-lg transition flex flex-col items-center text-center"
              >
                {category.icon}
                <h3 className="text-md font-semibold text-gray-800 mt-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">12,345 Researchers</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Research */}
        <section className="bg-gray-50 p-20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Trending Research
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">Loading trending research...</p>
              </div>
            ) : trendingResearchProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {trendingResearchProjects.map((project) => (
                  // @ts-ignore
                  <ResearchCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto p-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {[
              {
                title: "AI-Driven Research Discovery",
                icon: "/artificial-intelligence.png",
                alt: "AI Research Icon"
              },
              {
                title: "Decentralized Research Funding",
                icon: "/profit.png",
                alt: "Funding Icon"
              },
              {
                title: "Q&A Forum",
                icon: "/discussion (1).png",
                alt: "Q&A Forum Icon"
              },
              {
                title: "Industry-Academia Integration",
                icon: "/workplace.png",
                alt: "Integration Icon"
              },
              {
                title: "Mentorship and Knowledge Base",
                icon: "/image 2.png",
                alt: "Mentorship Icon"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
              >
                <Image
                  src={feature.icon}
                  alt={feature.alt}
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Create New Research and Fund a Research Section */}
        <section className="container mx-auto py-16 px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-8 md:px-32 py-16">
            {/* Create New Research */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex justify-center md:hidden mb-4">
                <Image
                  src="/icon.png"
                  alt="Create Research Icon"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
                Create New Research
              </h2>
              <p className="mt-4 text-gray-600 text-sm md:text-base text-center md:text-left">
                Turn your ideas into impactful research projects. Connect with a
                network of experts, access essential resources, and bring your
                vision to life with global collaboration.
              </p>
              <button
                className="mt-6 bg-[#770C0C] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#5d0a0a] transition"
                onClick={() => window.location.href = "/researchcreate"}
              >
                Get Started
              </button>
            </div>
            <div className="hidden md:flex justify-center">
              <Image
                src="/icon.png"
                alt="Create Research Icon"
                width={150}
                height={150}
                className="rounded-lg md:w-[200px] md:h-[200px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center m-16">
            {/* Fund a Research */}
            <div className="flex justify-center">
              <svg
                fill="#770C0C"
                version="1.1"
                className="w-64 h-64"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 245"
                enableBackground="new 0 0 256 245"
                stroke="#770C0C"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M192.498,113.8c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8S183.22,113.8,192.498,113.8z M171.798,155.6c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8S162.52,155.6,171.798,155.6z M144.998,192.3h-18.9h-18.9c-11.5,0-18.7,9.5-18.7,21.4V243h12.9v-25.9c0-1.2,1-2,2-2c1.2,0,2,0.8,2,2v25.8h41.5v-25.8 c0-1.2,1-2,2-2c1.2,0,2,1,2,2v25.8h12.9v-29.1C163.998,201.8,156.698,192.3,144.998,192.3z M149.698,113.8 c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8S140.42,113.8,149.698,113.8z M199.098,172.4 c0,9.3,7.5,16.8,16.8,16.8s16.8-7.5,16.8-16.8s-7.5-16.8-16.8-16.8S199.098,163.1,199.098,172.4z M197.398,192.3 c-11.5,0-18.7,9.5-18.7,21.4V243h12.9v-25.9c0-1.2,1-2,2-2c1.2,0,2,0.8,2,2v25.8h41.5v-25.8c0-1.2,1-2,2-2c1.2,0,2,1,2,2v25.8h12.9 v-29.1c0.2-12.1-7.1-21.6-18.7-21.6h-18.9h-19V192.3z M39.798,155.6c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8 s-16.8-7.522-16.8-16.8S30.52,155.6,39.798,155.6z M14.798,242.9v-25.8c0-1.2,1-2,2-2c1.2,0,2,0.8,2,2v25.8h41.5v-25.8 c0-1.2,1-2,2-2c1.2,0,2,1,2,2v25.8h12.9v-29.1c0.2-12.1-7.1-21.6-18.7-21.6h-18.9h-18.9c-11.5,0-18.7,9.5-18.7,21.4v29.3 L14.798,242.9L14.798,242.9z M109.298,172.4c0,9.3,7.5,16.8,16.8,16.8c9.3,0,16.8-7.5,16.8-16.8s-7.5-16.8-16.8-16.8 S109.298,163.1,109.298,172.4z M61.298,113.8c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8 S52.02,113.8,61.298,113.8z M106.698,113.8c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8 S97.42,113.8,106.698,113.8z M84.098,155.6c9.278,0,16.8,7.522,16.8,16.8s-7.522,16.8-16.8,16.8s-16.8-7.522-16.8-16.8 S74.82,155.6,84.098,155.6z M127.933,93c25.038,0,45.5-20.327,45.5-45.5S153.106,2,127.933,2S82.567,22.462,82.567,47.635 C82.567,72.673,102.894,93,127.933,93z M125.42,51.359c-8.346-2.917-13.551-7.135-13.551-14.628c0-6.91,4.577-12.34,12.968-14.045 v-7.494h6.282v7.135c5.205,0,8.974,1.077,11.756,2.558l-2.558,8.974c-2.064-0.853-5.429-2.288-10.051-2.288 c-4.622,0-7.135,2.288-7.135,4.577c0,3.141,2.917,4.353,9.199,6.91c8.571,3.141,12.564,7.494,12.564,14.628 s-4.353,12.564-13.551,14.628v7.135h-6.282v-6.91c-5.429,0-10.904-1.436-13.551-2.917l2.288-9.199 c2.917,1.436,7.494,3.141,12.34,3.141c5.205,0,7.763-2.288,7.763-5.429S131.433,53.692,125.42,51.359z"></path>
                </g>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-3xl font-bold text-gray-800">
                Fund a Research
              </h2>
              <p className="mt-4 text-gray-600">
                Support groundbreaking research and drive innovation. Contribute
                to projects that align with your interests and help researchers
                make meaningful discoveries.
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