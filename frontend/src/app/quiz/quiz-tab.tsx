"use client";

import React, { useState } from 'react';

export function QuizTab() {
  const [selectedOption, setSelectedOption] = useState('option-1');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const correctAnswer = 'option-2'; // Hardcoded for now, should come from props/API

  const getOptionStyles = (option: string) => {
    if (!isSubmitted) return selectedOption === option
      ? 'border-emerald-500 bg-emerald-50'
      : 'border-gray-200 hover:border-emerald-300';

    if (option === correctAnswer) {
      return 'border-emerald-500 bg-emerald-50';
    }
    return option === selectedOption
      ? 'border-red-500 bg-red-50'
      : 'border-gray-200';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
          Question 1
        </h3>
        <div className="space-y-4">
          {['option-1', 'option-2', 'option-3'].map((option) => (
            <div 
              key={option} 
              className={`transform transition-all duration-200 ease-in-out
                ${selectedOption === option ? 'scale-102' : 'hover:scale-101'}
                p-4 rounded-lg cursor-pointer border-2
                ${getOptionStyles(option)}`}
              onClick={() => !isSubmitted && setSelectedOption(option)}
            >
              <div className="flex items-center">
                <span className="text-lg select-none text-gray-700">
                  Option {option.split('-')[1]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => {
          if (!isSubmitted) {
            setIsSubmitted(true);
          } else {
            // Reset for next question
            setIsSubmitted(false);
            setSelectedOption('option-1');
          }
        }}
        className={`mt-8 w-full py-3 px-6 text-white rounded-lg
          font-semibold tracking-wide transform transition-all duration-200
          hover:shadow-md active:scale-95
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${isSubmitted 
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'}`}
      >
        {isSubmitted ? 'Next Question' : 'Submit Answer'}
      </button>
    </div>
  );
}

export default QuizTab;