"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export function SummaryCard({
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  trendType = "up",
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full",
                trendType === "up"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-rose-600 bg-rose-50",
              )}
            >
              {trendType === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {subValue && (
              <span className="text-xs font-medium text-muted-foreground">
                {subValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
