"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { ScanLine, X } from "lucide-react";
import apiClient from "@/lib/api";
import { useRBAC } from "@/hooks/useRBAC";
import { Scanner } from "@yudiel/react-qr-scanner";

export function InventoryTransactionDialog({
  open,
  onOpenChange,
  products = [],
  warehouses = [],
  divisions = [],
  stations = [],
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { user, isSuperAdmin, hasRole } = useRBAC();

  const [formData, setFormData] = useState({
    type: "RECEIVE",
    assetId: "",
    warehouseId: "",
    toWarehouseId: "",
    quantity: 0,
    referenceNo: "",
    remarks: "",
  });

  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedStationId, setSelectedStationId] = useState("");

  const isStationMaster = hasRole("Station Master");
  const isWarehouseStaff = hasRole("Warehouse Manager") || hasRole("Warehouse Staff");

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
      });
      setSelectedDivisionId("");
      setSelectedStationId("");

      if (!isSuperAdmin) {
        setSelectedDivisionId(user?.divisionId?._id || user?.divisionId || "");
        setSelectedStationId(user?.stationId?._id || user?.stationId || "");
      }
      if (isWarehouseStaff && user?.warehouseIds?.length > 0) {
        const defaultWhId = user.warehouseIds[0]?._id || user.warehouseIds[0] || "";
        setFormData((prev) => ({
          ...prev,
          warehouseId: defaultWhId,
        }));
      }
    }
  }, [open, isStationMaster, isWarehouseStaff, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up payload for Mongoose ObjectId casting
      const payload = { ...formData };
      if (payload.type !== "TRANSFER") {
        delete payload.toWarehouseId;
      }
      if (!payload.toWarehouseId) {
        delete payload.toWarehouseId; // ensure empty strings are removed even if TRANSFER
      }

      await apiClient.post("/transactions", payload);
      toast.success("Inventory transaction processed successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredStations = stations?.filter((s) => !selectedDivisionId || s.divisionId === selectedDivisionId || s.divisionId?._id === selectedDivisionId) || [];

  const filteredWarehouses = warehouses?.filter((w) => {
    if (isWarehouseStaff) {
      const userWhIds = user?.warehouseIds?.map((wh) => wh._id || wh) || [];
      return userWhIds.includes(w._id);
    }
    if (isStationMaster || selectedStationId) {
      const stationIdToFilter = isStationMaster ? (user?.stationId?._id || user?.stationId) : selectedStationId;
      return w.stationId === stationIdToFilter || w.stationId?._id === stationIdToFilter;
    }
    if (selectedDivisionId) {
      const divStations = stations?.filter((s) => s.divisionId === selectedDivisionId || s.divisionId?._id === selectedDivisionId).map((s) => s._id) || [];
      return divStations.includes(w.stationId?._id || w.stationId);
    }
    return true;
  }) || [];

  // Options mapping
  const productOptions = products.map((p) => ({
    value: p._id,
    label: `${p.asset_name} (${p.qr_code || 'NO-QR'})`,
  }));

  const divisionOptions = divisions?.map((d) => ({
    value: d._id,
    label: d.division_name,
  })) || [];

  const stationOptions = filteredStations?.map((s) => ({
    value: s._id,
    label: s.station_name,
  })) || [];

  const warehouseOptions = filteredWarehouses?.map((w) => ({
    value: w._id,
    label: w.warehouse_name,
  })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Process Asset Transaction</DialogTitle>
            <DialogDescription>
              Record a stock movement within the Smart Asset Management System.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label>Transaction Type <span className="text-rose-500">*</span></Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value, toWarehouseId: "" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEIVE">
                    Stock In (Receive Assets)
                  </SelectItem>
                  <SelectItem value="ISSUE">
                    Stock Out (Issue Assets)
                  </SelectItem>
                  {/* <SelectItem value="TRANSFER">Internal Transfer</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Asset Item <span className="text-rose-500">*</span></Label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Combobox
                    options={productOptions}
                    value={formData.assetId}
                    onChange={(val) => setFormData({ ...formData, assetId: val })}
                    placeholder="Search and select asset..."
                    emptyText="No asset found."
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => setIsScanning(true)}
                >
                  <ScanLine className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hierarchical Location Selection - Disabled for non-admins */}
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div className="grid gap-2">
                <Label>Division Filter</Label>
                <Combobox
                  options={divisionOptions}
                  value={selectedDivisionId}
                  onChange={(val) => {
                    setSelectedDivisionId(val);
                    setSelectedStationId("");
                    setFormData({ ...formData, warehouseId: "" });
                  }}
                  placeholder="All Divisions"
                  emptyText="No divisions."
                  disabled={!isSuperAdmin}
                />
              </div>
              <div className="grid gap-2">
                <Label>Station Filter</Label>
                <Combobox
                  options={stationOptions}
                  value={selectedStationId}
                  onChange={(val) => {
                    setSelectedStationId(val);
                    setFormData({ ...formData, warehouseId: "" });
                  }}
                  placeholder={selectedDivisionId ? "All Stations" : "Select division first..."}
                  emptyText="No stations."
                  disabled={!isSuperAdmin}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  {formData.type === "TRANSFER"
                    ? "Source Location"
                    : "Location"} <span className="text-rose-500">*</span>
                </Label>
                <Combobox
                  options={warehouseOptions}
                  value={formData.warehouseId}
                  onChange={(val) => setFormData({ ...formData, warehouseId: val })}
                  placeholder={isWarehouseStaff ? "Locked to your location" : "Select warehouse"}
                  emptyText="No warehouse found."
                />
              </div>

              {formData.type === "TRANSFER" && (
                <div className="grid gap-2 animate-in slide-in-from-right-2 duration-300">
                  <Label>Target Location <span className="text-rose-500">*</span></Label>
                  <Combobox
                    options={warehouses.map(w => ({ value: w._id, label: w.warehouse_name }))} // Internal transfers can typically go to any warehouse globally
                    value={formData.toWarehouseId}
                    onChange={(val) => setFormData({ ...formData, toWarehouseId: val })}
                    placeholder="Select target warehouse"
                    emptyText="No warehouse found."
                  />
                </div>
              )}

              <div
                className={`grid gap-2 ${formData.type !== "TRANSFER" ? "col-span-1" : "col-span-2"}`}
              >
                <Label>Quantity <span className="text-rose-500">*</span></Label>
                <Input
                  type="number"
                  placeholder="0"
                  step="1"
                  value={formData.quantity === 0 ? "" : formData.quantity}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFormData({
                      ...formData,
                      quantity: isNaN(val) ? 0 : Math.max(0, val),
                    });
                  }}
                  required
                  min={1}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Reference No. / PO / MRN <span className="text-rose-500">*</span></Label>
              <Input
                placeholder="e.g. PO-2024-001"
                value={formData.referenceNo}
                onChange={(e) =>
                  setFormData({ ...formData, referenceNo: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Special Remarks</Label>
              <Input
                placeholder="Optional notes about the transaction..."
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.assetId || !formData.warehouseId}>
              {loading ? "Processing..." : "Complete Transaction"}
            </Button>
          </DialogFooter>
        </form>

        {isScanning && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
            <div className="flex items-center justify-between p-4 bg-black/50 text-white">
              <h3 className="font-semibold text-lg">Scan Asset QR Code</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsScanning(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-sm aspect-square overflow-hidden rounded-2xl border-4 border-primary/50 relative">
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0) {
                      const scannedValue = result[0].rawValue;
                      const matchedAsset = products.find(
                        (a) => a.qr_code === scannedValue,
                      );
                      if (matchedAsset) {
                        setFormData({ ...formData, assetId: matchedAsset._id });
                        toast.success(
                          `Asset identified: ${matchedAsset.asset_name}`,
                        );
                        setIsScanning(false);
                      } else {
                        toast.error(`No asset found for QR: ${scannedValue}`);
                      }
                    }
                  }}
                  onError={(error) => {
                    console.error("Scanner Error:", error);
                  }}
                  formats={[
                    "qr_code",
                    "code_128",
                    "code_39",
                    "ean_13",
                    "ean_8",
                  ]}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { objectFit: "cover" },
                  }}
                />
              </div>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

