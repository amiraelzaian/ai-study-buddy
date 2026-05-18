# 🧠 AI Study Buddy

> Your daily AI-powered study companion — learn smarter, not harder.

Live Demo → [ai-study-buddy-blond-gamma.vercel.app](https://ai-study-buddy-blond-gamma.vercel.app)

---

## ✨ Features

- **AI Explanations** — Get clear, detailed explanations on any topic
- **Quiz Generator** — Auto-generate multiple choice quizzes to test your knowledge
- **Flashcards** — Generate flashcards for quick review sessions
- **Study Streaks** — Track your daily study consistency
- **Progress Dashboard** — Visualize your study activity and performance
- **Session History** — Review all your past study sessions
- **Google & Email Auth** — Sign in with Google or email/password
- **Dark Mode** — Full light/dark theme support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Auth & Database | Supabase |
| AI |  Cerebras AI |
| Charts | Recharts |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/amiraelzaian/ai-study-buddy.git
cd ai-study-buddy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

Run the following in your Supabase SQL Editor to set up triggers for automatic user initialization:

```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();
```

---

## 📁 Project Structure

```
app/
├── _components/     # Shared UI components
├── _hooks/          # Custom React hooks
├── _lib/            # Supabase client, server actions
├── api/             # API routes (AI, auth)
├── auth/            # Auth callback
├── dashboard/       # Dashboard page
├── profile/         # Profile page
├── study/           # Study area + session pages
├── login/           # Login page
└── signup/          # Signup page
```

---

## 🔐 Authentication

- Email/password with confirmation
- Google OAuth via Supabase
- Protected routes via middleware

---



## 📄 License

MIT License — feel free to use and modify.

---

Made with ❤️ by [Amira Alzaian](https://github.com/amiraelzaian)
