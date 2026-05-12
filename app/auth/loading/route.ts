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

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
