"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/UserManagement"
import { RoleManagement } from "@/components/admin/RoleManagement"
import { PermissionList } from "@/components/admin/PermissionList"
import { ShieldCheck, Users, Key, Lock } from "lucide-react"

export default function RBACPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">RBAC Administration</h1>
            <p className="text-slate-500 font-medium">Control system access, define roles, and manage user permissions</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <Tabs defaultValue="users" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100 p-1 rounded-xl border">
            <TabsTrigger value="users" className="flex items-center gap-2 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Key className="h-4 w-4" /> Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2 rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Lock className="h-4 w-4" /> Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="focus-visible:outline-none focus-visible:ring-0">
          <UserManagement />
        </TabsContent>
        <TabsContent value="roles" className="focus-visible:outline-none focus-visible:ring-0">
          <RoleManagement />
        </TabsContent>
        <TabsContent value="permissions" className="focus-visible:outline-none focus-visible:ring-0">
          <PermissionList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
