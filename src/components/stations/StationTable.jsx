"use client"

import React, { useState } from "react"
import { TableSkeleton } from "@/components/ui/table-skeleton"
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
  Navigation,
  Train,
  Building2
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

export function StationTable({ stations, onEdit, onDeleteSuccess, loading }) {
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/stations/${deleteId}`)
      toast.success("Station deleted successfully")
      onDeleteSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete station")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return <div className="mt-4"><TableSkeleton rows={5} columns={5} /></div>
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px]">
        <Train className="h-10 w-10 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No Stations Found</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
          There are no railway stations registered in the system yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-600 text-sm py-3 w-[120px] pl-6">Code</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Station Name</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Division</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Region</TableHead>
              <TableHead className="font-semibold text-slate-600 text-sm py-3">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 text-sm py-3 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station._id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell className="py-4 pl-6">
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 font-mono">
                    {station.station_code}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Train size={16} />
                    </div>
                    <span className="font-bold text-slate-700">{station.station_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Building2 className="h-3.5 w-3.5" />
                    {station.divisionId?.division_name || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                   <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {station.divisionId?.region || "N/A"}
                   </span>
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    station.is_active 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {station.is_active ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(station)}>
                        <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit Station
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setDeleteId(station._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Station
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
              This action cannot be undone. This will permanently delete the station and remove its data from our servers.
              Note that stations with linked warehouses or users cannot be deleted.
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
