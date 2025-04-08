export interface Question {
    id: string;
    title: string;
    content: string;
    category?: string;
    votes: number;
    answers: number;
    userName: string;
    userAvatar: string;
    createdAt: string;
  }
  
  export interface Answer {
    id: string;
    content: string;
    votes: number;
    userName: string;
    userAvatar: string;
    createdAt: string;
  }