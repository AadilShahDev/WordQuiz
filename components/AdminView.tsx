
import React, { useState, useCallback, useMemo } from 'react';
import type { Question } from '../types';
import { questionService } from '../services/mockDatabase';
import { UploadCloudIcon, CheckCircleIcon } from './Icons';

declare const XLSX: any;

export const AdminView: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(questionService.getQuestions());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const newQuestions: Question[] = json.slice(1) // skip header row
          .filter(row => row && row[0] && row.length >= 6) // ensure row has question and at least 5 options
          .map((row, index) => ({
            id: `q-${Date.now()}-${index}`,
            text: row[0],
            correctAnswer: row[1],
            options: row.slice(1, 6).filter(Boolean),
          }));

        if(newQuestions.length === 0) {
            throw new Error("No valid questions found. Ensure the Excel sheet has question text in the first column and options in the next 5 columns.");
        }

        questionService.saveQuestions(newQuestions);
        setQuestions(questionService.getQuestions());
        setFeedback({ type: 'success', message: `${newQuestions.length} questions uploaded successfully!` });
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
  
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => q.text.toLowerCase().includes(filter.toLowerCase()));
  }, [questions, filter]);


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 mb-8">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Upload Questions</h2>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloudIcon className="w-10 h-10 mb-4 text-slate-500" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">XLSX or XLS files</p>
                    <p className="text-xs text-slate-500 mt-2">Format: Col 1: Question, Col 2: Correct Answer, Cols 3-6: Other options</p>
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
      </div>

      {/* Question Management Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-700">Question Bank ({questions.length})</h2>
          <input 
            type="text"
            placeholder="Search questions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-1/3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Question</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Correct Answer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredQuestions.map((q) => (
                <tr key={q.id}>
                  <td className="px-6 py-4 whitespace-normal text-sm font-medium text-slate-900">{q.text}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-4 h-4 mr-1.5"/>
                      {q.correctAnswer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredQuestions.length === 0 && <p className="text-center py-8 text-slate-500">No questions found.</p>}
        </div>
      </div>
    </div>
  );
};
