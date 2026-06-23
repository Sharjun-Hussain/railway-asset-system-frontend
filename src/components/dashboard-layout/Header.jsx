"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import { Shield, Building, Warehouse, MapPin, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      const fetchFullUser = async () => {
        try {
          const res = await apiClient.get("/users/me");
          if (res.data) {
            setUser(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch full user details", error);
        }
      };
      fetchFullUser();
    }
  }, [session?.user?.id]);

  return (
    <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-6 md:px-8 lg:px-10 h-16 flex items-center justify-between shrink-0 shadow-sm/50">
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-bold text-slate-800 hidden lg:flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          Access Scope
        </h2>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Shield className="h-4 w-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role:</span>
            <Badge variant="outline" className="font-bold text-primary border-primary/20 bg-primary/5 text-xs">
              {user?.roles?.[0]?.name || user?.roles?.[0] || "Loading..."}
            </Badge>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Building className="h-4 w-4 text-slate-400" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Division:</span>
            <span className="text-sm font-bold text-slate-700">
              {user?.divisionId?.division_name || "Headquarters"}
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <MapPin className="h-4 w-4 text-slate-400" />
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Station:</span>
            <span className="text-sm font-bold text-slate-700">
              {user?.stationId?.station_name || "All Stations"}
            </span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Warehouse className="h-4 w-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouses:</span>
            <div className="flex items-center gap-1">
              {user?.warehouseIds?.length > 0 ? (
                user.warehouseIds.map((w, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">
                    {w.warehouse_name || w}
                  </Badge>
                ))
              ) : (
                <span className="text-sm font-bold text-slate-700">All</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
