"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  userId: string; 
};

const ResearchCreate: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userId, setUserId] = useState<string>('');
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
    userId: '', 
  });

  // Ensure component is mounted and get userId from localStorage
  useEffect(() => {
    setIsClient(true);
    
    // Get userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setFormData(prev => ({
        ...prev,
        userId: storedUserId
      }));
    } else {
      // Redirect if no userId is found
      console.error('No user ID found in localStorage');
      router.push('/signin');
    }
  }, [router]);

  const handleBasicInfoChange = (data: Partial<ResearchFormData['basicInfo']>) => {
    setFormData((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } }));
  };

  const handleAdvanceInfoChange = (data: Partial<ResearchFormData['advanceInfo']>) => {
    setFormData((prev) => ({ ...prev, advanceInfo: { ...prev.advanceInfo, ...data } }));
  };

  // Fixed handleCollaborativeInfoChange function to properly handle team array updates
  const handleCollaborativeInfoChange = (data: Partial<ResearchFormData['collaborativeInfo']>) => {
    setFormData((prev) => {
      // Create a new object to avoid reference issues
      const newCollaborativeInfo = { ...prev.collaborativeInfo };
      
      // Handle team array specially to ensure it's properly updated
      if (data.team) {
        newCollaborativeInfo.team = [...data.team];
      }
      
      // Handle other fields
      if (data.allowCollaboratorRequests !== undefined) {
        newCollaborativeInfo.allowCollaboratorRequests = data.allowCollaboratorRequests;
      }
      
      if (data.allowUnlistedSkills !== undefined) {
        newCollaborativeInfo.allowUnlistedSkills = data.allowUnlistedSkills;
      }
      
      if (data.requestedSkills) {
        newCollaborativeInfo.requestedSkills = [...data.requestedSkills];
      }
      
      return { ...prev, collaborativeInfo: newCollaborativeInfo };
    });
    
    // Debug logging to verify state updates
    console.log("Updated collaborative info data:", data);
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Ensure we have a userId before submitting
        if (!formData.userId) {
          throw new Error('User ID is required');
        }
        
        // Log form data before submission to verify team data
        console.log("Submitting form data:", formData);
        
        // Submit the entire form with userId
        await researchService.createResearch(formData);
        router.push('/dashboard/research');
      } catch (error) {
        console.error('Error creating research:', error);
        // You might want to add error handling UI here
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
      // Ensure we have a userId before saving
      if (!formData.userId) {
        throw new Error('User ID is required');
      }
      
      // Log the data before saving to verify team data
      console.log("Saving draft with data:", formData);
      
      // Save as draft with userId
      await researchService.saveResearchDraft(formData);
    } catch (error) {
      console.error('Error saving draft:', error);
      // You might want to add error handling UI here
    }
  };

  const handleSaveAndPreview = async () => {
    try {
      // Ensure we have a userId before saving and previewing
      if (!formData.userId) {
        throw new Error('User ID is required');
      }
      
      // Log the data before saving and previewing to verify team data
      console.log("Saving and previewing with data:", formData);
      
      const savedData = await researchService.saveResearchDraft(formData);
      router.push(`/research/preview/${savedData.id}`);
    } catch (error) {
      console.error('Error saving and previewing:', error);
      // You might want to add error handling UI here
    }
  };

  // Show loading state or redirect if not client-side or no userId
  if (!isClient) {
    return null; // Return null or a loading state while client-side rendering is not yet available
  }

  // Optional: Return a loading state or redirect if no userId
  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#770C0C]"></div>
      </div>
    );
  }

  // Debugging: Log the current state of formData to track team updates
  console.log("Current form data:", formData);

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