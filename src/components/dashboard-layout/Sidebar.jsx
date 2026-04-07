"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Moon,
  LogOut,
  Ticket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"

const navigationGroups = [
  {
    name: "CORE",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Transactions", href: "/transactions", icon: History },
      { name: "Tickets", href: "/tickets", icon: Ticket },
    ]
  },
  {
    name: "INVENTORY",
    items: [
      { name: "Products", href: "/products", icon: Package },
      { name: "Inventory", href: "/inventory", icon: Warehouse },
      { name: "Warehouses", href: "/warehouses", icon: Warehouse },
    ]
  },
  {
    name: "INFRASTRUCTURE",
    items: [
      { name: "Divisions", href: "/divisions", icon: Building },
      { name: "Stations", href: "/stations", icon: Building },
    ]
  },
  {
    name: "SYSTEM",
    items: [
      { name: "RBAC Admin", href: "/admin/rbac", icon: ShieldCheck },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-screen bg-white border-r z-50 flex flex-col w-64 shadow-sm overflow-x-hidden">
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-4 border-b shrink-0 overflow-hidden">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0">
             <Package className="h-6 w-6" />
          </div>
          <div className="whitespace-nowrap">
              <span className="font-bold text-xl text-primary tracking-tight">
                  SLR <span className="text-muted-foreground font-medium">CSAMS</span>
              </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8 scrollbar-tiny">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
             <h3 className="px-4 text-xs font-bold text-muted-foreground mb-4 opacity-100">
               {group.name}
             </h3>
            
            <div className="space-y-1">
                {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                const Icon = item.icon
                
                return (
                  <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium relative group/item w-full",
                          isActive 
                          ? "bg-primary text-white shadow-md shadow-primary/10" 
                          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                      )}
                  >
                      <Icon className={cn(
                          "h-5 w-5 shrink-0 transition-colors", 
                          !isActive && "text-muted-foreground/70 group-hover/item:text-foreground"
                      )} />
                      
                      <span className="whitespace-nowrap opacity-100">
                          {item.name}
                      </span>
                  </Link>
                )
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Profile */}
      <div className="p-4 border-t space-y-4 overflow-hidden">
        <div className="flex items-center gap-3 px-1 transition-all duration-300">
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name || "Harper"}`} alt="User" />
          </div>
          
          <div className="flex-1 min-w-0 transition-all duration-300 overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground leading-none mb-1">
              {session?.user?.name || "Harper Nelson"}
              </p>
              <p className="text-xs text-muted-foreground truncate font-medium">
              Admin Manager
              </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 text-muted-foreground bg-secondary/30 py-2 rounded-lg opacity-100 h-10">
            <div className="flex items-center gap-2 text-xs font-medium whitespace-nowrap">
                <Moon className="h-4 w-4" />
                Dark mode
            </div>
            <div className="w-9 h-5 bg-slate-200 rounded-full relative p-0.5 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
        </div>

        <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive gap-3 px-2 rounded-xl transition-all overflow-hidden"
            onClick={() => signOut()}
        >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap font-semibold">
                Log out
            </span>
        </Button>
      </div>
    </aside>
  )
}
