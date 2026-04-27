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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ShieldAlert, Search, Clock, User as UserIcon, Terminal } from "lucide-react"
import { format } from "date-fns"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await apiClient.get("/audit-logs?limit=100")
      setLogs(response.data.data)
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

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm flex items-center gap-6">
        <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Audit Logs</h1>
          <p className="text-slate-500 font-medium text-sm">Security trace and administrative activity history</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by action, module or user..." 
            className="pl-10 h-11 rounded-xl shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <Clock className="h-3.5 w-3.5" /> Recent {filteredLogs.length} Events
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
              <TableHead className="py-4">Timestamp</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>User / IP</TableHead>
              <TableHead>Activity Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log._id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="w-[180px]">
                   <span className="text-xs font-bold text-slate-400">
                     {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                   </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-slate-50 text-[10px] font-bold border-slate-200">
                      {log.module}
                    </Badge>
                    <span className="text-xs font-black text-slate-700">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                        <UserIcon className="h-3 w-3 text-slate-400" /> 
                        {log.performedBy?.full_name || "System"}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono ml-4">{log.ipAddress || "Internal"}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-md">
                    <Terminal className="h-3 w-3 text-slate-400 shrink-0" />
                    <code className="text-[10px] text-slate-600 font-mono truncate">
                      {JSON.stringify(log.details)}
                    </code>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
