"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
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
import { History, AlertTriangle } from "lucide-react"
import { useRBAC } from "@/hooks/useRBAC"

export function AdjustmentForm({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, isSuperAdmin, hasRole } = useRBAC()

  const [assets, setAssets] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [divisions, setDivisions] = useState([])
  const [stations, setStations] = useState([])
  const [currentStock, setCurrentStock] = useState(null)

  const [formData, setFormData] = useState({
    assetId: "",
    warehouseId: "",
    quantity: 0,
    remarks: "",
    type: "ADJUST"
  })

  const [selectedDivisionId, setSelectedDivisionId] = useState("")
  const [selectedStationId, setSelectedStationId] = useState("")

  const isStationMaster = hasRole("Station Master")
  const isWarehouseStaff = hasRole("Warehouse Manager") || hasRole("Warehouse Staff")

  useEffect(() => {
    if (open) {
      fetchData()
      resetForm()
      
      // Auto-set constraints based on roles
      if (isStationMaster) {
        setSelectedStationId(user?.stationId?._id || user?.stationId || "")
      }
      if (isWarehouseStaff && user?.warehouseIds?.length > 0) {
        setFormData(prev => ({ ...prev, warehouseId: user.warehouseIds[0]?._id || user.warehouseIds[0] || "" }))
      }
    }
  }, [open, isStationMaster, isWarehouseStaff, user])

  useEffect(() => {
    if (formData.assetId && formData.warehouseId) {
      fetchCurrentStock()
    } else {
      setCurrentStock(null)
    }
  }, [formData.assetId, formData.warehouseId])

  const fetchData = async () => {
    try {
      const [assetsRes, warehousesRes, divRes, statRes] = await Promise.all([
        apiClient.get("/assets"),
        apiClient.get("/warehouses"),
        apiClient.get("/divisions"),
        apiClient.get("/stations")
      ])
      setAssets(assetsRes.data?.data || assetsRes.data || [])
      setWarehouses(warehousesRes.data?.data || warehousesRes.data || [])
      setDivisions(divRes.data?.data || divRes.data || [])
      setStations(statRes.data?.data || statRes.data || [])
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
    setSelectedDivisionId("")
    setSelectedStationId("")
    setCurrentStock(null)
  }

  // Filter Logic
  const filteredStations = stations?.filter(s => !selectedDivisionId || s.divisionId === selectedDivisionId || s.divisionId?._id === selectedDivisionId) || []

  const filteredWarehouses = warehouses?.filter(w => {
    if (isWarehouseStaff) {
      const userWhIds = user?.warehouseIds?.map(wh => wh._id || wh) || []
      return userWhIds.includes(w._id)
    }
    if (isStationMaster || selectedStationId) {
      const stationIdToFilter = isStationMaster ? (user?.stationId?._id || user?.stationId) : selectedStationId
      return w.stationId === stationIdToFilter || w.stationId?._id === stationIdToFilter
    }
    if (selectedDivisionId) {
      const divStations = stations?.filter(s => s.divisionId === selectedDivisionId || s.divisionId?._id === selectedDivisionId).map(s => s._id) || []
      return divStations.includes(w.stationId?._id || w.stationId)
    }
    return true
  }) || []

  // Combobox Options Maps
  const productOptions = assets.map(p => ({
    value: p._id,
    label: `${p.asset_name} (${p.qr_code || 'NO-QR'})`
  }))

  const divisionOptions = divisions?.map(d => ({
    value: d._id,
    label: d.division_name
  })) || []

  const stationOptions = filteredStations?.map(s => ({
    value: s._id,
    label: s.station_name
  })) || []

  const warehouseOptions = filteredWarehouses?.map(w => ({
    value: w._id,
    label: w.warehouse_name
  })) || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 h-11 rounded-xl px-5 font-semibold text-[14px]">
          <History className="h-[18px] w-[18px]" /> New Adjustment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto scrollbar-tiny">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" /> Manual Stock Adjustment
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            
            {/* Super Admin Hierarchical Locators */}
            {isSuperAdmin && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Division Filter</Label>
                  <Combobox
                    options={divisionOptions}
                    value={selectedDivisionId}
                    onChange={(val) => {
                      setSelectedDivisionId(val)
                      setSelectedStationId("")
                      setFormData({ ...formData, warehouseId: "" })
                    }}
                    placeholder="All Divisions"
                    emptyText="No divisions."
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase text-slate-500">Station Filter</Label>
                  <Combobox
                    options={stationOptions}
                    value={selectedStationId}
                    onChange={(val) => {
                      setSelectedStationId(val)
                      setFormData({ ...formData, warehouseId: "" })
                    }}
                    placeholder={selectedDivisionId ? "All Stations" : "Select division first..."}
                    emptyText="No stations."
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Asset / Item</Label>
                <Combobox
                  options={productOptions}
                  value={formData.assetId}
                  onChange={(val) => setFormData({ ...formData, assetId: val })}
                  placeholder="Search and select asset..."
                  emptyText="No asset found."
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Target Warehouse</Label>
                <Combobox
                  options={warehouseOptions}
                  value={formData.warehouseId}
                  onChange={(val) => setFormData({ ...formData, warehouseId: val })}
                  placeholder={isWarehouseStaff ? "Locked to your location" : "Select warehouse"}
                  emptyText="No warehouse found."
                />
              </div>
            </div>

            {currentStock !== null && (
              <div className="bg-slate-50 p-4 rounded-xl border flex items-center justify-between shadow-inner">
                <span className="text-sm font-medium text-slate-600">Current System Balance:</span>
                <span className="text-2xl font-black text-primary tracking-tight">{currentStock} Units</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-xs font-bold uppercase text-slate-500">
                Adjustment Value (+ to add, - to subtract)
              </Label>
              <Input 
                id="quantity" 
                type="number" 
                step="1" 
                placeholder="e.g. -5 or 12" 
                required 
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value, 10) || 0})}
              />
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                 New balance will be: <span className="font-bold text-slate-700">{currentStock !== null ? currentStock + (formData.quantity || 0) : "?"} Units</span>
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
            <Button type="submit" disabled={loading || !formData.assetId || !formData.warehouseId}>
              {loading ? "Processing..." : "Complete Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
