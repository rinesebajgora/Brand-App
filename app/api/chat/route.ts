import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: NextRequest) {

  try {

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Mesazhi është bosh" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Ti je ekspert marketingu për social media. Gjenero një post kreativ për një brand me emoji dhe hashtags."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error) {

    console.error("Groq API error:", error);

    return NextResponse.json(
      { error: "Gabim gjatë komunikimit me AI" },
      { status: 500 }
    );

  }
}
