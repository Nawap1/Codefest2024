"use client"

import { useState } from "react"
import { MessageSquare, Brain, WalletCardsIcon as Cards } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatTab } from "./tabs/chat-tab"
import { QuizTab } from "./tabs/quiz-tab"
import { FlashcardsTab } from "./tabs/flashcards-tab"

export function ContentArea() {
  return (
    <Tabs defaultValue="chat" className="h-full flex flex-col">
      <TabsList className="mx-4 mt-2 flex-wrap">
        <TabsTrigger value="chat" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Chat</span>
        </TabsTrigger>
        <TabsTrigger value="quiz" className="gap-2">
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">Quiz</span>
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="gap-2">
          <Cards className="h-4 w-4" />
          <span className="hidden sm:inline">Flashcards</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="flex-1 m-0">
        <ChatTab />
      </TabsContent>
      
      <TabsContent value="quiz" className="flex-1 m-0">
        <QuizTab />
      </TabsContent>
      
      <TabsContent value="flashcards" className="flex-1 m-0">
        <FlashcardsTab />
      </TabsContent>
    </Tabs>
  )
}

