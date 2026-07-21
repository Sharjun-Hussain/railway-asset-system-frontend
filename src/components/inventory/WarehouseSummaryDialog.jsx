"use client"

import React, { useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { MapPin, Warehouse, Building2, LayoutDashboard } from "lucide-react"

export function WarehouseSummaryDialog({ open, onOpenChange, stocks, warehouses, stations, divisions }) {
  
  const summaryData = useMemo(() => {
    const summaryMap = {}

    stocks.forEach(stock => {
      const whIdObj = stock.warehouseId
      const whId = whIdObj?._id || whIdObj
      if (!whId) return

      if (!summaryMap[whId]) {
        // Resolve full objects
        const fullWh = warehouses.find(w => w._id === whId) || whIdObj
        const whName = fullWh?.warehouse_name || "Unknown Warehouse"

        const stId = fullWh?.stationId?._id || fullWh?.stationId
        const fullSt = stations.find(s => s._id === stId) || fullWh?.stationId
        const stName = fullSt?.station_name || "Unknown Station"

        const divId = fullSt?.divisionId?._id || fullSt?.divisionId
        const fullDiv = divisions.find(d => d._id === divId) || fullSt?.divisionId
        const divName = fullDiv?.division_name || "Unknown Division"

        summaryMap[whId] = {
          warehouseId: whId,
          warehouseName: whName,
          stationName: stName,
          divisionName: divName,
          totalQty: 0,
          skus: new Set()
        }
      }

      summaryMap[whId].totalQty += (stock.quantity || 0)
      if (stock.assetId) {
        summaryMap[whId].skus.add(stock.assetId._id || stock.assetId)
      }
    })

    return Object.values(summaryMap).sort((a, b) => a.divisionName.localeCompare(b.divisionName) || a.warehouseName.localeCompare(b.warehouseName))
  }, [stocks, warehouses, stations, divisions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-4xl md:max-w-5xl max-h-[85vh] flex flex-col rounded-[2rem] gap-0 p-0 overflow-hidden shadow-2xl border-0">
        <div className="p-8 border-b border-slate-100 bg-white z-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 tracking-tight text-slate-900">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              Global Warehouse Stock Summary
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium pt-1 text-[15px]">
              A complete bird's eye view of inventory distribution across all locations.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="rounded-2xl border border-slate-200/70 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 pl-6 uppercase">Division</TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 uppercase">Station</TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs tracking-wider py-4 uppercase">Warehouse</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 text-xs tracking-wider py-4 uppercase">Total SKUs</TableHead>
                  <TableHead className="text-right font-bold text-slate-500 text-xs tracking-wider py-4 pr-6 uppercase">Total Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-40 text-slate-500 font-medium">
                      No stock data available to summarize.
                    </TableCell>
                  </TableRow>
                ) : (
                  summaryData.map((row) => (
                    <TableRow key={row.warehouseId} className="hover:bg-indigo-50/30 transition-colors border-b border-slate-100 last:border-0">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          {row.divisionName}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {row.stationName}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2.5 text-[15px] font-bold text-slate-900">
                          <Warehouse className="h-4 w-4 text-indigo-500" />
                          {row.warehouseName}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200/60">
                          {row.skus.size}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-4">
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          {row.totalQty.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
