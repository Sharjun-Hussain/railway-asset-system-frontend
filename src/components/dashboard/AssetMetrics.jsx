"use client";

import React from "react";
import { 
  Train, 
  Activity, 
  Wrench, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const METRICS = [
  {
    title: "Total Assets",
    value: "12,450",
    change: "+21",
    changeType: "up",
    icon: Train,
    color: "primary",
    description: "Active rolling stock & equipment"
  },
  {
    title: "Operational Status",
    value: "98.2%",
    change: "0.5%",
    changeType: "up",
    icon: Activity,
    color: "green",
    description: "System-wide uptime"
  },
  {
    title: "Pending Maintenance",
    value: "24",
    change: "-3",
    changeType: "down",
    icon: Wrench,
    color: "amber",
    description: "Scheduled for this week"
  },
  {
    title: "Critical Alerts",
    value: "3",
    change: "+1",
    changeType: "up",
    icon: AlertTriangle,
    color: "red",
    description: "Immediate action required"
  }
];

export function AssetMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {METRICS.map((metric) => (
        <Card key={metric.title} className="border-none shadow-lg rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md group hover:translate-y-[-2px] transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-950/30 text-${metric.color}-600 dark:text-${metric.color}-400 shadow-sm border border-${metric.color}-100 dark:border-${metric.color}-900/50 group-hover:scale-110 transition-transform duration-200`}>
                <metric.icon size={22} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                metric.changeType === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
              }`}>
                {metric.changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{metric.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{metric.value}</span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mt-2 flex items-center gap-1.5">
                {metric.color === 'red' ? <AlertTriangle size={10} className="text-red-500" /> : <Clock size={10} className="text-muted-foreground/50" />}
                {metric.description}
              </p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
