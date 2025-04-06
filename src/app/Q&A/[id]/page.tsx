'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, ArrowLeft } from 'lucide-react';
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
      
      // Update question with new answer count
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
    return <div className="min-h-screen flex items-center justify-center">Loading question...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!question) {
    return <div className="min-h-screen flex items-center justify-center">Question not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-red-800" />
              <h1 className="text-2xl font-bold text-red-800">Resonance</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/Q&A" className="flex items-center text-red-800 hover:text-red-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Questions
          </Link>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <button 
                onClick={() => handleVoteQuestion(1)}
                className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50"
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">{question.votes}</span>
              <button 
                onClick={() => handleVoteQuestion(-1)}
                className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50"
              >
                <ThumbsDown className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                {question.title}
              </h1>
              <div className="text-gray-700 mb-6 whitespace-pre-wrap">
                {question.content}
              </div>
              <div className="flex items-center space-x-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  {question.userAvatar && (
                    <img 
                      src={question.userAvatar} 
                      alt={question.userName} 
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-500">{question.userName}</span>
                </div>
                <span className="text-sm text-gray-400">
                  asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {question.answers} {question.answers === 1 ? 'Answer' : 'Answers'}
          </h2>

          {answers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              No answers yet. Be the first to answer this question!
            </div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <button className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">{answer.votes || 0}</span>
                    <button className="p-2 text-gray-400 hover:text-red-800 rounded-full hover:bg-red-50">
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-700 mb-6 whitespace-pre-wrap">
                      {answer.content}
                    </div>
                    <div className="flex items-center space-x-4 border-t pt-4">
                      <div className="flex items-center space-x-2">
                        {answer.userAvatar && (
                          <img 
                            src={answer.userAvatar} 
                            alt={answer.userName} 
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-500">{answer.userName}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          <form onSubmit={handleSubmitAnswer}>
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
              <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                id="answerContent"
                rows={6}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Write your answer here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Your Answer'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}