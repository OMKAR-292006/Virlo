import { NextRequest, NextResponse } from "next/server";
import { generateCaptions } from "@/lib/gemini";
import { requireSession, handleApiError } from "@/lib/api-auth";

const VALID_TONES = ['Professional', 'Funny', 'Hype', 'Empathetic'];

export async function POST(req: NextRequest) {
  const unauth = requireSession(req, 'generate-captions');
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { product, targetAudience, tone } = body;

    if (!product || !targetAudience || !tone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (typeof product !== 'string' || typeof targetAudience !== 'string' || typeof tone !== 'string') {
      return NextResponse.json({ error: "Invalid field types." }, { status: 400 });
    }
    if (product.length > 2000 || targetAudience.length > 500) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }
    if (!VALID_TONES.includes(tone)) {
      return NextResponse.json({ error: "Invalid tone value." }, { status: 400 });
    }

    const data = await generateCaptions({ product, targetAudience, tone });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
