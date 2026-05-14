import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent("Say hello");
    const text = result.response.text();

    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e.message,
        details: e,
      },
      { status: 500 },
    );
  }
}
