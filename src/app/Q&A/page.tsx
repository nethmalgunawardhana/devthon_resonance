'use client';

import { useState, useEffect} from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Award, Search, Filter, TrendingUp, Loader, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../../../services/Q&AService';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Question } from '../../types/Q&A';
import Chatbot from '@/components/Chatbot';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 1 | -1 | 0>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
   
    fetchAllQuestions();
    
  
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
    
    const urlSearch = searchParams?.get('search');
    const urlCategory = searchParams?.get('category');
    
    if (urlSearch || urlCategory) {
      if (urlSearch) setSearchQuery(urlSearch);
      if (urlCategory) setActiveCategory(urlCategory);
      setHasAppliedFilters(true);
    }
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
    setFetchingData(true);
    
    let filteredData = [...allQuestions];
    
 
    if (searchQuery) {
      filteredData = filteredData.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeCategory) {
        filteredData = filteredData.filter(q => {
    
          if (q.category) {
            const normalizedCategory = activeCategory.toLowerCase().replace(/[\s_-]/g, '');
            const normalizedQCategory = q.category.toLowerCase().replace(/[\s_-]/g, '');
            return normalizedQCategory.includes(normalizedCategory);
          }

          return q.content.toLowerCase().includes(activeCategory.toLowerCase());
        });
      }
    

    const hasFilters = !!(searchQuery || activeCategory);
    setHasAppliedFilters(hasFilters);
    
    setQuestions(filteredData);
    setFetchingData(false);
  };

  const handleVote = async (questionId: string, value: 1 | -1) => {
    try {

      const currentVote = userVotes[questionId] || 0;
      const newVote = currentVote === value ? 0 : value;

      let updatedQuestion;
      if (newVote !== 0) {
        updatedQuestion = await api.voteQuestion(questionId, newVote);
      } else {

        updatedQuestion = await api.voteQuestion(questionId, currentVote === 1 ? -1 : 1);
      }

      setQuestions(questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      ));
      
      setAllQuestions(allQuestions.map(q => 
        q.id === questionId ? updatedQuestion : q
      ));
      
      // Update user votes
      const newUserVotes: Record<string, 0 | 1 | -1> = { ...userVotes, [questionId]: newVote };
      setUserVotes(newUserVotes);
      localStorage.setItem('userVotes', JSON.stringify(newUserVotes));
    } catch (err) {
      setError('Failed to vote: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleCategoryClick = (category: string) => {

    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);
  
  };

  const handleShowAllQuestions = () => {
 
    setSearchQuery('');
    setActiveCategory(null);
    setHasAppliedFilters(false);
    setQuestions(allQuestions);
  };

  const clearSearch = () => {
    if (!searchQuery) return;
    
    setSearchQuery('');

  };


  useEffect(() => {

    if (loading) return;
    
    applyFilters();
  }, [searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="relative h-16 w-16 mb-4">
            <Loader className="h-16 w-16 text-red-800 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-800 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortByTrending = () => {
    const sorted = [...questions].sort((a, b) => b.votes - a.votes);
    setQuestions(sorted);
  };

  const sortByTopRated = () => {
    const sorted = [...questions].sort((a, b) => b.answers - a.answers);
    setQuestions(sorted);
  };

  const hasActiveFilters = searchQuery || activeCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Resonance Logo" className="h-8 mr-2" />
            </div>
          </Link>
            <form onSubmit={handleSearch} className="relative flex-1 max-w-lg mx-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-black border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
            <Link href="/Q&A/ask" className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-900 transition font-medium shadow-md hover:shadow-lg">
              Ask Question
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-red-800" />
                Categories
              </h2>
              <ul className="space-y-3">
                {[ 'Data Analysis','Research Methods', 'Theory', 'Publications', 'Career Advice'].map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => handleCategoryClick(category)}
                      className={`text-left w-full text-gray-600 hover:text-red-800 block py-2 px-3 rounded-md hover:bg-gray-50 transition
                        ${activeCategory === category ? 'bg-red-50 text-red-800 font-medium' : ''}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
              
              {hasActiveFilters && (
                <button 
                  onClick={handleShowAllQuestions}
                  className="mt-6 w-full py-2 px-3 text-red-800 border border-red-800 rounded-md hover:bg-red-50 transition text-sm font-medium flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Show All Questions
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900 ml-2">
                    {hasActiveFilters ? 'Filtered Questions' : 'Latest Questions'}
                  </h2>
                  <div className="ml-4 px-2 py-1 bg-red-50 text-red-800 text-xs rounded-full font-medium">
                    {questions.length} results
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <div className="flex items-center">
                    {searchQuery && (
                      <div className="flex items-center mr-2 px-3 py-1 bg-red-50 text-red-800 text-sm rounded-full">
                        <span className="mr-1">Search: {searchQuery}</span>
                        <button onClick={clearSearch} className="text-red-700 hover:text-red-900">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {activeCategory && (
                      <div className="flex items-center mr-2 px-3 py-1 bg-red-50 text-red-800 text-sm rounded-full">
                        <span className="mr-1">Category: {activeCategory}</span>
                        <button onClick={() => handleCategoryClick(activeCategory)} className="text-red-700 hover:text-red-900">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={sortByTrending}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </button>
                  <button 
                    onClick={sortByTopRated}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                  >
                    <Award className="h-4 w-4" />
                    <span>Top Rated</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Question Cards - with in-place loading state */}
            <div className="relative">
         
              {fetchingData && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <Loader className="h-12 w-12 text-red-800 animate-spin mb-2" />
                    <span className="text-gray-700 font-medium">Loading questions...</span>
                  </div>
                </div>
              )}
              
          
              {(questions.length === 0 && hasAppliedFilters) ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-500 mb-6">
                    {hasActiveFilters 
                      ? `No questions found for ${activeCategory ? `category "${activeCategory}"` : ""}${(activeCategory && searchQuery) ? " and " : ""}${searchQuery ? `search "${searchQuery}"` : ""}` 
                      : "Be the first to ask a question!"}
                  </p>
                  
                  {hasActiveFilters && (
                    <button 
                      onClick={handleShowAllQuestions}
                      className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-900 transition font-medium mr-4"
                    >
                      Show All Questions
                    </button>
                  )}
                  <Link href="/Q&A/ask" className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-900 transition font-medium">
                    Ask a Question
                  </Link>
                </div>
              ) : questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-500 mb-6">Be the first to ask a question!</p>
                  <Link href="/Q&A/ask" className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-900 transition font-medium">
                    Ask a Question
                  </Link>
                </div>
              ) : (
                <div>
                  {questions.map((question) => (
                    <div key={question.id} className="bg-white rounded-lg shadow mb-4 hover:shadow-md transition overflow-hidden">
                      <div className="flex p-6">
                        <div className="flex flex-col items-center mr-6">
                          <button 
                            onClick={() => handleVote(question.id, 1)}
                            className={`p-2 rounded-full hover:bg-gray-100 transition ${
                              userVotes[question.id] === 1 ? 'text-red-800' : 'text-gray-400'
                            }`}
                            aria-label="Like"
                          >
                            <ThumbsUp className="h-6 w-6" />
                          </button>
                          <span className="text-sm text-black font-medium my-1">{question.votes}</span>
                          <button 
                            onClick={() => handleVote(question.id, -1)}
                            className={`p-2 rounded-full hover:bg-gray-100 transition ${
                              userVotes[question.id] === -1 ? 'text-red-800' : 'text-gray-400'
                            }`}
                            aria-label="Dislike"
                          >
                            <ThumbsDown className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <Link href={`/Q&A/${question.id}`}>
                            <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-red-800 transition line-clamp-2">
                              {question.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {question.content.length > 200 
                              ? `${question.content.substring(0, 200)}...` 
                              : question.content
                            }
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {question.userAvatar ? (
                                  <img 
                                    src={question.userAvatar} 
                                    alt={question.userName} 
                                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-medium">
                                    {question.userName?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                )}
                                <span className="text-sm font-medium text-gray-700">{question.userName}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                              <MessageCircle className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{question.answers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center mt-6">
                    <Chatbot />
                    </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}