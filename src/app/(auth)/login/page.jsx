"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const { data: userSession } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(userSession);
    localStorage.setItem("office_name", userSession?.user?.office?.office_name);
    localStorage.setItem("office_id", userSession?.user?.office?.id);
    localStorage.setItem("office_code", userSession?.user?.office?.code);
    localStorage.setItem(
      "warehouse_name",
      userSession?.user?.warehouse?.warehouse_name
    );
    localStorage.setItem("warehouse_id", userSession?.user?.warehouse?.id);
    localStorage.setItem(
      "warehouse_code",
      userSession?.user?.warehouse?.warehouse_code
    );
    localStorage.setItem("token", userSession?.user?.token);
  }, [userSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error message

    // Check for empty fields
    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const data = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log(data);

    setLoading(false); // Always set loading to false after processing

    if (data?.error) {
      // If there's an error returned from signIn, show it
      setError(data.error);
      toast.error("Login Failed: " + data.error);
      setLoading(false); // Always set loading to false after processing
    } else {
      // Assuming login is successful
      setLoading(false); // Always set loading to false after processing

      toast.success("Login Successful!");
      // Use accessToken from the signIn response
      router.push("/dashboard");
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
        Login
      </h2>

      {/* Display error if any */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          className="dark:bg-gray-700 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          className="dark:bg-gray-700 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400"
          >
            Forgot Password?
          </Link>
        </div>
        <Button
          disabled={loading}
          type="submit"
          variant="outline"
          className="w-full "
        >
          {loading ? "Sign-in Please Wait" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
