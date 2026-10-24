import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient } from "@/lib/gemini";

const RequestSchema = z.object({
  story: z.string().min(10, "Please provide at least a short description of your experience"),
});

const SkillExtractionSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string(),
      category: z.string().optional(),
      evidenceSnippet: z.string().optional(),
      suggestedConfidence: z.number().min(30).max(95).default(60),
    })
  ),
  summary: z.string().optional(),
});

// Deterministic contextual fallback matching South African township and informal economy patterns
function extractFallbackSkills(story: string) {
  const lower = story.toLowerCase();
  const skills: Array<{
    name: string;
    category: string;
    evidenceSnippet: string;
    suggestedConfidence: number;
  }> = [];

  if (
    lower.includes("stock") ||
    lower.includes("count") ||
    lower.includes("inventor") ||
    lower.includes("spaza") ||
    lower.includes("shop")
  ) {
    skills.push({
      name: "Stock Counting & Inventory Auditing",
      category: "Retail & Operations",
      evidenceSnippet: "Experience tracking goods, counting stock items, and auditing shrinkage",
      suggestedConfidence: 65,
    });
  }

  if (
    lower.includes("cash") ||
    lower.includes("till") ||
    lower.includes("drawer") ||
    lower.includes("money") ||
    lower.includes("float") ||
    lower.includes("change")
  ) {
    skills.push({
      name: "Cash Handling & Till Reconciliation",
      category: "Finance & Retail",
      evidenceSnippet: "Processing point-of-sale transactions and reconciling daily floats",
      suggestedConfidence: 70,
    });
  }

  if (
    lower.includes("phone") ||
    lower.includes("screen") ||
    lower.includes("repair") ||
    lower.includes("electron") ||
    lower.includes("fix") ||
    lower.includes("hardware")
  ) {
    skills.push({
      name: "Smartphone & Hardware Diagnostics",
      category: "Technical Services",
      evidenceSnippet: "Troubleshooting consumer devices, replacing components, and hardware recovery",
      suggestedConfidence: 75,
    });
  }

  if (
    lower.includes("deliver") ||
    lower.includes("bicycle") ||
    lower.includes("bike") ||
    lower.includes("courier") ||
    lower.includes("route") ||
    lower.includes("transport")
  ) {
    skills.push({
      name: "Local Route Planning & Last-Mile Logistics",
      category: "Logistics",
      evidenceSnippet: "Navigating local neighborhoods and timely delivery dispatch",
      suggestedConfidence: 65,
    });
  }

  if (
    lower.includes("sound") ||
    lower.includes("church") ||
    lower.includes("mic") ||
    lower.includes("event") ||
    lower.includes("cable") ||
    lower.includes("audio")
  ) {
    skills.push({
      name: "Community Event Audio & Equipment Setup",
      category: "Events & Media",
      evidenceSnippet: "Coordinating AV setups, microphone balancing, and sound check routines",
      suggestedConfidence: 65,
    });
  }

  if (
    lower.includes("child") ||
    lower.includes("care") ||
    lower.includes("babysit") ||
    lower.includes("crèche") ||
    lower.includes("teach") ||
    lower.includes("tutor")
  ) {
    skills.push({
      name: "Childcare & Early Learning Assistance",
      category: "Community & Care",
      evidenceSnippet: "Providing safe supervision, structured activities, and educational assistance",
      suggestedConfidence: 70,
    });
  }

  // Fallbacks if input had no specific keywords
  if (skills.length === 0) {
    skills.push(
      {
        name: "Customer Service & Community Engagement",
        category: "Client Relations",
        evidenceSnippet: "Assisting customers with inquiries and conflict resolution",
        suggestedConfidence: 60,
      },
      {
        name: "Task Coordination & Operations Support",
        category: "General Operations",
        evidenceSnippet: "Reliable execution of daily tasks and team assistance",
        suggestedConfidence: 60,
      }
    );
  }

  return {
    skills,
    summary: "Extracted practical competency signals from your informal experience story.",
    source: "deterministic_baseline" as const,
  };
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { story } = parsed.data;
    const gemini = getGeminiClient();

    if (!gemini) {
      // Deterministic fallback (no external API key required)
      const fallbackResult = extractFallbackSkills(story);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
      });
    }

    // Call Gemini 2.5 Flash for high-speed, high-accuracy skills extraction
    const prompt = `
You are a senior skills taxonomy and workforce development specialist for Kasirize (a South African platform connecting youth to work opportunities).
Analyze this young person's informal work story:
"""
${story}
"""

Translate their informal/everyday activities into 3 to 6 professional, credible skill competencies.
Focus on practical abilities: customer management, inventory auditing, local logistics, technical diagnostics, cash reconciliation, event coordination, etc.

Return your response in pure JSON matching this exact structure:
{
  "skills": [
    {
      "name": "Skill Title (e.g. Stock Counting & Inventory Auditing)",
      "category": "Broad Category (e.g. Operations)",
      "evidenceSnippet": "Direct reference from their story supporting this skill",
      "suggestedConfidence": 65
    }
  ],
  "summary": "Brief 1-sentence affirmation of their practical value."
}
Do not include markdown ticks or additional prose. Output valid JSON only.
`;

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text?.trim() || "";
      // Clean JSON formatting if enclosed in code blocks
      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const aiData = JSON.parse(cleanJson);
      const validated = SkillExtractionSchema.safeParse(aiData);

      if (validated.success) {
        return NextResponse.json({
          success: true,
          data: {
            ...validated.data,
            source: "gemini_ai",
          },
        });
      }
    } catch (apiErr) {
      console.warn("Gemini API call failed or returned invalid JSON, falling back to local extractor:", apiErr);
    }

    // Fallback if Gemini failed
    const fallbackResult = extractFallbackSkills(story);
    return NextResponse.json({
      success: true,
      data: fallbackResult,
    });
  } catch (error) {
    console.error("Skills extraction endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

