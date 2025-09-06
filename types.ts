// FIX: Add and export the User interface to resolve import errors.
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'subscriber';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizAttempt {
  question: Question;
  userAnswer: string | null;
  isCorrect: boolean;
}

export enum AppView {
  HOME,
  QUIZ,
  RESULTS,
}