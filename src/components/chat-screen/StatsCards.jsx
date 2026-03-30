import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Warehouse, History, AlertTriangle } from "lucide-react";

export function StatCards() {
  const stats = [
    {
      title: "Active Products",
      value: "1,284",
      description: "+12 from last month",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Low Stock Items",
      value: "24",
      description: "Needs attention",
      icon: AlertTriangle,
      color: "text-amber-600",
    },
    {
      title: "Recent Moves",
      value: "142",
      description: "Last 7 days",
      icon: History,
      color: "text-emerald-600",
    },
    {
      title: "Storage Points",
      value: "15",
      description: "Active warehouses",
      icon: Warehouse,
      color: "text-slate-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

