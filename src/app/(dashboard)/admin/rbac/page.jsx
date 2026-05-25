"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/UserManagement"
import { RoleManagement } from "@/components/admin/RoleManagement"
import { PermissionList } from "@/components/admin/PermissionList"
import { ShieldCheck, Users, Key, Lock, ShieldAlert } from "lucide-react"

export default function RBACPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section - Modernized & Clean */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RBAC Administration</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Control system access, define roles, and manage user permissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <Tabs defaultValue="users" className="w-full">

        {/* Unified Pill-Shaped Tabs Toolbar */}
        <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm mb-6 w-full sm:w-fit overflow-x-auto">
          <TabsList className="bg-slate-50/80 p-1 rounded-xl h-12 w-full sm:w-auto inline-flex min-w-max">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full text-sm data-[state=active]:text-primary transition-all"
            >
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full text-sm data-[state=active]:text-primary transition-all"
            >
              <Key className="h-4 w-4" /> Roles
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center gap-2 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full text-sm data-[state=active]:text-primary transition-all"
            >
              <Lock className="h-4 w-4" /> Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents - Note: Ensure the child components share the premium table styling */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
          <TabsContent value="users" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <UserManagement />
          </TabsContent>
          <TabsContent value="roles" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <RoleManagement />
          </TabsContent>
          <TabsContent value="permissions" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <PermissionList />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}