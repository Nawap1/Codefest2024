import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/app/educat/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

