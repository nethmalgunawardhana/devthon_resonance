import axios from 'axios';

interface Question {
  id: string;
  title: string;
  content: string;
  votes: number;
  answers: number;
  category?: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async getQuestions(): Promise<Question[]> {
    try {
      const response = await axios.get<ApiResponse<Question[]>>(`${API_BASE_URL}/questions`);
      // Check if the response has the expected structure
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data; // Return just the data array
      } else {
        // If for some reason the API directly returns an array
        if (Array.isArray(response.data)) {
          return response.data;
        }
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  async getQuestionById(questionId: string): Promise<Question> {
    try {
      const response = await axios.get<ApiResponse<Question>>(`${API_BASE_URL}/questions/${questionId}`);
      // Check if the response has the expected structure
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // If for some reason the API directly returns the question object
        if (response.data.id) {
          return response.data as Question;
        }
        throw new Error(`Invalid data format received for question ${questionId}`);
      }
    } catch (error) {
      console.error(`Error fetching question ${questionId}:`, error);
      throw error;
    }
  },

  async voteQuestion(questionId: string, value: 1 | -1): Promise<Question> {
    try {
      const response = await axios.post<ApiResponse<Question>>(`${API_BASE_URL}/questions/${questionId}/vote`, { value });
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.id) {
        return response.data as Question;
      }
      throw new Error(`Invalid data format received when voting on question ${questionId}`);
    } catch (error) {
      console.error(`Error voting on question ${questionId}:`, error);
      throw error;
    }
  },

  async createQuestion(questionData: Omit<Question, 'id' | 'createdAt' | 'votes' | 'answers'>): Promise<Question> {
    try {
      const response = await axios.post<ApiResponse<Question>>(`${API_BASE_URL}/questions`, questionData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.id) {
        return response.data as Question;
      }
      throw new Error('Invalid data format received when creating question');
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  async getAnswers(questionId: string): Promise<any[]> {
    try {
      const response = await axios.get<ApiResponse<any[]>>(`${API_BASE_URL}/questions/${questionId}/answers`);
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error(`Invalid data format received for answers to question ${questionId}`);
    } catch (error) {
      console.error(`Error fetching answers for question ${questionId}:`, error);
      throw error;
    }
  },

  async createAnswer(questionId: string, answerData: { content: string, userName: string }): Promise<any> {
    try {
      const response = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/questions/${questionId}/answers`, answerData);
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data.id) {
        return response.data;
      }
      throw new Error(`Invalid data format received when creating answer for question ${questionId}`);
    } catch (error) {
      console.error(`Error creating answer for question ${questionId}:`, error);
      throw error;
    }
  }
};