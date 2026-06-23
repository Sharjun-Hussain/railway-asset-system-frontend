"use client"

import React, { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"
import apiClient from "@/lib/api"

const UNITS = ["pcs", "kg", "meters", "liters", "units", "sets"]

export function ProductDialog({ open, onOpenChange, asset, categories, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState([])
  const [formData, setFormData] = useState({
    asset_name: "",
    qr_code: "",
    unit: "pcs",
    categoryId: "",
    subCategoryId: "",
    description: "",
  })

  const isEdit = !!asset

  useEffect(() => {
    if (asset) {
      setFormData({
        asset_name: asset.asset_name || "",
        qr_code: asset.qr_code || "",
        unit: asset.unit || "pcs",
        categoryId: asset.categoryId?._id || asset.categoryId || "",
        subCategoryId: asset.subCategoryId?._id || asset.subCategoryId || "",
        description: asset.description || "",
      })
    } else {
      setFormData({
        asset_name: "",
        qr_code: "",
        unit: "pcs",
        categoryId: "",
        subCategoryId: "",
        description: "",
      })
    }
  }, [asset, open])

  // Fetch sub-categories when categoryId changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!formData.categoryId) {
        setSubCategories([])
        return
      }
      try {
        const response = await apiClient.get(`/subcategories?categoryId=${formData.categoryId}`)
        setSubCategories(response.data)
      } catch (err) {
        console.error("Error fetching subcategories:", err)
      }
    }
    fetchSubCategories()
  }, [formData.categoryId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit 
        ? `/assets/${asset._id}`
        : `/assets`
      
      const method = isEdit ? "put" : "post"

      await apiClient[method](url, formData)

      toast.success(isEdit ? "Asset updated successfully" : "Asset registered successfully")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl border-l-slate-100 shadow-2xl p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
            <SheetTitle className="text-2xl font-black text-slate-800 tracking-tight">
              {isEdit ? "Edit Asset Definition" : "Register New Asset"}
            </SheetTitle>
            <SheetDescription className="text-slate-500 font-medium pt-1">
              {isEdit 
                ? "Update the master definition of this railway asset." 
                : "Define a new item in the centralized SAMS asset catalog."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="asset_name">
                  Asset Name / Title
                </Label>
                <Input
                  id="asset_name"
                  placeholder="e.g. 50kg Rail Piece, Signal Relay X"
                  value={formData.asset_name}
                  onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="qr_code">
                    QR Code
                  </Label>
                  <Input
                    id="qr_code"
                    placeholder="e.g. QR-MECH-001"
                    value={formData.qr_code}
                    onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">
                    Unit of Measure
                  </Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">
                    Main Category
                  </Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value, subCategoryId: "" })}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subCategoryId">
                    Sub-Category
                  </Label>
                  <Select 
                    value={formData.subCategoryId} 
                    onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((sub) => (
                        <SelectItem key={sub._id} value={sub._id}>
                          {sub.sub_category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2 pt-2">
                <Label htmlFor="description">
                  Technical Specifications
                </Label>
                <Textarea
                  id="description"
                  placeholder="Optional specifications, dimensions, or usage notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className=""
                />
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-slate-50 bg-slate-50/30 flex-row justify-end items-center gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="font-bold text-slate-400 hover:text-slate-600 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
            >
              {loading ? "Registering..." : isEdit ? "Save Definition" : "Register Asset"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
