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
  Info,
  Layers,
  LayoutDashboard
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
import apiClient from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"


export default function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [assetRes, catRes, subCatRes, unitRes] = await Promise.all([
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Asset Inventory Catalog</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage standardized asset definitions for the Smart Asset Management System.</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6 h-11 rounded-xl"
          onClick={() => {
            setSelectedAsset(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-5 w-5" /> Register New Asset
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Assets</p>
                <h3 className="text-4xl font-black text-slate-800">{assets.length}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Main Categories</p>
                <h3 className="text-4xl font-black text-slate-800">{categories.length}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <LayoutDashboard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Standard Units</p>
                <h3 className="text-4xl font-black text-slate-800">06</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Master Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search assets by name or master code..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-[220px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-white border-slate-200 shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground font-medium">Synchronizing SAMS asset database...</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                  <TableHead className="w-[120px] font-bold">QR Code</TableHead>
                  <TableHead className="font-bold  ">Description</TableHead>
                  <TableHead className="font-bold ">Category</TableHead>
                  <TableHead className="font-bold ">Sub Category</TableHead>
                  <TableHead className="font-bold ">Unit</TableHead>
                  <TableHead className="text-right font-bold ">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">
                      No active asset definitions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset._id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0 group">
                      <TableCell className="">
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 font-mono">
                          {asset.qr_code || "N/A"}

                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700 min-w-[200px]">
                        {asset.asset_name}
                        {asset.description && (
                          <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1 max-w-[300px]">
                            {asset.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-600 font-medium text-xs">
                            <Badge variant="secondary">{asset.categoryId?.category_name}</Badge>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-600 font-medium text-xs">
                            <Badge variant="secondary">{asset.subCategoryId?.sub_category_name}</Badge>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                          {asset.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-slate-100">
                            <DropdownMenuItem className="cursor-pointer  text-sm" onClick={() => {
                              setSelectedAsset(asset)
                              setDialogOpen(true)
                            }}>
                              <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit Asset
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 text-sm" onClick={() => setDeleteId(asset._id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-800">Remove Asset Definition?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium pt-2">
              This action strictly removes the <span className="font-bold text-slate-700">centralized definition</span>.
              Existing inventory records for this item must be cleared before removal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel disabled={deleting} className="rounded-xl border-slate-200 font-bold text-slate-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700 rounded-xl font-bold px-6 shadow-lg shadow-red-200"
              disabled={deleting}
            >
              {deleting ? "De-registering Asset..." : "Confirm Removal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={selectedAsset}
        categories={categories}
        onSuccess={fetchData}
      />
    </div>
  )
}
