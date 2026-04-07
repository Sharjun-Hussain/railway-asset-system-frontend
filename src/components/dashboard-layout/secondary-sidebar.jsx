"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Building,
  History,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Moon,
  LogOut,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const navigationGroups = [
  {
    name: "CORE",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Transactions", href: "/transactions", icon: History },
      { name: "Tickets", href: "/tickets", icon: Ticket },
    ],
  },
  {
    name: "INVENTORY",
    items: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Inventory", href: "/inventory", icon: Warehouse },
      { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    ],
  },
  {
    name: "INFRASTRUCTURE",
    items: [
      { name: "Divisions", href: "/divisions", icon: Building },
      { name: "Stations", href: "/stations", icon: Building },
    ],
  },
  {
    name: "SYSTEM",
    items: [
      { name: "RBAC Admin", href: "/admin/rbac", icon: ShieldCheck },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function SecondarySidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "w-60 flex flex-col bg-white border-r h-screen fixed left-[70px] top-0 z-40 transition-all duration-300",
        isCollapsed && "w-0 left-[70px] border-none overflow-hidden",
      )}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <span className="flex items-center gap-2">
            SLR <span className="text-muted-foreground font-medium">CSAMS</span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-secondary"
          onClick={onToggle}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8 scrollbar-hide">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <h3 className="px-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-4">
              {group.name}
            </h3>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                    isActive
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4.5 w-4.5",
                      isActive ? "text-primary" : "text-muted-foreground/70",
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1 h-3 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-100 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harper"
              alt="User"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-foreground">
              {session?.user?.name || "Harper Nelson"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate uppercase font-medium">
              Admin Manager
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-muted-foreground">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Moon className="h-4 w-4" />
            Dark mode
          </div>
          <div className="w-10 h-5 bg-slate-200 rounded-full relative p-0.5 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive gap-3 px-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
