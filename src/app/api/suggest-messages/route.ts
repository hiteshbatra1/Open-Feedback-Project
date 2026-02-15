import OpenAI from "openai";

import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like Qooh.me. Avoid personal or sensitive topics and focus on universal, friendly themes.";

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error("No output generated");
    }

    return NextResponse.json({
      success: true,
      result: text,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
