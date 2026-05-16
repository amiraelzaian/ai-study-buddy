"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";
import { uploadAvatar } from "../_lib/actions";
import { useState } from "react";
import toast from "react-hot-toast";

type Profile = {
  profile: {
    id: string;
    avatar_url: string;
    Bio: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
  };
};

function InfoCard({ profile }: Profile) {
  const [updating, setUpdating] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUpdating(true);
      await uploadAvatar(profile.id, file);
      toast.success("Avatar updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try later");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <aside
      className="flex flex-col items-center gap-4 mt-5 bg-card rounded-2xl
      mx-auto p-6 shadow-md border 
      hover:border-primary-400 w-full"
    >
      {/* Avatar */}
      <div className="relative">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={96}
            height={96}
            className="rounded-full object-cover w-24 h-24"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
            {profile.full_name?.[0]}
          </div>
        )}

        {/* Upload Button */}
        <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 shadow-md hover:bg-primary/80 transition cursor-pointer">
          <Plus className="w-4 h-4" />

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={updating}
            className="hidden"
          />
        </label>
      </div>

      {updating && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}

      {/* Name & Bio */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-xl font-semibold text-card-foreground">
          {profile.full_name}
        </h3>

        <p className="text-sm text-muted-foreground">{profile.Bio}</p>
      </div>

      <hr className="w-full border-gray-200" />

      {/* Info */}
      <div className="flex flex-col gap-2 w-full text-sm text-muted-foreground">
        {profile?.phone && (
          <div className="flex items-center gap-2 ">
            <span>📞</span>
            <p className="text-sm">{profile.phone}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span>✉️</span>
          <p className="text-sm">{profile.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <span>📅</span>

          <p className="text-sm">
            Joined{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <EditProfileModal profile={profile} />
    </aside>
  );
}

export default InfoCard;
