import React, { useState, useMemo } from 'react';
import type { Question, QuizAttempt } from '../types';

interface QuizViewProps {
  questions: Question[];
  onFinish: (results: QuizAttempt[]) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return [...currentQuestion.options].sort(() => Math.random() - 0.5);
  }, [currentQuestion]);
  
  const handleNextQuestion = () => {
    const newAttempt: QuizAttempt = {
      question: currentQuestion,
      userAnswer: selectedAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
    };
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onFinish(updatedAttempts);
    }
  };

  const handleEndQuiz = () => {
    onFinish(attempts);
  }

  if (!currentQuestion) {
    return <div className="text-center p-8">Loading quiz...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-sm font-medium text-indigo-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <button onClick={handleEndQuiz} className="text-sm bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                End Quiz
            </button>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8 h-24 flex items-center justify-center">
            {currentQuestion.text}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shuffledOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedAnswer === option
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-indigo-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};
