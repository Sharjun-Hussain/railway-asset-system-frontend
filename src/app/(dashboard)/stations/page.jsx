"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Search,
  TrendingUp,
  Train,
  Plus,
  LayoutGrid,
  Filter,
  MapPin,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { StationTable } from "@/components/stations/StationTable"
import { StationDialog } from "@/components/stations/StationDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function StationsPage() {
  const [stations, setStations] = useState([])
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDivisionId, setSelectedDivisionId] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stationsRes, divisionsRes] = await Promise.all([
        apiClient.get("/stations"),
        apiClient.get("/divisions")
      ])
      setStations(stationsRes.data.data || [])
      setDivisions(divisionsRes.data.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load station management data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredStations = stations.filter((s) => {
    const matchesSearch =
      s.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.station_code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDivision = selectedDivisionId === "all" || s.divisionId?._id === selectedDivisionId

    return matchesSearch && matchesDivision
  })

  const handleEdit = (station) => {
    setSelectedStation(station)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedStation(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <Train className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Railway Stations</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage physical station locations and division assignments
            </p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Station
        </Button>
      </div>

      {/* Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Total Stations */}
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Stations</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stations.length}</h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Stations */}
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Active Stations</p>
                <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">
                  {stations.filter(s => s.is_active !== false).length}
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-inner">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Stations */}
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative group rounded-[1.5rem] hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Inactive Stations</p>
                <h3 className="text-4xl font-black text-slate-400 tracking-tighter">
                  {stations.filter(s => s.is_active === false).length}
                </h3>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 shadow-inner">
                <XCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Unified Pill Toolbar (Search & Filter) */}
      <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name or station code..."
            className="pl-12 h-12 w-full bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[14.5px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[260px] relative">
          <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId}>
            <SelectTrigger className="w-full h-12 bg-slate-50/50 border-transparent hover:border-slate-200 shadow-none rounded-xl focus:ring-primary text-[15px]">
              <div className="flex items-center text-slate-600 font-medium">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Divisions" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
              <SelectItem value="all" className="font-semibold py-2.5">All Divisions</SelectItem>
              {divisions.map((division) => (
                <SelectItem key={division._id} value={division._id} className="py-2.5 font-medium">
                  {division.division_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section Wrapper - Elegant & Breathable Container */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Note: Ensure StationTable uses similar internal padding/styling (e.g. py-5, uppercase headers) as the other pages */}
        <StationTable
          stations={filteredStations}
          loading={loading}
          onEdit={handleEdit}
          onDeleteSuccess={fetchData}
        />
      </div>

      <StationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        station={selectedStation}
        onSuccess={fetchData}
      />
    </div>
  )
}