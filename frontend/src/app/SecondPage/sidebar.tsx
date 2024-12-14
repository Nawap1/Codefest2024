"use client"

import React, { useState } from 'react'
import { History, LayoutDashboard, Upload, User, Settings, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={`
      h-full bg-white border-r 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      flex flex-col relative
    `}>
      <button
        className="absolute -right-3 top-[50px] z-20 p-1.5 bg-white border rounded-full 
        shadow-sm cursor-pointer hover:bg-gray-50"
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <div className="flex-1 mt-10 space-y-4 px-4">
        <button className={`
          w-full flex items-center gap-2 p-2 rounded-md bg-gray-100 
          ${isCollapsed ? "justify-center" : "justify-start"}
        `}>
          <Upload className="h-4 w-4" />
          {!isCollapsed && <span>Upload Content</span>}
        </button>
        
        {!isCollapsed && <hr className="my-2 border-gray-200" />}
        
        <div className="space-y-2">
          <button className={`
            w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md
            ${isCollapsed ? "justify-center" : "justify-start"}
          `}>
            <History className="h-4 w-4" />
            {!isCollapsed && <span>History</span>}
          </button>
          <button className={`
            w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md
            ${isCollapsed ? "justify-center" : "justify-start"}
          `}>
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && <span>Community Dashboard</span>}
          </button>
        </div>
      </div>
      
      <div className="relative p-4">
        <button className={`
          w-full flex items-center gap-2 p-2 border rounded-md
          ${isCollapsed ? "justify-center" : "justify-start"}
        `} onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('hidden')}>
          <User className="h-4 w-4" />
          {!isCollapsed && <span>John Doe</span>}
        </button>
        <div className="absolute bottom-full right-0 w-56 bg-white border rounded-md shadow-lg hidden">
          <button className="w-full text-left p-2 hover:bg-gray-100 flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-100 flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-100 flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Plan</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;