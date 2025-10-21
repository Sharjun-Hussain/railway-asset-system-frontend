"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [Email, setEmail] = useState(null);
  const [SuccessMessage, setSuccessMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://128.199.31.7/api/admin/forgot-password",
      { email: Email },
      {
        withCredentials: true,
      }
    );

    if(res.status==200){
      
      
      toast.success(res.data.message,{
        dismissible:true,
        richColors:true,
        icon:<Info size={18} className="me-2"/>,
        closeButton:true
      })
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
        Forgot Password
      </h2>
      <div className="text-center text-sm">Enter your registered email to get an reset password link </div>
      <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={Email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="dark:bg-gray-700 w-full"
        />
        <Button type="submit" variant="outline" className="w-full">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
