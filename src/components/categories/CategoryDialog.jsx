"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import apiClient from "@/lib/api"

export function CategoryDialog({ open, onOpenChange, category, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    category_name: "",
    is_active: true,
  })

  const isEdit = !!category

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || "",
        is_active: category.is_active !== false,
      })
    } else {
      setFormData({
        category_name: "",
        is_active: true,
      })
    }
  }, [category, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit 
        ? `/categories/${category._id}`
        : `/categories`
      
      const method = isEdit ? "put" : "post"

      const response = await apiClient[method](url, formData)

      toast.success(isEdit ? "Category updated successfully" : "Category registered successfully")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Category" : "Register New Category"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Update the details of your asset category here." 
                : "Create a new high-level category for railway assets."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category_name">Category Name</Label>
              <Input
                id="category_name"
                placeholder="e.g. Mechanical, Signal, Way & Works"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50">
              <div className="space-y-0.5">
                <Label htmlFor="status">Operational Status</Label>
                <p className="text-xs text-muted-foreground">Set if this category is currently active.</p>
              </div>
              <Switch
                id="status"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
