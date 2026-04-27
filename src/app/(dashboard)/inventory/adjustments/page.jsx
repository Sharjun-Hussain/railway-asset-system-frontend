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
import { History, TrendingUp, TrendingDown, Clock, Search } from "lucide-react"
import { AdjustmentForm } from "@/components/inventory/AdjustmentForm"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const fetchAdjustments = async () => {
    try {
      const response = await apiClient.get("/transactions")
      // Filter only ADJUST types
      const filtered = response.data.filter(t => t.type === "ADJUST")
      setAdjustments(filtered)
    } catch (error) {
      toast.error("Failed to load adjustment history")
    } finally {
      setLoading(false)
    }
  }

  const filteredAdjustments = adjustments.filter(adj => 
    adj.assetId?.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.warehouseId?.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Stock Adjustments</h1>
          <p className="text-sm text-slate-500">History of manual corrections and audit adjustments</p>
        </div>
        <AdjustmentForm onSuccess={fetchAdjustments} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by asset, location or reason..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
           <Clock className="h-3 w-3" /> Showing {filteredAdjustments.length} records
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Date & Time</TableHead>
              <TableHead>Asset / Item</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Adjustment</TableHead>
              <TableHead>Reason / Remarks</TableHead>
              <TableHead>Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                   No adjustment records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAdjustments.map((adj) => (
                <TableRow key={adj._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-slate-500 text-xs">
                    {format(new Date(adj.createdAt), "MMM d, yyyy • HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{adj.assetId?.asset_name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{adj.assetId?.qr_code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium text-[10px]">
                      {adj.warehouseId?.warehouse_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1 font-bold",
                      adj.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {adj.quantity > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {adj.quantity > 0 ? "+" : ""}{adj.quantity}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs text-slate-600 truncate" title={adj.remarks}>
                      {adj.remarks}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-700">{adj.performedBy?.full_name || "System"}</span>
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

// Utility import needed for the cn function
import { cn } from "@/lib/utils"
