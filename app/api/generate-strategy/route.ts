import { NextResponse } from "next/server";
import { generateMarketingStrategy } from "@/lib/gemini";

function handleApiError(error: any) {
  const msg: string = error?.message || '';
  if (msg.includes('429') || msg.toLowerCase().includes('too many requests') || msg.toLowerCase().includes('quota')) {
    return NextResponse.json(
      { error: 'Rate limit reached. Please wait a moment and try again.' },
      { status: 429 }
    );
  }
  return NextResponse.json(
    { error: msg || 'An unexpected error occurred' },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, industry, targetAudience, goals } = body;

    if (!businessName || !industry || !targetAudience || !goals || !Array.isArray(goals)) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, industry, targetAudience, goals (array)" },
        { status: 400 }
      );
    }

    const strategy = await generateMarketingStrategy({ businessName, industry, targetAudience, goals });
    return NextResponse.json({ success: true, data: strategy });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return handleApiError(error);
  }
}
