import { StatCards } from "@/components/chat-screen/StatsCards";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const recentTransactions = [
    { id: "TX-1002", product: "Class S12 Engine", warehouse: "Fort Mechanical", type: "ISSUE", quantity: 1, date: "2026-03-30" },
    { id: "TX-1001", product: "Brake Pad Type-B", warehouse: "Maradana Signal", type: "RECEIVE", quantity: 50, date: "2026-03-29" },
    { id: "TX-1000", product: "Signal Lamp LED", warehouse: "Jaffna General", type: "TRANSFER", quantity: 10, date: "2026-03-28" },
  ];

  return (
    <div className="space-y-6">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest movements across all regional warehouses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{tx.product}</TableCell>
                    <TableCell>{tx.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "RECEIVE" ? "default" : tx.type === "ISSUE" ? "destructive" : "secondary"}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{tx.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <CardDescription>By primary item category.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mechanical</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Signal</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Civil</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

