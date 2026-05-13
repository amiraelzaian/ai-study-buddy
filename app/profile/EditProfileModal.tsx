"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "../_lib/actions";

type Profile = {
  full_name: string;
  phone: string;
  Bio: string;
  avatar_url: string;
  id: string;
};

type FormData = {
  fName: string;
  lName: string;
  phoneNumber: string;
  bio: string;
};

export default function EditProfileModal({ profile }: { profile: Profile }) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // split full_name into first and last
  const [fName, lName] = profile.full_name?.split(" ") ?? ["", ""];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fName,
      lName,
      phoneNumber: profile.phone,
      bio: profile.Bio,
    },
  });

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await updateProfile(profile.id, formData);
      console.log(formData);
    } catch (e) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 z-50 "
        >
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
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              placeholder="Bio"
              {...register("bio")} // ✅ fixed — was "lName" before
            />
            {errors.bio && (
              <p className="text-xs text-red-500">{errors.bio.message}</p>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
