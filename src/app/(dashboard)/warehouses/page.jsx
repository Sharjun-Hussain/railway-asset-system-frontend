"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Warehouse, 
  MapPin, 
  Plus, 
  Search, 
  Layers, 
  Box,
  LayoutGrid
} from "lucide-react"
import { WarehouseTable } from "@/components/warehouses/WarehouseTable"
import { WarehouseDialog } from "@/components/warehouses/WarehouseDialog"
import { Card, CardContent } from "@/components/ui/card"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([])
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [stationFilter, setStationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [warehousesRes, stationsRes] = await Promise.all([
        apiClient.get("/warehouses"),
        apiClient.get("/stations")
      ])
      setWarehouses(warehousesRes.data.data || [])
      setStations(stationsRes.data.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load warehouses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredWarehouses = warehouses.filter((w) => {
    const matchesSearch = w.warehouse_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStation = stationFilter === "all" || w.stationId?._id === stationFilter || w.stationId === stationFilter
    const matchesType = typeFilter === "all" || w.warehouse_type === typeFilter
    return matchesSearch && matchesStation && matchesType
  })

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedWarehouse(null)
    setDialogOpen(true)
  }

  const WAREHOUSE_TYPES = ["Mechanical", "Signal", "Stationery", "General"]

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Railway Warehouses</h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage specialized inventory storage locations and station-linked stores.
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 px-6 rounded-xl font-bold">
          <Plus className="h-5 w-5" /> Register Warehouse
        </Button>
      </div>

      {/* Stats Cards - Compact Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Warehouses */}
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group h-full">
          <div className="absolute -top-2 -right-2 p-4 opacity-10 group-hover:scale-110 transition-transform duration-300">
            <Warehouse className="h-16 w-16" />
          </div>
          <CardContent className="p-4 relative z-10 flex flex-col justify-end h-full min-h-[110px]">
            <div>
              <p className="text-primary-foreground/80 font-semibold text-xs mb-1">
                Total Warehouses
              </p>
              <h3 className="text-3xl font-black leading-none">{warehouses.length}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Active Warehouses */}
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group h-full">
          <CardContent className="p-4 flex flex-col justify-between h-full min-h-[110px]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Box className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold text-xs mb-1">
                Active Stores
              </p>
              <h3 className="text-2xl font-black text-slate-800 leading-none">
                {warehouses.filter(w => w.is_active !== false).length}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Warehouses */}
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group h-full">
          <CardContent className="p-4 flex flex-col justify-between h-full min-h-[110px]">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                <Warehouse className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold text-xs mb-1">
                Inactive Stores
              </p>
              <h3 className="text-2xl font-black text-slate-800 leading-none">
                {warehouses.filter(w => w.is_active === false).length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search warehouse name..."
              className="pl-11  bg-white border-slate-200  focus:ring-primary shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-[180px]">
              <Select value={stationFilter} onValueChange={setStationFilter}>
                <SelectTrigger className="w-full bg-white border-slate-200 text-slate-700">
                  <SelectValue placeholder="All Stations" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="">All Stations</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station._id} value={station._id} className="">
                      {station.station_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[180px]">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="  bg-white border-slate-200  text-slate-700 w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="">All Types</SelectItem>
                  {WAREHOUSE_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="font-bold">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <WarehouseTable 
          warehouses={filteredWarehouses} 
          loading={loading}
          onEdit={handleEdit}
          onDeleteSuccess={fetchData}
        />
      </div>

      <WarehouseDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        warehouse={selectedWarehouse}
        onSuccess={fetchData}
      />
    </div>
  )
}
