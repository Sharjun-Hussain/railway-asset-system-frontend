"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock next-auth signIn function
const signIn = async (provider, { email, password }) => {
  console.log("Mock signIn called with:", { email, password });
  // Simulate a network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate a successful login for a specific password, otherwise fail.
  if (password === "password") {
    return { ok: true, error: null };
  } else {
    return { ok: false, error: "Invalid credentials" };
  }
};

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export default function LoginPage() {
  const router = useRouter();

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

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("root", {
          type: "manual",
          message: "Invalid email or password. Please try again.",
        });
        toast.error("Login Failed: Invalid credentials.");
      } else if (result?.ok) {
        toast.success("Login Successful! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {/* Left Panel: Branding */}
        <div className=" md:block md:w-1/2 bg-slate-800 p-12 text-white flex flex-col justify-between">
          <div>
            <svg
              className="w-16 h-16 mb-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.545 0 8.41-2.953 9-7.056a12.02 12.02 0 00-2.382-6.088z"
              ></path>
            </svg>
            <h1 className="text-3xl font-bold tracking-tight">
              Department Portal
            </h1>
            <p className="mt-2 text-slate-300">
              Please enter your credentials to access the system securely.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            &copy; 2024 Official Government Department
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full p-8 md:w-1/2">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
            System Login
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
            Authorized access only
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {errors.root && (
              <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
                {errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Official Email Address
              </Label>
              <Input
                id="email"
                placeholder="user@department.gov"
                type="email"
                className={`${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-slate-600 hover:underline dark:text-slate-400"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                className={`${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Verifying..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Need assistance?{" "}
              <Link
                href="/help"
                className="font-medium text-slate-600 hover:underline dark:text-slate-400"
              >
                Contact Support
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
