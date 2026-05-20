import { NextResponse } from "next/server";
import { generateWeeklyPlan } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { businessName, industry, targetAudience } = body;

    // Validation
    if (!businessName || !industry || !targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, industry, targetAudience" },
        { status: 400 }
      );
    }

    const planData = await generateWeeklyPlan({
      businessName,
      industry,
      targetAudience
    });

    return NextResponse.json({ success: true, data: planData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
