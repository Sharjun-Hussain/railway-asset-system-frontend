"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { ShieldCheck, Info } from "lucide-react"

export function RoleManagement() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get("/roles")
      setRoles(response.data)
    } catch (error) {
      toast.error("Failed to fetch roles")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Roles & Permissions Map</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <div key={role._id} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg">{role.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                {role.permissions?.length || 0} Permissions
              </Badge>
            </div>

            <div className="bg-slate-50/50 rounded-lg p-4">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1">
                <Info className="h-3 w-3" /> Assigned Permissions
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions?.map(perm => (
                  <div key={perm._id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border text-xs shadow-sm">
                    <span className="font-bold text-primary">{perm.module}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-slate-600">{perm.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
