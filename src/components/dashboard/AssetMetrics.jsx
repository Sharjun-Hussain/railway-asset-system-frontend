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
      {METRICS.map((metric) => {
        let colorClasses = {
          bgBubble: "bg-indigo-50/30 group-hover:bg-indigo-50/50",
          iconBg: "bg-indigo-50 text-indigo-500"
        }
        
        if (metric.color === "green") {
          colorClasses = {
            bgBubble: "bg-emerald-50/30 group-hover:bg-emerald-50/50",
            iconBg: "bg-emerald-50 text-emerald-500"
          }
        } else if (metric.color === "amber") {
          colorClasses = {
            bgBubble: "bg-amber-50/30 group-hover:bg-amber-50/50",
            iconBg: "bg-amber-50 text-amber-500"
          }
        } else if (metric.color === "red") {
          colorClasses = {
            bgBubble: "bg-rose-50/30 group-hover:bg-rose-50/50",
            iconBg: "bg-rose-50 text-rose-500"
          }
        }

        return (
          <Card key={metric.title} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full transition-all duration-300 ${colorClasses.bgBubble}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-400">{metric.title}</p>
                <p className="text-4xl font-semibold text-slate-800">{metric.value}</p>
              </div>
              <div className={`rounded-2xl p-3 ${colorClasses.iconBg}`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  );
}
