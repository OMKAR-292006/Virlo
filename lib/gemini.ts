import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

if (!process.env.GEMINI_API_KEY) {
  logger.warn("Missing GEMINI_API_KEY environment variable. API calls will fail.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface StrategyParams {
  businessName: string;
  industry: string;
  targetAudience: string;
  goals: string[];
}

export interface StrategyResponse {
  brandTone: string;
  contentPillars: string[];
  marketingStrategy: string;
  competitorPositioning: string;
  weeklyCampaignIdeas: Array<{
    title: string;
    description: string;
    platform: string;
  }>;
}

async function callGeminiWithFallback(prompt: string, expectJson: boolean = true) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-flash-lite", "gemini-flash-lite-latest", "gemini-flash-latest"];
  let lastError = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: expectJson ? { responseMimeType: "application/json" } : {}
      });
      return result.response.text();
    } catch (error: any) {
      logger.warn(`Gemini fallback: model ${modelName} failed`, { error: error.message });
      lastError = error;
    }
  }

  throw lastError;
}

export async function generateMarketingStrategy(params: StrategyParams): Promise<StrategyResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert AI marketing strategist. Generate a comprehensive marketing strategy based on the following inputs.
    
    Business Name: ${params.businessName}
    Industry: ${params.industry}
    Target Audience: ${params.targetAudience}
    Goals: ${params.goals.join(', ')}

    Please generate a detailed strategy and return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks:
    {
      "brandTone": "A paragraph describing the recommended brand tone.",
      "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3"],
      "marketingStrategy": "A comprehensive paragraph explaining the overall marketing strategy.",
      "competitorPositioning": "How to position against competitors.",
      "weeklyCampaignIdeas": [
        {
          "title": "Campaign Idea 1",
          "description": "Description of the campaign.",
          "platform": "e.g., Instagram, LinkedIn"
        }
      ]
    }
  `;

  try {
    let responseText = await callGeminiWithFallback(prompt);
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(responseText) as StrategyResponse;
  } catch (error: any) {
    logger.error('generateMarketingStrategy failed', { error: error.message });
    throw new Error(`AI Error: ${error.message || "Failed to generate strategy"}`);
  }
}

export interface CaptionParams {
  product: string;
  targetAudience: string;
  tone: string;
}

export interface CaptionResponse {
  captions: string[];
  hashtags: string[];
  cta: string;
  reelIdea: string;
}

export async function generateCaptions(params: CaptionParams): Promise<CaptionResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert social media manager. Generate 3 engaging Instagram captions, relevant hashtags, a call to action, and a short reel idea based on the following inputs.
    
    Product/Service: ${params.product}
    Target Audience: ${params.targetAudience}
    Tone: ${params.tone}

    Please return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks:
    {
      "captions": ["Caption 1...", "Caption 2...", "Caption 3..."],
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "cta": "The strong call to action text.",
      "reelIdea": "A short, creative idea for an Instagram Reel."
    }
  `;

  try {
    let responseText = await callGeminiWithFallback(prompt);
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(responseText) as CaptionResponse;
  } catch (error: any) {
    logger.error('generateCaptions failed', { error: error.message });
    throw new Error(`AI Error: ${error.message || "Failed to generate captions"}`);
  }
}

export interface PlannerParams {
  businessName: string;
  industry: string;
  targetAudience: string;
}

export interface PlannerResponse {
  days: Array<{
    day: string;
    postType: string;
    captionIdea: string;
    cta: string;
    hashtags: string[];
    postingTime: string;
  }>;
}

export async function generateWeeklyPlan(params: PlannerParams): Promise<PlannerResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const prompt = `
    You are an expert social media manager. Generate a 7-day social media content plan based on the following business context.
    
    Business Name: ${params.businessName}
    Industry: ${params.industry}
    Target Audience: ${params.targetAudience}

    Please generate a 7-day plan (Monday to Sunday) and return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks:
    {
      "days": [
        {
          "day": "Monday",
          "postType": "Educational Carousel",
          "captionIdea": "3 myths about...",
          "cta": "Save this post...",
          "hashtags": ["#tag1", "#tag2"],
          "postingTime": "10:00 AM"
        }
      ]
    }
    Ensure the array has exactly 7 items, one for each day of the week in order from Monday to Sunday.
  `;

  try {
    let responseText = await callGeminiWithFallback(prompt);
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(responseText) as PlannerResponse;
  } catch (error: any) {
    logger.error('generateWeeklyPlan failed', { error: error.message });
    throw new Error(`AI Error: ${error.message || "Failed to generate weekly plan"}`);
  }
}

export interface FestivalParams {
  festivalName: string;
  businessName: string;
  industry: string;
}

export interface FestivalResponse {
  suggestedCampaign: string;
  marketingSuggestions: string[];
  suggestedHashtags: string[];
}

export async function generateFestivalCampaign(params: FestivalParams): Promise<FestivalResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const prompt = `
    You are an expert AI marketing strategist. A business wants to run a marketing campaign for an upcoming festival.
    
    Festival Name: ${params.festivalName}
    Business Name: ${params.businessName}
    Industry: ${params.industry}

    Generate a targeted campaign idea, key marketing suggestions, and relevant hashtags.
    Please return ONLY a valid JSON object matching this exact structure, with no markdown formatting or backticks:
    {
      "suggestedCampaign": "A catchy, one-paragraph description of the campaign idea.",
      "marketingSuggestions": ["Actionable suggestion 1", "Actionable suggestion 2", "Actionable suggestion 3"],
      "suggestedHashtags": ["#tag1", "#tag2", "#tag3"]
    }
  `;

  try {
    let responseText = await callGeminiWithFallback(prompt);
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(responseText) as FestivalResponse;
  } catch (error: any) {
    logger.error('generateFestivalCampaign failed', { error: error.message });
    throw new Error(`AI Error: ${error.message || "Failed to generate festival campaign"}`);
  }
}
