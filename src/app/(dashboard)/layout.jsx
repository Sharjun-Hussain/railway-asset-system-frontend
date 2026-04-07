"use client";
import { Sidebar } from "@/components/dashboard-layout/Sidebar"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF]">
      {/* Unified Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 transition-all">
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
