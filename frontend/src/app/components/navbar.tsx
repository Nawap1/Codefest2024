import { Globe, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buttonVariants } from "@/components/ui/button"


export function Navbar() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-xl font-bold">PDF Learning</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select defaultValue="en">
            <SelectTrigger className="w-[120px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="np">Nepali</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="hidden sm:flex">
            Upgrade to Pro
          </Button>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

