"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  Warehouse, 
  ArrowRightLeft, 
  TrendingUp,
  AlertTriangle,
  History,
  PackageCheck
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import apiClient from "@/lib/api"
import { InventoryTransactionDialog } from "@/components/inventory/InventoryTransactionDialog"

export default function StockInventoryPage() {
  const [stocks, setStocks] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog States
  const [transactionOpen, setTransactionOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [stockRes, prodRes, whRes] = await Promise.all([
        apiClient.get("/inventory"),
        apiClient.get("/products"),
        apiClient.get("/warehouses")
      ])
      
      setStocks(Array.isArray(stockRes.data) ? stockRes.data : [])
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : [])
      setWarehouses(Array.isArray(whRes.data) ? whRes.data : [])
    } catch (error) {
      console.error("Error fetching inventory data:", error)
      toast.error("Failed to sync inventory status")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredStocks = stocks.filter(s => 
    (s.assetId?.asset_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.assetId?.qr_code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.warehouseId?.warehouse_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockCount = stocks.filter(s => s.quantity <= (s.min_level || 0)).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Real-time Stock Inventory</h1>
          <p className="text-slate-500 font-medium tracking-tight">Monitor and manage asset quantities across all railway warehouses.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="border-slate-200 font-bold px-6 h-11 rounded-xl shadow-sm hover:bg-slate-50"
            onClick={() => setTransactionOpen(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4 text-primary" /> Transfer / Issue
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6 h-11 rounded-xl"
            onClick={() => setTransactionOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" /> Stock In (Receive)
          </Button>
        </div>
      </div>

      {/* SAMS Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total SKU Records</p>
                <h3 className="text-3xl font-black text-slate-800">{stocks.length}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <PackageCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Low Stock Alerts</p>
                <h3 className="text-3xl font-black text-red-600">{lowStockCount}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Active Quantities</p>
                <h3 className="text-3xl font-black text-emerald-600">
                    {stocks.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Recent Activities</p>
                <h3 className="text-3xl font-black text-slate-800">24h</h3>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-600">
                <History className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stock Table */}
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Filter stock by asset name, code or warehouse location..."
              className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-xl bg-white border-slate-200 shadow-sm shrink-0">
            <Filter className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                <TableHead className="font-bold text-slate-500 py-5 uppercase tracking-tighter">Asset Specification</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase tracking-tighter">Physical Location</TableHead>
                <TableHead className="text-right font-bold text-slate-500 uppercase tracking-tighter">Current Stock</TableHead>
                <TableHead className="text-right font-bold text-slate-500 uppercase tracking-tighter">Status</TableHead>
                <TableHead className="text-center font-bold text-slate-500 uppercase tracking-tighter">Last Sync</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">
                    Synchronizing SAMS inventory database...
                  </TableCell>
                </TableRow>
              ) : filteredStocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">
                    No matching stock records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStocks.map((stock) => (
                  <TableRow key={stock._id} className="hover:bg-slate-50/30 transition-colors border-b last:border-0 group">
                    <TableCell className="py-4">
                        <div className="font-bold text-slate-800">{stock.assetId?.asset_name}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{stock.assetId?.qr_code}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase">{stock.assetId?.unit || "pcs"}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium text-slate-600">
                        <Warehouse className="h-4 w-4 text-slate-400" />
                        {stock.warehouseId?.warehouse_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <span className={`text-xl font-black ${stock.quantity <= (stock.min_level || 0) ? "text-red-600" : "text-slate-800"}`}>
                         {stock.quantity.toLocaleString()}
                       </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {stock.quantity <= (stock.min_level || 0) ? (
                        <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100 font-bold text-[10px] uppercase py-0.5">
                          Critical Low
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 font-bold text-[10px] uppercase py-0.5">
                          Standard OK
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-[10px] font-bold text-slate-400">
                      {new Date(stock.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <InventoryTransactionDialog 
        open={transactionOpen}
        onOpenChange={setTransactionOpen}
        products={products}
        warehouses={warehouses}
        onSuccess={fetchData}
      />
    </div>
  )
}
