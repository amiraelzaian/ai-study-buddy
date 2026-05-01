"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supabase";

export default function AuthLoading() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      // 👇 1. خدي التوكن من URL
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

      // 👇 2. خزني السيشن
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      await new Promise((res) => setTimeout(res, 500));
      if (error) {
        router.push("/login");
        return;
      }

      // 👇 3. دلوقتي getSession هيشتغل
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      // 👇 4. create profile
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

      // 👇 5. نظفي الرابط
      window.history.replaceState({}, document.title, "/dashboard");

      router.replace("/dashboard");
    };

    run();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Logging you in...</p>
    </div>
  );
}
