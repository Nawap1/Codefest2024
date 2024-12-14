"use client"

import React, { useState } from "react"
import { ChatTab } from "../quiz/chat-tab"
import { QuizTab } from "../quiz/quiz-tab"
import { FlashcardsTab } from "../quiz/flashcards-tab"

export function ContentArea() {
  const [activeTab, setActiveTab] = useState("chat");

  // Tab navigation icons as inline SVGs
  const TabIcons = {
    chat: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    quiz: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M12 22H7l-3-3-3-3 3-7 2 2c0-2.5 4-3.5 6-2"/>
        <path d="M22 9l-3.5 6.5-3.5-3.5L15 7c0-1.5-1-3.5-3-3.5"/>
      </svg>
    ),
    flashcards: (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    )
  };

  // Array of tab configurations
  const tabs = [
    { value: "chat", label: "Chat", icon: TabIcons.chat },
    { value: "quiz", label: "Quiz", icon: TabIcons.quiz },
    { value: "flashcards", label: "Flashcards", icon: TabIcons.flashcards }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Tab Navigation */}
      <div className="sticky top-0 backdrop-blur-md bg-white/80 z-10 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-nowrap space-x-4 py-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex items-center gap-3
                  px-4 py-2.5
                  rounded-xl
                  font-medium
                  transition-all duration-200 ease-in-out
                  transform hover:scale-105
                  ${activeTab === tab.value 
                    ? 'bg-[#5661F6] text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-600 hover:bg-[#5661F6] hover:text-white'}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="rounded-2xl">
            {activeTab === "chat" && (
              <div className="animate-fadeIn">
                <ChatTab />
              </div>
            )}
            {activeTab === "quiz" && (
              <div className="animate-fadeIn">
                <QuizTab />
              </div>
            )}
            {activeTab === "flashcards" && (
              <div className="animate-fadeIn">
                <FlashcardsTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentArea;