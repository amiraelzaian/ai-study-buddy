"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";
import { cache } from "react";

// =================== SIGN UP ===================
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  phone: string,
) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Something went wrong" };

  await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    phone,
  });

  await supabase.from("streaks").upsert({
    user_id: data.user.id,
    current_streak: 0,
    longest_streak: 0,
  });

  await supabase.from("ai_usage").upsert({
    user_id: data.user.id,
    daily_count: 0,
    last_reset: new Date().toISOString().split("T")[0],
  });

  redirect("/dashboard");
}

// =================== SIGN IN ===================
export async function signInWithEmail(email: string, password: string) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

// =================== GOOGLE ===================
export async function signInWithGoogle() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/loading`,
    },
  });

  if (error) return { error: error.message };

  return { url: data.url };
}

// =================== SIGN OUT ===================
export async function signOut() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

// =================== GET USER ===================
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
});

// =================== GET PROFILE ===================
export const getProfile = cache(async (userId: string) => {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data;
});

// =================== GET STREAK ===================
export const getStreak = cache(async (userId: string) => {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
});

// =================== UPDATE STREAK ===================
export async function updateStreak(userId: string) {
  // ❌ don't cache — writes to DB
  const supabase = await createSupabaseServer();
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
  const supabase = await createSupabaseServer();
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
export const getStudySessions = cache(async (userId: string) => {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return data || [];
});

// ================== GET SUBJECT ========================
export const getSubjectsByUser = cache(async (userId: string) => {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("study_sessions")
    .select(
      `
      subject_id,
      subjects (
        id,
        name
      )
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }

  return data;
});

// ================== UPDATE PROFILE ========================
export async function updateProfile(
  userId: string,
  formData: {
    fName: string;
    lName: string;
    bio: string;
    phoneNumber: string;
  },
) {
  const full_name = `${formData.fName} ${formData.lName}`;
  const Bio = formData.bio;
  const phone = formData.phoneNumber;

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name, Bio, phone })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}
