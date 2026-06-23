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
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  History,
  ArrowRightLeft,
  Download,
  Upload,
  RefreshCw,
  Search,
  FileText,
  MapPin,
  ArrowRight,
  User,
  Hash,
  Package
} from "lucide-react"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get("/transactions")
      setTransactions(response.data)
    } catch (error) {
      toast.error("Failed to load transaction history")
    } finally {
      setLoading(false)
    }
  }

  // Visual helpers for Transaction Types (Semantic colors kept as-is)
  const getTypeConfig = (type) => {
    switch (type) {
      case "RECEIVE":
        return {
          style: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: <Download className="h-3.5 w-3.5 mr-1" />,
          qtyPrefix: "+",
          qtyStyle: "text-emerald-600"
        }
      case "ISSUE":
        return {
          style: "bg-rose-100 text-rose-800 border-rose-200",
          icon: <Upload className="h-3.5 w-3.5 mr-1" />,
          qtyPrefix: "-",
          qtyStyle: "text-rose-600"
        }
      case "TRANSFER":
        return {
          style: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />,
          qtyPrefix: "",
          qtyStyle: "text-blue-600"
        }
      case "ADJUST":
        return {
          style: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <RefreshCw className="h-3.5 w-3.5 mr-1" />,
          qtyPrefix: "±",
          qtyStyle: "text-amber-600"
        }
      default:
        return {
          style: "bg-slate-100 text-slate-800 border-slate-200",
          icon: <FileText className="h-3.5 w-3.5 mr-1" />,
          qtyPrefix: "",
          qtyStyle: "text-slate-600"
        }
    }
  }

  const filteredTransactions = transactions.filter(t =>
    t.assetId?.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.warehouseId?.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.toWarehouseId?.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 mt-6">
      <TableSkeleton rows={8} columns={6} />
    </div>
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20">
            <History className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Transactions</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Monitor your complete inventory movement and history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchTransactions} className="h-10 px-4 rounded-lg shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2 text-slate-500" />
            Refresh
          </Button>
          {/* Export button removed as requested */}
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by asset, reference, or location..."
            className="pl-10 h-10 w-full bg-slate-50 border-slate-200 focus-visible:ring-primary transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm font-medium text-slate-500 w-full md:w-auto text-left md:text-right">
          Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 && 's'}
        </div>
      </div>

      {/* Upgraded Table Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
              <TableHead className="w-[180px] font-semibold text-slate-600">Date & Type</TableHead>
              <TableHead className="font-semibold text-slate-600">Asset Details</TableHead>
              <TableHead className="font-semibold text-slate-600">Movement Location</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Quantity</TableHead>
              <TableHead className="w-[150px] font-semibold text-slate-600">Audit Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Search className="h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-500">No transactions match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => {
                const config = getTypeConfig(t.type)

                return (
                  <TableRow key={t._id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Date & Type */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] font-semibold text-slate-700">
                          {format(new Date(t.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          {format(new Date(t.createdAt), "HH:mm a")}
                        </span>
                        <Badge className={cn("w-fit font-bold text-[10px] uppercase shadow-sm mt-1 border", config.style)}>
                          {config.icon}
                          {t.type}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Asset Details */}
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 border border-slate-200 group-hover:bg-white transition-colors">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-900">{t.assetId?.asset_name}</span>
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                            {t.assetId?.qr_code || "NO-QR"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Movement (Locations) */}
                    <TableCell>
                      <div className="flex flex-col gap-1.5 justify-center py-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            {t.warehouseId?.stationId?.divisionId?.division_name} • {t.warehouseId?.stationId?.station_name}
                          </span>
                          <div className="flex items-center gap-1.5 text-[13px] text-slate-700 font-bold">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {t.warehouseId?.warehouse_name}
                          </div>
                        </div>

                        {t.type === "TRANSFER" && t.toWarehouseId && (
                          <div className="flex flex-col gap-0.5 mt-1 border-l-2 border-primary/20 pl-2">
                             <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                              {t.toWarehouseId?.stationId?.divisionId?.division_name} • {t.toWarehouseId?.stationId?.station_name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[13px] text-primary font-bold">
                              <ArrowRight className="h-3 w-3 text-primary/70" />
                              {t.toWarehouseId?.warehouse_name}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="text-right">
                      <div className={cn("text-base font-bold tabular-nums", config.qtyStyle)}>
                        {config.qtyPrefix}{t.quantity}
                      </div>
                    </TableCell>

                    {/* Audit Info */}
                    <TableCell>
                      <div className="flex flex-col gap-2 border-l-2 border-slate-100 pl-4 py-1">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-700 font-mono tracking-tight">
                            {t.referenceNo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500 line-clamp-1">
                            {t.performedBy?.full_name}
                          </span>
                        </div>
                      </div>
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