import { NextResponse } from "next/server";
import { generateMarketingStrategy } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { businessName, industry, targetAudience, goals } = body;

    // Validation
    if (!businessName || !industry || !targetAudience || !goals || !Array.isArray(goals)) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, industry, targetAudience, goals (array)" },
        { status: 400 }
      );
    }

    const strategy = await generateMarketingStrategy({
      businessName,
      industry,
      targetAudience,
      goals
    });

    return NextResponse.json({ success: true, data: strategy });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
