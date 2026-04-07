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

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`)
      ])
      
      const prodData = await prodRes.json()
      const catData = await catRes.json()
      
      setProducts(prodData)
      setCategories(catData)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load product catalog")
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${deleteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete product")
      }

      toast.success("Product definition deleted successfully")
      fetchData()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.qr_code?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Product Catalog</h1>
          <p className="text-slate-500 font-medium">Manage standardized asset definitions for Sri Lanka Railways.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6 h-11 rounded-xl"
          onClick={() => {
            setSelectedProduct(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-5 w-5" /> Add Master Product
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Definitions</p>
                <h3 className="text-4xl font-black text-slate-800">{products.length}</h3>
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
        <div className="flex flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search products by name or identification code..."
              className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-xl bg-white border-slate-200 shadow-sm shrink-0">
            <Filter className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                <TableHead className="w-[120px] font-bold text-slate-500 py-5">IDENTIFIER</TableHead>
                <TableHead className="font-bold text-slate-500">PRODUCT NAME</TableHead>
                <TableHead className="font-bold text-slate-500">CLASSIFICATION</TableHead>
                <TableHead className="font-bold text-slate-500">UNIT</TableHead>
                <TableHead className="text-right font-bold text-slate-500">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">
                    Loading product catalog...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">
                    No products found in catalog.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} className="hover:bg-slate-50/30 transition-colors border-b last:border-0 group">
                    <TableCell className="font-mono text-xs font-bold text-slate-400 py-4">
                      {product.qr_code || "N/A"}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 min-w-[200px]">
                      {product.product_name}
                      {product.description && (
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1 max-w-[300px]">
                            {product.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit bg-slate-50 text-slate-600 border-slate-200 text-[10px] font-bold py-0">
                            {product.categoryId?.category_name}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-medium ml-1">
                            {product.subCategoryId?.sub_category_name || "Uncategorized"}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-none font-bold text-[10px] uppercase">
                        {product.unit}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-slate-100">
                          <DropdownMenuItem className="cursor-pointer font-bold text-sm" onClick={() => {
                              setSelectedProduct(product)
                              setDialogOpen(true)
                          }}>
                            <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 font-bold text-sm" onClick={() => setDeleteId(product._id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Product
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
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-800">Delete Product Definition?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium pt-2">
              This action strictly removes the <span className="font-bold text-slate-700">centralized definition</span>. 
              Historical data associated with this item may become inaccessible.
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
              {deleting ? "System Processing..." : "Delete Master Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        categories={categories}
        onSuccess={fetchData}
      />
    </div>
  )
}
