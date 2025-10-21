// components/layout/Header.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelLeft, PanelRight } from "lucide-react";
import { MobileSidebar } from "./mobile-sidebar";

export function Header({ isCollapsed, toggleSidebar }) {
  // TODO: Fetch these from user's session/context
  const user = { name: "Admin User", email: "admin@railways.gov.lk" };
  const branches = ["Colombo", "Batticaloa", "Jaffna"];
  const warehouses = ["Maradana Main", "Colombo Fort Goods", "Jaffna Depot"];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile Sidebar Toggle */}
      <MobileSidebar />

      {/* Desktop Sidebar Toggle */}
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

      {/* Breadcrumbs or Page Title can go here */}
      <h1 className="text-lg font-semibold md:text-xl hidden md:block">
        Dashboard
      </h1>

      {/* Header Right Side */}
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* TODO: Add logic for role-based selectors */}
          {/* A SuperAdmin might select a Branch */}
          <Select defaultValue="colombo">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch.toLowerCase()}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-none">
          {/* A BranchManager might select a Warehouse in their branch */}
          <Select defaultValue="maradana">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((wh) => (
                <SelectItem key={wh} value={wh.toLowerCase().replace(" ", "-")}>
                  {wh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                <AvatarFallback>AU</AvatarFallback> {/* Admin User */}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
