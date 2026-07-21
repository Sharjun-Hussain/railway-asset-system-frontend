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
import { toast } from "sonner"
import {
  History,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  SlidersHorizontal,
  FileSearch
} from "lucide-react"
import { AdjustmentForm } from "@/components/inventory/AdjustmentForm"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { PermissionGate } from "@/components/auth/PermissionGate"

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAdjustments()
  }, [])

  const fetchAdjustments = async () => {
    setLoading(true)
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <SlidersHorizontal className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Adjustments</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              History of manual inventory corrections and audit reconciliations
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <PermissionGate module="stock" action="audit">
            <AdjustmentForm onSuccess={fetchAdjustments} />
          </PermissionGate>
        </div>
      </div>

      {/* Compact Search Toolbar */}
      <div className="flex w-full items-center justify-between bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">
            {filteredAdjustments.length} record{filteredAdjustments.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by asset, location, reason..."
            className="pl-10 h-10 w-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-full text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Adjustments Table Section - Elegant & Breathable */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-600 text-sm pl-8 py-3 w-[150px]">Date & Time</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3 w-[120px]">Asset ID</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Asset Details</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Location</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 text-sm py-3">Adjustment</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3 w-[260px]">Reason / Remarks</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm pr-8 py-3">Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    <p className="text-sm text-slate-500 font-semibold animate-pulse tracking-wide">Loading adjustment history...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAdjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <FileSearch className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-500 text-lg">No adjustment records found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAdjustments.map((adj) => {
                const isPositive = adj.quantity > 0;

                return (
                  <TableRow key={adj._id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0">

                    {/* Date & Time */}
                    <TableCell className="pl-8 py-3">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-xs font-semibold text-slate-700">
                          {format(new Date(adj.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          {format(new Date(adj.createdAt), "hh:mm a")}
                        </span>
                      </div>
                    </TableCell>

                    {/* Asset ID */}
                    <TableCell className="py-3">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100/70 px-2 py-1 rounded border border-slate-200/60 inline-block">
                        {adj.assetId?.qr_code || "N/A"}
                      </span>
                    </TableCell>

                    {/* Asset / Item */}
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1 max-w-[250px]">
                        <span className="text-[14px] font-bold text-slate-900 leading-tight truncate">
                          {adj.assetId?.asset_name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-3">
                      <div className="inline-flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                        {adj.warehouseId?.warehouse_name || "Unknown Location"}
                      </div>
                    </TableCell>

                    {/* Adjustment Quantity */}
                    <TableCell className="text-right py-3">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 font-black text-lg tracking-tight",
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {isPositive ? "+" : ""}{adj.quantity}
                      </div>
                    </TableCell>

                    {/* Remarks */}
                    <TableCell className="py-3">
                      {adj.remarks ? (
                        <p className="text-[13px] text-slate-600 font-medium line-clamp-2 leading-relaxed" title={adj.remarks}>
                          {adj.remarks}
                        </p>
                      ) : (
                        <span className="text-[13px] text-slate-400 italic">No remarks provided</span>
                      )}
                    </TableCell>

                    {/* Performed By */}
                    <TableCell className="pr-8 py-3">
                      <span className="text-slate-600 text-sm font-semibold">
                        {adj.performedBy?.full_name || "System"}
                      </span>
                    </TableCell>

                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}