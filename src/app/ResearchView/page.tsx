"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import ContentSection from '@/components/ContentSection';
import FundingSection from '@/components/FundingSection';
import { useSearchParams } from 'next/navigation';
import { fetchResearchProjectById, ResearchProject } from '../../../services/researchService2';
import { getResearcherById } from '../../../services/researcherIdService';
import { Loader } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';

const ResearchView = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [researchProject, setResearchProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  interface Researcher {
    firstName: string;
    lastName: string;
  }

  const [researchers, setResearchers] = useState<Researcher[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        try {
          const project = await fetchResearchProjectById(id);
          setResearchProject(project);
          const researcherIds = [project.createdBy, ...project.team];
          const researcherData = await Promise.all(
            researcherIds.map((researcherId) => getResearcherById(researcherId))
          );

          setResearchers(researcherData);

        } catch (error) {
          console.error('Error fetching research project:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center">
          <Loader className="animate-spin h-10 w-10 text-red-900" />
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </motion.div> 
    );
  }

  if (!researchProject) {
    return <p className="text-center text-gray-500">No research project found.</p>;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}> 
      <div className="bg-white min-h-screen">
      <motion.div
        className="min-h-screen bg-white p-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto py-8 px-4 z-10 relative">
          <Navbar />
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <motion.div
              className="lg:flex-grow"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContentSection
                details={{
                  title: researchProject.title,
                  description: researchProject.description,
                  createdAt: researchProject.createdAt,
                  category: researchProject.category,
                  fundingGoal: researchProject.fundingGoal,
                  team: researchProject.team,
                  createdBy: researchProject.createdBy,
                  allowCollaboratorRequests: researchProject.allowCollaboratorRequests,
                  thumbnailUrl: researchProject.thumbnailUrl,
                  trailerVideoUrl: researchProject.trailerVideoUrl,
                  views: researchProject.views,
                  keyInfo: researchProject.keyInformation,
                  requestedSkills: researchProject.requestedSkills,
                }}
                
                researchers={researchers}
              />
            </motion.div>
            <motion.div
              className="lg:w-95 mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <FundingSection project={researchProject} />
            </motion.div>
          </div>
        
        </div>
      
      </motion.div>
      <Footer />
      </div>
    </Suspense>
  );
};

export default ResearchView;