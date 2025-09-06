
import type { User, Question } from '../types';

// Initialize with a default admin user if none exists
const initializeUsers = () => {
  if (!localStorage.getItem('users')) {
    const adminUser: User = { id: 'admin1', username: 'admin', role: 'admin' };
    const subUser: User = { id: 'sub1', username: 'subscriber', role: 'subscriber' };
    const users = {
      admin: 'password', // In a real app, this would be a hashed password
      subscriber: 'password',
    };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user_details', JSON.stringify([adminUser, subUser]));
  }
};

initializeUsers();

// Initialize with some sample questions
const initializeQuestions = () => {
    if (!localStorage.getItem('questions')) {
        const sampleQuestions: Question[] = [
            { id: 'q1', text: 'Which word is a synonym for "happy"?', options: ['Joyful', 'Sad', 'Angry', 'Tired', 'Fast'], correctAnswer: 'Joyful' },
            { id: 'q2', text: 'Which word is an antonym for "hot"?', options: ['Cold', 'Warm', 'Spicy', 'Burning', 'Tropical'], correctAnswer: 'Cold' },
            { id: 'q3', text: 'Complete the phrase: "A piece of..."', options: ['Cake', 'Sky', 'Time', 'Water', 'Music'], correctAnswer: 'Cake' },
            { id: 'q4', text: 'Which word is most associated with "ocean"?', options: ['Water', 'Desert', 'Mountain', 'Forest', 'City'], correctAnswer: 'Water' },
            { id: 'q5', text: 'Which of these is a type of fruit?', options: ['Apple', 'Carrot', 'Potato', 'Chair', 'Book'], correctAnswer: 'Apple' },
        ];
        localStorage.setItem('questions', JSON.stringify(sampleQuestions));
    }
};

initializeQuestions();

export const authService = {
  login: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userDetails: User[] = JSON.parse(localStorage.getItem('user_details') || '[]');
    
    if (users[username] && users[username] === password) {
      return userDetails.find(u => u.username === username) || null;
    }
    return null;
  },
};

export const questionService = {
  getQuestions: (): Question[] => {
    return JSON.parse(localStorage.getItem('questions') || '[]');
  },
  saveQuestions: (questions: Question[]): void => {
    const existingQuestions = questionService.getQuestions();
    const newQuestionMap = new Map(existingQuestions.map(q => [q.text, q]));
    
    questions.forEach(q => {
      newQuestionMap.set(q.text, q);
    });

    localStorage.setItem('questions', JSON.stringify(Array.from(newQuestionMap.values())));
  },
  getDailyQuiz: (): Question[] => {
    const allQuestions = questionService.getQuestions();
    // Shuffle and pick 20. If less than 20, pick all.
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 20);
  },
};
