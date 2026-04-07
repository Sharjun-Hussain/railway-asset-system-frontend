"use client";

import { AssetMetrics } from "@/components/dashboard/AssetMetrics";
import { AIChat } from "@/components/dashboard/AIChat";
import {
  Train,
  Activity,
  Wrench,
  AlertTriangle,
  History,
  LayoutDashboard,
  Bell,
  Box,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  const QUICK_REPORTS = [
    { id: 1, type: "Maintenance", title: "Engine #4521 - Service Completed", status: "Done", time: "2h ago", color: "green" },
    { id: 2, type: "Arrival", title: "Gampaha Station - Track Sync", status: "Syncing", time: "15m ago", color: "blue" },
    { id: 3, type: "Alert", title: "Signal Failure - Colombo Fort", status: "Critical", time: "Just now", color: "red" },
  ];

  return (
    <div className="space-y-8 min-h-screen bg-background/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="p-3.5 h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Asset Command Center
             
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              System monitoring and AI-assisted asset management.
            </p>
          </div>
        </div>

       
      </div>

      {/* Asset Metrics (Top Stats) */}
      <AssetMetrics />

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left Span: AI Chat (The Core Interaction) */}
        <div className="lg:col-span-4">
          <AIChat />
        </div>

        {/* Right Span: Live Feed & Quick Navigation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Reports Card */}
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Live Activity
                </CardTitle>
                <div className="p-1 rounded-full bg-primary/5">
                   <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               {QUICK_REPORTS.map((report) => (
                 <div key={report.id} className="p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 hover:border-primary/30 transition-all cursor-pointer group">
                   <div className="flex items-start justify-between mb-2">
                      <Badge className={`text-xs font-bold py-0.5 px-2 rounded bg-${report.color}-500/10 text-${report.color}-600 dark:text-${report.color}-400 border border-${report.color}-500/20`}>
                        {report.type}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{report.time}</span>
                   </div>
                   <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{report.title}</h4>
                   <div className="flex items-center gap-1.5 pt-1">
                      <div className={`h-1.5 w-1.5 rounded-full bg-${report.color}-500`} />
                      <span className="text-xs font-bold text-muted-foreground/70">{report.status}</span>
                   </div>
                 </div>
               ))}
               <Button variant="ghost" className="w-full h-10 rounded-xl font-bold text-xs gap-2 group">
                 View Full Activity Logs
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Button>
            </CardContent>
          </Card>

          

          {/* Quick Links Group */}
          <div className="grid grid-cols-2 gap-4">
             <Link href="/inventory" className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 transition-all flex flex-col gap-3 group">
                <div className="p-2 rounded-lg bg-primary/5 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-all">
                   <Box size={18} />
                </div>
                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Inventory</span>
             </Link>
             <Link href="/stations" className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/40 transition-all flex flex-col gap-3 group">
                <div className="p-2 rounded-lg bg-primary/5 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-all">
                   <MapPin size={18} />
                </div>
                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Stations</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
