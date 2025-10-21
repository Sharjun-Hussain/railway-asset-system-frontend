// app/(dashboard)/components/StatCards.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, Users } from "lucide-react";

// TODO: Fetch this data
const stats = [
  { title: "Total Assets", value: "1,250", icon: Package, change: "+12.5%" },
  { title: "Warehouses", value: "15", icon: Warehouse, change: "Active" },
  { title: "Active Users", value: "89", icon: Users, change: "+5" },
];

export function StatCards() {
  return (
    // Changed from "grid" to "flex flex-col" to stack the cards vertically
    <div className="flex flex-col gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
