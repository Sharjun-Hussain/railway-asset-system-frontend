import { Sidebar } from "@/components/dashboard-layout/Sidebar"
import { Header } from "@/components/dashboard-layout/Header"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF]">
      {/* Unified Sidebar (Fixed Desktop) */}
      <Sidebar session={session} className="fixed left-0 top-0 h-screen w-64 hidden lg:flex" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all w-full min-w-0 overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
          <div className="max-w-[1400px] mx-auto min-h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
