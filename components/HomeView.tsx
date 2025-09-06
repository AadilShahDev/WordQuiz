import React, { useState } from 'react';
import type { Question } from '../types';
import { UploadCloudIcon } from './Icons';

declare const XLSX: any;

interface HomeViewProps {
  onQuizStart: (questions: Question[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onQuizStart }) => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'welcome' | 'upload'>('welcome');
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    setLoadedQuestions([]);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip the header and the first 3 rows of data
        const newQuestions: Question[] = json.slice(4)
          .filter(row => row && row[0] && row[2]) // Must have a question (col A) and a correct answer (col C)
          .map((row, index) => {
            const options = [row[2], row[3], row[4], row[5], row[6], row[7]].filter(val => val !== null && val !== undefined && val !== '');
            return {
                id: `q-${Date.now()}-${index}`,
                text: String(row[0]),
                correctAnswer: String(row[2]),
                options: options.map(String),
            };
          });

        if (newQuestions.length === 0) {
            throw new Error("No valid questions found. Ensure the Excel sheet has question text in column A, the correct answer in column C, and other options in columns D-H. Note that the first 3 data rows are ignored.");
        }
        
        setLoadedQuestions(newQuestions);
        setFeedback({ type: 'success', message: `${newQuestions.length} questions found in your file.` });

      } catch (error) {
        console.error(error);
        setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to parse Excel file. Please check the format.' });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
        setFeedback({ type: 'error', message: 'Failed to read the file.' });
        setIsUploading(false);
    };

    reader.readAsArrayBuffer(file);
    event.target.value = ''; // Reset file input
  };
  
  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Excel Quiz Taker</h1>
                <p className="text-slate-600 mt-2 mb-8">Ready to test your knowledge?</p>
                <button
                    onClick={() => setStep('upload')}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg"
                >
                    Take Quiz from File
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 animate-fade-in-up">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800">Upload Your Quiz File</h1>
            <p className="text-slate-600 mt-2">Select your Excel file to generate the quiz.</p>
        </div>

        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloudIcon className="w-10 h-10 mb-4 text-slate-500" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">XLSX or XLS files</p>
                    <div className="text-xs text-slate-500 mt-4 text-left border-l-2 border-slate-300 pl-3">
                        <p><strong>Format Guide:</strong></p>
                        <p>• <strong>Rows 1-4:</strong> Ignored</p>
                        <p>• <strong>Column A:</strong> Question Text</p>
                        <p>• <strong>Column C:</strong> Correct Answer</p>
                        <p>• <strong>Cols C-H:</strong> All Options</p>
                    </div>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} />
            </label>
        </div>
        {isUploading && <p className="text-center mt-4 text-indigo-600">Processing file...</p>}
        {feedback && (
          <div className={`mt-4 p-4 rounded-lg text-center ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.message}
          </div>
        )}
        {loadedQuestions.length > 0 && !isUploading && (
            <button 
              onClick={() => onQuizStart(loadedQuestions)}
              className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Start Quiz
            </button>
        )}
      </div>
    </div>
  );
};