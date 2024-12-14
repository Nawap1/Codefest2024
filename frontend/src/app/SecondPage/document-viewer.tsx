//landingpage\src\app\SecondPage\document-viewer.tsx
"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Share2 } from 'lucide-react';
import YouTube from 'react-youtube';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  contentType: "document" | "youtube" | "pdf"
  data: any
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function DocumentViewer({ contentType, data, isCollapsed, setIsCollapsed }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isNepaliMode, setIsNepaliMode] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const getYoutubeVideoId = (url: string) => {
    return url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s]+)/)?.[1];
  };

  const handleShare = () => {
    if (agreeToTerms) {
      console.log("Notes shared to the community");
      setIsShareDialogOpen(false);
    }
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleNepaliMode = () => setIsNepaliMode(!isNepaliMode);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const renderYoutubeContent = () => {
    const videoId = getYoutubeVideoId(data.url);
    if (!videoId) return <div>Invalid YouTube URL</div>;

    const opts = {
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 0,
      },
    };

    return (
      <YouTube
        videoId={videoId}
        opts={opts}
        className="w-full h-full"
        onReady={(event) => {
          // Handle video ready event if needed
          console.log('YouTube Player Ready', event);
        }}
      />
    );
  };

  const renderContent = () => {
    if (contentType === 'youtube') {
      return renderYoutubeContent();
    } else if (contentType === 'pdf') {
      return (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <Document
            file={data.url || data.file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex flex-col items-center"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={500}
                className="mb-4"
              />
            ))}
          </Document>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'h-0' : 'h-auto'}`}>
        {/* Preview Section */}
        <div className={`transition-all duration-300 ease-in-out ${
          isNotesExpanded ? 'h-0 overflow-hidden' : 'h-1/2'
        } p-4 border-b border-gray-200`}>
          <div className="h-full rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-gray-900">Original Material</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleNepaliMode}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
                    style={{
                      backgroundColor: isNepaliMode ? '#3b82f6' : '#e5e7eb'
                    }}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        isNepaliMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <label className="text-sm font-medium text-gray-800">
                    Switch to Nepali
                  </label>
                </div>
              </div>
            </div>
            <div className="h-[calc(100%-2rem)] bg-gray-200 rounded-md">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className={`transition-all duration-300 ease-in-out ${
          isNotesExpanded ? 'h-full' : 'h-1/2'
        } flex flex-col`}>
          <div className="p-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Generated Notes</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isNotesExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                )}
              </button>
              <button 
                onClick={() => setIsShareDialogOpen(true)}
                className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-800"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
          
          <div 
            className="flex-1 overflow-y-auto scrollbar"
            style={{
              maxHeight: isNotesExpanded 
                ? 'calc(1.5rem * 25)' // 30 lines when expanded
                : 'calc(1.5rem * 12)', // 12 lines when collapsed
              overflowY: 'auto'
            }}
          >
            <div className="p-4 pb-8 leading-6"> {/* Added pb-8 for bottom padding */}
              <p className="text-gray-800">
              Artificial intelligence (AI) and blockchain technology are powerful technologies that can be used together to create more secure, efficient, and transparent systems. Here are some ways that AI and blockchain can be used together: <br/>
              <b>Data management</b>
              AI can analyze and process data, while blockchain can store and manage data securely and transparently. 
              Data control
              Blockchain's decentralized model allows users to retain control over their data while sharing it with AI applications. 
              Fraud detection
              AI models can analyze transaction data to identify potential fraud, while blockchain provides a secure record. 
              Supply chain
              AI and blockchain can digitize paper-based processes, making data shareable and trustworthy. 
              Healthcare
              Patient data can be stored on blockchain, allowing organizations to improve care while protecting patient privacy. 
              Intellectual property
              Storing and tagging IP on a blockchain before using it in generative AI chatbots can reduce the risk of infringing on someone else's intellectual property. 
              Cryptocurrency
              AI can identify patterns in historical crypto data to predict future price movements. 
              Security
              Blockchain technology can act as encryption-backed guardrails for AI systems.
              </p>
              <p className="text-gray-800">
              Blockchain is a shared, immutable ledger that provides an immediate, 
              shared and transparent exchange of encrypted data simultaneously to multiple parties as they 
              initiate and complete transactions. A blockchain network can track orders, payments, accounts, production and much more. Since 
              permissioned members share a single view of the truth, they gain confidence and trust in their 
              transactions with other businesses, along with new efficiencies and opportunities.
              Artificial intelligence (AI) uses computers, data and sometimes machines to mimic the problem-solving and decision-making capabilities of the human mind. AI encompasses the sub-fields of machine learning and deep learning, which use AI algorithms that are trained on data to make predictions or classifications. The benefits of AI include automation of repetitive tasks, improved decision making and a better customer experience.


              </p>
            </div>
          </div>
        </div>
      </div>

      {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-2 text-white">Share Notes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your notes will be shared to the community dashboard.
            </p>
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="mr-2"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-800">
                I agree to the terms and conditions
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsShareDialogOpen(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleShare}
                disabled={!agreeToTerms}
                className={`px-3 py-1 rounded ${
                  agreeToTerms 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Share Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Update scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = scrollbarStyles;
document.head.appendChild(styleSheet);