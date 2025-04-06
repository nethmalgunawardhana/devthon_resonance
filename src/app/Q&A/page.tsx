'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Award, Search, Filter, TrendingUp, SearchIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../../../services/Q&AService';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Question } from '../../types/Q&A';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadQuestions();
    
    // Initialize search query from URL
    const urlSearch = searchParams?.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await api.getQuestions();
      
      // Apply search filter if present
      const search = searchParams?.get('search');
      const category = searchParams?.get('category');
      
      let filteredData = [...data];
      
      if (search) {
        filteredData = filteredData.filter(q => 
          q.title.toLowerCase().includes(search.toLowerCase()) || 
          q.content.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (category) {
        // This is a placeholder - actual implementation would depend on your category structure
        filteredData = filteredData.filter(q => q.content.includes(category));
      }
      
      setQuestions(filteredData);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load questions: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  const handleVote = async (questionId: string, value: 1 | -1) => {
    try {
      const updatedQuestion = await api.voteQuestion(questionId, value);
      setQuestions(questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      ));
    } catch (err) {
      setError('Failed to vote: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/questions?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading questions...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  const sortByTrending = () => {
    const sorted = [...questions].sort((a, b) => b.votes - a.votes);
    setQuestions(sorted);
  };

  const sortByTopRated = () => {
    const sorted = [...questions].sort((a, b) => b.answers - a.answers);
    setQuestions(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <SearchIcon className="h-8 w-8 text-red-800" />
              <h1 className="text-2xl font-bold text-red-800">Resonance</h1>
            </Link>
            <form onSubmit={handleSearch} className="relative flex-1 max-w-lg mx-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
            </form>
            <Link href="/Q&A/ask" className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition">
              Ask Question
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2">
                {['Research Methods', 'Data Analysis', 'Theory', 'Publications', 'Career Advice'].map((category) => (
                  <li key={category}>
                    <Link href={`/Q&A?category=${encodeURIComponent(category)}`} className="text-gray-600 hover:text-red-800 block py-1">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">Latest Questions</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <button 
                  onClick={sortByTrending}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-800"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </button>
                <button 
                  onClick={sortByTopRated}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-800"
                >
                  <Award className="h-4 w-4" />
                  <span>Top Rated</span>
                </button>
              </div>
            </div>

            {/* Question Cards */}
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                No questions found. Be the first to ask a question!
              </div>
            ) : (
              questions.map((question) => (
                <div key={question.id} className="bg-white rounded-lg shadow-sm p-6 mb-4 hover:shadow-md transition">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <button 
                        onClick={() => handleVote(question.id, 1)}
                        className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50"
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700">{question.votes}</span>
                      <button 
                        onClick={() => handleVote(question.id, -1)}
                        className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50"
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <Link href={`/Q&A/${question.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-red-800">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4">
                        {question.content.length > 200 
                          ? `${question.content.substring(0, 200)}...` 
                          : question.content
                        }
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {question.userAvatar && (
                            <img 
                              src={question.userAvatar} 
                              alt={question.userName} 
                              className="h-6 w-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-gray-500">{question.userName}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{question.answers} answers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
