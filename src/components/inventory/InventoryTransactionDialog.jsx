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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import apiClient from "@/lib/api"

export function InventoryTransactionDialog({ open, onOpenChange, products, warehouses, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "RECEIVE",
    assetId: "",
    warehouseId: "",
    toWarehouseId: "",
    quantity: 0,
    referenceNo: "",
    remarks: "",
  })

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setFormData({
        type: "RECEIVE",
        assetId: "",
        warehouseId: "",
        toWarehouseId: "",
        quantity: 0,
        referenceNo: "",
        remarks: "",
      })
    }
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.post("/inventory/transaction", formData)
      toast.success("Inventory transaction processed successfully")
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Process Asset Transaction</DialogTitle>
            <DialogDescription>
              Record a stock movement within the Smart Asset Management System.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Transaction Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEIVE">Stock In (Receive Assets)</SelectItem>
                  <SelectItem value="ISSUE">Stock Out (Issue Assets)</SelectItem>
                  <SelectItem value="TRANSFER">Internal Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Asset Item</Label>
              <Select 
                value={formData.assetId} 
                onValueChange={(value) => setFormData({ ...formData, assetId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.asset_name} ({p.qr_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>{formData.type === "TRANSFER" ? "Source Location" : "Location"}</Label>
                    <Select 
                        value={formData.warehouseId} 
                        onValueChange={(value) => setFormData({ ...formData, warehouseId: value })}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                        {warehouses.map((w) => (
                            <SelectItem key={w._id} value={w._id}>
                            {w.warehouse_name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                {formData.type === "TRANSFER" && (
                    <div className="grid gap-2 animate-in slide-in-from-right-2 duration-300">
                        <Label>Target Location</Label>
                        <Select 
                            value={formData.toWarehouseId} 
                            onValueChange={(value) => setFormData({ ...formData, toWarehouseId: value })}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                            {warehouses.map((w) => (
                                <SelectItem key={w._id} value={w._id}>
                                {w.warehouse_name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                 <div className={`grid gap-2 ${formData.type !== "TRANSFER" ? "col-span-1" : "col-span-2"}`}>
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div className="grid gap-2">
              <Label>Reference No. / PO / MRN</Label>
              <Input
                placeholder="e.g. PO-2024-001"
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Special Remarks</Label>
              <Input
                placeholder="Optional notes about the transaction..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Complete Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
