"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Lock } from "lucide-react"

export function PermissionList() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    try {
      const response = await apiClient.get("/permissions")
      setPermissions(response.data)
    } catch (error) {
      toast.error("Failed to fetch permissions")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>

  // Group by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = []
    acc[perm.module].push(perm)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">System Permissions Library</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedPermissions).map(([module, perms]) => (
          <div key={module} className="rounded-xl border bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50 px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600">{module}</h3>
              <Badge variant="secondary" className="text-[10px] bg-slate-200">{perms.length} Actions</Badge>
            </div>
            <div className="p-4 space-y-3 flex-1">
              {perms.map(perm => (
                <div key={perm._id} className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-indigo-50 text-indigo-600">
                      <Lock className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-bold">{perm.name}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground ml-6 leading-tight">
                    {perm.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
