"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { History, Search, Box, AlertTriangle } from "lucide-react"

export function AdjustmentForm({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [currentStock, setCurrentStock] = useState(null)

  const [formData, setFormData] = useState({
    assetId: "",
    warehouseId: "",
    quantity: 0,
    remarks: "",
    type: "ADJUST"
  })

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  // Fetch current stock when asset or warehouse changes
  useEffect(() => {
    if (formData.assetId && formData.warehouseId) {
      fetchCurrentStock()
    }
  }, [formData.assetId, formData.warehouseId])

  const fetchData = async () => {
    try {
      const [assetsRes, warehousesRes] = await Promise.all([
        apiClient.get("/assets"),
        apiClient.get("/warehouses")
      ])
      setAssets(assetsRes.data?.data || assetsRes.data || [])
      setWarehouses(warehousesRes.data?.data || warehousesRes.data || [])
    } catch (error) {
      toast.error("Failed to fetch reference data")
    }
  }

  const fetchCurrentStock = async () => {
    try {
      const response = await apiClient.get(`/inventory/asset/${formData.assetId}`)
      const stock = response.data.find(s => s.warehouseId?._id === formData.warehouseId || s.warehouseId === formData.warehouseId)
      setCurrentStock(stock ? stock.quantity : 0)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.quantity === 0) {
       return toast.error("Adjustment quantity cannot be zero")
    }

    setLoading(true)
    try {
      await apiClient.post("/transactions", formData)
      toast.success("Stock adjustment processed")
      setOpen(false)
      if (onSuccess) onSuccess()
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process adjustment")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ assetId: "", warehouseId: "", quantity: 0, remarks: "", type: "ADJUST" })
    setCurrentStock(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
          <History className="h-4 w-4" /> New Adjustment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Manual Stock Adjustment
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Target Warehouse</Label>
              <Select onValueChange={(val) => setFormData({...formData, warehouseId: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(w => (
                    <SelectItem key={w._id} value={w._id}>{w.warehouse_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Asset / Item</Label>
              <Select onValueChange={(val) => setFormData({...formData, assetId: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item to adjust" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map(a => (
                    <SelectItem key={a._id} value={a._id}>{a.asset_name} ({a.qr_code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentStock !== null && (
              <div className="bg-slate-50 p-3 rounded-lg border flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Current System Balance:</span>
                <span className="text-lg font-bold text-primary">{currentStock} Units</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-xs font-bold uppercase text-slate-500">
                Adjustment Value (+ to add, - to subtract)
              </Label>
              <Input 
                id="quantity" 
                type="number" 
                step="0.01" 
                placeholder="e.g. -5 or 12" 
                required 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
              />
              <p className="text-[10px] text-muted-foreground italic">
                 New balance will be: {currentStock !== null ? currentStock + (formData.quantity || 0) : "?"} Units
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="remarks" className="text-xs font-bold uppercase text-slate-500">Reason for Adjustment</Label>
              <Textarea 
                id="remarks" 
                placeholder="e.g. Damage found during audit, lost item found etc." 
                className="resize-none" 
                required
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700">
              {loading ? "Processing..." : "Complete Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
