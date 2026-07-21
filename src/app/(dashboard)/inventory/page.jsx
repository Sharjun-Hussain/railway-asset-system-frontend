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
  PackageOpen,
  Eye
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
import { WarehouseSummaryDialog } from "@/components/inventory/WarehouseSummaryDialog"
import { PermissionGate } from "@/components/auth/PermissionGate"

export default function StockInventoryPage() {
  const [stocks, setStocks] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [divisions, setDivisions] = useState([])
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog States
  const [transactionOpen, setTransactionOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const results = await Promise.allSettled([
        apiClient.get("/inventory"),
        apiClient.get("/assets"),
        apiClient.get("/warehouses"),
        apiClient.get("/divisions"),
        apiClient.get("/stations")
      ])

      const getResultData = (result) => result.status === 'fulfilled' ? result.value.data : [];

      const stockData = getResultData(results[0]);
      const prodData = getResultData(results[1]);
      const whData = getResultData(results[2]);
      const divData = getResultData(results[3]);
      const statData = getResultData(results[4]);

      setStocks(Array.isArray(stockData) ? stockData : [])
      setProducts(Array.isArray(prodData) ? prodData : [])
      setWarehouses(Array.isArray(whData?.data || whData) ? (whData?.data || whData) : [])
      setDivisions(Array.isArray(divData?.data || divData) ? (divData?.data || divData) : [])
      setStations(Array.isArray(statData?.data || statData) ? (statData?.data || statData) : [])
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
            className="border-primary/20 text-primary hover:bg-primary/5 shadow-sm font-semibold px-5 h-11 rounded-xl transition-all w-full sm:w-auto"
            onClick={() => setSummaryOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" /> Global Overview
          </Button>
          <PermissionGate module="stock" action="receive">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all w-full sm:w-auto"
              onClick={() => setTransactionOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Stock In (Receive)
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

        {/* Card 1 */}
        {/* Card 1 - Total SKU */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Total SKU</p>
              <p className="text-4xl font-semibold text-slate-800">{stocks.length}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <PackageCheck className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Low Alerts (Commented out per request) 
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose-50/30 group-hover:bg-rose-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Low Alerts</p>
              <p className="text-4xl font-semibold text-rose-500">{lowStockCount}</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-3 text-rose-500">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </Card>
        */}

        {/* Card 3 - Active Qty */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Active Qty</p>
              <p className="text-4xl font-semibold text-slate-800">{totalActiveQuantities.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Search Toolbar */}
      <div className="flex w-full items-center justify-end">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assets, codes, locations..."
            className="pl-10 h-10 w-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-full text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Master Table Section - Elegant & Breathable */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-600 text-sm pl-8 py-3 w-[140px]">Asset ID</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Asset Details</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Location Map</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 text-sm py-3">In Stock</TableHead>
              <TableHead className="text-left font-semibold text-slate-600 text-sm pr-8 py-3 w-[150px]">Last Updated</TableHead>
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

                    {/* Asset ID First Column */}
                    <TableCell className="pl-8 py-3">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100/70 px-2 py-1 rounded border border-slate-200/60 inline-block">
                        {stock.assetId?.qr_code || "N/A"}
                      </span>
                    </TableCell>

                    {/* Asset Specs */}
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1 max-w-[340px]">
                        <span className="text-[14.5px] font-bold text-slate-900 leading-tight">
                          {stock.assetId?.asset_name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="inline-flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
                          <Warehouse className="h-4 w-4 text-primary" />
                          {stock.warehouseId?.warehouse_name || 'Unknown Warehouse'}
                        </div>
                        {(() => {
                          const whId = stock.warehouseId?._id || stock.warehouseId;
                          const fullWh = warehouses.find(w => w._id === whId) || stock.warehouseId;
                          const stId = fullWh?.stationId?._id || fullWh?.stationId;
                          const fullSt = stations.find(s => s._id === stId) || fullWh?.stationId;
                          const divId = fullSt?.divisionId?._id || fullSt?.divisionId;
                          const fullDiv = divisions.find(d => d._id === divId) || fullSt?.divisionId;
                          
                          if (fullDiv?.division_name || fullSt?.station_name) {
                            return (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                {fullDiv?.division_name && <span>{fullDiv.division_name}</span>}
                                {fullDiv?.division_name && fullSt?.station_name && <span className="text-slate-300">/</span>}
                                {fullSt?.station_name && <span>{fullSt.station_name}</span>}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </TableCell>

                    {/* Current Stock */}
                    <TableCell className="text-right py-3">
                      <span className={`text-2xl font-black tracking-tight ${isLowStock ? "text-rose-600" : "text-slate-800"}`}>
                        {(stock.quantity || 0).toLocaleString()}
                      </span>
                    </TableCell>

                    {/* Last Sync */}
                    <TableCell className="text-left pr-8 py-3">
                      <div className="flex flex-col items-start justify-center gap-0.5">
                        <span className="text-xs font-semibold text-slate-700">
                          {new Date(stock.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          {new Date(stock.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
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
        divisions={divisions}
        stations={stations}
        onSuccess={fetchData}
      />
      
      <WarehouseSummaryDialog
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        stocks={stocks}
        warehouses={warehouses}
        stations={stations}
        divisions={divisions}
      />
    </div>
  )
}