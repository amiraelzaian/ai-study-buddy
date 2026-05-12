import { Plus } from "lucide-react";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";

type Profile = {
  profile: {
    avatar_url: string;
    Bio: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
  };
};

function InfoCard({ profile }: Profile) {
  return (
    <aside
      className="flex flex-col items-center gap-4 mt-5 bg-card rounded-2xl  mx-auto
    p-6 shadow-md border border-gray-200 
    hover:border-primary-400 w-full "
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
            {profile.full_name?.split("")[0]}
          </div>
        )}
        {/* Plus button */}
        <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 shadow-md hover:bg-primary/80 transition">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Name & Bio */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-xl font-semibold text-card-foreground">
          {profile.full_name}
        </h3>
        <p className="text-sm text-muted-foreground">{profile.Bio}</p>
      </div>

      {/* Divider */}
      <hr className="w-full border-gray-200" />

      {/* Read-only info */}
      <div className="flex flex-col gap-2 w-full text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>📞</span>
          <p>{profile.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <span>✉️</span>
          <p>{profile.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <span>📅</span>
          <p>
            Joined{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      {/* <button className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90 transition-all duration-200">
        Edit Profile
      </button> */}
      <EditProfileModal profile={profile} />
    </aside>
  );
}

export default InfoCard;
