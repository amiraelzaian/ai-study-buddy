"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Robot from "./Robot";
import { signInWithEmail, signInWithGoogle } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function handleEmailLogin(data: FormData) {
    setLoading(true);
    setError("");

    const result = await signInWithEmail(data.email, data.password);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);

    const result = await signInWithGoogle();

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="bg-background flex flex-col justify-center items-center min-h-screen w-full px-4 gap-4">
      <div className="w-36 h-36">
        <Robot />
      </div>

      <Card className="w-full md:max-w-sm pt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-center">Login to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your AI Study Buddy
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(handleEmailLogin)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="amira@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Min 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <Link href="/signup" className="text-primary-500 text-sm">
                  Forget your password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex-col gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
