import { Sidebar } from "@/components/dashboard-layout/Sidebar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen w-full bg-[#FAFBFF]">
      {/* Unified Sidebar (Fixed) */}
      <Sidebar session={session} />

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
