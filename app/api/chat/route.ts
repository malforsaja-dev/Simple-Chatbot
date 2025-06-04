import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Summarize the following text:" },
          { role: "user", content: input },
        ],
      }),
    });
  
    const data = await openaiRes.json();
    const response = data.choices?.[0]?.message?.content?.trim();
  
    if (!response) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }
  
    const chat = await prisma.chat.create({
      data: { input, response },
    });

    await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chat),
    });

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again later." },
      { status: 500 }
    );
  }
}
