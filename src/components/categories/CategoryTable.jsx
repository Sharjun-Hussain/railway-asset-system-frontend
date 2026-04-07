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
import apiClient from "@/lib/api"

export function CategoryTable({ categories, onEdit, onDeleteSuccess }) {
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      await apiClient.delete(`/categories/${deleteId}`)
      toast.success("Category deleted successfully")
      onDeleteSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category")
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
              <TableHead className="font-bold text-slate-500">Category Name</TableHead>
              <TableHead className="font-bold text-slate-500">Created At</TableHead>
              <TableHead className="text-right font-bold text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category._id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="font-medium text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700">
                    {category.category_name}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(category)}>
                          <FileEdit className="mr-2 h-4 w-4 text-primary" /> Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600" 
                          onClick={() => setDeleteId(category._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Category
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
              This will permanently delete the category. This action cannot be undone and will 
              fail if the category contains active sub-categories or products.
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
              {deleting ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
