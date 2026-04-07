"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building, 
  MapPin, 
  Plus, 
  Search, 
  TrendingUp, 
  Users,
  LayoutGrid
} from "lucide-react"
import { DivisionTable } from "@/components/divisions/DivisionTable"
import { DivisionDialog } from "@/components/divisions/DivisionDialog"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { toast } from "sonner"

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState(null)

  const fetchDivisions = async () => {
    setLoading(true)
    try {
      const response = await axios.get("/api/divisions")
      // backend returns { success: true, count: X, data: [...] }
      setDivisions(response.data.data || [])
    } catch (error) {
      console.error("Error fetching divisions:", error)
      toast.error("Failed to load divisions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDivisions()
  }, [])

  const filteredDivisions = divisions.filter((d) => 
    d.division_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (division) => {
    setSelectedDivision(division)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedDivision(null)
    setDialogOpen(true)
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Railway Divisions</h2>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage administrative regions and organizational hierarchies.
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-11 px-6 rounded-xl font-bold">
          <Plus className="h-5 w-5" /> Add New Division
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Building className="h-24 w-24" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-primary-foreground/80 font-bold uppercase tracking-wider text-[10px] mb-1">Total Divisions</p>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black">{divisions.length}</h3>
               <div className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full mb-1">
                  <TrendingUp className="h-3 w-3" /> +1 new
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <MapPin className="h-5 w-5" />
               </div>
               <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold">Regions</Badge>
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] mb-1">Active Regions</p>
            <h3 className="text-2xl font-black text-slate-800">
              {[...new Set(divisions.map(d => d.region))].length}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <LayoutGrid className="h-5 w-5" />
               </div>
               <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold">Status</Badge>
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] mb-1">System Capacity</p>
            <h3 className="text-2xl font-black text-slate-800">100% Active</h3>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Filter by name or region..."
              className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-xl bg-white border-slate-200">
             <LayoutGrid className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <DivisionTable 
          divisions={filteredDivisions} 
          loading={loading}
          onEdit={handleEdit}
          onDeleteSuccess={fetchDivisions}
        />
      </div>

      <DivisionDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        division={selectedDivision}
        onSuccess={fetchDivisions}
      />
    </div>
  )
}

function Badge({ children, className, variant = "default" }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
            {children}
        </span>
    )
}
