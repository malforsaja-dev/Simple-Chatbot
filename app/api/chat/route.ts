import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { input } = await req.json();

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Summarize the following text:' },
        { role: 'user', content: input },
      ],
    }),
  });

  const data = await openaiRes.json();
  const response = data.choices?.[0]?.message?.content?.trim();

  if (!response) {
    return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
  }

  const saved = await prisma.chat.create({
    data: { input, response },
  });

  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saved),
  });

  return NextResponse.json({ response });
}
