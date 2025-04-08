"use client";
import React, { useState, useEffect } from 'react';
import Modal from '../research/modal';
import { Loader2 } from 'lucide-react'; 

interface Researcher {
  uid: string; // Changed from _id to uid
  firstName: string;
  email: string;
  specialization?: string;
  institution?: string;
}

interface CollaborativeData {
  allowCollaboratorRequests: boolean;
  allowUnlistedSkills: boolean;
  requestedSkills: string[];
  team: string[]; // Storing researcher UIDs instead of IDs
}

interface CollaborativeOpportunitiesProps {
  data: CollaborativeData;
  onChange: (data: Partial<CollaborativeData>) => void;
  onSave: () => void;
  onSaveAndPreview: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CollaborativeOpportunities: React.FC<CollaborativeOpportunitiesProps> = ({
  data,
  onChange,
  onSave,
  onSaveAndPreview,
  onNext,
  onPrevious
}) => {
  const [researcher, setResearcher] = useState('');
  const [researcherEmail, setResearcherEmail] = useState('');
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResearcher, setSelectedResearcher] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  // For display purposes - mapping UIDs to researcher information
  const [teamDisplay, setTeamDisplay] = useState<{uid: string, display: string}[]>([]);
  
  // State for researcher creation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResearcher, setNewResearcher] = useState({ firstName: '', email: '', specialization: '', institution: '' });

  // Fetch researchers on component mount
  useEffect(() => {
    fetchResearchers();
  }, []);

  // Update teamDisplay whenever team or researchers change
  useEffect(() => {
    updateTeamDisplay();
  }, [data.team, researchers]);

  const updateTeamDisplay = () => {
    const display = data.team.map(uid => {
      const researcher = researchers.find(r => r.uid === uid);
      return {
        uid,
        display: researcher ? `${researcher.firstName} (${researcher.email})` : uid
      };
    });
    setTeamDisplay(display);
  };

  const fetchResearchers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/researchers`);
      const data = await response.json();
      
      // Log the researcher data with their UIDs
      console.log('Fetched researchers:', data);
      data.forEach((researcher: { firstName: any; uid: any; }) => {
        console.log(`Researcher: ${researcher.firstName}, ID: ${researcher.uid}`);
      });
      
      setResearchers(data);
    } catch (error) {
      console.error('Error fetching researchers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ [name]: checked });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...data.requestedSkills];
    updatedSkills[index] = value;
    onChange({ requestedSkills: updatedSkills });
  };

  const handleAddSkill = () => {
    onChange({ requestedSkills: [...data.requestedSkills, ''] });
  };

  const handleAddResearcher = async () => {
    if (researcher && researcherEmail) {
      try {
        setIsLoading(true);
        // Create a new researcher and get their UID
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/researchers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: researcher,
            email: researcherEmail
          }),
        });
        
        if (response.ok) {
          const newResearcherData = await response.json();
          // Add the researcher UID to the team
          onChange({ team: [...data.team, newResearcherData.uid] });
          // Add to researchers list for display
          setResearchers([...researchers, newResearcherData]);
          // Reset form fields
          setResearcher('');
          setResearcherEmail('');
        }
      } catch (error) {
        console.error('Error adding researcher:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectResearcher = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const researcherUid = e.target.value;
    if (!researcherUid) return;
    
    // Check if researcher UID is already in team
    if (!data.team.includes(researcherUid)) {
      onChange({ team: [...data.team, researcherUid] });
    }
    setSelectedResearcher('');
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedTeam = [...data.team];
    updatedTeam.splice(index, 1);
    onChange({ team: updatedTeam });
  };

  const handleCreateResearcher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/researchers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResearcher),
      });
      
      if (response.ok) {
        const createdResearcher = await response.json();
        // Add the researcher to our list
        setResearchers([...researchers, createdResearcher]);
        
        // Add the researcher UID to the team
        onChange({ team: [...data.team, createdResearcher.uid] });
        
        // Reset form and close modal
        setNewResearcher({ firstName: '', email: '', specialization: '', institution: '' });
        setIsModalOpen(false);
        
        // Refresh the researchers list
        fetchResearchers();
      } else {
        console.error('Failed to create researcher');
      }
    } catch (error) {
      console.error('Error creating researcher:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    onNext();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-black font-bold">Collaborative Opportunities</h2>
        <div className="space-x-4">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Save
          </button>
          <button
            onClick={onSaveAndPreview}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Save & Preview
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Collaborative Checkbox */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="allowCollaboratorRequests"
              checked={data.allowCollaboratorRequests}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-red-800 rounded border-gray-300 focus:ring-red-800"
            />
            <span className="text-sm text-gray-700">
              I want researchers to request to join as collaborators for this research
            </span>
          </label>
        </div>

       {/* Skills Requested */}
       <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-gray-700">Skills & Specialties Requested</h3>
            <button 
              type="button" 
              onClick={handleAddSkill}
              className="text-sm text-red-800 hover:text-red-900 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add new
            </button>
          </div>

          {data.requestedSkills.map((skill, index) => (
            <div key={index} className="relative">
              <div className="absolute left-3 top-3 text-gray-500">
                {String(index + 1).padStart(2, '0')}
              </div>
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="w-full pl-12 pr-16 py-2 text-black border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Skills, Specialties you are requesting"
                maxLength={50}
              />
              <span className="absolute right-3 top-3 text-xs text-gray-500">
                {skill.length}/50
              </span>
            </div>
          ))}
        </div>

        {/* Allow unlisted skills checkbox */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="allowUnlistedSkills"
              checked={data.allowUnlistedSkills}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-red-800 rounded border-gray-300 focus:ring-red-800"
            />
            <span className="text-sm text-gray-700">
              I want researchers to request to join as collaborators for this research even if their specialty/skill is listed
            </span>
          </label>
        </div>

        {/* Research Team */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-4">Research Team</h3>
          
          <div className="relative mb-4">
            <div className="relative">
              <select
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={selectedResearcher}
                onChange={handleSelectResearcher}
                disabled={isLoading}
              >
                <option value="">Search and add researchers you have connected with ...</option>
                {researchers.map((r) => (
                  <option key={r.uid} value={r.uid}>
                    {r.firstName} ({r.email})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="flex items-center text-sm text-red-800 hover:text-red-900 mb-6"
              onClick={() => setIsModalOpen(true)}
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add a researcher who doesn&apos;t have an account
            </button>
          </div>

          {(researcher || researcherEmail) && (
            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-md">
              <div>
                <label htmlFor="researcher-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="researcher-name"
                  type="text"
                  value={researcher}
                  onChange={(e) => setResearcher(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Researcher name"
                />
              </div>
              <div>
                <label htmlFor="researcher-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="researcher-email"
                  type="email"
                  value={researcherEmail}
                  onChange={(e) => setResearcherEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Researcher email"
                />
              </div>
              <button
                type="button"
                onClick={handleAddResearcher}
                disabled={!researcher || !researcherEmail || isLoading}
                className={`px-4 py-2 rounded-md ${
                  researcher && researcherEmail && !isLoading
                    ? 'bg-red-800 text-white hover:bg-red-900'
                    : 'bg-red-300 text-white cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Adding...
                  </>
                ) : (
                  'Add Researcher'
                )}
              </button>
            </div>
          )}

          {teamDisplay.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Researchers:</h4>
              <ul className="list-disc pl-5 text-sm">
                {teamDisplay.map((member, index) => (
                  <li key={index} className="flex text-pink-950 justify-between items-center pb-1">
                    <span>{member.display}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTeamMember(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            disabled={isPublishing}
          >
            Previous
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 flex items-center justify-center min-w-[120px]"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>

      {/* Modal for creating a new researcher */}
      {isModalOpen && (
        <Modal title="Create New Researcher" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleCreateResearcher} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                id="name"
                type="text"
                value={newResearcher.firstName}
                onChange={(e) => setNewResearcher({...newResearcher, firstName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Researcher name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                id="email"
                type="email"
                value={newResearcher.email}
                onChange={(e) => setNewResearcher({...newResearcher, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Researcher email"
                required
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                value={newResearcher.specialization}
                onChange={(e) => setNewResearcher({...newResearcher, specialization: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Area of expertise"
              />
            </div>
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                id="institution"
                type="text"
                value={newResearcher.institution}
                onChange={(e) => setNewResearcher({...newResearcher, institution: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="University or organization"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !newResearcher.firstName || !newResearcher.email}
                className={`px-4 py-2 rounded-md ${
                  !isLoading && newResearcher.firstName && newResearcher.email
                    ? 'bg-red-800 text-white hover:bg-red-900'
                    : 'bg-red-300 text-white cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Creating...
                  </>
                ) : (
                  'Create Researcher'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollaborativeOpportunities;