'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, Tag } from 'lucide-react';
import { api } from '../../../../services/Q&AService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AskQuestionPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const [category, setCategory] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories = [
    { id: 'Research Methods', name: 'Research Methods' },
    { id: 'Data Analysis', name: 'Data Analysis' },
    { id: 'Theory', name: 'Theory' },
    { id: 'Publications', name: 'Publications' },
    { id: 'Career Advice', name: 'Career Advice' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || !title.trim() || !content.trim() || !userName.trim() || !category) {
      if (!category) {
        setError('Please select a category for your question');
      }
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const newQuestion = await api.createQuestion({
        title,
        content,
        userName,
        category,
        userAvatar: '' 
      });
      
      router.push(`/Q&A/${newQuestion.id}`);
    } catch (err) {
      setError('Failed to post question: ' + (err instanceof Error ? err.message : String(err)));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-red-800 rounded-full p-2 group-hover:bg-red-900 transition-all">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-red-800">Resonance</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/Q&A" className="flex items-center text-red-800 hover:text-red-900 font-medium">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Questions
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <Tag className="h-6 w-6 text-red-800" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Ask a Question</h1>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md border-l-4 border-red-500 animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Category
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-3 py-2  text-gray-800 border rounded-md flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent ${category ? 'border-gray-300 bg-white' : 'border-red-200 bg-red-50'}`}
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  >
                    <span>{category ? categories.find(c => c.id === category)?.name : 'Select a category'}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {categoryDropdownOpen && (
                    <div className="absolute z-10 mt-1 text text-gray-900 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="px-4 py-2 hover:bg-red-50 cursor-pointer"
                          onClick={() => {
                            setCategory(cat.id);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Question Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                placeholder="Enter a specific title for your question"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Be specific and imagine you are asking a question to another person
              </p>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Question Body
              </label>
              <textarea
                id="content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                placeholder="Include all the information someone would need to answer your question"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Include all the details someone would need to answer effectively
              </p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all disabled:opacity-50 font-medium shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                {submitting ? 'Posting...' : 'Post Your Question'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}