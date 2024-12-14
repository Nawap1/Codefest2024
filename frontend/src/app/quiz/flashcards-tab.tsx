"use client";

import React, { useState } from 'react'

export function FlashcardsTab() {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <div className="flex h-full items-center justify-center p-4 space-x-6">
      <button 
        onClick={() => {/* TODO: Previous card logic */}} 
        className="p-3 text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      
      <div 
        className="relative w-[500px] h-[300px] perspective-1000 cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card */}
          <div 
            className={`absolute w-full h-full rounded-xl shadow-2xl p-8 backface-hidden
              bg-gradient-to-br from-violet-500 to-purple-500 text-white
              ${isFlipped ? "opacity-0" : "opacity-100"}`}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="font-bold mb-6 text-2xl tracking-wide">What is React?</h3>
              <p className="text-white/80 text-sm font-medium">
                Click to reveal answer
              </p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Back of Card */}
          <div 
            className={`absolute w-full h-full rounded-xl shadow-2xl p-8 backface-hidden rotate-y-180
              bg-gradient-to-br from-indigo-500 to-blue-500 text-white
              ${isFlipped ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col justify-center items-center h-full">
              <h3 className="font-bold mb-4 text-xl tracking-wide">Answer</h3>
              <p className="text-white/90 text-center leading-relaxed">
                React is a JavaScript library for building user interfaces, developed and maintained by Facebook.
              </p>
              <div className="absolute bottom-4 right-4">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => {/* TODO: Next card logic */}} 
        className="p-3 text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  )
}

export default FlashcardsTab;