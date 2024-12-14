"use client";

import { Mic, Paperclip, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Hero() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');

  const isYoutubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      if (isYoutubeUrl(inputText)) {
        console.log('YouTube URL detected:', inputText);
        router.push(`/chatapp?youtube=${encodeURIComponent(inputText)}`);
      } else {
        alert('Please enter a valid YouTube URL');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const supportedTypes = ['.pdf', '.pptx', '.txt', '.jpeg', '.jpg'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (supportedTypes.includes(fileExtension)) {
        const fileUrl = URL.createObjectURL(file);
        const queryString = `type=${fileExtension === '.pdf' ? 'pdf' : 'document'}&file=${encodeURIComponent(fileUrl)}`;
        router.push(`/chatapp?${queryString}`);
      } else {
        alert('Unsupported file type. Please upload PDF, PPTX, TXT, or JPEG files.');
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 text-center  p-13">
      <h1 className="text-4xl md:text-3.5xl font-bold mb-[52px] max-w-3xl">
        START LEARNING SMARTER TODAY
      </h1>
      
      <div className="w-full max-w-3xl relative">
        <div className="flex flex-col gap-0.1 p-2.5 rounded-[32px] border bg-white shadow-md"
          style={{ borderColor: '#5661F6' }}>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Upload pdf, pptx, articles or paste youtube videos"
              className="flex-1 p-2 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 mt-0.5">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.pptx,.txt,.jpeg,.jpg"
            />
            <button 
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById('fileUpload')?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button 
              className="p-2 rounded-[9.14px] bg-[#6366F1] text-white hover:bg-[#5558E3] ml-auto mr-3"
              onClick={handleTextSubmit}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mt-4">
        Supported Format : PDF, PPTX, TXT, JPEG or Youtube Videos
      </p>
    </section>
  )
}