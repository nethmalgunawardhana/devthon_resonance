'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../services/Q&AService';
import { Question } from '../types/Q&A';
import Chatbot from '@/components/Chatbot';

export default function QuestionsPageContent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAllQuestions();

    const urlSearch = searchParams?.get('search');
    const urlCategory = searchParams?.get('category');

    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCategory) setActiveCategory(urlCategory);
  }, [searchParams]);

  const fetchAllQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions();
      setAllQuestions(data);
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load questions: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredData = [...allQuestions];

    if (searchQuery) {
      filteredData = filteredData.filter((q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeCategory) {
      filteredData = filteredData.filter((q) =>
        q.category?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    setQuestions(filteredData);
  };

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            {/* Sidebar content */}
          </div>

          {/* Questions */}
          <div className="col-span-9">
            {questions.map((question) => (
              <div key={question.id} className="bg-white rounded-lg shadow mb-4">
                {/* Question content */}
              </div>
            ))}
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}