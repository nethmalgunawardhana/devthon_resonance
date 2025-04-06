import React from 'react';
import ContentSection from '@/components/ContentSection';
import FundingSection from '@/components/FundingSection';

const ResearchView = () => {
  return (
    <div className="min-h-screen bg-white p-20">
      <div className='absolute top-0 left-0 w-full h-2/5 bg-gray-50 opacity-50 z-0'></div>
      <div className="container mx-auto py-8 px-4 z-10 relative">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:flex-grow">
            <ContentSection />
          </div>
          <div className="lg:w-95 mt-8 lg:mt-0">
            <FundingSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchView;