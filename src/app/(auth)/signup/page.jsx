import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Signup() {
  return (
    
      <div>  <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Sign Up</h2>
      <form className="mt-6 space-y-4">
        <Input placeholder="Name" type="text" className="dark:bg-gray-700  text-black w-full" />
        <Input placeholder="Email" type="email" className="dark:bg-gray-700 text-black w-full" />
        <Input placeholder="Password" type="password" className="dark:bg-gray-700 text-black w-full" />
        <Button variant="outline" className="w-full">Create Account</Button>
      </form>
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
        Already have an account? <Link href="/login" className="text-pink-600 dark:text-blue-400">Login</Link>
      </p></div>
     
  );
}
