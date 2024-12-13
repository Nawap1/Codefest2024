// app/landing/index.tsx
"use client";
import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function LandingPage() {
    const features = [
        {
            title: "AI-Powered Note Taking",
            description:
                "Automatically generate comprehensive notes from lectures, articles, or any text. Our AI identifies key concepts and structures them for easy understanding.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 text-blue-500" // Changed color
                >
                    <path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-6z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                </svg>
            ),
        },
        {
            title: "Instant Quiz Generation",
            description:
                "Test your knowledge with automatically generated quizzes. Our AI creates diverse question types to reinforce learning and identify areas for improvement.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 text-blue-500" 
                >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="20" y2="22" />
                </svg>
            ),
        },
        {
            title: "Smart Summarization",
            description:
                "Get concise, AI-powered summaries of any content. Quickly grasp the main points of articles, videos, or documents without getting bogged down in details.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-10 h-10 text-blue-500"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            ),
        },
    ];

    const [inputUrl, setInputUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        console.log('URL submitted:', inputUrl);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        console.log('File selected:', file);
        // Handle file processing
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <Head>
                <title>Learn Smarter, Not Harder | [Your Startup Name]</title>
                <meta
                    name="description"
                    content="Instantly generate notes, quizzes, and summaries from any Medium article, YouTube video, PDF, and more. Boost your learning efficiency today!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-gray-900 text-gray-100 flex flex-col min-h-screen font-sans">
               {/* Hero Section - Compact Height */}
                <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 md:py-12 px-4">
                    
                    <div className="container mx-auto">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight leading-tight">
                                Learn Smarter, Not Harder
                            </h1>
                            <p className="text-base md:text-lg mb-4 text-gray-300 max-w-2xl mx-auto">
                                Unlock the power of AI to transform any content into interactive notes, quizzes, and summaries.
                            </p>
                        </div>
                    </div>
                </section>
                {/* Input Section */}
                <section className="py-16 bg-gray-900/50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto bg-gray-800/90 backdrop-blur rounded-xl p-8 md:p-12 shadow-2xl border border-gray-700">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Start Learning Smarter Today
                            </h2>
                            
                            <form onSubmit={handleUrlSubmit} className="space-y-6">
                                <div className="relative">
                                    <div className="relative flex items-center">
                                        <Input
                                            type="text"
                                            value={inputUrl}
                                            onChange={(e) => setInputUrl(e.target.value)}
                                            placeholder="Paste URL or enter text..."
                                            className="w-full h-14 pl-5 pr-36 rounded-xl text-gray-100 bg-gray-700/70 
                                                    border-2 border-gray-600 focus:border-blue-500/50 focus:ring-2 
                                                    focus:ring-blue-500/20 focus:outline-none text-base 
                                                    placeholder:text-gray-400 transition-all duration-200"
                                        />
                                        <div className="absolute right-2 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                onClick={triggerFileInput}
                                                className="h-10 px-3 bg-gray-600 hover:bg-gray-500 rounded-lg 
                                                        transition-colors flex items-center gap-2 text-gray-200"
                                                title="Upload file"
                                            >
                                                <svg 
                                                    className="w-5 h-5" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none" 
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                        d="M12 4v16m0-16l-4 4m4-4l4 4"/>
                                                </svg>
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="h-10 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg 
                                                        transition-all duration-200 flex items-center gap-2 
                                                        text-white font-medium shadow-lg 
                                                        hover:shadow-blue-500/25"
                                            >
                                                Generate
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                        d="M13 5l7 7-7 7M5 12h14"/>
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {selectedFile && (
                                    <div className="flex items-center gap-3 text-gray-200 bg-gray-700/50 
                                                p-4 rounded-lg border border-gray-600 backdrop-blur-sm">
                                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" 
                                                d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
                                            <path fill="white" fillRule="evenodd" 
                                                d="M14 2v6h6"/>
                                        </svg>
                                        <span className="truncate text-sm">{selectedFile.name}</span>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="ml-auto p-1 hover:text-red-400 rounded-full 
                                                    hover:bg-gray-600/50 transition-colors"
                                            aria-label="Remove file"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                    d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <div className="text-center text-sm text-gray-400 mt-4">
                                    Supported formats: PDF, PPTX, TXT, JPEG
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center mb-16">
                            How It Works: Supercharge Your Learning
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    <div className="mb-6">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default LandingPage;