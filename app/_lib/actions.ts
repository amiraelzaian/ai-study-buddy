//signIn,singup,signout
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

// Email Signup

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { error };

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
  return { data, error: null };
}
// Email Login
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Google Login
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
}

// Logout
export async function signOUt() {
  await supabase.auth.signOut();
  redirect("/login");
}

// Get Current User

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
