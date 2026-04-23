//just for google

import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata.full_name,
          avatar_url: data.user.user_metadata.avatar_url,
        });

        await supabase.from("streaks").insert({
          user_id: data.user.id,
          current_streak: 0,
          longest_streak: 0,
        });
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }
}
