"use client";

import React from "react";
import { 
  Train, 
  Activity, 
  Wrench, 
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const METRICS = [
  {
    title: "Total Assets",
    value: "12,450",
    icon: Train,
    color: "primary",
  },
  {
    title: "Operational Status",
    value: "98.2%",
    icon: Activity,
    color: "green",
  },
  {
    title: "Pending Maintenance",
    value: "24",
    icon: Wrench,
    color: "amber",
  },
  {
    title: "Critical Alerts",
    value: "3",
    icon: AlertTriangle,
    color: "red",
  }
];

export function AssetMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {METRICS.map((metric) => (
        <Card key={metric.title} className="border-none shadow-lg rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md group hover:translate-y-[-2px] transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-950/30 text-${metric.color}-600 dark:text-${metric.color}-400 shadow-sm border border-${metric.color}-100 dark:border-${metric.color}-900/50 group-hover:scale-110 transition-transform duration-200`}>
                <metric.icon size={22} strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-muted-foreground/60">{metric.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
