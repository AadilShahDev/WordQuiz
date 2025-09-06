import React from 'react';
import type { QuizAttempt } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface ResultsViewProps {
  results: QuizAttempt[];
  onRetake: () => void;
  onUploadNew: () => void;
  totalQuestions: number;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, onRetake, onUploadNew, totalQuestions }) => {
    const score = results.filter(a => a.isCorrect).length;
    const answeredCount = results.length;
    const scorePercentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(0) : 0;
    
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-2">Quiz Complete!</h1>
            <p className="text-center text-slate-600 mb-8">Here's how you did.</p>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center mb-8 border border-slate-200">
                <p className="text-lg text-slate-500">Your Score</p>
                <p className="text-7xl font-bold text-indigo-600 my-2">{scorePercentage}%</p>
                <p className="text-xl text-slate-700">{score} out of {totalQuestions} correct</p>
                {answeredCount < totalQuestions && <p className="text-sm text-slate-500 mt-2">({answeredCount} questions answered)</p>}
            </div>

            <div className="space-y-4">
                {results.map((attempt, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <p className="font-semibold text-slate-800 mb-4">{index + 1}. {attempt.question.text}</p>
                        <div className="space-y-2">
                            {attempt.question.options.map(option => {
                                const isCorrectAnswer = option === attempt.question.correctAnswer;
                                const isUserChoice = option === attempt.userAnswer;
                                
                                let bgClass = 'bg-slate-100';
                                let icon = null;

                                if (isUserChoice && !attempt.isCorrect) {
                                  bgClass = 'bg-red-100 text-red-800 border-red-300';
                                  icon = <XCircleIcon className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />;
                                } else if (isUserChoice && attempt.isCorrect) {
                                  icon = <CheckCircleIcon className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0" />;
                                }


                                return (
                                    <div key={option} className={`flex items-center p-3 rounded-lg border ${bgClass}`}>
                                        {icon}
                                        <span className="flex-grow">{option}</span>
                                    </div>
                                );
                            })}
                            {attempt.userAnswer === null && <p className="text-sm text-yellow-600 p-3 bg-yellow-50 rounded-lg">You did not answer this question.</p>}
                        </div>
                        <p className="text-sm text-slate-600 mt-4 pt-3 border-t border-slate-200">
                            Correct Answer: <span className="font-semibold text-slate-800">{attempt.question.correctAnswer}</span>
                        </p>
                    </div>
                ))}
            </div>
             <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button onClick={onRetake} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Take Quiz from Same File
                </button>
                <button onClick={onUploadNew} className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                    Upload New File
                </button>
             </div>
        </div>
    );
};