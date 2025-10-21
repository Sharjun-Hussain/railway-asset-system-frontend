"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, MailCheck } from "lucide-react"; // Added MailCheck for success state

// 1. Define schema for validation, just like in your LoginPage
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  // 2. State to show a success message instead of the form
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 3. Set up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // 4. onSubmit handler with robust error handling
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://128.199.31.7/api/v1/forgot-password",
        { email: data.email },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Password reset link sent!", {
          icon: <Info size={18} className="me-2" />,
          richColors: true,
          closeButton: true,
        });
        setIsSubmitted(true); // Trigger the success UI
      } else {
        // Handle other non-error statuses if needed
        throw new Error(res.data.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      // Get error message from Axios response
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";

      // Set form-level error, just like in your LoginPage
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {/* Left Panel: Branding (Copied directly from your LoginPage) */}
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
            <p className="mt-2 text-slate-300">Recover your account access.</p>
          </div>
          <div className="text-sm text-slate-400">
            &copy; 2024 Official Government Department
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full p-8 md:w-1/2">
          {/* 5. Conditional UI: Show success message or the form */}
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MailCheck className="w-16 h-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                Check Your Email
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We've sent a password reset link to the email address you
                provided (if it exists in our system).
              </p>
              <Button asChild variant="outline" className="w-full mt-6">
                {/* Assuming your login page is at the root "/" */}
                <Link href="/">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                Enter your registered email to get a reset link.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-6"
              >
                {/* 6. Root error display (from setError) */}
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
                  {/* 7. Field-level error display (from Zod) */}
                  {errors.email && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* 8. Submitting state for the button */}
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Remembered your password?{" "}
                  {/* Assuming your login page is at the root "/" */}
                  <Link
                    href="/"
                    className="font-medium text-slate-600 hover:underline dark:text-slate-400"
                  >
                    Back to Login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
