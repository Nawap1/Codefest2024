import { ChevronUp, ChevronDown, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from 'react'
import { cn } from "@/app/educat/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface DocumentViewerProps {
  contentType: "document" | "youtube"
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function DocumentViewer({ contentType, isCollapsed, setIsCollapsed }: DocumentViewerProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleShare = () => {
    if (agreeToTerms) {
      // Logic to share notes to the community
      console.log("Notes shared to the community")
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {contentType === "youtube" && (
            <>
              <Switch id="nepali" />
              <Label htmlFor="nepali">Switch to Nepali</Label>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={cn("flex-1 overflow-auto transition-all duration-300", isCollapsed ? "h-0" : "h-auto")}>
        {contentType === "youtube" ? (
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="text-lg font-bold mb-4">Document Preview</h2>
              <div className="aspect-[3/4] bg-muted rounded-md" />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t">
        <div className="p-2 flex justify-between items-center">
          <h3 className="font-semibold">Generated Notes</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Notes</DialogTitle>
                <DialogDescription>
                  Your notes will be shared to the community dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the terms and conditions
                </label>
              </div>
              <Button onClick={handleShare} disabled={!agreeToTerms} className="mt-4">
                Share Notes
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        
        <ScrollArea className="max-h-[300px]">
          <div className="p-4 prose prose-sm dark:prose-invert">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <h4>References</h4>
            <ul>
              <li>Reference 1 - Page 12</li>
              <li>Reference 2 - Page 15</li>
              <li>Reference 3 - Page 23</li>
            </ul>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

