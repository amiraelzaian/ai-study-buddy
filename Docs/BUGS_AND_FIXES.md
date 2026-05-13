# AI Study Buddy — Bugs & Fixes Documentation

## 1. Supabase Rate Limit (429)

**Error:** `AuthApiError: Request rate limit reached`  
**Cause:** Multiple components calling `getCurrentUser()` and `getStudySessions()` independently on each render.  
**Fix:**

- Wrap all read actions with `cache()` from React
- Fetch all data once in `page.tsx` and pass as props
- Remove data fetching from child components like `ProgressSection`

```typescript
export const getCurrentUser = cache(async () => { ... });
export const getProfile = cache(async (userId: string) => { ... });
export const getStudySessions = cache(async (userId: string) => { ... });
export const getStreak = cache(async (userId: string) => { ... });
export const getSubjectsByUser = cache(async (userId: string) => { ... });
```

---

## 2. Refresh Token Already Used (400)

**Error:** `AuthApiError: Invalid Refresh Token: Already Used`  
**Cause:** `createSupabaseServer` was wrapped with `cache()`, returning the same client instance across requests. When a token refreshed after a POST, the next request reused the old cached client with the already-used token.  
**Fix:** Remove `cache()` from `createSupabaseServer` — only cache action functions, not the client creator.

```typescript
// ✅ No cache() here
export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(...);
}
```

---

## 3. Too Many Redirects (ERR_TOO_MANY_REDIRECTS)

**Error:** `ERR_TOO_MANY_REDIRECTS` on `/login`  
**Cause:** Middleware error handler was triggering on the `/login` page itself, causing an infinite redirect loop.  
**Fix:** Check the pathname before running Supabase in middleware — skip auth pages entirely.

```typescript
if (
  pathname.startsWith("/auth") ||
  pathname === "/login" ||
  pathname === "/signup"
) {
  return NextResponse.next();
}
```

---

## 4. Google OAuth — Profile Not Created

**Error:** New Google users redirected to `/login` when accessing `/profile`  
**Cause:** Google OAuth login doesn't automatically create rows in `profiles`, `streaks`, or `ai_usage` tables.  
**Fix:** In `auth/loading/route.ts`, exchange the OAuth code and create missing rows.

```typescript
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const code = new URL(request.url).searchParams.get("code");

  if (code) await supabase.auth.exchangeCodeForSession(code);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: existingProfile } = await supabase
    .from("profiles").select("id").eq("id", user.id).maybeSingle();

  if (!existingProfile) {
    await supabase.from("profiles").insert({ id: user.id, email: user.email, ... });
    await supabase.from("streaks").insert({ user_id: user.id, current_streak: 0, longest_streak: 0 });
    await supabase.from("ai_usage").insert({ user_id: user.id, daily_count: 0 });
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

---

## 5. Profile Page Crash on Missing Profile

**Error:** Page crashes or redirects when `profile` is null  
**Cause:** New Google users may not have a profile row yet when first visiting `/profile`  
**Fix:** Use a safe fallback object instead of crashing.

```typescript
const safeProfile = profile ?? {
  id: userId,
  full_name: user.user_metadata?.full_name ?? "",
  email: user.email ?? "",
  avatar_url: user.user_metadata?.avatar_url ?? null,
  Bio: "",
  phone: "",
  created_at: user.created_at ?? "",
};
```

---

## 6. Edit Profile Redirects to Login

**Error:** Clicking "Save Changes" redirects to `/login`  
**Cause 1:** Expired session token in browser cookies  
**Cause 2:** `setOpen` was not defined in `EditProfileModal`  
**Fix:**

- Clear browser cookies and sign in fresh
- Add `const [open, setOpen] = useState(false)` in modal
- Pass controlled state to Dialog: `<Dialog open={open} onOpenChange={setOpen}>`
- Add `revalidatePath("/profile")` after successful update

```tsx
const [open, setOpen] = useState(false);

async function onSubmit(formData) {
  await updateProfile(profile.id, formData);
  setOpen(false); // ✅ close modal on success
}

<Dialog open={open} onOpenChange={setOpen}>
```

---

## 7. Middleware Not Protecting `/profile`

**Error:** Unauthenticated users could access `/profile`  
**Cause:** Middleware only protected `/dashboard`, not `/profile`  
**Fix:** Add `/profile` to protected routes in middleware.

```typescript
if (
  !user &&
  (pathname.startsWith("/dashboard") || pathname.startsWith("/profile"))
) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

---

## 8. Overflow on Dashboard Layout

**Error:** Horizontal scroll/overflow on mobile  
**Cause:** `w-full` + `mx-4` used together — margin pushes outside the width  
**Fix:** Use `px-4` (padding) only, never `mx-4` with `w-full`

```tsx
// ❌ Wrong
<section className="w-full px-4 mx-4">

// ✅ Correct
<section className="w-full px-4">
```

---

## 9. Wrong Type Causing grayscale Not Working

**Error:** Achievement cards always showed grayscale  
**Cause:** `isActive` was passed as a string `"true"/"false"` instead of a boolean  
**Fix:** Pass boolean directly without template literal

```tsx
// ❌ Wrong — string
isActive={`${longestStreak >= 7}`}

// ✅ Correct — boolean
isActive={longestStreak >= 7}
```

---

## 10. sessions.map().filter() Error

**Error:** `.filter is not a function`  
**Cause:** Used `sessions.map((s) => s.filter(...))` — `.filter()` doesn't exist on objects  
**Fix:** Use `.filter()` directly on the sessions array

```typescript
// ❌ Wrong
const numOfQuizzes = sessions.map((s) => s.filter((m) => m.mode === "quiz"));

// ✅ Correct
const numOfQuizzes = sessions.filter((s) => s.mode === "quiz").length;
```

---

## General Rules Learned

| Rule                                          | Reason                                        |
| --------------------------------------------- | --------------------------------------------- |
| Never use `cache()` on `createSupabaseServer` | Token refreshes need a fresh client each time |
| Always use `cache()` on read actions          | Prevents duplicate DB calls per request       |
| Fetch data only in `page.tsx`                 | Avoid redundant child fetches                 |
| Use `px-4` not `mx-4 + w-full`                | Prevents overflow                             |
| Always pass booleans not strings to props     | Avoids truthy/falsy bugs                      |
| Add `revalidatePath` after mutations          | Ensures UI reflects latest data               |
