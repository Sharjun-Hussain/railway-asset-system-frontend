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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  ShieldAlert,
  Search,
  Clock,
  User as UserIcon,
  Terminal,
  FileSearch,
  Activity
} from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get("/audit-logs?limit=100")
      setLogs(response.data.data || [])
    } catch (error) {
      toast.error("Failed to load audit logs")
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log =>
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Using slate-900 to give it a distinct "Security/Admin" feel while matching the shape */}
          <div className="p-3 bg-slate-900 rounded-xl shadow-inner shadow-white/10 hidden sm:block">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Logs</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Security trace and administrative activity history
            </p>
          </div>
        </div>
      </div>

      {/* Unified Pill Toolbar */}
      <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by action, module, or user..."
            className="pl-12 h-12 w-full bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[14.5px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 mr-2 w-full md:w-auto justify-center">
          <Activity className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">
            Recent {filteredLogs.length} Event{filteredLogs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Logs Table Section - Elegant & Breathable */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider pl-8 py-4 w-[160px]">Timestamp</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 w-[160px]">Event Type</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 w-[240px]">User Details</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 w-[200px]">Email</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4">Division</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4">Station</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs tracking-wider pr-8 py-4">Warehouse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell className="pl-8 py-5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[80px] rounded-full" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <Skeleton className="h-4 w-[160px]" />
                  </TableCell>
                  <TableCell className="py-5">
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell className="py-5">
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell className="pr-8 py-5">
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <FileSearch className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-500 text-lg">No audit events match your search</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log._id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0">

                  {/* Timestamp */}
                  <TableCell className="pl-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-slate-700">
                        {format(new Date(log.createdAt), "MMM d, yyyy")}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {format(new Date(log.createdAt), "HH:mm:ss")}
                      </div>
                    </div>
                  </TableCell>

                  {/* Event Type */}
                  <TableCell className="py-5">
                    <div className="flex flex-col items-start gap-1.5">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-semibold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                        {log.module}
                      </Badge>
                      <span className="text-[14px] font-bold text-slate-900 leading-tight">
                        {log.action}
                      </span>
                    </div>
                  </TableCell>

                  {/* User Details */}
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 rounded-md shrink-0">
                        <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 text-sm truncate max-w-[180px]">
                          {log.performedBy?.full_name || "System Automated"}
                        </span>
                        {log.performedBy?.roles?.length > 0 && (
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                            {log.performedBy.roles.map(r => r.name).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="py-5">
                    <span className="text-[12px] text-slate-500 font-medium truncate max-w-[180px]">
                      {log.performedBy?.email || "system@internal.local"}
                    </span>
                  </TableCell>

                  {/* Division */}
                  <TableCell className="py-5">
                    {log.performedBy?.divisionId ? (
                      <span className="text-sm font-semibold text-slate-700">{log.performedBy.divisionId.division_name}</span>
                    ) : (
                      <span className="text-sm text-slate-400 italic">-</span>
                    )}
                  </TableCell>

                  {/* Station */}
                  <TableCell className="py-5">
                    {log.performedBy?.stationId ? (
                      <span className="text-sm font-semibold text-slate-700">{log.performedBy.stationId.station_name}</span>
                    ) : (
                      <span className="text-sm text-slate-400 italic">-</span>
                    )}
                  </TableCell>

                  {/* Warehouse */}
                  <TableCell className="pr-8 py-5">
                    {log.performedBy?.warehouseIds?.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {log.performedBy.warehouseIds.map(w => (
                           <Badge key={w._id} variant="outline" className="text-[10px] text-slate-600 border-slate-200 px-1.5 py-0 truncate max-w-full">
                             {w.warehouse_name}
                           </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">-</span>
                    )}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}