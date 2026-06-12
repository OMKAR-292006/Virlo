import { NextResponse } from "next/server";
import { generateCaptions } from "@/lib/gemini";

function handleApiError(error: any) {
  const msg: string = error?.message || '';
  if (msg.includes('429') || msg.toLowerCase().includes('too many requests') || msg.toLowerCase().includes('quota')) {
    return NextResponse.json({ error: 'Rate limit reached. Please wait a moment and try again.' }, { status: 429 });
  }
  return NextResponse.json({ error: msg || 'An unexpected error occurred' }, { status: 500 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product, targetAudience, tone } = body;
    if (!product || !targetAudience || !tone) {
      return NextResponse.json({ error: "Missing required fields: product, targetAudience, tone" }, { status: 400 });
    }
    // Basic input length limits to prevent abuse
    if (product.length > 2000 || targetAudience.length > 500) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }
    const captionsData = await generateCaptions({ product, targetAudience, tone });
    return NextResponse.json({ success: true, data: captionsData });
  } catch (error: any) {
    return handleApiError(error);
  }
}
