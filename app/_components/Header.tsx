"use client";
import { useUser } from "@/app/_hooks/useUser";
import Logo from "./Logo";

function Header() {
  const { user, loading } = useUser();
  console.log(user, loading);

  return (
    <section className="w-full fixed top-0 left-0 bg-forground p-2 flex justify-between items-center">
      <Logo />
      {!loading && user && (
        <span className="text-white text-sm">{user.email}</span>
      )}
    </section>
  );
}

export default Header;
