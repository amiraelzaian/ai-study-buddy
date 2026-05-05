"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supabase/client";
import PageLoading from "@/app/_components/PageLoading";

export default function AuthLoading() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      //take token from Url
      const hash = window.location.hash;

      if (!hash) {
        router.push("/login");
        return;
      }

      const params = new URLSearchParams(hash.replace("#", ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      // we await to make sure that session is set successfully
      await new Promise((res) => setTimeout(res, 500));

      if (error) {
        router.push("/login");
        return;
      }
      // we use the session that we set accuatly set
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      //  create profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "User",
          avatar_url: user.user_metadata?.avatar_url || null,
        });
      }

      // clean the URL
      // Remove sensitive tokens from the URL (they come in the hash after OAuth)
      // This prevents tokens from being stored in browser history or exposed
      window.history.replaceState({}, document.title, "/dashboard");
      // Now navigate to the dashboard using Next.js router (client-side navigation)
      // This updates the UI without a full page reload
      router.replace("/dashboard");
    };

    run();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-36 h-36 mx-auto">
        <PageLoading />
      </div>
    </div>
  );
}
