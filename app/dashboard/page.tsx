"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { useRouter } from "next/navigation";
import PageLoading from "../_components/PageLoading";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    check();
  }, [router]);

  if (loading) return <PageLoading />;

  return <div>Welcome 🎉</div>;
}
