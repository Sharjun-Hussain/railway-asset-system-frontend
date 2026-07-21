"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/UserManagement"
import { RoleManagement } from "@/components/admin/RoleManagement"
import { PermissionList } from "@/components/admin/PermissionList"
import { ShieldCheck, Users, Key, Lock, ShieldAlert, DownloadCloud } from "lucide-react"
import { useRBAC } from "@/hooks/useRBAC"
import { Button } from "@/components/ui/button"
import apiClient from "@/lib/api"
import { toast } from "sonner"

export default function RBACPage() {
  const { isSuperAdmin } = useRBAC()

  const handleBackup = async () => {
    try {
      toast.loading("Generating system backup...", { id: "backup-toast" })
      const response = await apiClient.get('/backup/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `railway_csams_backup_${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("System backup downloaded successfully.", { id: "backup-toast" })
    } catch (error) {
      console.error("Backup failed", error)
      toast.error("Failed to download system backup.", { id: "backup-toast" })
    }
  }

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
        {isSuperAdmin && (
          <Button
            onClick={handleBackup}
            className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-lg shadow-primary/20 h-11 rounded-xl transition-all text-white"
          >
            <DownloadCloud className="mr-2 h-4 w-4" /> Download Full Backup
          </Button>
        )}
      </div>

      {/* Main Content Sections */}
      <Tabs defaultValue="users" className="w-full">

        {/* Sleek Underline-Style Tabs Toolbar */}
        <div className="mb-8 w-full overflow-x-auto border-b border-slate-200">
          <TabsList className="flex w-max min-w-full justify-start h-14 bg-transparent p-0">
            <TabsTrigger
              value="users"
              className="relative h-14 flex items-center gap-2 rounded-none border-0 border-b-2 border-transparent px-6 font-semibold text-slate-500 hover:text-slate-800 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
            >
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="relative h-14 flex items-center gap-2 rounded-none border-0 border-b-2 border-transparent px-6 font-semibold text-slate-500 hover:text-slate-800 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
            >
              <Key className="h-4 w-4" /> Roles
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="relative h-14 flex items-center gap-2 rounded-none border-0 border-b-2 border-transparent px-6 font-semibold text-slate-500 hover:text-slate-800 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
            >
              <Lock className="h-4 w-4" /> Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents - Note: Ensure the child components share the premium table styling */}
        <div className="min-h-[400px]">
          <TabsContent value="users" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UserManagement />
          </TabsContent>
          <TabsContent value="roles" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <RoleManagement />
          </TabsContent>
          <TabsContent value="permissions" className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PermissionList />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}