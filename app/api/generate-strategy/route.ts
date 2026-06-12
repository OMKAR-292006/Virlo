import { NextRequest, NextResponse } from "next/server";
import { generateMarketingStrategy } from "@/lib/gemini";
import { requireSession, handleApiError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  const unauth = requireSession(req, 'generate-strategy');
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { businessName, industry, targetAudience, goals } = body;

    if (!businessName || !industry || !targetAudience || !Array.isArray(goals)) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (typeof businessName !== 'string' || typeof industry !== 'string' || typeof targetAudience !== 'string') {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }
    if (businessName.length > 200 || industry.length > 200 || targetAudience.length > 1000) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }
    if (goals.length > 10 || goals.some((g: unknown) => typeof g !== 'string' || g.length > 200)) {
      return NextResponse.json({ error: "Invalid goals." }, { status: 400 });
    }

    const data = await generateMarketingStrategy({ businessName, industry, targetAudience, goals });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
