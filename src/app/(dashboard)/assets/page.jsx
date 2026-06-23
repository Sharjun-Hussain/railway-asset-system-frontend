"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileEdit,
  Trash2,
  Package,
  Layers,
  LayoutDashboard,
  Printer,
  QrCode,
  Box
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ProductDialog } from "@/components/products/ProductDialog"
import { AssetQRCode } from "@/components/products/AssetQRCode"
import apiClient from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { PermissionGate } from "@/components/auth/PermissionGate"


export default function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [qrAsset, setQrAsset] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [assetRes, catRes] = await Promise.all([
        apiClient.get("/assets"),
        apiClient.get("/categories"),
      ])

      setAssets(Array.isArray(assetRes.data) ? assetRes.data : [])
      setCategories(Array.isArray(catRes.data) ? catRes.data : [])
    } catch (error) {
      console.error("Error fetching assets:", error)
      toast.error("Failed to load asset catalog")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      await apiClient.delete(`/assets/${deleteId}`)
      toast.success("Asset definition removed successfully")
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove asset")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredAssets = assets.filter(a => {
    const matchesSearch =
      (a.asset_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.qr_code || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "ALL" || a.categoryId === selectedCategory || a.categoryId?._id === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Calculate unique standard units
  const uniqueUnits = new Set(assets.map(a => a.unit).filter(Boolean)).size || 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Inventory Catalog</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage standardized asset definitions for the Smart Asset Management System
            </p>
          </div>
        </div>
        <PermissionGate module="product" action="manage">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-5 h-10 rounded-lg transition-all"
            onClick={() => {
              setSelectedAsset(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Register New Asset
          </Button>
        </PermissionGate>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Total Assets */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Total Assets</p>
              <p className="text-4xl font-semibold text-slate-800">{assets.length}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <Box className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Categories */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Categories</p>
              <p className="text-4xl font-semibold text-slate-800">{categories.length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 3 - Standard Units */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-50/30 group-hover:bg-amber-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Standard Units</p>
              <p className="text-4xl font-semibold text-slate-800">{uniqueUnits < 10 ? `0${uniqueUnits}` : uniqueUnits}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-500">
              <Layers className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar - Unified Pill Design */}
      <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search assets by name or code..."
            className="pl-12 h-12 w-full bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[15px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[260px] relative">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full h-12 bg-slate-50/50 border-transparent hover:border-slate-200 shadow-none rounded-xl focus:ring-primary text-[15px]">
              <div className="flex items-center text-slate-600 font-medium">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
              <SelectItem value="ALL" className="font-semibold py-2.5">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id} className="py-2.5 font-medium">
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Master Table Section - Elegant & Breathable */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm text-slate-500 font-semibold animate-pulse tracking-wide">Syncing Asset Catalog...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                <TableHead className="w-[380px] font-bold text-slate-500 text-xs tracking-wider pl-8 py-4">Asset Details</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4">Category</TableHead>
                <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4">Sub Category</TableHead>
                <TableHead className="w-[120px] font-bold text-slate-500 text-xs tracking-wider text-center py-4">Unit</TableHead>
                <TableHead className="w-[100px] font-bold text-slate-500 text-xs tracking-wider text-right pr-8 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-500 text-lg">No assets match your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((asset) => (
                  <TableRow key={asset._id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0">

                    {/* Asset Details - Beautiful Hover state to open QR */}
                    <TableCell className="pl-8 py-5">
                      <button
                        className="flex flex-col gap-1.5 max-w-[340px] text-left focus:outline-none group/btn w-full"
                        onClick={() => setQrAsset(asset)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[15px] font-bold text-slate-900 group-hover/btn:text-primary group-hover/btn:underline decoration-primary/30 underline-offset-4 transition-all truncate">
                            {asset.asset_name}
                          </span>
                          {asset.qr_code && (
                            <QrCode className="h-4 w-4 text-slate-300 group-hover/btn:text-primary transition-colors shrink-0" />
                          )}
                        </div>
                        {asset.description ? (
                          <span className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {asset.description}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400 italic">No detailed description</span>
                        )}
                      </button>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-5">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-semibold px-3 py-1 text-xs">
                        {asset.categoryId?.category_name || "Uncategorized"}
                      </Badge>
                    </TableCell>

                    {/* Sub Category */}
                    <TableCell className="py-5">
                      {asset.subCategoryId?.sub_category_name ? (
                        <Badge variant="outline" className="text-slate-600 border-slate-200 bg-white font-semibold shadow-sm px-3 py-1 text-xs">
                          {asset.subCategoryId.sub_category_name}
                        </Badge>
                      ) : (
                        <span className="text-slate-300 text-sm font-medium pl-3">-</span>
                      )}
                    </TableCell>

                    {/* Unit */}
                    <TableCell className="text-center py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[11px] font-bold uppercase tracking-widest">
                        {asset.unit || "N/A"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-8 py-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 p-0 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-1.5">
                          <PermissionGate module="product" action="manage">
                            <DropdownMenuItem
                              className="cursor-pointer text-sm font-semibold rounded-xl mb-1 py-2.5 focus:bg-primary/5 focus:text-primary transition-colors"
                              onClick={() => {
                                setSelectedAsset(asset)
                                setDialogOpen(true)
                              }}
                            >
                              <FileEdit className="mr-2.5 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-700 rounded-xl py-2.5 transition-colors"
                              onClick={() => setDeleteId(asset._id)}
                            >
                              <Trash2 className="mr-2.5 h-4 w-4" /> Delete Asset
                            </DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">Remove Asset Definition?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 pt-2 leading-relaxed">
              This action strictly removes the <strong className="text-slate-700">centralized definition</strong>.
              Any existing inventory records tied to this asset must be cleared beforehand.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2 sm:gap-0">
            <AlertDialogCancel disabled={deleting} className="rounded-xl border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-sm"
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Confirm Removal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Register/Edit Asset Modal Component */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={selectedAsset}
        categories={categories}
        onSuccess={fetchData}
      />

      {/* Unified Compact Premium QR Preview Sheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr, #printable-qr * {
            visibility: visible;
          }
          #printable-qr {
            position: fixed !important;
            left: 50% !important;
            top: 50px !important;
            transform: translateX(-50%) !important;
            width: 200px !important;
            height: 200px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>

      <Sheet open={!!qrAsset} onOpenChange={(open) => !open && setQrAsset(null)}>
        <SheetContent side="right" className="sm:max-w-[340px] border-l border-slate-200 shadow-2xl p-0 flex flex-col bg-white text-slate-900 overflow-hidden print-hide-close-btn [&>button]:text-slate-400 [&>button]:hover:text-slate-900 [&>button]:hover:bg-slate-100 [&>button]:right-4 [&>button]:top-5 [&>button]:z-50 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:transition-all [&>button]:print:hidden">

          {/* Header */}
          <SheetHeader className="p-5 pb-4 bg-gradient-to-b from-indigo-50/50 via-white to-transparent relative border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl ring-1 ring-slate-200 shadow-sm">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Asset Passport</SheetTitle>
                <SheetDescription className="text-slate-500 font-medium text-xs">
                  Digital Identity Label
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 flex flex-col items-center px-5 py-4 overflow-y-auto relative z-10 bg-slate-50/30">
            
            {/* Title & Badge */}
            <div className="w-full text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2.5 line-clamp-2">
                {qrAsset?.asset_name}
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">ID Ref</span>
                <div className="h-3 w-px bg-slate-200"></div>
                <span className="text-primary font-mono text-sm tracking-widest font-bold">
                  {qrAsset?.qr_code || "N/A"}
                </span>
              </div>
            </div>

            {/* Glowing QR Card */}
            <div className="relative group w-full max-w-[200px] mx-auto perspective-1000 mb-6">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-white p-4 rounded-3xl ring-1 ring-slate-200 shadow-md flex items-center justify-center transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
                <div id="printable-qr" className="relative z-10 bg-white rounded-2xl w-full aspect-square flex items-center justify-center">
                  <AssetQRCode value={qrAsset?.qr_code} size={150} className="border-none w-full h-full" />
                </div>
              </div>
            </div>

            {/* Info Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <div className="flex flex-col items-center justify-center bg-white border border-slate-200 shadow-sm p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><Layers className="h-2.5 w-2.5" /> Unit</span>
                <span className="text-slate-700 font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">{qrAsset?.unit || "N/A"}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white border border-slate-200 shadow-sm p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1"><LayoutDashboard className="h-2.5 w-2.5" /> Category</span>
                <span className="text-slate-700 font-semibold text-xs truncate max-w-[100px]">{qrAsset?.categoryId?.category_name || "N/A"}</span>
              </div>
            </div>
            
            {/* Description if available */}
            {qrAsset?.description && (
               <div className="mt-3 w-full bg-white border border-slate-200 shadow-sm p-3 rounded-xl text-center">
                 <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                   "{qrAsset.description}"
                 </p>
               </div>
            )}
          </div>

          {/* Footer Action */}
          <SheetFooter className="print-hide p-4 bg-white border-t border-slate-200 relative z-10 flex flex-row gap-2.5 items-center justify-between">
            <Button
              variant="outline"
              className="w-1/3 rounded-xl border-slate-200 font-semibold h-10 hover:bg-slate-50 text-xs"
              onClick={() => setQrAsset(null)}
            >
              Close
            </Button>
            <Button
              className="w-2/3 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] text-xs"
              onClick={() => window.print()}
            >
              <Printer className="w-3.5 h-3.5 mr-2" />
              Print Label
            </Button>
          </SheetFooter>

        </SheetContent>
      </Sheet>
    </div>
  )
}