'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../../../services/Q&AService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AskQuestionPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || !title.trim() || !content.trim() || !userName.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const newQuestion = await api.createQuestion({
        title,
        content,
        userName,
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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="h-8 w-8 text-red-800" />
              <h1 className="text-2xl font-bold text-red-800">Resonance</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/Q&A" className="flex items-center text-red-800 hover:text-red-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Questions
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Ask a Question</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Question Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Enter a specific title for your question"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Be specific and imagine you are asking a question to another person
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Question Body
              </label>
              <textarea
                id="content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Include all the information someone would need to answer your question"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Include all the details someone would need to answer effectively
              </p>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Your Question'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}