"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callbackUrl = useCallback(() => {
    return searchParams.get("callbackUrl") || "/";
  }, [searchParams]);

  const onSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data) {
          const result = await signIn("credentials", {
            redirect: false,
            user: JSON.stringify(data),
            accessToken: data.accessToken,
            callbackUrl: callbackUrl(),
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          if (result?.ok) {
            toast.success("Welcome back!", {
              description: "You're now being redirected.",
            });
            router.push(result.url || callbackUrl());
          }
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login Failed", {
          description:
            error.message ||
            "Please check your email and password and try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, searchParams, callbackUrl]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-5xl mx-auto overflow-hidden bg-card rounded-2xl shadow-xl border border-border">

        <div className="hidden md:flex md:w-5/12 relative bg-primary p-12 text-white flex-col justify-between overflow-hidden">

          <div
            className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.4]"
            style={{
              backgroundImage: "url('/Assets/login-bg-1.jpg')",
            }}
          />
          <div className="absolute inset-0 z-10 bg-primary/60 backdrop-blur-[1px]" />

          <div className="relative z-20">
            <div className="mb-8">
              <img src="/logo.png" alt="SLR Logo" className="h-20 w-auto object-contain drop-shadow-lg" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight leading-tight">
              SL Railway Asset Management
            </h1>
            <p className="mt-4 text-slate-100/80 font-medium">
              Centralized Smart Asset Management System (CSAMS)
            </p>
          </div>

          <div className="relative z-20 mt-auto">
            <div className="text-xs text-white/40 pt-4 border-t border-white/10">
              &copy; 2026 Sri Lankan Railway Department. All rights reserved. Developed By Sharjun Hussain
            </div>
          </div>
        </div>

   
        <div className="w-full p-8 md:p-14 md:w-7/12 bg-card">
          <div className="max-w-sm mx-auto">
            <div className="md:hidden flex justify-center mb-8">
              <img src="/logo.png" alt="SLR Logo" className="h-16 w-auto object-contain drop-shadow-md" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Portal Login
            </h2>
            <p className="mt-2 text-muted-foreground font-medium">
              Authorized Personnel Access Only
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              {errors.root && (
                <div className="p-4 text-sm text-center text-red-800 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50">
                  {errors.root.message}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-gray-300 ml-0.5"
                >
                  Official Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="user@department.gov"
                  type="email"
                  className={`h-11 px-4 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-100 ${errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-red-500 ml-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-0.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className={`h-11 px-4 pr-10 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-100 ${errors.password ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-red-500 ml-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl shadow-md transition-all duration-100 active:scale-[0.99]"
              >
                {isSubmitting ? "Verifying..." : "Sign In to Dashboard"}
              </Button>

              <div className="pt-2">
                <p className="text-sm text-center text-muted-foreground font-medium">
                  Need technical assistance?{" "}
                  <Link
                    href="/help"
                    className="font-semibold text-slate-900 hover:text-primary dark:text-white transition-colors"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>


  );
}
