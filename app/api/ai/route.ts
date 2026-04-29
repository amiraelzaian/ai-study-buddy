import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/app/_lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const DAILY_LIMIT = 20;

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

    // =================== 1. Check Limit ===================
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (usage) {
      // if new day
      if (usage.last_reset !== today) {
        await supabase
          .from("ai_usage")
          .update({
            daily_count: 0,
            last_reset: today,
          })
          .eq("user_id", userId);
        usage.daily_count = 0;
      }
      // check limit: limit reached?
      if (usage.daily_count >= DAILY_LIMIT) {
        return NextResponse.json(
          { error: "Daily limit reached", limit: DAILY_LIMIT },
          { status: 429 },
        );
      }
    } else {
      // first time to record
      await supabase
        .from("ai_usage")
        .insert({ user_id: userId, daily_count: 0, last_reset: today });
    }
    // =================== 2. Get history ===================

    let history: { role: string; text: string }[] = [];
    let currentConversationId = conversationId;

    if (conversationId) {
      // old conversation
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      history =
        messages?.map((m) => ({
          role: m.role,
          text: m.content,
        })) || [];
    } else {
      // new conversation
      const { data: newConversation } = await supabase
        .from("conversation")
        .insert({ user_id: userId, subject, mode })
        .select()
        .single();

      currentConversationId = newConversation?.id;
    }
    // =================== 3.Build prompt ===================

    const prompts: Record<string, string> = {
      explain: `You are a helpful study assistant.
        Subject: ${subject || "General"}
        Explain the following clearly with examples:
        ${question}`,
      quiz: `
      You are a quiz generator.
      Subject:${subject || "General"}
      Topic:${question}
      Generate 10 MCQ guestions in theis exact JSON format:
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
            Subject:${subject || "General"}
      Topic:${question}
      Generate 5 flashcards in this exact JSON format:
      {
        "flashcards": [
          {
              "front": "Question or term",
              "back": "Answer or definition"
            }
            ]
      `,
    };
    const prompt = prompts[mode] || prompts.explain;

    // =================== 4. Call Gemini===================
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
