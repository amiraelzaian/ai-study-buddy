import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/app/_lib/supabase/client";

// =================== SETUP ===================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DAILY_LIMIT = 20;

// Fallback models
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
];

async function generateWithFallback(prompt: string) {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e: any) {
      console.warn(`Model ${modelName} failed:`, e.message);
      continue;
    }
  }
  throw new Error("All models failed");
}

async function chatWithFallback(
  history: { role: string; parts: { text: string }[] }[],
  prompt: string,
) {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (e: any) {
      console.warn(`Model ${modelName} failed:`, e.message);
      continue;
    }
  }
  throw new Error("All models failed");
}

// =================== API ROUTE ===================
export async function POST(request: Request) {
  try {
    const { question, subject, mode, userId, conversationId } =
      await request.json();

    if (!question || !userId) {
      return NextResponse.json(
        { error: "Question and userId are required" },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // =================== 1. CHECK LIMIT ===================
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (usage) {
      if (usage.last_reset !== today) {
        await supabase
          .from("ai_usage")
          .update({ daily_count: 0, last_reset: today })
          .eq("user_id", userId);
        usage.daily_count = 0;
      }

      if (usage.daily_count >= DAILY_LIMIT) {
        return NextResponse.json(
          { error: "Daily limit reached", limit: DAILY_LIMIT },
          { status: 429 },
        );
      }
    } else {
      await supabase
        .from("ai_usage")
        .insert({ user_id: userId, daily_count: 0, last_reset: today });
    }

    // =================== 2. HISTORY ===================
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
      const { data: newConversation } = await supabase
        .from("conversations")
        .insert({ user_id: userId, subject, mode })
        .select()
        .maybeSingle();

      currentConversationId = newConversation?.id;
    }

    // =================== 3. PROMPTS ===================
    const prompts: Record<string, string> = {
      explain: `
You are a helpful study assistant.
Subject: ${subject || "General"}
Explain clearly with examples:
${question}
      `,
      quiz: `
You are a quiz generator.
Subject: ${subject || "General"}
Topic: ${question}
Generate 10 MCQ questions in this exact JSON format only, no extra text:
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
Generate 5 flashcards in this exact JSON format only, no extra text:
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

    // =================== 4. GEMINI CALL ===================
    let answer = "";

    if (history.length > 0) {
      answer = await chatWithFallback(history, prompt);
    } else {
      answer = await generateWithFallback(prompt);
    }

    // =================== 5. SAVE MESSAGES ===================
    await supabase.from("messages").insert([
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

    // =================== 6. UPDATE USAGE ===================
    await supabase
      .from("ai_usage")
      .update({ daily_count: (usage?.daily_count || 0) + 1 })
      .eq("user_id", userId);

    // =================== 7. RESPONSE ===================
    if (mode === "quiz" || mode === "flashcard") {
      try {
        const clean = answer.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        return NextResponse.json({
          ...parsed,
          mode,
          conversationId: currentConversationId,
          remaining: DAILY_LIMIT - (usage?.daily_count || 0) - 1,
        });
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    return NextResponse.json({
      answer,
      mode,
      conversationId: currentConversationId,
      remaining: DAILY_LIMIT - (usage?.daily_count || 0) - 1,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
