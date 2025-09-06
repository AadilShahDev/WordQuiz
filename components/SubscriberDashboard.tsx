
import React from 'react';
import type { User } from '../types';
import { AppView } from '../types';

interface SubscriberDashboardProps {
  user: User;
  setView: (view: AppView) => void;
  setQuizResults: (results: any) => void;
}

export const SubscriberDashboard: React.FC<SubscriberDashboardProps> = ({ user, setView, setQuizResults }) => {
  const handleStartQuiz = () => {
    setQuizResults(null);
    setView(AppView.QUIZ);
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">👋</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{getGreeting()}, {user.username}!</h1>
                <p className="text-slate-600 mt-2 mb-8">Ready for your daily challenge?</p>
                <button
                    onClick={handleStartQuiz}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg"
                >
                    Start Daily Quiz
                </button>
                <p className="text-xs text-slate-400 mt-6">A new set of 20 questions is waiting for you.</p>
            </div>
        </div>
    </div>
  );
};
