"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Plus, LayoutDashboard, Layers, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryTable } from "@/components/categories/CategoryTable"
import { CategoryDialog } from "@/components/categories/CategoryDialog"
import { SubCategoryTable } from "@/components/categories/SubCategoryTable"
import { SubCategoryDialog } from "@/components/categories/SubCategoryDialog"
import { Card, CardContent } from "@/components/ui/card"
import apiClient from "@/lib/api"

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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Asset Categories</h1>
          <p className="text-slate-500 font-medium">Manage main categories and sub-categories for centralized inventory.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6 h-11 rounded-xl"
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
          <Plus className="mr-2 h-5 w-5" /> 
          Add {activeTab === "categories" ? "Category" : "Sub-Category"}
        </Button>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Active Categories</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-800">{categories.filter(c => c.is_active !== false).length}</h3>
                  <span className="text-slate-400 text-sm font-bold">/ {categories.length} total</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <LayoutDashboard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Active Sub-Categories</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-800">{subCategories.filter(s => s.is_active !== false).length}</h3>
                  <span className="text-slate-400 text-sm font-bold">/ {subCategories.length} total</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Selection */}
      <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 w-fit">
            <TabsTrigger value="categories" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
              Main Categories
            </TabsTrigger>
            <TabsTrigger value="subcategories" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
              Sub-Categories
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder={`Search ${activeTab}...`}
                className="pl-10 h-10 bg-white border-slate-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-10 w-10 p-0 rounded-xl bg-white border-slate-200">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>

        <TabsContent value="categories" className="mt-0 outline-none">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
              Loading Categories...
            </div>
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
            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
              Loading Sub-Categories...
            </div>
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
