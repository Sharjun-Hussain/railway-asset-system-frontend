"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod schema for validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Error will be attached to the confirmPassword field
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (!token || !email) {
      toast.error("Missing required information to reset password.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reset-password`,
        {
          email: email,
          token: token,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Your password has been reset successfully."
        );
        // Optionally redirect the user to the login page
        // router.push('/login');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-5xl mx-auto overflow-hidden bg-card rounded-2xl shadow-xl border border-border">
        {/* Left Panel: Branding & Visual */}
        <div className="hidden md:flex md:w-5/12 relative bg-primary p-12 text-white flex-col justify-between overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.4]"
            style={{ 
              backgroundImage: "url('/Assets/login-bg-1.jpg')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-primary/60 backdrop-blur-[1px]" />
          
          <div className="relative z-20">
            <div className="p-3 w-fit rounded-xl bg-white/10 border border-white/20 mb-8">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.545 0 8.41-2.953 9-7.056a12.02 12.02 0 00-2.382-6.088z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight leading-tight">
              SL Railway Asset Management
            </h1>
            <p className="mt-4 text-slate-100/80 font-medium">
              Securely reset your portal password.
            </p>
          </div>

          <div className="relative z-20 mt-auto">
            <div className="text-xs text-white/40 pt-4 border-t border-white/10">
              &copy; 2026 Sri Lankan Railway Department. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full p-8 md:p-14 md:w-7/12 bg-card">
          <div className="max-w-sm mx-auto">
            <div className="md:hidden flex justify-center mb-8">
               <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.545 0 8.41-2.953 9-7.056a12.02 12.02 0 00-2.382-6.088z" />
                  </svg>
               </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reset Password
            </h2>
            <p className="mt-2 text-muted-foreground font-medium">
              Account: <span className="text-slate-900 font-semibold">{email || "your email"}</span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {errors.root && (
                <div className="p-4 text-sm text-center text-red-800 bg-red-50 border border-red-100 rounded-xl">
                  {errors.root.message}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-0.5"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`h-11 px-4 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-100 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-red-500 ml-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-0.5"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`h-11 px-4 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-100 ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-red-500 ml-0.5">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting || !token || !email}
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl shadow-md transition-all duration-100 active:scale-[0.99]"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}
