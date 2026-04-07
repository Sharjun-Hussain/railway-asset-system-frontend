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
import axios from "axios"

const REGIONS = ["Colombo", "Kandy", "Jaffna", "Galle", "Anuradhapura", "Trincomalee", "Batticaloa"]

export function DivisionDialog({ open, onOpenChange, division, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    division_name: "",
    region: ""
  })

  const isEdit = !!division

  useEffect(() => {
    if (division) {
      setFormData({
        division_name: division.division_name || "",
        region: division.region || ""
      })
    } else {
      setFormData({
        division_name: "",
        region: ""
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
              <Select 
                value={formData.region} 
                onValueChange={(value) => setFormData({ ...formData, region: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
