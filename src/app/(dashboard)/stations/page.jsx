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
  MapPin
} from "lucide-react"
import { StationTable } from "@/components/stations/StationTable"
import { StationDialog } from "@/components/stations/StationDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
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
        axios.get("/api/stations"),
        axios.get("/api/divisions")
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
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Railway Stations</h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage physical station locations and division assignments.
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 px-6 rounded-xl font-bold">
          <Plus className="h-5 w-5" /> Add New Station
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Train className="h-20 w-20" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-primary-foreground/80 font-semibold text-sm mb-1">Total Stations</p>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black">{stations.length}</h3>
               <div className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full mb-1 font-medium">
                  <TrendingUp className="h-3 w-3" /> +2
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                  <Building2 className="h-5 w-5" />
               </div>
               <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold">Divisions</Badge>
            </div>
            <p className="text-muted-foreground font-semibold text-sm mb-1">Unique Divisions</p>
            <h3 className="text-2xl font-black text-slate-800">
               {divisions.length}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <MapPin className="h-5 w-5" />
               </div>
               <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold">Scope</Badge>
            </div>
            <p className="text-muted-foreground font-semibold text-sm mb-1">Coverage</p>
            <h3 className="text-2xl font-black text-slate-800">National</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp className="h-5 w-5" />
               </div>
               <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold">Growth</Badge>
            </div>
            <p className="text-muted-foreground font-semibold text-sm mb-1">New Stations</p>
            <h3 className="text-2xl font-black text-slate-800">6.2% </h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or station code..."
              className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-primary shadow-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="w-full md:w-[200px]">
                <Select value={selectedDivisionId} onValueChange={setSelectedDivisionId}>
                  <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="All Divisions" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {divisions.map((division) => (
                      <SelectItem key={division._id} value={division._id}>
                        {division.division_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <Button variant="outline" className="h-12 w-12 shrink-0 rounded-xl bg-white border-slate-200">
                <LayoutGrid className="h-5 w-5 text-slate-500" />
             </Button>
          </div>
        </div>

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
