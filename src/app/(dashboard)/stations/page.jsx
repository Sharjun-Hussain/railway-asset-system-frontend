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
import { PermissionGate } from "@/components/auth/PermissionGate"

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
        <PermissionGate module="station" action="manage">
          <Button
            onClick={handleAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Station
          </Button>
        </PermissionGate>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Total Stations */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Total Stations</p>
              <p className="text-4xl font-semibold text-slate-800">{stations.length}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Active Stations */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Active Stations</p>
              <p className="text-4xl font-semibold text-slate-800">{stations.filter(s => s.is_active !== false).length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 3 - Inactive Stations */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-50/30 group-hover:bg-slate-100/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Inactive Stations</p>
              <p className="text-4xl font-semibold text-slate-800">{stations.filter(s => s.is_active === false).length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-500">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-4">
        
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or station code..."
            className="pl-10 h-10 w-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-full text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full lg:w-auto gap-2">
          {/* Division Filter */}
          <div className="w-full lg:w-[220px] relative">
            <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId}>
              <SelectTrigger className="w-full h-10 bg-white border border-slate-200 hover:border-slate-300 shadow-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary text-sm font-medium transition-all">
                <div className="flex items-center text-slate-600 truncate">
                  <Filter className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                  <SelectValue placeholder="All Divisions" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="font-semibold py-2">All Divisions</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division._id} value={division._id} className="py-2 font-medium">
                    {division.division_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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