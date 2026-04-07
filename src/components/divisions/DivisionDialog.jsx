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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import axios from "axios"

export function DivisionDialog({ open, onOpenChange, division, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    division_name: "",
    region: "",
    is_active: true
  })

  const isEdit = !!division

  useEffect(() => {
    if (division) {
      setFormData({
        division_name: division.division_name || "",
        region: division.region || "",
        is_active: division.is_active !== undefined ? division.is_active : true
      })
    } else {
      setFormData({
        division_name: "",
        region: "",
        is_active: true
      })
    }
  }, [division, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit) {
        await axios.put(`/api/divisions/${division._id}`, formData)
        toast.success("Division updated successfully")
      } else {
        await axios.post("/api/divisions", formData)
        toast.success("Division created successfully")
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
            <DialogTitle>{isEdit ? "Edit Division" : "Add Division"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Update the details of the selected railway division." 
                : "Create a new railway division for the system."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="division_name">Division Name</Label>
              <Input
                id="division_name"
                placeholder="e.g. Colombo Division"
                value={formData.division_name}
                onChange={(e) => setFormData({ ...formData, division_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Region / Province</Label>
              <Input
                id="region"
                placeholder="e.g. Western Province"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                required
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
                      {formData.is_active ? "Live" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {formData.is_active 
                      ? "This division is visible and active globally." 
                      : "This division is hidden and restricted."}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Division"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
