"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Package,
  Settings,
  Users,
  Map,
  Box,
  LayoutGrid,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const primaryNavItems = [
  { icon: LayoutGrid, label: "Home", href: "/" },
  { icon: Box, label: "Inventory", href: "/products" },
  { icon: Map, label: "Infrastructure", href: "/divisions" },
  { icon: Users, label: "Admin", href: "/admin/rbac" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function PrimarySidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[70px] flex flex-col items-center py-6 border-r bg-white h-screen fixed left-0 top-0 z-50">
      <div className="mb-8 p-3 rounded-xl bg-primary/10 text-primary">
        <Package className="h-6 w-6" />
      </div>

      <nav className="flex-1 space-y-4">
        {primaryNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "p-3 rounded-xl flex items-center justify-center transition-all group relative",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              {isActive && (
                <div className="absolute left-[-12px] w-1.5 h-6 bg-primary rounded-r-full" />
              )}
              {/* Tooltip style label on hover can be added here */}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harper"
            alt="User"
          />
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
