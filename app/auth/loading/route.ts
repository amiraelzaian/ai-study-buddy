// app/auth/loading/route.ts
import { createSupabaseServer } from "@/app/_lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get("code");
  console.log("code:", code ? "EXISTS" : "MISSING");

  if (!code) {
    console.log("no code");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log("exchange error:", error);
  console.log("exchange user:", data?.user?.email);

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // =================== CREATE PROFILE FOR GOOGLE USERS ===================
  const user = data.user;
  if (user) {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
      },
      { onConflict: "id", ignoreDuplicates: true }, // don't overwrite existing profile
    );

    await supabase.from("streaks").upsert(
      {
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    );

    await supabase.from("ai_usage").upsert(
      {
        user_id: user.id,
        requests_count: 0,
        date: new Date().toISOString().split("T")[0],
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
