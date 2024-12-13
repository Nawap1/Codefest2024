"use client"

import { useState, useEffect } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Navbar } from "@/app/educat/components/navbar"
import { Sidebar } from "@/app/educat/components/sidebar"
import { ContentArea } from "@/app/educat/components/content-area"
import { DocumentViewer } from "@/app/educat/components/document-viewer"
import { cn } from "@/app/educat/lib/utils"

export default function Page() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDocViewerCollapsed, setIsDocViewerCollapsed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contentType, setContentType] = useState<"document" | "youtube">("document")
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (data: FormData) => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Navbar />
      
      {isProcessing ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Processing your content</h2>
            <p className="text-muted-foreground">Please don't close this tab...</p>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel
            defaultSize={20}
            minSize={0}
            maxSize={30}
            collapsible={true}
            collapsedSize={4}
            onCollapse={() => setIsSidebarCollapsed(true)}
            onExpand={() => setIsSidebarCollapsed(false)}
            className={cn(
              "transition-all duration-300",
              isSidebarCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
            )}
          >
            <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={isMobile ? 100 : 50} minSize={30}>
            <ContentArea />
          </ResizablePanel>

          {!isMobile && <ResizableHandle withHandle />}

          {!isMobile && (
            <ResizablePanel 
              defaultSize={30} 
              minSize={20} 
              maxSize={50}
              collapsible={true}
              collapsedSize={4}
              onCollapse={() => setIsDocViewerCollapsed(true)}
              onExpand={() => setIsDocViewerCollapsed(false)}
            >
              <DocumentViewer
                contentType={contentType}
                isCollapsed={isDocViewerCollapsed}
                setIsCollapsed={setIsDocViewerCollapsed}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      )}
    </div>
  )
}

