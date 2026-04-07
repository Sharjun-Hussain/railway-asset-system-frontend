"use client";

import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import {
  Users,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  Plus,
  Calendar,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total customers",
      value: "567,899",
      trend: "2.5%",
      trendType: "up",
      icon: Users,
    },
    {
      title: "Total revenue",
      value: "$3,465 M",
      trend: "0.5%",
      trendType: "up",
      icon: DollarSign,
    },
    {
      title: "Total orders",
      value: "1,136 M",
      trend: "0.2%",
      trendType: "down",
      icon: ShoppingCart,
    },
    {
      title: "Total returns",
      value: "1,789",
      trend: "0.12%",
      trendType: "up",
      icon: RotateCcw,
    },
  ];

  const countries = [
    { name: "Poland", value: "19%", flag: "🇵🇱" },
    { name: "Austria", value: "15%", flag: "🇦🇹" },
    { name: "Spain", value: "13%", flag: "🇪🇸" },
    { name: "Romania", value: "12%", flag: "🇷🇴" },
    { name: "France", value: "11%", flag: "🇫🇷" },
    { name: "Italy", value: "11%", flag: "🇮🇹" },
    { name: "Germany", value: "10%", flag: "🇩🇪" },
    { name: "Ukraine", value: "9%", flag: "🇺🇦" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border bg-white rounded-xl shadow-sm text-sm font-medium text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Time period: <span className="text-foreground">Last 30 days</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl shadow-sm bg-white"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl shadow-sm bg-white"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <SummaryCard key={stat.title} {...stat} />
        ))}
        <Button
          variant="outline"
          className="h-full min-h-[140px] border-dashed border-2 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-primary hover:bg-primary/5 transition-all"
        >
          <div className="p-2 rounded-lg bg-secondary text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Add data
          </span>
        </Button>
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Bottom Section: Country Sales & Map Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Sales by countries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {countries.map((country) => (
              <div key={country.name} className="flex items-center gap-3">
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm font-bold text-foreground flex-1">
                  {country.name}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  {country.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden bg-white flex items-center justify-center p-10">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Geographic Distribution</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Detailed world map visualization would be here, showing user
                density and sales volume by region.
              </p>
            </div>
            <Button variant="secondary" className="rounded-xl">
              View world map
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
