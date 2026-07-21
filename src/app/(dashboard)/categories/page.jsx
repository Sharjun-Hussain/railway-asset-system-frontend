"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Plus,
  LayoutDashboard,
  Layers,
  Search,
  Filter,
  FolderTree
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { CategoryTable } from "@/components/categories/CategoryTable"
import { CategoryDialog } from "@/components/categories/CategoryDialog"
import { SubCategoryTable } from "@/components/categories/SubCategoryTable"
import { SubCategoryDialog } from "@/components/categories/SubCategoryDialog"
import { Card, CardContent } from "@/components/ui/card"
import apiClient from "@/lib/api"
import { PermissionGate } from "@/components/auth/PermissionGate"

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("categories")
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [catDialogOpen, setCatDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [catRes, subRes] = await Promise.all([
        apiClient.get("/categories"),
        apiClient.get("/subcategories")
      ])

      setCategories(Array.isArray(catRes.data) ? catRes.data : [])
      setSubCategories(Array.isArray(subRes.data) ? subRes.data : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setCategories([])
      setSubCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredCategories = categories.filter(c =>
    c.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSubCategories = subCategories.filter(s =>
    s.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.categoryId?.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <FolderTree className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Categories</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage main classifications and sub-categories for your inventory
            </p>
          </div>
        </div>
        <PermissionGate module="product" action="manage">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all"
            onClick={() => {
              if (activeTab === "categories") {
                setSelectedCategory(null)
                setCatDialogOpen(true)
              } else {
                setSelectedSubCategory(null)
                setSubDialogOpen(true)
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab === "categories" ? "Category" : "Sub-Category"}
          </Button>
        </PermissionGate>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 - Main Categories */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Main Categories</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-semibold text-slate-800">
                  {categories.filter(c => c.is_active !== false).length}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Sub Categories */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Sub Categories</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-semibold text-slate-800">
                  {subCategories.filter(s => s.is_active !== false).length}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <Layers className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs Selection & Toolbar */}
      <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>

        {/* Unified Pill Toolbar */}
        <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
          <TabsList className="bg-slate-50/80 p-1 rounded-xl h-12 w-full md:w-auto grid grid-cols-2 md:flex">
            <TabsTrigger
              value="categories"
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full text-sm data-[state=active]:text-primary transition-all"
            >
              Main Categories
            </TabsTrigger>
            <TabsTrigger
              value="subcategories"
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full text-sm data-[state=active]:text-primary transition-all"
            >
              Sub-Categories
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-11 h-12 bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[14.5px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl bg-slate-50/50 border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all shrink-0">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Tab Content Wrapper */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
          <TabsContent value="categories" className="mt-0 outline-none">
            {loading ? (
              <TableSkeleton rows={8} columns={4} />
            ) : (
              <CategoryTable
                categories={filteredCategories}
                onEdit={(cat) => {
                  setSelectedCategory(cat)
                  setCatDialogOpen(true)
                }}
                onDeleteSuccess={fetchData}
              />
            )}
          </TabsContent>

          <TabsContent value="subcategories" className="mt-0 outline-none">
            {loading ? (
              <TableSkeleton rows={8} columns={5} />
            ) : (
              <SubCategoryTable
                subCategories={filteredSubCategories}
                onEdit={(sub) => {
                  setSelectedSubCategory(sub)
                  setSubDialogOpen(true)
                }}
                onDeleteSuccess={fetchData}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Dialogs */}
      <CategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={selectedCategory}
        onSuccess={fetchData}
      />

      <SubCategoryDialog
        open={subDialogOpen}
        onOpenChange={setSubDialogOpen}
        subCategory={selectedSubCategory}
        categories={categories}
        onSuccess={fetchData}
      />
    </div>
  )
}