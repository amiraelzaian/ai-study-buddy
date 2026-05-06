"use client";
import { useUser } from "@/app/_hooks/useUser";
import Logo from "./Logo";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Theme from "./Theme";
import { useScreenSize } from "@/hooks/useScreen";

function Header() {
  const { user, loading } = useUser();
  const { isMobile } = useScreenSize();

  return (
    <section
      className="w-full fixed top-0 left-0 bg-card px-2 md:px-4 py-2
  flex justify-between items-center shadow-sm"
    >
      <Logo />

      <div
        className="flex gap-2 justify-center items-center
        "
      >
        <Theme />
        {!loading && user && (
          <>
            <Avatar size="default" className="shadow-md">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.name}
              />
              <AvatarFallback>
                {user.user_metadata.name.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarBadge />
            </Avatar>
            {!isMobile && (
              <span className=" text-forground">
                {user.user_metadata.name.split(" ")[0] ||
                  user.user_metadata.full_name}
              </span>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Header;
