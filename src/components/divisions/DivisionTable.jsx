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
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  MapPin, 
  Calendar 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

export function DivisionTable({ divisions, onEdit, onDeleteSuccess, loading }) {
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/divisions/${deleteId}`)
      toast.success("Division deleted successfully")
      onDeleteSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete division")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading divisions...</p>
        </div>
      </div>
    )
  }

  if (!divisions || divisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-200">
        <MapPin className="h-10 w-10 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Divisions Found</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
          There are no railway divisions registered in the system yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Division Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {divisions.map((division) => (
              <TableRow key={division._id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-semibold py-3 border-b-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full shadow-sm ${division.is_active ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="text-slate-700">{division.division_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {division.region}
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {new Date(division.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    division.is_active 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {division.is_active ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(division)}>
                        <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => setDeleteId(division._id)}>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the division and remove its data from our servers.
              Note that divisions with linked stations cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
