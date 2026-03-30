import Link from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Building,
  Settings,
  History,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({ isCollapsed }) {
  const { data: session } = useSession();
  const permissions = session?.user?.roles?.flatMap(role => 
    role.permissions.map(p => `${p.module}.${p.name}`)
  ) || [];

  const isSuperAdmin = session?.user?.roles?.some(r => r.name === "Super Admin");

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, show: true },
    { 
      name: "Products", 
      href: "/products", 
      icon: Package, 
      show: isSuperAdmin || permissions.includes("product.view") 
    },
    { 
      name: "Inventory", 
      href: "/inventory", 
      icon: Warehouse, 
      show: isSuperAdmin || permissions.includes("stock.view") 
    },
    { 
      name: "Divisions", 
      href: "/divisions", 
      icon: Building, 
      show: isSuperAdmin || permissions.includes("location.view") 
    },
    { 
      name: "Transactions", 
      href: "/transactions", 
      icon: History, 
      show: isSuperAdmin || permissions.includes("stock.view") 
    },
    { 
      name: "RBAC Admin", 
      href: "/admin/rbac", 
      icon: ShieldCheck, 
      show: isSuperAdmin || permissions.includes("rbac.view") 
    },
    { name: "Settings", href: "/settings", icon: Settings, show: true },
  ];

  const visibleItems = navItems.filter(item => item.show);

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
            <Package className="h-6 w-6 text-slate-700" />
            {!isCollapsed && <span className="text-slate-800">SLR CSAMS</span>}
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4 px-4">
          <ul className="space-y-2">
            {visibleItems.map((item) => (
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

