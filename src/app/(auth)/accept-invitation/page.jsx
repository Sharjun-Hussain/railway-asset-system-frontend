"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import apiClient from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, CheckCircle2, ShieldCheck, Railway } from "lucide-react"

function AcceptInvitationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }

    setLoading(true)
    try {
      await apiClient.post(`/auth/accept-invitation/${token}`, { password })
      setSuccess(true)
      toast.success("Account activated successfully!")
      setTimeout(() => router.push("/login"), 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired invitation")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Account Activated</h2>
        <p className="text-slate-500 text-center">Your password has been set. <br/> Redirecting you to login...</p>
        <Button onClick={() => router.push("/login")} className="mt-4">Login Now</Button>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-slate-200">
      <CardHeader className="space-y-2 pb-8">
        <div className="flex justify-center mb-4">
           <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <ShieldCheck className="h-10 w-10" />
           </div>
        </div>
        <CardTitle className="text-2xl font-black text-center text-slate-800">Complete Registration</CardTitle>
        <CardDescription className="text-center text-slate-500">
          Set up your secure password for <span className="font-bold text-slate-700">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                id="password" 
                type="password" 
                className="pl-10 h-11" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                id="confirm" 
                type="password" 
                className="pl-10 h-11" 
                placeholder="••••••••" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? "Activating..." : "Activate Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Suspense fallback={<div>Loading...</div>}>
        <AcceptInvitationForm />
      </Suspense>
    </div>
  )
}
