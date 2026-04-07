"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileEdit, Trash2 } from "lucide-react"
import { toast } from "sonner"
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
import { Badge } from "@/components/ui/badge"
import apiClient from "@/lib/api"

export function SubCategoryTable({ subCategories, onEdit, onDeleteSuccess }) {
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      await apiClient.delete(`/subcategories/${deleteId}`)
      toast.success("Sub-category deleted successfully")
      onDeleteSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete sub-category")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[80px] font-bold text-slate-500">#</TableHead>
              <TableHead className="font-bold text-slate-500">Sub-Category Name</TableHead>
              <TableHead className="font-bold text-slate-500">Parent Category</TableHead>
              <TableHead className="font-bold text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No sub-categories found.
                </TableCell>
              </TableRow>
            ) : (
              subCategories.map((sub, index) => (
                <TableRow key={sub._id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="font-medium text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">
                    {sub.sub_category_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                        {sub.categoryId?.category_name || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(sub)}>
                          <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit Sub
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600" 
                          onClick={() => setDeleteId(sub._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Sub
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sub-category. This action cannot be undone and 
              will fail if the sub-category is linked to active products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }} 
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Sub-Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
