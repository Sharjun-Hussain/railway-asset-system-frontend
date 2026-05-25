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
  PackageCheck,
  PackageOpen
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
        apiClient.get("/assets"),
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
  const totalActiveQuantities = stocks.reduce((acc, curr) => acc + (curr.quantity || 0), 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <PackageOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Real-time Stock Inventory</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Monitor and manage asset quantities across all railway warehouses
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-slate-200 font-semibold px-6 h-11 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-700 w-full sm:w-auto"
            onClick={() => setTransactionOpen(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4 text-primary" /> Transfer / Issue
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all w-full sm:w-auto"
            onClick={() => setTransactionOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Stock In (Receive)
          </Button>
        </div>
      </div>

      {/* Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-xs tracking-widest">Total SKU Records</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stocks.length}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <PackageCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-rose-50/30 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-xs tracking-widest">Low Stock Alerts</p>
                <h3 className="text-4xl font-black text-rose-600 tracking-tighter">{lowStockCount}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 shadow-inner">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-xs tracking-widest">Active Quantities</p>
                <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">
                  {totalActiveQuantities.toLocaleString()}
                </h3>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-inner">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-xs tracking-widest">Recent Activity</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">24h</h3>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 shadow-inner">
                <History className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unified Pill Toolbar */}
      <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Filter stock by asset name, code or warehouse location..."
            className="pl-12 h-12 w-full bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[14.5px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-slate-50/50 border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all shrink-0">
          <Filter className="h-4 w-4 text-slate-500" />
        </Button>
      </div>

      {/* Master Table Section - Elegant & Breathable */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider pl-8 py-4">Asset Specification</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider py-4">Physical Location</TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider py-4">Current Stock</TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider py-4">Status</TableHead>
              <TableHead className="text-center font-bold text-slate-500 text-xs uppercase tracking-wider pr-8 py-4">Last Sync</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                    <p className="text-sm text-slate-500 font-semibold animate-pulse tracking-wide">Syncing SAMS inventory database...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredStocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-500 text-lg">No matching stock records found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredStocks.map((stock) => {
                const isLowStock = stock.quantity <= (stock.min_level || 0);

                return (
                  <TableRow key={stock._id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0">

                    {/* Asset Specs */}
                    <TableCell className="pl-8 py-5">
                      <div className="flex flex-col gap-1.5 max-w-[340px]">
                        <span className="text-[15px] font-bold text-slate-900 leading-tight">
                          {stock.assetId?.asset_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[10px] font-bold text-slate-500 uppercase bg-white px-1.5 py-0 border-slate-200">
                            {stock.assetId?.qr_code || "NO-QR"}
                          </Badge>
                          <span className="text-slate-300 text-xs">•</span>
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            {stock.assetId?.unit || "pcs"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm text-slate-700 font-medium text-sm">
                        <Warehouse className="h-4 w-4 text-slate-400" />
                        {stock.warehouseId?.warehouse_name}
                      </div>
                    </TableCell>

                    {/* Current Stock */}
                    <TableCell className="text-right py-5">
                      <span className={`text-2xl font-black tracking-tight ${isLowStock ? "text-rose-600" : "text-slate-800"}`}>
                        {(stock.quantity || 0).toLocaleString()}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-right py-5">
                      {isLowStock ? (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 font-bold text-[10px] uppercase py-1 px-2.5 shadow-sm">
                          Critical Low
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-bold text-[10px] uppercase py-1 px-2.5 shadow-sm">
                          Standard OK
                        </Badge>
                      )}
                    </TableCell>

                    {/* Last Sync */}
                    <TableCell className="text-center pr-8 py-5">
                      <span className="text-xs font-semibold text-slate-400 tracking-wide">
                        {new Date(stock.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>

                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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