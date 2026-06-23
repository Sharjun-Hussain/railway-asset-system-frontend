import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] animate-in fade-in duration-500">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="py-4">
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-b-slate-100">
              {Array.from({ length: columns }).map((_, j) => (
                <TableCell key={j} className="py-4">
                  {j === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ) : j === columns - 1 ? (
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
