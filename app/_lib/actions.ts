// app/_lib/actions.ts
"use server";

import { supabase } from "./supabase";
import { redirect } from "next/navigation";

// =================== SIGN UP ===================
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Something went wrong" };

  await supabase.from("profiles").insert({
    id: data.user.id,
    email,
    full_name: fullName,
  });

  await supabase.from("streaks").insert({
    user_id: data.user.id,
    current_streak: 0,
    longest_streak: 0,
  });

  await supabase.from("ai_usage").insert({
    user_id: data.user.id,
    daily_count: 0,
    last_reset: new Date().toISOString().split("T")[0],
  });

  redirect("/dashboard");
}

// =================== SIGN IN ===================
export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

// =================== GOOGLE ===================
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/loading`,
    },
  });

  if (error) return { error: error.message };

  return { url: data.url };
}
// export async function signInWithGoogle() {
//   await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: `${window.location.origin}/auth/callback`,
//       queryParams: {
//         access_type: "offline",
//         prompt: "consent",
//       },
//     },
//   });
// }

// =================== SIGN OUT ===================
export async function signOut() {
  await supabase.auth.signOut();
  redirect("/login");
}

// =================== GET USER ===================
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// =================== GET PROFILE ===================
export async function getProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data;
}

// =================== GET STREAK ===================
export async function getStreak(userId: string) {
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

// =================== UPDATE STREAK ===================
export async function updateStreak(userId: string) {
  const streak = await getStreak(userId);

  if (!streak) return;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = streak.current_streak;

  if (streak.last_study_date === yesterdayStr) {
    newStreak += 1;
  } else if (streak.last_study_date !== today) {
    newStreak = 1;
  }

  await supabase
    .from("streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, streak.longest_streak),
      last_study_date: today,
    })
    .eq("user_id", userId);
}

// =================== SAVE STUDY SESSION ===================
export async function saveStudySession(
  userId: string,
  topic: string,
  subject: string,
  mode: string,
  score?: number,
) {
  const { error } = await supabase.from("study_sessions").insert({
    user_id: userId,
    topic,
    subject_id: null,
    mode,
    score: score || null,
  });

  if (error) return { error: error.message };

  await updateStreak(userId);

  return { error: null };
}

// =================== GET STUDY SESSIONS ===================
export async function getStudySessions(userId: string) {
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return data || [];
}
