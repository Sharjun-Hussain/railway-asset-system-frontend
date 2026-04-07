"use client"

import React, { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  Warehouse,
  MapPin,
  Tag
} from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/api"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export function WarehouseTable({ warehouses, onEdit, onDeleteSuccess, loading }) {
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/warehouses/${deleteId}`)
      toast.success("Warehouse deleted successfully")
      onDeleteSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete warehouse")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading warehouses...</p>
        </div>
      </div>
    )
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
        <Warehouse className="h-10 w-10 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Warehouses Found</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs font-medium">
          There are no railway warehouses registered in the system yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[200px] font-bold text-slate-500 py-4">Warehouse Name</TableHead>
              <TableHead className="font-bold text-slate-500">Type</TableHead>
              <TableHead className="font-bold text-slate-500">Station</TableHead>
              <TableHead className="font-bold text-slate-500">Status</TableHead>
              <TableHead className="text-right px-6 font-bold text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse._id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell className="py-4 border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Warehouse size={16} />
                    </div>
                    <span className="font-bold text-slate-700">{warehouse.warehouse_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {warehouse.warehouse_type}
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    {warehouse.stationId?.station_name || "Unknown"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    warehouse.is_active 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {warehouse.is_active ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-slate-100">
                      <DropdownMenuItem className="cursor-pointer font-bold text-sm" onClick={() => onEdit(warehouse)}>
                        <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 font-bold text-sm" onClick={() => setDeleteId(warehouse._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              This action cannot be undone. This will permanently delete the warehouse from the system.
              Note that warehouses with linked stock cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 rounded-xl font-bold shadow-lg shadow-red-200"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
