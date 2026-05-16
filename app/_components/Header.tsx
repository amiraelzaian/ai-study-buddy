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
import { signOut } from "@/app/_lib/actions";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function Header() {
  const { user, loading } = useUser();
  const { isMobile } = useScreenSize();
  const router = useRouter();
  let pathname = usePathname();
  pathname = pathname.split("/")[1];
  const isDshboard = pathname === "dashboard";
  return (
    <section
      className="w-full fixed top-0 left-0 bg-card px-2 md:px-4 py-2
  flex justify-between items-center shadow-sm z-50 bg-opacity-50"
    >
      <div className="flex gap-5 items-center justify-center">
        {!isDshboard && (
          <button
            onClick={() => router.push(`/dashboard`)}
            className="text-primary-500"
          >
            <ArrowLeft />
          </button>
        )}
        <Logo />
      </div>

      {isDshboard && (
        <div className="flex gap-2 justify-center items-center">
          <Theme />
          {!loading && user && (
            <>
              {" "}
              <Link href="/profile">
                <Avatar size="default" className="shadow-md cursor-pointer">
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.name}
                  />
                  <AvatarFallback>
                    {user.user_metadata.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                  <AvatarBadge />
                </Avatar>
              </Link>
              {!isMobile && (
                <span className="text-forground">
                  {user.user_metadata.name.split(" ")[0] ||
                    user.user_metadata.full_name}
                </span>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {!isMobile && <span>Logout</span>}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default Header;
