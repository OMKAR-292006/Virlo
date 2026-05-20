import { NextResponse } from "next/server";
import { generateFestivalCampaign } from "@/lib/gemini";

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

    const campaignData = await generateFestivalCampaign({
      festivalName,
      businessName,
      industry
    });

    return NextResponse.json({ success: true, data: campaignData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
