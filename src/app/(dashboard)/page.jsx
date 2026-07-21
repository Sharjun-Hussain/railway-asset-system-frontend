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
import { useSession } from "next-auth/react";
import { Shield, Building, Warehouse, MapPin, UserCheck } from "lucide-react";


export default function DashboardPage() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response = await apiClient.get("/transactions");
        setRecentTransactions(response.data.slice(0, 5));
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
    <div className="flex flex-col h-full space-y-5 bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
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

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 flex-1 pb-6">
        <div className="lg:col-span-4 h-full">
          <AIChat />
        </div>


        <div className="lg:col-span-2 space-y-6">
          {/* Quick Reports Card */}
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md h-full py-0 gap-0 flex flex-col">
            <CardHeader className="p-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-lg font-bold">
                    Live Activity
                  </CardTitle>
                  <p className="text-xs text-muted-foreground font-medium ">
                    Real-time system transactions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3 flex-1 overflow-y-auto scrollbar-tiny">
              {loading ? (
                <div className="flex justify-center p-4"><div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground font-medium">No recent activity.</div>
              ) : recentTransactions.map((t) => {
                const style = getTypeStyle(t.type);
                return (
                  <div key={t._id} className="p-3 rounded-lg border border-border/50 bg-white/50 dark:bg-slate-900/50 hover:border-primary/30 transition-all cursor-pointer group flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Badge className={`text-[10px] font-bold py-0 px-1.5 rounded-md border ${style.badge}`}>
                        {t.type}
                      </Badge>
                      <span className="text-[10px] font-medium text-muted-foreground">{format(new Date(t.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                    <h4 className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{t.assetId?.asset_name || 'Unknown Asset'}</h4>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className="text-[11px] font-medium text-muted-foreground/70 truncate">{t.warehouseId?.warehouse_name || 'Unknown Location'}</span>
                    </div>
                  </div>
                )
              })}
              <Link href="/transactions" className="block pt-2">
                <Button variant="ghost" className="w-full h-8 rounded-lg font-bold text-xs gap-2 group">
                  View Full Logs
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
