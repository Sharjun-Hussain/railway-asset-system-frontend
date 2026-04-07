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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import apiClient from "@/lib/api"

export function SubCategoryDialog({ open, onOpenChange, subCategory, categories, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sub_category_name: "",
    categoryId: "",
    is_active: true,
  })

  const isEdit = !!subCategory

  useEffect(() => {
    if (subCategory) {
      setFormData({
        sub_category_name: subCategory.sub_category_name || "",
        categoryId: subCategory.categoryId?._id || subCategory.categoryId || "",
        is_active: subCategory.is_active !== false,
      })
    } else {
      setFormData({
        sub_category_name: "",
        categoryId: "",
        is_active: true,
      })
    }
  }, [subCategory, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit 
        ? `/subcategories/${subCategory._id}`
        : `/subcategories`
      
      const method = isEdit ? "put" : "post"

      await apiClient[method](url, formData)

      toast.success(isEdit ? "Sub-category updated successfully" : "Sub-category registered successfully")
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
            <DialogTitle>{isEdit ? "Edit Sub-Category" : "Register New Sub-Category"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Update the details of your asset sub-category." 
                : "Create a new sub-category linked to a main category."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sub_category_name">Sub-Category Name</Label>
              <Input
                id="sub_category_name"
                placeholder="e.g. Locomotives, Signal Relays"
                value={formData.sub_category_name}
                onChange={(e) => setFormData({ ...formData, sub_category_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Main Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select main category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50">
              <div className="space-y-0.5">
                <Label htmlFor="status">Operational Status</Label>
                <p className="text-xs text-muted-foreground">Set if this sub-category is currently active.</p>
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
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Sub-Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
