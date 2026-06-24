"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { History, AlertTriangle, ScanLine, X } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";
import { Scanner } from "@yudiel/react-qr-scanner";

export function AdjustmentForm({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const { user, isSuperAdmin, hasRole } = useRBAC();

    const [assets, setAssets] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [stations, setStations] = useState([]);
    const [currentStock, setCurrentStock] = useState(null);

    const [formData, setFormData] = useState({
        assetId: "",
        warehouseId: "",
        quantity: 0,
        remarks: "",
        type: "ADJUST",
    });

    const [selectedDivisionId, setSelectedDivisionId] = useState("");
    const [selectedStationId, setSelectedStationId] = useState("");

    const isStationMaster = hasRole("Station Master");
    const isWarehouseStaff =
        hasRole("Warehouse Manager") || hasRole("Warehouse Staff");

    useEffect(() => {
        if (open) {
            fetchData();
            resetForm();

            // Auto-set constraints based on roles
            if (!isSuperAdmin) {
                setSelectedDivisionId(user?.divisionId?._id || user?.divisionId || "");
                setSelectedStationId(user?.stationId?._id || user?.stationId || "");
            }
            if (isWarehouseStaff && user?.warehouseIds?.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    warehouseId: user.warehouseIds[0]?._id || user.warehouseIds[0] || "",
                }));
            }
        }
    }, [open, isStationMaster, isWarehouseStaff, user]);

    useEffect(() => {
        if (formData.assetId && formData.warehouseId) {
            fetchCurrentStock();
        } else {
            setCurrentStock(null);
        }
    }, [formData.assetId, formData.warehouseId]);

    const fetchData = async () => {
        try {
            const results = await Promise.allSettled([
                apiClient.get("/assets"),
                apiClient.get("/warehouses"),
                apiClient.get("/divisions"),
                apiClient.get("/stations"),
            ]);

            const getResultData = (result) =>
                result.status === "fulfilled" ? result.value.data : [];

            const assetsData = getResultData(results[0]);
            const whData = getResultData(results[1]);
            const divData = getResultData(results[2]);
            const statData = getResultData(results[3]);

            setAssets(assetsData?.data || assetsData || []);
            setWarehouses(whData?.data || whData || []);
            setDivisions(divData?.data || divData || []);
            setStations(statData?.data || statData || []);
        } catch (error) {
            toast.error("Failed to fetch reference data");
        }
    };

    const fetchCurrentStock = async () => {
        try {
            const response = await apiClient.get(
                `/inventory/asset/${formData.assetId}`,
            );
            const stock = response.data.find(
                (s) =>
                    s.warehouseId?._id === formData.warehouseId ||
                    s.warehouseId === formData.warehouseId,
            );
            setCurrentStock(stock ? stock.quantity : 0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.quantity === 0) {
            return toast.error("Adjustment quantity cannot be zero");
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                referenceNo: `ADJ-${Date.now()}`,
            };
            await apiClient.post("/transactions", payload);
            toast.success("Stock adjustment processed");
            setOpen(false);
            if (onSuccess) onSuccess();
            resetForm();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to process adjustment",
            );
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            assetId: "",
            warehouseId: "",
            quantity: 0,
            remarks: "",
            type: "ADJUST",
        });
        setSelectedDivisionId("");
        setSelectedStationId("");
        setCurrentStock(null);
    };

    // Filter Logic
    const filteredStations =
        stations?.filter(
            (s) =>
                !selectedDivisionId ||
                s.divisionId === selectedDivisionId ||
                s.divisionId?._id === selectedDivisionId,
        ) || [];

    const filteredWarehouses =
        warehouses?.filter((w) => {
            if (isWarehouseStaff) {
                const userWhIds = user?.warehouseIds?.map((wh) => wh._id || wh) || [];
                return userWhIds.includes(w._id);
            }
            if (isStationMaster || selectedStationId) {
                const stationIdToFilter = isStationMaster
                    ? user?.stationId?._id || user?.stationId
                    : selectedStationId;
                return (
                    w.stationId === stationIdToFilter ||
                    w.stationId?._id === stationIdToFilter
                );
            }
            if (selectedDivisionId) {
                const divStations =
                    stations
                        ?.filter(
                            (s) =>
                                s.divisionId === selectedDivisionId ||
                                s.divisionId?._id === selectedDivisionId,
                        )
                        .map((s) => s._id) || [];
                return divStations.includes(w.stationId?._id || w.stationId);
            }
            return true;
        }) || [];

    // Combobox Options Maps
    const productOptions = assets.map((p) => ({
        value: p._id,
        label: `${p.asset_name} (${p.qr_code || "NO-QR"})`,
    }));

    const divisionOptions =
        divisions?.map((d) => ({
            value: d._id,
            label: d.division_name,
        })) || [];

    const stationOptions =
        filteredStations?.map((s) => ({
            value: s._id,
            label: s.station_name,
        })) || [];

    const warehouseOptions =
        filteredWarehouses?.map((w) => ({
            value: w._id,
            label: w.warehouse_name,
        })) || [];

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
                            <AlertTriangle className="h-5 w-5 text-amber-600" /> Manual Stock
                            Adjustment
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        {/* Hierarchical Locators - Disabled for non-admins */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">
                                    Division Filter
                                </Label>
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
                                <Label className="text-xs font-bold uppercase text-slate-500">
                                    Station Filter
                                </Label>
                                <Combobox
                                    options={stationOptions}
                                    value={selectedStationId}
                                    onChange={(val) => {
                                        setSelectedStationId(val);
                                        setFormData({ ...formData, warehouseId: "" });
                                    }}
                                    placeholder={
                                        selectedDivisionId
                                            ? "All Stations"
                                            : "Select division first..."
                                    }
                                    emptyText="No stations."
                                    disabled={!isSuperAdmin}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">
                                    Asset / Item
                                </Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Combobox
                                            options={productOptions}
                                            value={formData.assetId}
                                            onChange={(val) =>
                                                setFormData({ ...formData, assetId: val })
                                            }
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

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">
                                    Target Warehouse
                                </Label>
                                <Combobox
                                    options={warehouseOptions}
                                    value={formData.warehouseId}
                                    onChange={(val) =>
                                        setFormData({ ...formData, warehouseId: val })
                                    }
                                    placeholder={
                                        isWarehouseStaff
                                            ? "Locked to your location"
                                            : "Select warehouse"
                                    }
                                    emptyText="No warehouse found."
                                />
                            </div>
                        </div>

                        {currentStock !== null && (
                            <div className="bg-slate-50 p-4 rounded-xl border flex items-center justify-between shadow-inner">
                                <span className="text-sm font-medium text-slate-600">
                                    Current System Balance:
                                </span>
                                <span className="text-2xl font-black text-primary tracking-tight">
                                    {currentStock} Units
                                </span>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label
                                htmlFor="quantity"
                                className="text-xs font-bold uppercase text-slate-500"
                            >
                                Adjustment Value (+ to add, - to subtract)
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="1"
                                placeholder="e.g. -5 or 12"
                                required
                                value={formData.quantity}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        quantity: parseInt(e.target.value, 10) || 0,
                                    })
                                }
                            />
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                                New balance will be:{" "}
                                <span className="font-bold text-slate-700">
                                    {currentStock !== null
                                        ? currentStock + (formData.quantity || 0)
                                        : "?"}{" "}
                                    Units
                                </span>
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="remarks"
                                className="text-xs font-bold uppercase text-slate-500"
                            >
                                Reason for Adjustment
                            </Label>
                            <Textarea
                                id="remarks"
                                placeholder="e.g. Damage found during audit, lost item found etc."
                                className="resize-none"
                                required
                                value={formData.remarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.assetId || !formData.warehouseId}
                            className="w-full sm:w-auto"
                        >
                            {loading ? "Processing..." : "Complete Adjustment"}
                        </Button>
                    </DialogFooter>
                </form>

                {isScanning && (
                    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
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
                            <div className="w-full max-w-sm aspect-square overflow-hidden rounded-2xl border-4 border-amber-500/50 relative">
                                <Scanner
                                    onScan={(result) => {
                                        if (result && result.length > 0) {
                                            const scannedValue = result[0].rawValue;
                                            const matchedAsset = assets.find(
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
                        <div className="p-6 text-center text-white/70 text-sm">
                            Position the QR code within the frame to automatically scan and
                            select the asset.
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
