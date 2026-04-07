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
import { Info, MailCheck } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [debugResetLink, setDebugResetLink] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

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

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Password reset link generated!", {
          icon: <Info size={18} className="me-2" />,
          richColors: true,
          closeButton: true,
        });
        
        // --- Debug Mode ---
        // Since no real email is sent, capture the token and email for the test link
        if (result.resetToken) {
           setDebugResetLink(`/reset-password?token=${result.resetToken}&email=${data.email}`);
           setSubmittedEmail(data.email);
        }
        
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage =
        error.message ||
        "Failed to send reset link. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
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
              Recover your account access safely.
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
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 rounded-full bg-green-50 text-green-600 mb-6">
                  <MailCheck className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Check Your Email
                </h2>
                <p className="mt-4 text-muted-foreground font-medium">
                  We've sent a password reset link to your official email address. Please check your inbox.
                </p>

                {/* Debug Test Link (Since no email service is connected) */}
                {debugResetLink && (
                  <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl text-left">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      Debug: Test Recovery Link
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      In a production environment, this link would be sent via email. For testing purposes, you can use the button below:
                    </p>
                    <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/95 text-xs h-9">
                       <Link href={debugResetLink}>Go to Reset Page</Link>
                    </Button>
                  </div>
                )}

                <Button asChild variant="ghost" className="w-full mt-6 h-11 rounded-xl font-semibold border-slate-200">
                  <Link href="/">Back to Portal Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="md:hidden flex justify-center mb-8">
                   <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.545 0 8.41-2.953 9-7.056a12.02 12.02 0 00-2.382-6.088z" />
                      </svg>
                   </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Forgot Password
                </h2>
                <p className="mt-2 text-muted-foreground font-medium">
                  Enter your official email to receive a reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                  {errors.root && (
                    <div className="p-4 text-sm text-center text-red-800 bg-red-50 border border-red-100 rounded-xl">
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
                      className={`h-11 px-4 rounded-xl border-slate-200 focus:ring-primary focus:border-primary transition-all duration-100 ${
                        errors.email ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs font-medium text-red-500 ml-0.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl shadow-md transition-all duration-100 active:scale-[0.99]"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="pt-2">
                    <p className="text-sm text-center text-muted-foreground font-medium">
                      Remembered your password?{" "}
                      <Link
                        href="/"
                        className="font-semibold text-slate-900 hover:text-primary dark:text-white transition-colors"
                      >
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
