'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, ArrowLeft, Award, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../../../../services/Q&AService';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Question, Answer } from '../../../types/Q&A';

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params?.id as string;
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [userName, setUserName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (questionId) {
      loadQuestionAndAnswers();
    }
  }, [questionId]);

  const loadQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      const [questionData, answersData] = await Promise.all([
        api.getQuestionById(questionId),
        api.getAnswers(questionId)
      ]);
      setQuestion(questionData);
      setAnswers(answersData);
      setLoading(false);
    } catch (err) {
      setError(`Failed to load question: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  const handleVoteQuestion = async (value: 1 | -1) => {
    if (!question) return;
    
    try {
      const updatedQuestion = await api.voteQuestion(question.id, value);
      setQuestion(updatedQuestion);
    } catch (err) {
      setError('Failed to vote: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAnswer.trim() || !userName.trim() || submitting) {
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await api.createAnswer(questionId, {
        content: newAnswer,
        userName: userName
      });
      
      setAnswers([...answers, response]);
      setNewAnswer('');
    
      if (question) {
        setQuestion({
          ...question,
          answers: question.answers + 1
        });
      }
    } catch (err) {
      setError('Failed to submit answer: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-yellow-800 font-semibold mb-2">Not Found</h3>
          <p className="text-yellow-700">The requested question could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Resonance Logo" className="h-8 mr-2" />
            </div>
          </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/Q&A" className="inline-flex items-center text-red-800 hover:text-red-900 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {question.title}
              </h1>
              <div className="text-gray-700 mb-6 whitespace-pre-wrap leading-relaxed">
                {question.content}
              </div>
            </div>

            {/* YouTube-style voting controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex rounded-full overflow-hidden bg-gray-100">
                  <button 
                    onClick={() => handleVoteQuestion(1)}
                    className="flex items-center space-x-1 py-1 px-3 hover:bg-gray-200 transition-colors"
                    aria-label="Like"
                  >
                    <ThumbsUp className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{question.votes > 0 ? question.votes : ''}</span>
                  </button>
                  <div className="w-px bg-gray-300 h-full"></div>
                  <button 
                    onClick={() => handleVoteQuestion(-1)}
                    className="py-1 px-3 hover:bg-gray-200 transition-colors"
                    aria-label="Dislike"
                  >
                    <ThumbsDown className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <button className="flex items-center space-x-1 py-1 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {question.answers} {question.answers === 1 ? 'Answer' : 'Answers'}
                  </span>
                </button>
              </div>

              <div className="flex items-center space-x-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  {question.userAvatar ? (
                    <img 
                      src={question.userAvatar} 
                      alt={question.userName} 
                      className="h-8 w-8 rounded-full border-2 border-red-50"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-800 font-semibold text-sm">
                        {question.userName?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{question.userName}</span>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {question.answers} {question.answers === 1 ? 'Answer' : 'Answers'}
            </h2>
            <div className="flex-grow border-t border-gray-200 ml-4"></div>
          </div>

          {answers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-dashed border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No answers yet. Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer, index) => (
                <div 
                  key={answer.id} 
                  className={`bg-white text-black rounded-lg shadow-sm p-6 border ${index === 0 && answer.votes > 0 ? 'border-green-100' : 'border-gray-100'}`}
                >
                  {index === 0 && answer.votes > 0 && (
                    <div className="flex items-center mb-3 bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm inline-flex">
                      <Award className="h-4 w-4 mr-1.5" />
                      <span className="font-medium">Top Answer</span>
                    </div>
                  )}
                  <div className="flex flex-col space-y-4">
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer.content}
                    </div>

                    {/* YouTube-style voting for answers */}
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        
                      </div>

                      <div className="flex items-center space-x-4 border-t pt-4">
                        <div className="flex items-center space-x-2">
                          {answer.userAvatar ? (
                            <img 
                              src={answer.userAvatar} 
                              alt={answer.userName} 
                              className="h-8 w-8 rounded-full border-2 border-red-50"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-800 font-semibold text-sm">
                                {answer.userName?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700">{answer.userName}</span>
                        </div>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-red-800" />
            Your Answer
          </h3>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-shadow"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                id="answerContent"
                rows={6}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-shadow"
                placeholder="Write your answer here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 font-medium flex items-center justify-center shadow-sm hover:shadow"
            >
              {submitting ? 'Submitting...' : 'Post Your Answer'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}