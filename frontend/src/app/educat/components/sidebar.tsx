import { History, LayoutDashboard, Upload, User, Settings, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/app/educat/lib/utils"

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <div className={cn(
      "relative flex h-full w-full flex-col gap-4 p-2 transition-all duration-300",
      isCollapsed ? "items-center" : "p-4"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10 hidden md:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <div className="flex-1 space-y-4">
        <Button className={cn("w-full justify-start gap-2", isCollapsed && "justify-center")} variant="secondary">
          <Upload className="h-4 w-4" />
          {!isCollapsed && <span>Upload Content</span>}
        </Button>
        
        {!isCollapsed && <Separator />}
        
        <div className="space-y-2">
          <Button variant="ghost" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center")}>
            <History className="h-4 w-4" />
            {!isCollapsed && <span>History</span>}
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center")}>
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && <span>Community Dashboard</span>}
          </Button>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start gap-2", isCollapsed && "justify-center")}>
            <User className="h-4 w-4" />
            {!isCollapsed && <span>John Doe</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Plan</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

