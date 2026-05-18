"use client";
import { signUpWithEmail } from "@/app/_lib/actions";
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
import { Brain } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  fName: string;
  lName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export default function SignupPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");

    const fullName = `${data.fName} ${data.lName}`;
    const phone = data.phoneNumber;
    const result = await signUpWithEmail(
      data.email,
      data.password,
      fullName,
      phone,
    );
    //if (!result?.error) toast.success("Account is created successfully");
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="bg-background flex flex-col justify-center items-center min-h-screen w-full px-4 gap-4">
      <Card className="w-full md:max-w-sm pt-6 bg-card">
        <CardHeader className="flex flex-col justify-center items-center">
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
          <CardTitle className="text-center text-xl">Sign Up</CardTitle>
          <CardDescription className="text-center">
            AI Study Buddy, Your daily Buddy
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-4">
              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...register("fName", { required: "First name is required" })}
                />
                {errors.fName && (
                  <p className="text-xs text-red-500">{errors.fName.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  {...register("lName", { required: "Last name is required" })}
                />
                {errors.lName && (
                  <p className="text-xs text-red-500">{errors.lName.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+20-"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email", { required: "Email is required" })}
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
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="w-full">
          <Link
            href="/login"
            className="w-full text-primary-500 mx-auto text-xs text-center"
          >
            Already have an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
