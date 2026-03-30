import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelLeft, PanelRight, LogOut, User } from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";

export function Header({ isCollapsed, toggleSidebar }) {
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileSidebar />

      <Button
        variant="outline"
        size="icon"
        className="hidden md:flex"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <PanelRight className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <h1 className="text-lg font-semibold md:text-xl hidden md:block">
        Resource Management Portal
      </h1>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex flex-col items-end">
          <p className="text-sm font-medium">{user?.full_name || "Loading..."}</p>
          <p className="text-xs text-muted-foreground uppercase">
            {user?.roles?.map(r => r.name).join(", ") || "User"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="/avatar.png" alt={user?.full_name} />
                <AvatarFallback>
                  {user?.full_name?.split(" ").map(n => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

