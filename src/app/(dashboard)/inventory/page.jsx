"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  Warehouse, 
  ArrowRightLeft, 
  Download, 
  Upload 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial display
  useEffect(() => {
    const mockInventory = [
      { id: "1", product: "Class S12 Engine", code: "ENG-S12", warehouse: "Fort Mechanical", quantity: 5, minLevel: 2, unit: "pcs" },
      { id: "2", product: "Brake Pad Type-B", code: "BRK-B-500", warehouse: "Maradana Signal", quantity: 150, minLevel: 100, unit: "pcs" },
      { id: "3", product: "Signal Lamp LED", code: "SIG-LED-100", warehouse: "Jaffna General", quantity: 12, minLevel: 20, unit: "pcs" },
    ];
    setInventory(mockInventory);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock Inventory</h2>
          <p className="text-muted-foreground">Monitor real-time stock levels across regional warehouses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowRightLeft className="h-4 w-4" /> Transfer
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Receive Stock
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.product}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.code}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-3 w-3 text-muted-foreground" />
                        <span>{item.warehouse}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity <= item.minLevel ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-600">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
