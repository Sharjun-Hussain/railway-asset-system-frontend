"use client";

import { AIChat } from "@/components/dashboard/AIChat";
import { LayoutDashboard, History, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { format } from "date-fns";
import Link from "next/link";


export default function DashboardPage() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response = await apiClient.get("/transactions");
        setRecentTransactions(response.data.slice(0, 5)); // get top 5 latest
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTransactions();
  }, []);

  const getTypeStyle = (type) => {
    switch (type) {
      case "RECEIVE": return { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", dot: "bg-emerald-500" };
      case "ISSUE": return { badge: "bg-rose-500/10 text-rose-600 border-rose-500/20", dot: "bg-rose-500" };
      case "TRANSFER": return { badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", dot: "bg-blue-500" };
      case "ADJUST": return { badge: "bg-amber-500/10 text-amber-600 border-amber-500/20", dot: "bg-amber-500" };
      default: return { badge: "bg-slate-500/10 text-slate-600 border-slate-500/20", dot: "bg-slate-500" };
    }
  };

  return (
    <div className="space-y-8 min-h-screen bg-background/50">

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


      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4">
          <AIChat />
        </div>


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
               {loading ? (
                 <div className="flex justify-center p-4"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
               ) : recentTransactions.length === 0 ? (
                 <div className="text-center p-4 text-sm text-muted-foreground font-medium">No recent activity.</div>
               ) : recentTransactions.map((t) => {
                 const style = getTypeStyle(t.type);
                 return (
                 <div key={t._id} className="p-4 rounded-xl border border-border/50 bg-white/50 dark:bg-slate-900/50 hover:border-primary/30 transition-all cursor-pointer group">
                   <div className="flex items-start justify-between mb-2">
                      <Badge className={`text-xs font-bold py-0.5 px-2 rounded border ${style.badge}`}>
                        {t.type}
                      </Badge>
                      <span className="text-[11px] font-medium text-muted-foreground">{format(new Date(t.createdAt), "MMM d, h:mm a")}</span>
                   </div>
                   <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{t.assetId?.asset_name || 'Unknown Asset'}</h4>
                   <div className="flex items-center gap-1.5 pt-1">
                      <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className="text-xs font-bold text-muted-foreground/70 truncate">{t.warehouseId?.warehouse_name || 'Unknown Location'}</span>
                   </div>
                 </div>
                 )
               })}
               <Link href="/transactions">
                 <Button variant="ghost" className="w-full h-10 rounded-xl font-bold text-xs gap-2 group">
                   View Full Activity Logs
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </Button>
               </Link>
            </CardContent>
          </Card>

          {/* Quick Links Group */}
          {/* <div className="grid grid-cols-2 gap-4">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
