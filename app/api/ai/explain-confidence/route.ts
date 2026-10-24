import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient } from "@/lib/gemini";

const RequestSchema = z.object({
  ratingAverage: z.number().min(0).max(5),
  completionRate: z.number().min(0).max(100),
  verifiedEvidenceCount: z.number().min(0),
  repeatClientsCount: z.number().min(0),
  compositeScore: z.number().min(0).max(100),
});

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

    const {
      ratingAverage,
      completionRate,
      verifiedEvidenceCount,
      repeatClientsCount,
      compositeScore,
    } = parsed.data;

    // Component analysis
    // Formula: 40% rating + 25% completion + 20% evidence + 15% repeat performance
    const ratingContrib = Math.round((ratingAverage / 5) * 40);
    const completionContrib = Math.round((completionRate / 100) * 25);
    const evidenceContrib = Math.round(Math.min(100, verifiedEvidenceCount * 25) * 0.2);
    const repeatContrib = Math.round(Math.min(100, repeatClientsCount * 33.3) * 0.15);

    const breakdown = [
      {
        name: "Client Ratings & Feedback",
        weight: "40%",
        points: ratingContrib,
        description: `${ratingAverage.toFixed(1)} / 5.0 star average from community task requesters`,
      },
      {
        name: "Task Completion Reliability",
        weight: "25%",
        points: completionContrib,
        description: `${completionRate}% of accepted tasks delivered without abandonment`,
      },
      {
        name: "Verified Evidence Artifacts",
        weight: "20%",
        points: evidenceContrib,
        description: `${verifiedEvidenceCount} referee-confirmed work samples or badge verifications`,
      },
      {
        name: "Repeat Requester Trust",
        weight: "15%",
        points: repeatContrib,
        description: `${repeatClientsCount} clients who requested you more than once`,
      },
    ];

    const fallbackSummary = `Your ${compositeScore}% Credibility Score reflects verified real-world consistency. Every task rating and referee confirmation shortens the distance to formal employment.`;

    const gemini = getGeminiClient();
    if (!gemini) {
      return NextResponse.json({
        success: true,
        data: {
          compositeScore,
          breakdown,
          explanation: fallbackSummary,
          nextMilestone:
            verifiedEvidenceCount < 3
              ? "Complete 1 more task or add referee verification to push your score past 85%."
              : "Top Tier: Your score qualifies you for employer-funded interview transport credits.",
          source: "deterministic_baseline",
        },
      });
    }

    const prompt = `
Kasirize calculates a candidate's Credibility Score using transparent, objective signals:
- Composite Score: ${compositeScore}%
- Client rating: ${ratingAverage}/5.0 (40% weight)
- Task completion rate: ${completionRate}% (25% weight)
- Verified evidence count: ${verifiedEvidenceCount} (20% weight)
- Repeat requesters: ${repeatClientsCount} (15% weight)

Write a 2-sentence encouraging, clear breakdown explaining to an employer or the candidate why this score is trustworthy and what it proves about the candidate's work ethic.
Return pure JSON:
{
  "explanation": "2-sentence clear explanation",
  "nextMilestone": "1 specific recommendation for the candidate"
}
Output valid JSON only.
`;

    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text?.trim() || "";
      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const aiData = JSON.parse(cleanJson);
      return NextResponse.json({
        success: true,
        data: {
          compositeScore,
          breakdown,
          explanation: aiData.explanation || fallbackSummary,
          nextMilestone: aiData.nextMilestone || "Keep completing verified tasks to unlock higher tier opportunities.",
          source: "gemini_ai",
        },
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      data: {
        compositeScore,
        breakdown,
        explanation: fallbackSummary,
        nextMilestone: "Complete 1 more task or add referee verification to push your score higher.",
        source: "deterministic_baseline",
      },
    });
  } catch (error) {
    console.error("Confidence explanation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

