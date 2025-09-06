import React, { useState } from 'react';
import type { Question, QuizAttempt } from './types';
import { AppView } from './types';
import { QuizView } from './components/QuizView';
import { HomeView } from './components/HomeView';
import { ResultsView } from './components/ResultsView';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<QuizAttempt[] | null>(null);

  const startQuizWithQuestions = (questionsToUse: Question[]) => {
    // Shuffle the questions and pick the first 20, or fewer if not enough are available.
    const shuffled = [...questionsToUse].sort(() => 0.5 - Math.random());
    const quizQuestions = shuffled.slice(0, Math.min(20, shuffled.length));
    
    setQuestions(quizQuestions);
    setQuizResults(null);
    setView(AppView.QUIZ);
  };

  const handleQuizStart = (loadedQuestions: Question[]) => {
    setAllQuestions(loadedQuestions);
    startQuizWithQuestions(loadedQuestions);
  };

  const handleQuizFinish = (results: QuizAttempt[]) => {
    setQuizResults(results);
    setView(AppView.RESULTS);
  };

  const handleRetakeQuiz = () => {
    startQuizWithQuestions(allQuestions);
  };

  const handleUploadNew = () => {
    setAllQuestions([]);
    setQuestions([]);
    setQuizResults(null);
    setView(AppView.HOME);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.QUIZ:
        return <QuizView questions={questions} onFinish={handleQuizFinish} />;
      case AppView.RESULTS:
        return <ResultsView results={quizResults!} onRetake={handleRetakeQuiz} onUploadNew={handleUploadNew} totalQuestions={questions.length} />;
      case AppView.HOME:
      default:
        return <HomeView onQuizStart={handleQuizStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main>{renderContent()}</main>
    </div>
  );
};

export default App;