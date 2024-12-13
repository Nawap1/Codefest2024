"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function FlashcardsTab() {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <div className="flex h-full items-center justify-center p-4">
      <Button variant="ghost" size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="relative" onClick={() => setIsFlipped(!isFlipped)}>
        <div
          className={`transition-all duration-500 preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <Card className="p-8 w-[400px] h-[250px] absolute backface-hidden">
            <div className="text-center">
              <h3 className="font-semibold mb-4">Front of Card</h3>
              <p>Click to reveal answer</p>
            </div>
          </Card>
          
          <Card className="p-8 w-[400px] h-[250px] rotate-y-180 backface-hidden">
            <div className="text-center">
              <h3 className="font-semibold mb-4">Back of Card</h3>
              <p>Answer revealed!</p>
            </div>
          </Card>
        </div>
      </div>
      
      <Button variant="ghost" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

