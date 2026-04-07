"use client"

import React, { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import apiClient from "@/lib/api"

const WAREHOUSE_TYPES = ["Mechanical", "Signal", "Stationery", "General"]

export function WarehouseDialog({ open, onOpenChange, warehouse, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [stations, setStations] = useState([])
  const [formData, setFormData] = useState({
    warehouse_name: "",
    warehouse_type: "General",
    stationId: "",
    description: ""
  })

  const isEdit = !!warehouse

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await apiClient.get("/stations")
        setStations(response.data.data || [])
      } catch (err) {
        console.error("Failed to load stations:", err)
      }
    }
    if (open) fetchStations()
  }, [open])

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse_name: warehouse.warehouse_name || "",
        warehouse_type: warehouse.warehouse_type || "General",
        stationId: warehouse.stationId?._id || warehouse.stationId || "",
        description: warehouse.description || ""
      })
    } else {
      setFormData({
        warehouse_name: "",
        warehouse_type: "General",
        stationId: "",
        description: ""
      })
    }
  }, [warehouse, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await apiClient.put(`/warehouses/${warehouse._id}`, formData)
        toast.success("Warehouse updated successfully")
      } else {
        await apiClient.post("/warehouses", formData)
        toast.success("Warehouse created successfully")
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{isEdit ? "Edit Warehouse" : "Register Warehouse"}</DialogTitle>
            <DialogDescription className="text-sm font-medium">
              {isEdit 
                ? "Update the configuration and details of this warehouse." 
                : "Add a new specialized warehouse to the railway network."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="warehouse_name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Warehouse Name</Label>
                <Input
                    id="warehouse_name"
                    placeholder="e.g. Mechanical Store A"
                    className="h-11 rounded-xl bg-slate-50 border-slate-200"
                    value={formData.warehouse_name}
                    onChange={(e) => setFormData({ ...formData, warehouse_name: e.target.value })}
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="warehouse_type" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</Label>
                  <Select 
                    value={formData.warehouse_type} 
                    onValueChange={(value) => setFormData({ ...formData, warehouse_type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WAREHOUSE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="stationId" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Station</Label>
                  <Select 
                    value={formData.stationId} 
                    onValueChange={(value) => setFormData({ ...formData, stationId: value })}
                    required
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station._id} value={station._id}>
                          {station.station_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional details about this warehouse..."
                className="rounded-xl bg-slate-50 border-slate-200 min-h-[80px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 rounded-xl font-bold px-6 shadow-lg shadow-primary/20">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
