import { ChatInterface } from "@/components/chat-screen/chatInterface";
import { StatCards } from "@/components/chat-screen/StatsCards";

// app/(dashboard)/page.tsx
export default function DashboardPage() {
  return (
    // On mobile: 1 column (default)
    // On large screens: 3-column grid
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stat Cards Area */}
      {/* On mobile: Full width, appears first */}
      {/* On large screens: 1 column wide, appears last (on the right) */}
      <div className="lg:col-span-1 lg:order-last">
        <StatCards />
      </div>

      {/* Chat Interface Area */}
      {/* On mobile: Full width, appears second */}
      {/* On large screens: 2 columns wide, appears first (on the left) */}
      <div className="lg:col-span-2 lg:order-first">
        <ChatInterface />
      </div>
    </div>
  );
}
