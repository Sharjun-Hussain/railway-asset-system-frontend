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

export function StationDialog({ open, onOpenChange, station, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [divisions, setDivisions] = useState([])
  const [formData, setFormData] = useState({
    station_code: "",
    divisionId: "",
    address: "",
    is_active: true
  })

  const isEdit = !!station

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await apiClient.get("/divisions")
        setDivisions(response.data.data || [])
      } catch (err) {
        console.error("Failed to load divisions:", err)
      }
    }
    if (open) fetchDivisions()
  }, [open])

  useEffect(() => {
    if (station) {
      setFormData({
        station_name: station.station_name || "",
        station_code: station.station_code || "",
        divisionId: station.divisionId?._id || station.divisionId || "",
        address: station.address || "",
        is_active: station.is_active !== undefined ? station.is_active : true
      })
    } else {
      setFormData({
        station_name: "",
        station_code: "",
        divisionId: "",
        address: "",
        is_active: true
      })
    }
  }, [station, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await apiClient.put(`/stations/${station._id}`, formData)
        toast.success("Station updated successfully")
      } else {
        await apiClient.post("/stations", formData)
        toast.success("Station created successfully")
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Station" : "Add Station"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Update the details of the selected railway station." 
                : "Create a new railway station for the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="station_name">Station Name</Label>
                    <Input
                        id="station_name"
                        placeholder="e.g. Fort"
                        value={formData.station_name}
                        onChange={(e) => setFormData({ ...formData, station_name: e.target.value })}
                        required
                    />
                </div>
               
            </div>
            
            <div className="grid grid-cols-2 gap-2">
             <div className="grid gap-2">
               <Label htmlFor="divisionId">Division</Label>
              <Select 
                value={formData.divisionId} 
                onValueChange={(value) => setFormData({ ...formData, divisionId: value })}
                required
              >
                <SelectTrigger className={"w-full"}>
                  <SelectValue placeholder="Select a division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((division) => (
                    <SelectItem key={division._id} value={division._id}>
                      {division.division_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
             </div>

              <div className="grid gap-2">
                    <Label htmlFor="station_code">Station Code</Label>
                    <Input
                        id="station_code"
                        placeholder="e.g. FOT"
                        value={formData.station_code}
                        onChange={(e) => setFormData({ ...formData, station_code: e.target.value.toUpperCase() })}
                        required
                    />
                </div>
            </div>

            

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Station location address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-700">Station Status</Label>
                    <p className="text-[11px] font-medium text-muted-foreground">Toggle to set station as active or inactive</p>
                </div>
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Station"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
