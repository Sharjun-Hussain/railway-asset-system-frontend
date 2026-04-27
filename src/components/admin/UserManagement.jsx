"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users")
      setUsers(response.data)
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">System Users</h2>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Roles</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <Badge key={role._id} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-0">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                   {user.divisionId?.division_name && <span>{user.divisionId.division_name} Division</span>}
                   {user.stationId?.station_name && <span> • {user.stationId.station_name} Station</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "success" : "destructive"} className="rounded-full px-2">
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
