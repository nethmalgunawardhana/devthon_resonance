"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { researchService } from '../../../services/researchService';
import BasicInformation from './BasicInformation';
import AdvanceInformation from './AdvanceInformation';
import CollaborativeOpportunities from './CollaborativeOpportunities';
import StepIndicator from './StepIndicator';
import { Loader2 } from 'lucide-react'; 

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0); // Added progress state
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

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isSubmitting) {
      progressInterval = setInterval(() => {
        setPublishProgress(prev => {
     
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 500);
    } else if (publishProgress >= 90) {
    
      setPublishProgress(100);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isSubmitting, publishProgress]);

  const handleBasicInfoChange = (data: Partial<ResearchFormData['basicInfo']>) => {
    setFormData((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } }));
  };

  const handleAdvanceInfoChange = (data: Partial<ResearchFormData['advanceInfo']>) => {
    setFormData((prev) => ({ ...prev, advanceInfo: { ...prev.advanceInfo, ...data } }));
  };

  const handleCollaborativeInfoChange = (data: Partial<ResearchFormData['collaborativeInfo']>) => {
    setFormData((prev) => {
 
      const newCollaborativeInfo = { ...prev.collaborativeInfo };
    
      if (data.team) {
  
        newCollaborativeInfo.team = data.team;
        console.log("Updated team data:", newCollaborativeInfo.team);
      }
 
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
    

    console.log("Updated collaborative info data:", data);
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
 
        if (!formData.userId) {
          throw new Error('User ID is required');
        }
        
        setIsSubmitting(true);
        setPublishProgress(10); 
        
     
        console.log("Submitting form data:", formData);
        
   
        await researchService.createResearch(formData);
        
 
        setPublishProgress(100);
   
        setTimeout(() => {
          
        }, 500);
      } catch (error) {
        console.error('Error creating research:', error);
     
        setPublishProgress(0);
      } finally {
        setIsSubmitting(false);
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
   
      if (!formData.userId) {
        throw new Error('User ID is required');
      }
   
      console.log("Saving draft with data:", formData);

      await researchService.saveResearchDraft(formData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSaveAndPreview = async () => {
    try {

      if (!formData.userId) {
        throw new Error('User ID is required');
      }
      
    
      console.log("Saving and previewing with data:", formData);
      
      const savedData = await researchService.saveResearchDraft(formData);
      router.push(`/research/preview/${savedData.id}`);
    } catch (error) {
      console.error('Error saving and previewing:', error);
    }
  };


  if (!isClient) {
    return null; 
  }


  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#770C0C]"></div>
      </div>
    );
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
            onNext={() => {
              if (!isSubmitting) handleNext();
            }}
            onPrevious={handlePrevious}
          />
        )}
        
        {/* Publishing Progress Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-red-800 animate-spin mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Publishing Research...</h3>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-red-800 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${publishProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                {publishProgress < 30 && "Preparing your research..."}
                {publishProgress >= 30 && publishProgress < 60 && "Uploading content..."}
                {publishProgress >= 60 && publishProgress < 90 && "Processing submission..."}
                {publishProgress >= 90 && "Finalizing publication..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchCreate;