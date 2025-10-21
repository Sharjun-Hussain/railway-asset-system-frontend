"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Info } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [Password, setPassword] = useState("");

  const handleResetePassword = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reset-password`,
      { email: email, token: token, password: Password },
      {
        withCredentials: true,
      }
    );

    if (res.status == 200) {
      toast.success(res.data.message, {
        dismissible: true,
        richColors: true,
        icon: <Info size={18} className="me-2" />,
        closeButton: true,
      });
    }
    else{
      toast.success("oops! Please Check your Credentials!", {
        dismissible: true,
        richColors: true,
        icon: <Info size={18} className="me-2" />,
        closeButton: true,
      });
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
        Reset Password
      </h2>
      <div className="text-center">Email : {email}</div>
      <form className="mt-6 space-y-4">
        <Input
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          type="password"
          className="dark:bg-gray-700 w-full"
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          className="dark:bg-gray-700 w-full"
        />
        <Button
          onClick={handleResetePassword}
          variant="outline"
          className="w-full"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
