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

export function ProductDialog({ open, onOpenChange, product, categories, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState([])
  const [formData, setFormData] = useState({
    product_name: "",
    qr_code: "",
    unit: "pcs",
    categoryId: "",
    subCategoryId: "",
    description: "",
  })

  const isEdit = !!product

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        qr_code: product.qr_code || "",
        unit: product.unit || "pcs",
        categoryId: product.categoryId?._id || product.categoryId || "",
        subCategoryId: product.subCategoryId?._id || product.subCategoryId || "",
        description: product.description || "",
      })
    } else {
      setFormData({
        product_name: "",
        qr_code: "",
        unit: "pcs",
        categoryId: "",
        subCategoryId: "",
        description: "",
      })
    }
  }, [product, open])

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
        ? `/products/${product._id}`
        : `/products`
      
      const method = isEdit ? "put" : "post"

      await apiClient[method](url, formData)

      toast.success(isEdit ? "Product updated successfully" : "Product registered successfully")
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
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Product" : "Register New Product"}</DialogTitle>
            <DialogDescription>
              {isEdit 
                ? "Update the master definition of this railway asset." 
                : "Define a new item in the centralized product catalog."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 col-span-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                        id="product_name"
                        placeholder="e.g. 50kg Rail Piece, Signal Relay X"
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="qr_code">Identification Code (QR)</Label>
                    <Input
                        id="qr_code"
                        placeholder="e.g. QR-MECH-001"
                        value={formData.qr_code}
                        onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="unit">Unit of Measure</Label>
                    <Select 
                        value={formData.unit} 
                        onValueChange={(value) => setFormData({ ...formData, unit: value })}
                        required
                    >
                        <SelectTrigger>
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
                    <Label htmlFor="categoryId">Category</Label>
                    <Select 
                        value={formData.categoryId} 
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value, subCategoryId: "" })}
                        required
                    >
                        <SelectTrigger>
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
                    <Label htmlFor="subCategoryId">Sub-Category</Label>
                    <Select 
                        value={formData.subCategoryId} 
                        onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                        disabled={!formData.categoryId}
                    >
                        <SelectTrigger>
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

            <div className="grid gap-2">
              <Label htmlFor="description">Technical Description</Label>
              <Textarea
                id="description"
                placeholder="Optional specifications, dimensions, or usage notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Register Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
