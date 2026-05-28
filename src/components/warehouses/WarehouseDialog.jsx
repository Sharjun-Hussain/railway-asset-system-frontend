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
import { Switch } from "@/components/ui/switch"

const WAREHOUSE_TYPES = ["Mechanical", "Signal", "Stationery", "General"]

export function WarehouseDialog({ open, onOpenChange, warehouse, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [stations, setStations] = useState([])
  const [formData, setFormData] = useState({
    warehouse_type: "General",
    stationId: "",
    description: "",
    is_active: true
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
        description: warehouse.description || "",
        is_active: warehouse.is_active !== undefined ? warehouse.is_active : true
      })
    } else {
      setFormData({
        warehouse_name: "",
        warehouse_type: "General",
        stationId: "",
        description: "",
        is_active: true
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
                <Label htmlFor="warehouse_name">Warehouse Name</Label>
                <Input
                    id="warehouse_name"
                    placeholder="e.g. Mechanical Store A"
                    className=""
                    value={formData.warehouse_name}
                    onChange={(e) => setFormData({ ...formData, warehouse_name: e.target.value })}
                    required
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="warehouse_type" className="">Type</Label>
                  <Select 
                    value={formData.warehouse_type} 
                    onValueChange={(value) => setFormData({ ...formData, warehouse_type: value })}
                  >
                    <SelectTrigger className={"w-full"}>
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
                  <Label htmlFor="stationId">Station</Label>
                  <Select 
                    value={formData.stationId} 
                    onValueChange={(value) => setFormData({ ...formData, stationId: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional details about this warehouse..."
                className=""
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
              formData.is_active 
                ? "bg-emerald-50/50 border-emerald-200 border-solid" 
                : "bg-slate-50 border-slate-200 border-dashed"
            }`}>
               <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="is_active" className="text-sm font-bold">Active Status</Label>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                      formData.is_active 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-400 text-white"
                    }`}>
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {formData.is_active 
                      ? "This warehouse is visible and active globally." 
                      : "This warehouse is hidden and restricted."}
                  </p>
               </div>
               <Switch 
                  id="is_active" 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-emerald-500"
               />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-lg shadow-primary/20">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
