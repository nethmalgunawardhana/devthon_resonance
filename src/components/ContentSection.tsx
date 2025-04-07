import React from 'react';
import { RxAvatar } from "react-icons/rx";
import CommentSection from './CommentSection';

interface ContentSectionProps {
  details: {
    title: string;
    description: string;
    createdAt: {_seconds: number, nanoseconds: number};
    fundingGoal: number;
    category: string;
    createdBy: string;
    allowCollaboratorRequests: boolean;
    thumbnailUrl: string;
    trailerVideoUrl: string;
    views: number;
    team: string[];
    keyInfo: string[];
    requestedSkills: string[];
  };  
  researchers: { firstName: string, lastName: string }[];
}

const ContentSection: React.FC<ContentSectionProps> = ({ details, researchers }) => {
  console.log(details.createdAt);


  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>{details.category}</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1D2026]">{details.title}</h1>
        <p className="text-gray-500 mb-6 text-sm">Created Date: {new Date(details.createdAt._seconds * 1000).toLocaleDateString()}</p>


        <p className="text-gray-500 mb-6">{details.description}</p>

        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
            <RxAvatar className="w-full h-full text-gray-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Lead by</div>
            <div className="font-medium text-[#1D2026]">
              {researchers[0].firstName} {researchers[0].lastName}
            </div>
          </div>
          <div className="ml-auto text-gray-500 text-sm">{details.views.toLocaleString()} Views</div>
        </div>

        <div className="relative w-full h-100 bg-gray-200 mb-8 flex items-center justify-center pt-5">
          {details.trailerVideoUrl ? (
            <video
              src={details.trailerVideoUrl}
              controls
              className="w-full h-auto rounded"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-gray-500">No video available.</p>
          )}
        </div>

        <div className="mb-8 pt-5">
          <h3 className="text-xl font-semibold text-[#1D2026] mb-3">Key Information</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {details.keyInfo.map((info, index) => (
              <li key={index} className="text-gray-700">{info}</li>
            ))}
          </ul>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-3 text-[#1D2026]">Collaboration Opportunities</h3>
          <p className="mb-3 text-gray-700">We are looking for more individuals to join us in this research. We are looking for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {details.requestedSkills.map((skill, index) => (
              <li key={index} className="text-gray-700">{skill}</li>
            ))}
          </ul>
          <p className="mt-3 text-gray-700">
            Even if we have not listed a requirement, but you still you can help out feel free to join us.
          </p>
          <div className="mt-4">
            {details.allowCollaboratorRequests && (
              <button className="text-[#564FFD] text-sm font-semibold border-2 p-3 border-gray-200
              hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 active:scale-95 transition ">Request To Collaborate</button>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#1D2026] mb-5">About The Research Team</h3>

            {researchers.slice(1,).map((researcher, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                  <RxAvatar className="w-full h-full text-gray-500" />
                </div>
                <div className="text-sm text-[#1D2026] font-medium">
                  {researcher.firstName} {researcher.lastName}
                </div>
              </div>
            ))}
          </div>


        <CommentSection />
      </div>
    </div>
  );
};

export default ContentSection;