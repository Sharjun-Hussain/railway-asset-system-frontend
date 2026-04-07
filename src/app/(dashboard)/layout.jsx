"use client";
import { useState } from "react"
import { cn } from "@/lib/utils"
import { UnifiedSidebar } from "@/components/dashboard-layout/UnifiedSidebar"

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF]">
      {/* Unified Toggling Sidebar (Fixed) */}
      <UnifiedSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
