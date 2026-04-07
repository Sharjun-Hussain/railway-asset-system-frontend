"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const barData = [
  { name: "1 Jul", revenue: 4000, margin: 2400 },
  { name: "2 Jul", revenue: 3000, margin: 1398 },
  { name: "3 Jul", revenue: 2000, margin: 9800 },
  { name: "4 Jul", revenue: 2780, margin: 3908 },
  { name: "5 Jul", revenue: 1890, margin: 4800 },
  { name: "6 Jul", revenue: 2390, margin: 3800 },
  { name: "7 Jul", revenue: 3490, margin: 4300 },
];

const pieData = [
  { name: "Living room", value: 25, color: "#42369E" },
  { name: "Kids", value: 17, color: "#6366f1" },
  { name: "Office", value: 13, color: "#8b5cf6" },
  { name: "Bedroom", value: 12, color: "#a855f7" },
  { name: "Kitchen", value: 9, color: "#d946ef" },
  { name: "Others", value: 24, color: "#ec4899" },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Product sales</CardTitle>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" /> Gross margin
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-secondary" /> Revenue
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="margin"
                fill="#42369E"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="revenue"
                fill="#E2E8F0"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Sales by product category
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex flex-col justify-center items-center">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-md"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-muted-foreground truncate">
                  {item.name}
                </span>
                <span className="text-xs font-bold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
