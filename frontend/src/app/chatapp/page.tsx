//landingpage\src\app\chatapp\page.tsx
"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from "../SecondPage/navbar";
import { Sidebar } from "../SecondPage/sidebar";
import { ContentArea } from "../SecondPage/content-area";
import { DocumentViewer } from "../SecondPage/document-viewer";
import Header from "../MainPage/header";

const someData = {
  // Define someData with appropriate value
  title: "Sample Document",
  content: "This is a sample document content."
};

function ChatApp() {
  const searchParams = useSearchParams();
  const youtubeUrl = searchParams.get('youtube');
  const fileUrl = searchParams.get('file');
  const fileType = searchParams.get('type');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getContentType = () => {
    if (youtubeUrl) return "youtube";
    if (fileType === 'pdf') return "pdf";
    return "document";
  };

  const getData = () => {
    if (youtubeUrl) return { url: youtubeUrl };
    if (fileUrl) return { url: fileUrl };
    return someData;
  };

  return (
    <div>
      <Header/>
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1">
          <div className="w-1/2">
            <ContentArea />
          </div>
          <div className="w-1/2">
            <DocumentViewer 
              contentType={getContentType()} 
              data={getData()} 
              isCollapsed={isCollapsed} 
              setIsCollapsed={setIsCollapsed} 
            />
          </div>
        </div>
      </div>  
    </div>
  )
}

export default ChatApp;