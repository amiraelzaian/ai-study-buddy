import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/app/_lib/supabase";

// setup
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

    let generatedTitle: string | null = null;

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
      // =================== NEW CONVERSATION ===================

      // 1. Generate title using Gemini
      const titlePrompt = `
Generate a short title (3 to 6 words max) for this conversation.

Question:
${question}

Rules:
- Very short
- No punctuation
- No quotes
- Must describe topic clearly
`;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const titleResult = await model.generateContent(titlePrompt);
      generatedTitle = titleResult.response.text().trim();

      // 2. Create conversation in DB with title
      const { data: newConversation } = await supabase
        .from("conversation")
        .insert({
          user_id: userId,
          subject,
          mode,
          title: generatedTitle,
        })
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
    }]
    }
      `,
    };
    const prompt = prompts[mode] || prompts.explain;

    // =================== 4. Call Gemini===================

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    let answer = "";

    if (history.length > 0) {
      const chat = model.startChat({
        history: history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      answer = result.response.text();
    } else {
      const result = await model.generateContent(prompt);
      answer = result.response.text();
    }
    // =================== 5. Save Messages ===================

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

    // =================== 6. Update Count===================

    await supabase
      .from("ai_usage")
      .update({
        daily_count: (usage?.daily_count || 0) + 1,
      })
      .eq("user_id", userId);

    // =================== 7. Parse JSON if needed ===================

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
      } catch (error) {
        console.error("Response is Text not json", error);
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
