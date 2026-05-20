import { NextResponse } from "next/server";
import { generateCaptions } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { product, targetAudience, tone } = body;

    // Validation
    if (!product || !targetAudience || !tone) {
      return NextResponse.json(
        { error: "Missing required fields: product, targetAudience, tone" },
        { status: 400 }
      );
    }

    const captionsData = await generateCaptions({
      product,
      targetAudience,
      tone
    });

    return NextResponse.json({ success: true, data: captionsData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
