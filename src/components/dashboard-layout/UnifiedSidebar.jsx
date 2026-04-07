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
  Ticket,
  Box,
  LayoutGrid
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"

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

export function UnifiedSidebar({ isCollapsed, onToggle }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-white border-r z-50 transition-all duration-300 flex flex-col group/sidebar shadow-sm",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Header / Logo */}
      <div className={cn(
        "h-20 flex items-center px-4 border-b shrink-0",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0">
             <Package className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-primary whitespace-nowrap animate-in fade-in slide-in-from-left-2 transition-all">
                SLR <span className="text-muted-foreground font-medium">CSAMS</span>
            </span>
          )}
        </Link>
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-secondary rounded-lg"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {isCollapsed && (
           <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-3 top-8 h-6 w-6 rounded-full bg-white border shadow-md z-50 hover:bg-primary hover:text-white transition-all scale-0 group-hover/sidebar:scale-100"
            onClick={onToggle}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            {!isCollapsed && (
               <h3 className="px-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase mb-4 animate-in fade-in-0 duration-500">
                 {group.name}
               </h3>
            )}
            
            <div className="space-y-1">
                {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium relative group/item",
                        isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/10" 
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                        isCollapsed && "justify-center px-0"
                    )}
                    >
                    <item.icon className={cn(
                        "h-5 w-5 shrink-0", 
                        !isActive && "text-muted-foreground/70"
                    )} />
                    
                    {!isCollapsed && (
                        <span className="whitespace-nowrap transition-all duration-300">{item.name}</span>
                    )}

                    {isCollapsed && isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                    )}
                    
                    {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover/item:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                            {item.name}
                        </div>
                    )}
                    </Link>
                )
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Profile */}
      <div className={cn(
        "p-4 border-t space-y-4",
        isCollapsed ? "items-center" : ""
      )}>
        <div className={cn(
          "flex items-center gap-3 px-1",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harper" alt="User" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 transition-opacity">
                <p className="text-xs font-bold truncate text-foreground leading-none mb-1">
                {session?.user?.name || "Harper Nelson"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-medium">
                Admin Manager
                </p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
            <div className="flex items-center justify-between px-2 text-muted-foreground bg-secondary/30 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-medium">
                    <Moon className="h-4 w-4" />
                    Dark mode
                </div>
                <div className="w-9 h-5 bg-slate-200 rounded-full relative p-0.5 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            </div>
        )}

        <Button 
          variant="ghost" 
          className={cn(
              "w-full justify-start text-muted-foreground hover:text-destructive gap-3 px-2 rounded-xl transition-all",
              isCollapsed && "justify-center"
          )}
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </aside>
  )
}
