import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

export function ChatTab() {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="rounded-lg bg-muted p-4">
              <p>How can I help you understand this content better?</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="flex gap-4">
          <Textarea
            placeholder="Type your message..."
            className="min-h-[80px]"
          />
          <Button className="shrink-0">Send</Button>
        </div>
      </div>
    </div>
  )
}

