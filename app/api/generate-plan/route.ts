import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyPlan } from "@/lib/gemini";
import { requireSession, handleApiError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const unauth = requireSession(req, 'generate-plan');
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { businessName, industry, targetAudience } = body;

    if (!businessName || !industry || !targetAudience) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (typeof businessName !== 'string' || typeof industry !== 'string' || typeof targetAudience !== 'string') {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }
    if (businessName.length > 200 || industry.length > 200 || targetAudience.length > 1000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const data = await generateWeeklyPlan({ businessName, industry, targetAudience });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
