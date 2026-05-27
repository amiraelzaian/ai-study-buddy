import { Message } from "./../../study/[conversationId]/_explain/explain.utils";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createSupabaseServer = async () => {
  // this cookies is from next
  // we use it as server has no local storage so
  // we want thing to store the data in it like (cookies )
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // get the current session
        getAll: () => cookieStore.getAll(),
        // set new sessions like ( acess token and refresh token)
        setAll: (
          cookiesToSet: { name: string; value: string; options: any }[],
        ) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (error) {
            console.error(error);
          }
        },
      },
    },
  );
};
