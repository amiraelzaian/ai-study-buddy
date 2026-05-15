// app/api/ai/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseServer } from "@/app/_lib/supabase/server";

// =================== SETUP ===================
const cerebras = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

const DAILY_LIMIT = 20;

async function generateAIResponse(
  history: { role: string; parts: { text: string }[] }[],
  prompt: string,
) {
  const messages = history.map((m) => ({
    role: m.role === "model" ? "assistant" : ("user" as "assistant" | "user"),
    content: m.parts[0].text,
  }));

  messages.push({ role: "user", content: prompt });

  const completion = await cerebras.chat.completions.create({
    model: "llama-3.1-8b",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI study assistant that explains topics clearly and accurately.",
      },
      ...messages,
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
}

// =================== API ROUTE ===================
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();

    const { question, subject, mode, userId, conversationId } =
      await request.json();

    if (!question || !userId) {
      return NextResponse.json(
        { error: "Question and userId are required" },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // =================== CHECK LIMIT ===================
    let { data: usage } = await supabase
      .from("ai_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (usage) {
      // Reset count if it's a new day
      if (usage.date !== today) {
        await supabase
          .from("ai_usage")
          .update({ requests_count: 0, date: today })
          .eq("user_id", userId);
        usage.requests_count = 0;
      }

      if (usage.requests_count >= DAILY_LIMIT) {
        return NextResponse.json(
          { error: "Daily limit reached", limit: DAILY_LIMIT },
          { status: 429 },
        );
      }
    } else {
      // First time user — insert and treat count as 0
      await supabase.from("ai_usage").insert({
        user_id: userId,
        requests_count: 0,
        date: today,
      });
      usage = { requests_count: 0, date: today };
    }

    // =================== HISTORY ===================
    let history: { role: string; parts: { text: string }[] }[] = [];
    let currentConversationId = conversationId;

    if (conversationId) {
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      history =
        messages?.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })) || [];
    } else {
      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({ user_id: userId, subject, mode })
        .select()
        .maybeSingle();

      if (convError || !newConversation) {
        console.error("Failed to create conversation:", convError);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 },
        );
      }

      currentConversationId = newConversation.id;
    }

    // =================== PROMPTS ===================
    const prompts: Record<string, string> = {
      explain: `
You are a helpful study assistant.
Subject: ${subject || "General"}

Explain the following topic using markdown.
Use ## for main section headings.
Use **bold** for key terms.
Include examples where relevant.

${question}
`,
      quiz: `
You are a quiz generator.

Subject: ${subject || "General"}
Topic: ${question}

Generate 10 MCQ questions in this exact JSON format only.
No markdown.
No extra text.

{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "..."
    }
  ]
}
      `,
      flashcard: `
You are a flashcard generator.

Subject: ${subject || "General"}
Topic: ${question}

Generate 5 flashcards in this exact JSON format only.
No markdown.
No extra text.

{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}
      `,
    };

    const prompt = prompts[mode] || prompts.explain;

    // =================== AI CALL ===================
    const answer = await generateAIResponse(history, prompt);

    // =================== SAVE MESSAGES ===================
    const { error: msgError } = await supabase.from("messages").insert([
      {
        conversation_id: currentConversationId,
        role: "user",
        content: question,
      },
      {
        conversation_id: currentConversationId,
        role: "model",
        content: answer,
      },
    ]);

    if (msgError) {
      console.error("Failed to save messages:", msgError);
    }

    // =================== UPDATE USAGE ===================
    // Use current daily_count from DB to avoid stale value
    await supabase
      .from("ai_usage")
      .update({ requests_count: usage.requests_count + 1 })
      .eq("user_id", userId);

    const remaining = DAILY_LIMIT - usage.requests_count - 1;

    // =================== RESPONSE ===================
    if (mode === "quiz" || mode === "flashcard") {
      try {
        const clean = answer.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({
          ...parsed,
          mode,
          conversationId: currentConversationId,
          remaining,
        });
      } catch (e) {
        console.error("JSON parse error:", e);
        return NextResponse.json(
          { error: "Failed to parse AI response" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      answer,
      mode,
      conversationId: currentConversationId,
      remaining,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
