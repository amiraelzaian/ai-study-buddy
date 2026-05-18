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
import { signInWithEmail, signInWithGoogle } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain } from "lucide-react";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [googling, setGoogling] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function handleEmailLogin(data: FormData) {
    setLoading(true);
    setError("");

    const result = await signInWithEmail(data.email, data.password);
    // if (!result?.error) toast.success("Logged in successfully");

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      toast.error("Something went wrong, try later");
      return;
    }

    setLoading(false);
  }

  async function handleGoogleLogin() {
    setGoogling(true);

    const result = await signInWithGoogle();
    //if (!result?.error) toast.success("Logged in successfully");

    if (result?.error) {
      setError(result.error);
      setGoogling(false);
      toast.error("Something went wrong, try later");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="bg-background flex flex-col justify-center items-center min-h-screen w-full px-4 gap-4">
      <Card className="w-full md:max-w-sm pt-6 bg-card">
        <CardHeader className="flex flex-col items-center justify-center ">
          <div
            className="relative flex items-center justify-center w-10 h-10 rounded-xl 
        bg-gradient-to-br  from-primary-500 to-primary-800 shadow-lg
       shadow-primary-500/30 transition-transform duration-200 group-hover:scale-105"
          >
            <Brain className="w-5 h-5 text-white" />
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5
         bg-emerald-400 rounded-full border-2 
         border-background animate-pulse"
            />
          </div>
          <CardTitle className="text-center text-xl">Login </CardTitle>
          <CardDescription className="text-center">
            AI study Buddy, Your daily Buddy
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
                  placeholder="user@example.com"
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
            disabled={googling}
          >
            {googling ? "Loading..." : " Continue with Google"}
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
