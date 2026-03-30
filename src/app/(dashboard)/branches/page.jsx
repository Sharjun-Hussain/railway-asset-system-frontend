"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";

const dummyBranches = [
  {
    id: "B001",
    name: "Colombo Main",
    location: "Colombo, Western Province",
    warehouses: 5,
    users: 45,
  },
  {
    id: "B002",
    name: "Jaffna",
    location: "Jaffna, Northern Province",
    warehouses: 2,
    users: 18,
  },
  {
    id: "B003",
    name: "Batticaloa",
    location: "Batticaloa, Eastern Province",
    warehouses: 3,
    users: 22,
  },
  {
    id: "B004",
    name: "Galle",
    location: "Galle, Southern Province",
    warehouses: 2,
    users: 15,
  },
];

export default function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Branches</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Fill in the details for the new branch.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="branch-name"
                  placeholder="e.g., Colombo Main"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch-code" className="text-right">
                  Code
                </Label>
                <Input
                  id="branch-code"
                  placeholder="e.g., B005"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="branch-location"
                  placeholder="e.g., Kandy, Central Province"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Branch List</CardTitle>
          <CardDescription>
            A list of all active branches in the Sri Lankan Railways system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Warehouses</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyBranches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.id}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>{branch.warehouses}</TableCell>
                  <TableCell>{branch.users}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
