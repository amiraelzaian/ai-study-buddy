// app/_hooks/useUser.ts
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "../_lib/actions";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function init() {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
