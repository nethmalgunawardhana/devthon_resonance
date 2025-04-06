"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Update import to next/navigation
import { researchService } from '../../../services/researchService';
import BasicInformation from './BasicInformation';
import AdvanceInformation from './AdvanceInformation';
import CollaborativeOpportunities from './CollaborativeOpportunities';
import StepIndicator from './StepIndicator';

export type ResearchFormData = {
  basicInfo: {
    title: string;
    category: string;
    language: string;
    fundingGoal: number;
  };
  advanceInfo: {
    thumbnail: File | null;
    trailerVideo: File | null;
    description: string;
    keyInformation: string[];
  };
  collaborativeInfo: {
    allowCollaboratorRequests: boolean;
    allowUnlistedSkills: boolean;
    requestedSkills: string[];
    team: string[];
  };
};

const ResearchCreate: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ResearchFormData>({
    basicInfo: {
      title: '',
      category: '',
      language: '',
      fundingGoal: 0,
    },
    advanceInfo: {
      thumbnail: null,
      trailerVideo: null,
      description: '',
      keyInformation: ['', '', ''],
    },
    collaborativeInfo: {
      allowCollaboratorRequests: true,
      allowUnlistedSkills: true,
      requestedSkills: ['', '', ''],
      team: [],
    },
  });

  // Add this useEffect to ensure component is mounted before using router
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBasicInfoChange = (data: Partial<ResearchFormData['basicInfo']>) => {
    setFormData((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } }));
  };

  const handleAdvanceInfoChange = (data: Partial<ResearchFormData['advanceInfo']>) => {
    setFormData((prev) => ({ ...prev, advanceInfo: { ...prev.advanceInfo, ...data } }));
  };

  const handleCollaborativeInfoChange = (data: Partial<ResearchFormData['collaborativeInfo']>) => {
    setFormData((prev) => ({ ...prev, collaborativeInfo: { ...prev.collaborativeInfo, ...data } }));
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Submit the entire form
        await researchService.createResearch(formData);
        router.push('/dashboard/research');
      } catch (error) {
        console.error('Error creating research:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      // Save as draft
      await researchService.saveResearchDraft(formData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSaveAndPreview = async () => {
    try {
      const savedData = await researchService.saveResearchDraft(formData);
      router.push(`/research/preview/${savedData.id}`);
    } catch (error) {
      console.error('Error saving and previewing:', error);
    }
  };

  if (!isClient) {
    return null; // Return null or a loading state while client-side rendering is not yet available
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <StepIndicator 
        steps={[
          { title: 'Basic Information', completed: currentStep > 1 },
          { title: 'Advance Information', completed: currentStep > 2 },
          { title: 'Publish Research', completed: false }
        ]} 
        currentStep={currentStep} 
      />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        {currentStep === 1 && (
          <BasicInformation 
            data={formData.basicInfo} 
            onChange={handleBasicInfoChange} 
            onSave={handleSave}
            onSaveAndPreview={handleSaveAndPreview}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <AdvanceInformation 
            data={formData.advanceInfo} 
            onChange={handleAdvanceInfoChange} 
            onSave={handleSave}
            onSaveAndPreview={handleSaveAndPreview}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 3 && (
          <CollaborativeOpportunities 
            data={formData.collaborativeInfo} 
            onChange={handleCollaborativeInfoChange} 
            onSave={handleSave}
            onSaveAndPreview={handleSaveAndPreview}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
};

export default ResearchCreate;