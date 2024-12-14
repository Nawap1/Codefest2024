"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';

export function ChatTab() {
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I help you understand this content better?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const [inputAreaHeight, setInputAreaHeight] = useState(0); // State for input height

  // Get input area height on resize and initial render
  useEffect(() => {
    const handleResize = () => {
      if (inputAreaRef.current) {
        setInputAreaHeight(inputAreaRef.current.offsetHeight);
      }
    };

    handleResize(); // Get height initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: inputMessage, isUser: true }
    ]);

    setInputMessage('');

    // Simulate a response
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: "I'm working on understanding your message.", isUser: false }
      ]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-fit">
      {/* Scrollable Chat Area */}
      <div
        ref={scrollAreaRef}
        className="overflow-y-auto flex-1"
        style={{ paddingBottom: inputAreaHeight }} // Use state value for padding
      >
        <div className="space-y-4 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%]
                  p-3
                  ${message.isUser
                    ? 'bg-[#627EEE] text-white rounded-t-lg rounded-bl-lg'
                    : 'bg-white text-black rounded-t-lg rounded-br-lg'}
                `}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area (Fixed to bottom) */}
      <div
        ref={inputAreaRef}
        className="border-t bg-white w-full" // Removed sticky
      >
        <div className="p-1 max-w-4xl mx-auto flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            placeholder="How can I help you?"
            className="flex-1 px-1 py-1 rounded-full outline-none focus:ring-0 focus:border-transparent border-none"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            className="p-2 rounded-[5px] bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSendMessage}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;