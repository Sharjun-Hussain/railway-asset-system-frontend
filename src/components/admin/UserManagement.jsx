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
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { UserPlus, Mail, User as UserIcon, Shield } from "lucide-react"

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [divisions, setDivisions] = useState([])
  const [stations, setStations] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    roleIds: [],
    divisionId: "",
    stationId: "",
    warehouseIds: []
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [usersRes, rolesRes, divisionsRes, stationsRes, warehousesRes] = await Promise.all([
        apiClient.get("/users"),
        apiClient.get("/roles"),
        apiClient.get("/divisions"),
        apiClient.get("/stations"),
        apiClient.get("/warehouses")
      ])
      setUsers(usersRes.data)
      setRoles(rolesRes.data)
      setDivisions(divisionsRes.data?.data || divisionsRes.data)
      setStations(stationsRes.data?.data || stationsRes.data)
      setWarehouses(warehousesRes.data?.data || warehousesRes.data)
    } catch (error) {
      toast.error("Failed to fetch data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post("/users", formData)
      toast.success("Invitation sent successfully")
      setIsInviteOpen(false)
      fetchInitialData() // refresh list
      setFormData({ full_name: "", email: "", roleIds: [], divisionId: "", stationId: "", warehouseIds: [] })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invitation")
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">System Users</h2>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Invite New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-tiny">
            <form onSubmit={handleInvite}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Invite User to Platform
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="full_name" className="text-xs font-bold uppercase text-slate-500">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="full_name" 
                      placeholder="e.g. John Doe" 
                      className="pl-10" 
                      required 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-500">Official Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@slrail.lk" 
                      className="pl-10" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Primary Role</Label>
                      <Select 
                        onValueChange={(val) => setFormData({...formData, roleIds: [val]})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role._id} value={role._id}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                   
                   <div className="grid gap-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Division</Label>
                      <Select onValueChange={(val) => setFormData({...formData, divisionId: val, stationId: "", warehouseIds: []})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map(d => (
                            <SelectItem key={d._id} value={d._id}>{d.division_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Station</Label>
                    <Select onValueChange={(val) => setFormData({...formData, stationId: val, warehouseIds: []})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Station" />
                      </SelectTrigger>
                      <SelectContent>
                        {stations
                          .filter(s => !formData.divisionId || (s.divisionId?._id === formData.divisionId || s.divisionId === formData.divisionId))
                          .map(s => (
                            <SelectItem key={s._id} value={s._id}>{s.station_name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Store / Warehouse (Multi-select)</Label>
                    <div className="border rounded-lg p-2 max-h-[120px] overflow-y-auto space-y-1 bg-slate-50/50">
                      {warehouses
                        .filter(w => !formData.stationId || (w.stationId?._id === formData.stationId || w.stationId === formData.stationId))
                        .map(w => (
                          <div key={w._id} className="flex items-center gap-2 hover:bg-white p-1 rounded transition-colors">
                            <input 
                              type="checkbox" 
                              id={`wh-${w._id}`}
                              className="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5"
                              checked={formData.warehouseIds.includes(w._id)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  warehouseIds: checked 
                                    ? [...prev.warehouseIds, w._id] 
                                    : prev.warehouseIds.filter(id => id !== w._id)
                                }))
                               }}
                             />
                             <label htmlFor={`wh-${w._id}`} className="text-xs font-medium text-slate-600 cursor-pointer flex-1">
                               {w.warehouse_name}
                             </label>
                          </div>
                        ))
                      }
                      {formData.stationId && warehouses.filter(w => (w.stationId?._id === formData.stationId || w.stationId === formData.stationId)).length === 0 && (
                        <p className="text-[10px] text-slate-400 italic p-2 text-center text-wrap">No warehouses found for this station.</p>
                      )}
                      {!formData.stationId && (
                        <p className="text-[10px] text-slate-400 italic p-2 text-center text-wrap">Select a station first.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button type="submit">Send Invitation Link</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[250px]">Basic Details</TableHead>
              <TableHead>Assigned Roles</TableHead>
              <TableHead>Organizational Scope</TableHead>
              <TableHead className="text-center">Account Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="group">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{user.full_name}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                       <Mail className="h-3 w-3" /> {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <Badge key={role._id} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-0.5 text-[10px]">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex flex-col gap-0.5">
                      {user.divisionId?.division_name ? (
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                           <Shield className="h-3 w-3 text-slate-400" /> {user.divisionId.division_name} Division
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Full HQ Access</span>
                      )}
                      {user.stationId?.station_name && (
                        <span className="text-[10px] text-slate-500 ml-4 italic px-2 border-l border-slate-200">
                          {user.stationId.station_name} Station
                        </span>
                      )}
                      {user.warehouseIds?.length > 0 && (
                        <div className="flex flex-wrap gap-1 ml-4 mt-1">
                          {user.warehouseIds.map(w => (
                            <Badge key={w._id} variant="outline" className="text-[9px] px-1.5 py-0 border-slate-200 text-slate-500">
                              {w.warehouse_name}
                            </Badge>
                          ))}
                        </div>
                      )}
                   </div>
                </TableCell>
                <TableCell className="text-center">
                  {user.isPending ? (
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-full px-3">
                      Pending Invite
                    </Badge>
                  ) : (
                    <Badge variant={user.isActive ? "success" : "destructive"} className="rounded-full px-3">
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
