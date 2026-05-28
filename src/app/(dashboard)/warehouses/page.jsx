"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Warehouse,
  Plus,
  Search,
  Box,
  CheckCircle2,
  XCircle,
  Filter,
  MapPin,
  Layers
} from "lucide-react";
import { WarehouseTable } from "@/components/warehouses/WarehouseTable";
import { WarehouseDialog } from "@/components/warehouses/WarehouseDialog";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stationFilter, setStationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [warehousesRes, stationsRes] = await Promise.all([
        apiClient.get("/warehouses"),
        apiClient.get("/stations"),
      ]);
      setWarehouses(warehousesRes.data.data || []);
      setStations(stationsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load warehouses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredWarehouses = warehouses.filter((w) => {
    const matchesSearch = w.warehouse_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStation =
      stationFilter === "all" ||
      w.stationId?._id === stationFilter ||
      w.stationId === stationFilter;
    const matchesType = typeFilter === "all" || w.warehouse_type === typeFilter;
    return matchesSearch && matchesStation && matchesType;
  });

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedWarehouse(null);
    setDialogOpen(true);
  };

  const WAREHOUSE_TYPES = ["Mechanical", "Signal", "Stationery", "General"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-inner shadow-white/20 hidden sm:block">
            <Warehouse className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Railway Warehouses</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Manage specialized inventory storage locations and station-linked stores
            </p>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm font-semibold px-6 h-11 rounded-xl transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Register Warehouse
        </Button>
      </div>

      {/* Ultra-Compact Premium Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Total Warehouses */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Total Warehouses</p>
              <p className="text-4xl font-semibold text-slate-800">{warehouses.length}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-500">
              <Warehouse className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 2 - Active Stores */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Active Stores</p>
              <p className="text-4xl font-semibold text-slate-800">{warehouses.filter((w) => w.is_active !== false).length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        {/* Card 3 - Inactive Stores */}
        <Card className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-50/30 group-hover:bg-slate-100/50 transition-all duration-300" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Inactive Stores</p>
              <p className="text-4xl font-semibold text-slate-800">{warehouses.filter((w) => w.is_active === false).length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-slate-500">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Unified Pill Toolbar (Search & Filters) */}
      <div className="bg-white p-2 rounded-[1.25rem] border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-2 items-center">

        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search warehouse name..."
            className="pl-12 h-12 w-full bg-slate-50/50 border-transparent hover:border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl text-[14.5px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full lg:w-auto gap-2">
          {/* Station Filter */}
          <div className="w-full lg:w-[220px] relative">
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger className="w-full h-12 bg-slate-50/50 border-transparent hover:border-slate-200 shadow-none rounded-xl focus:ring-primary text-[15px]">
                <div className="flex items-center text-slate-600 font-medium truncate">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  <SelectValue placeholder="All Stations" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="font-semibold py-2.5">All Stations</SelectItem>
                {stations.map((station) => (
                  <SelectItem key={station._id} value={station._id} className="py-2.5 font-medium">
                    {station.station_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-full lg:w-[200px] relative">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full h-12 bg-slate-50/50 border-transparent hover:border-slate-200 shadow-none rounded-xl focus:ring-primary text-[15px]">
                <div className="flex items-center text-slate-600 font-medium truncate">
                  <Layers className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="font-semibold py-2.5">All Types</SelectItem>
                {WAREHOUSE_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="py-2.5 font-medium">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      {/* Table Section Wrapper - Elegant & Breathable Container */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Note: Ensure WarehouseTable uses similar internal padding/styling (e.g. py-5, uppercase headers) as the other pages */}
        <WarehouseTable
          warehouses={filteredWarehouses}
          loading={loading}
          onEdit={handleEdit}
          onDeleteSuccess={fetchData}
        />
      </div>

      <WarehouseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        warehouse={selectedWarehouse}
        onSuccess={fetchData}
      />
    </div>
  );
}