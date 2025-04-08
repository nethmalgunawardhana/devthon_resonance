'use client';

import { Suspense } from 'react';
import QuestionsPageContent from '../../components/QuestionsPageContent';

export default function QuestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <QuestionsPageContent />
    </Suspense>
  );
}