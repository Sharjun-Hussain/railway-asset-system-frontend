// components/layout/Sidebar.tsx
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Building,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({ isCollapsed }) {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Assets", href: "/assets", icon: Package },
    { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    { name: "Branches", href: "/branches", icon: Building },
    { name: "Users", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "hidden md:block border-r bg-background transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" /> {/* Replace with SL Railway Logo */}
            {!isCollapsed && <span className="">SLR Assets</span>}
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isCollapsed ? "justify-center px-0" : "justify-start"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn("h-5 w-5", !isCollapsed && "mr-3")}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
