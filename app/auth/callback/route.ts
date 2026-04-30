import { supabase } from "@/app/_lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(`${origin}/login?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const { data, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (sessionError || !data.user) {
    console.error("Session error:", sessionError);
    return NextResponse.redirect(`${origin}/login?error=session_failed`);
  }

  // google for first time

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || "User",
      avatar_url: data.user.user_metadata?.avatar_url || null,
    });

    await supabase.from("ai_usage").insert({
      user_id: data.user.id,
      daily_count: 0,
      last_reset: new Date().toISOString().split("T")[0],
    });

    await supabase.from("streaks").insert({
      user_id: data.user.id,
      current_streak: 0,
      longest_streak: 0,
    });
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
