import { NextResponse } from "next/server";
import { generateWeeklyPlan } from "@/lib/gemini";

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
    const { businessName, industry, targetAudience } = body;

    if (!businessName || !industry || !targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, industry, targetAudience" },
        { status: 400 }
      );
    }

    const planData = await generateWeeklyPlan({ businessName, industry, targetAudience });
    return NextResponse.json({ success: true, data: planData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return handleApiError(error);
  }
}
