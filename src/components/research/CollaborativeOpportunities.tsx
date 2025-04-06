"use client";
import React, { useState } from 'react';

interface CollaborativeOpportunitiesProps {
  data: {
    allowCollaboratorRequests: boolean;
    allowUnlistedSkills: boolean;
    requestedSkills: string[];
    team: string[];
  };
  onChange: (data: any) => void;
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

  const handleAddResearcher = () => {
    if (researcher && researcherEmail) {
      const newTeamMember = `${researcher} (${researcherEmail})`;
      onChange({ team: [...data.team, newTeamMember] });
      setResearcher('');
      setResearcherEmail('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Collaborative Opportunities</h2>
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
                className="w-full pl-12 pr-16 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                <option value="">Search and add researchers you have connected with ...</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center text-sm text-red-800 hover:text-red-900 mb-6"
            onClick={() => {
              setResearcher('');
              setResearcherEmail('');
            }}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add a researcher who doesn't have an account
          </button>

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
                disabled={!researcher || !researcherEmail}
                className={`px-4 py-2 rounded-md ${
                  researcher && researcherEmail
                    ? 'bg-red-800 text-white hover:bg-red-900'
                    : 'bg-red-300 text-white cursor-not-allowed'
                }`}
              >
                Add Researcher
              </button>
            </div>
          )}

          {data.team.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Added Researchers:</h4>
              <ul className="list-disc pl-5 text-sm">
                {data.team.map((member, index) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-red-800 text-white rounded-md hover:bg-red-900"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeOpportunities;