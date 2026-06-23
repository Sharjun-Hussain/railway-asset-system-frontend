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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { UserPlus, Mail, User as UserIcon, Shield, UserX, UserCheck } from "lucide-react"

export function UserManagement() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [divisions, setDivisions] = useState([])
  const [stations, setStations] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionType, setActionType] = useState(null) // 'ACTIVATE' or 'DEACTIVATE'
  const [isProcessing, setIsProcessing] = useState(false)
  
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

  const handleUserStatusChange = async () => {
    if (!selectedUser) return
    setIsProcessing(true)
    const newStatus = actionType === 'ACTIVATE'
    try {
      await apiClient.put(`/users/${selectedUser._id}`, { isActive: newStatus })
      toast.success(`User access ${newStatus ? 'activated' : 'deactivated'} successfully`)
      setSelectedUser(null)
      setActionType(null)
      fetchInitialData() // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${newStatus ? 'activate' : 'deactivate'} user`)
    } finally {
      setIsProcessing(false)
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
              <DialogHeader className="pb-4 border-b border-slate-100">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  Invite User to Platform
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input 
                      id="full_name" 
                      placeholder="e.g. John Doe" 
                      required 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Official Email address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="user@slrail.lk" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Row 2: Role & Division */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label>Primary Role</Label>
                      <Select 
                        onValueChange={(val) => setFormData({...formData, roleIds: [val]})}
                        required
                      >
                        <SelectTrigger className="w-full">
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
                      <Label>Division</Label>
                      <Select onValueChange={(val) => setFormData({...formData, divisionId: val, stationId: "", warehouseIds: []})}>
                        <SelectTrigger className="w-full">
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

                {/* Row 3: Station */}
                <div className="grid gap-2">
                  <Label>Station</Label>
                  <Select onValueChange={(val) => setFormData({...formData, stationId: val, warehouseIds: []})}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Station" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.divisionId ? (
                        stations
                          .filter(s => s.divisionId?._id === formData.divisionId || s.divisionId === formData.divisionId)
                          .map(s => (
                            <SelectItem key={s._id} value={s._id}>{s.station_name}</SelectItem>
                          ))
                      ) : (
                        <div className="p-2 text-xs text-slate-400 italic text-center">Select a division first</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 4: Warehouses (Full Width) */}
                <div className="grid gap-2">
                  <Label>Assign Warehouses</Label>
                  <div className="border border-slate-200 rounded-md p-3 max-h-[160px] overflow-y-auto bg-slate-50/50 scrollbar-tiny">
                    {formData.stationId && warehouses.filter(w => w.stationId?._id === formData.stationId || w.stationId === formData.stationId).length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {warehouses
                          .filter(w => w.stationId?._id === formData.stationId || w.stationId === formData.stationId)
                          .map(w => {
                            const isSelected = formData.warehouseIds.includes(w._id);
                            return (
                              <div key={w._id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all border ${isSelected ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white border-transparent hover:border-slate-300 shadow-sm'}`}>
                                <input 
                                  type="checkbox" 
                                  id={`wh-${w._id}`}
                                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                  checked={isSelected}
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
                                 <label htmlFor={`wh-${w._id}`} className={`text-sm cursor-pointer flex-1 select-none ${isSelected ? 'font-semibold text-primary' : 'font-medium text-slate-700'}`}>
                                   {w.warehouse_name}
                                 </label>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) : (
                      <>
                        {formData.stationId ? (
                          <div className="flex items-center justify-center h-[80px]">
                            <p className="text-xs text-slate-400 italic text-center px-4">No warehouses found for this station.</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[80px]">
                            <p className="text-xs text-slate-400 italic text-center px-4">Select a station first to assign warehouses.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)} className="font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-lg shadow-primary/20">
                  Send Invitation Link
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-200/60">
              <TableHead className="w-[280px] font-semibold text-slate-600 h-12">User Identity</TableHead>
              <TableHead className="font-semibold text-slate-600 h-12">Assigned Roles</TableHead>
              <TableHead className="font-semibold text-slate-600 h-12">Access Scope</TableHead>
              <TableHead className="text-center font-semibold text-slate-600 h-12">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600 h-12 pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="group hover:bg-slate-50/40 transition-colors cursor-default border-b-slate-100">
                <TableCell className="py-4">
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
                    <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-100 font-bold text-[10px] uppercase">
                      Pending Invite
                    </Badge>
                  ) : user.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 font-bold text-[10px] uppercase">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-50 text-slate-400 hover:bg-slate-50 border-slate-200 font-bold text-[10px] uppercase">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right pr-4">
                  {!user.isPending && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={user.isActive 
                        ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg"
                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 rounded-lg"
                      }
                      title={user.isActive ? "Deactivate User" : "Activate User"}
                      onClick={() => {
                        setSelectedUser(user)
                        setActionType(user.isActive ? 'DEACTIVATE' : 'ACTIVATE')
                      }}
                    >
                      {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              {actionType === 'ACTIVATE' ? 'Activate User?' : 'Deactivate User?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 pt-2 leading-relaxed">
              {actionType === 'ACTIVATE' 
                ? "Are you sure you want to restore this user's access? They will be able to log in and use the platform again."
                : "Are you sure you want to remove this user's access from the platform? This will deactivate their account and prevent them from logging in."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isProcessing} className="rounded-xl border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleUserStatusChange()
              }}
              className={actionType === 'ACTIVATE' 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                : "bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-sm"
              }
              disabled={isProcessing}
            >
              {isProcessing 
                ? "Processing..." 
                : actionType === 'ACTIVATE' ? "Confirm Activation" : "Confirm Deactivation"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
