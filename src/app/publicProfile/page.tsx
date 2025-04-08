'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResearcherProfileContent from './../../components/ResearcherProfileContent';

export default function ResearcherProfile() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>}>
      <ResearcherProfileContent uid={useSearchParams().get('id') as string} />
    </Suspense>
  );
}