"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PrimarySidebar } from "@/components/dashboard-layout/primary-sidebar";
import { SecondarySidebar } from "@/components/dashboard-layout/secondary-sidebar";

export default function DashboardLayout({ children }) {
  const [isSecondaryCollapsed, setIsSecondaryCollapsed] = useState(false);

  const toggleSecondarySidebar = () => {
    setIsSecondaryCollapsed(!isSecondaryCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF]">
      {/* Primary Slim Sidebar (Fixed) */}
      <PrimarySidebar />

      {/* Secondary Detailed Sidebar (Fixed/Collapsible) */}
      <SecondarySidebar
        isCollapsed={isSecondaryCollapsed}
        onToggle={toggleSecondarySidebar}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSecondaryCollapsed ? "ml-[70px]" : "ml-[310px]", // 70px primary + 240px secondary
        )}
      >
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
