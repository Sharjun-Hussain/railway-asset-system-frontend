"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Building2
} from "lucide-react"
import { DivisionTable } from "@/components/divisions/DivisionTable"
import { DivisionDialog } from "@/components/divisions/DivisionDialog"
import { Card, CardContent } from "@/components/ui/card"
import apiClient from "@/lib/api"
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
      const response = await apiClient.get("/divisions")
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Railway Divisions</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage administrative regions and organizational hierarchies
            </p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Division
        </Button>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Total Divisions */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Total Divisions</p>
              <p className="text-4xl font-semibold text-slate-800">{divisions.length}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <Building className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Active Divisions */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Active Divisions</p>
              <p className="text-4xl font-semibold text-slate-800">{divisions.filter(d => d.is_active !== false).length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 3 - Inactive Divisions */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-50/30 group-hover:bg-slate-100/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Inactive Divisions</p>
              <p className="text-4xl font-semibold text-slate-800">{divisions.filter(d => d.is_active === false).length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-500">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Compact Search Toolbar */}
      <div className="flex w-full items-center justify-end">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Filter divisions by name or region..."
            className="pl-10 h-10 w-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-full text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section Wrapper - Elegant & Breathable Container */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Note: Ensure DivisionTable uses similar internal padding/styling (e.g. py-5, uppercase headers) as the other pages */}
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