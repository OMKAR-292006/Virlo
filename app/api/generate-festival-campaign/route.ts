import { NextResponse } from "next/server";
import { generateFestivalCampaign } from "@/lib/gemini";

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
    const { festivalName, businessName, industry } = body;

    if (!festivalName || !businessName || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: festivalName, businessName, industry" },
        { status: 400 }
      );
    }

    const campaignData = await generateFestivalCampaign({ festivalName, businessName, industry });
    return NextResponse.json({ success: true, data: campaignData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return handleApiError(error);
  }
}
