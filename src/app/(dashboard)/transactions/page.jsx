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
import { History, ArrowRightLeft, Download, Upload, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get("/transactions")
      setTransactions(response.data)
    } catch (error) {
      toast.error("Failed to load transaction history")
    } finally {
      setLoading(false)
    }
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case "RECEIVE": return "bg-emerald-50 text-emerald-700 border-emerald-100"
      case "ISSUE": return "bg-rose-50 text-rose-700 border-rose-100"
      case "TRANSFER": return "bg-blue-50 text-blue-700 border-blue-100"
      case "ADJUST": return "bg-amber-50 text-amber-700 border-amber-100"
      default: return "bg-slate-50 text-slate-700"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "RECEIVE": return <Download className="h-3 w-3" />
      case "ISSUE": return <Upload className="h-3 w-3" />
      case "TRANSFER": return <ArrowRightLeft className="h-3 w-3" />
      case "ADJUST": return <RefreshCw className="h-3 w-3" />
      default: return null
    }
  }

  const filteredTransactions = transactions.filter(t => 
    t.assetId?.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.warehouseId?.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.toWarehouseId?.warehouse_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Stock Transactions</h1>
          <p className="text-sm text-slate-500 font-medium">History of all stock movements and operations</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-none font-bold">Auditor View Enabled</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search by asset, reference or location..." 
          className="pl-10 h-11 rounded-xl shadow-sm" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Asset / Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reference / Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                   No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t._id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {format(new Date(t.createdAt), "MMM d, yyyy • HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("flex items-center gap-1.5 w-fit font-bold text-[10px] uppercase border", getTypeStyle(t.type))}>
                      {getTypeIcon(t.type)}
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{t.assetId?.asset_name}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{t.assetId?.qr_code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-700 italic">
                      {t.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          {t.warehouseId?.warehouse_name}
                       </span>
                       {t.type === "TRANSFER" && (
                         <>
                           <ArrowRightLeft className="h-3 w-3 text-slate-300 mx-auto" />
                           <span className="text-xs font-bold text-indigo-600">
                             To: {t.toWarehouseId?.warehouse_name}
                           </span>
                         </>
                       )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-slate-800 tracking-tighter">#{t.referenceNo}</span>
                       <span className="text-[10px] text-slate-400 font-medium">By {t.performedBy?.full_name}</span>
                    </div>
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
