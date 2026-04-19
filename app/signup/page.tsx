"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUp } from "@/lib/auth/authClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message ?? "Failed to sign up");
      } else {
        router.push("/");
      }
    } catch {
      setError("UNEXPECTED ERROR WHILE SIGNING UP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="rounded-md max-w-lg w-full shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-semibold">
              Sign up
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Create an account to start tracking your job applications
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">
                {error}
              </div>
            )}

            <div className="space-y-2 mb-3">
              <Label>Name</Label>
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                placeholder="John Doe"
                className="rounded-md py-4"
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label>Email</Label>
              <Input
                value={email}
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="py-4"
              />
            </div>

            <div className="space-y-2 mb-3">
              <Label>Password</Label>
              <Input
                value={password}
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
                minLength={6}
                className="py-4"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}