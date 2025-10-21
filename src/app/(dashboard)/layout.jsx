// app/(dashboard)/layout.tsx
"use client"; // This component needs to be a client component to use state

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/dashboard-layout/header";
import { Sidebar } from "@/components/dashboard-layout/sidebar";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main
          className={cn(
            "flex-1 overflow-auto p-4 md:p-6",
            // This class can be used for animations or transitions
            "transition-all duration-300"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
