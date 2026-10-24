import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient } from "@/lib/gemini";

const RequestSchema = z.object({
  youthSkills: z.array(z.string()).min(1, "Candidate skills are required"),
  youthLocation: z.string().default("Gauteng"),
  opportunityTitle: z.string(),
  opportunityCompany: z.string(),
  requiredSkills: z.array(z.string()),
  opportunityLocation: z.string(),
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
      youthSkills,
      youthLocation,
      opportunityTitle,
      opportunityCompany,
      requiredSkills,
      opportunityLocation,
    } = parsed.data;

    // 1. Calculate deterministic component breakdown
    // Skills match (50% weight):
    const matchedSkills = youthSkills.filter((ys) =>
      requiredSkills.some(
        (rs) =>
          rs.toLowerCase().includes(ys.toLowerCase()) ||
          ys.toLowerCase().includes(rs.toLowerCase())
      )
    );
    const skillRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0.8;
    const skillsScore = Math.min(100, Math.round(skillRatio * 100));

    // Location compatibility (15% weight)
    const locMatch =
      youthLocation.toLowerCase().includes(opportunityLocation.toLowerCase()) ||
      opportunityLocation.toLowerCase().includes(youthLocation.toLowerCase()) ||
      opportunityLocation.toLowerCase().includes("remote");
    const locationScore = locMatch ? 90 : 65;

    // Preference readiness (20% weight) & Work Readiness (15% weight)
    const preferenceScore = 85;
    const readinessScore = 80;

    // Weighted match composite
    const overallScore = Math.round(
      skillsScore * 0.5 +
        preferenceScore * 0.2 +
        locationScore * 0.15 +
        readinessScore * 0.15
    );

    const fallbackSummary = `Strong ${overallScore}% fit for ${opportunityTitle} at ${opportunityCompany}. Your informal experience aligns with ${matchedSkills.length} of ${requiredSkills.length} required competencies.`;

    const gemini = getGeminiClient();
    if (!gemini) {
      return NextResponse.json({
        success: true,
        data: {
          overallScore,
          breakdown: {
            skillsMatch: { score: skillsScore, weight: "50%", matched: matchedSkills },
            preferences: { score: preferenceScore, weight: "20%" },
            location: { score: locationScore, weight: "15%", isNearby: locMatch },
            readiness: { score: readinessScore, weight: "15%" },
          },
          explanation: fallbackSummary,
          recommendation:
            overallScore >= 75
              ? "Highly Recommended: Apply with your verified Kasirize profile to unlock interview transport support."
              : "Good Opportunity: Highlight your related practical projects to boost your match.",
          source: "deterministic_engine",
        },
      });
    }

    // Live AI reasoning synthesis
    const prompt = `
You are the career match reasoning engine for Kasirize, South Africa.
A young candidate has these practical skills: ${youthSkills.join(", ")} located in ${youthLocation}.
The target opportunity is "${opportunityTitle}" at "${opportunityCompany}" in ${opportunityLocation}, requiring: ${requiredSkills.join(", ")}.

Overall calculated match score: ${overallScore}%.
Explain in 2 conversational, encouraging sentences why this opportunity fits their background, which skills directly apply, and give 1 concrete tip for their application.

Return JSON:
{
  "explanation": "2-sentence encouraging fit explanation",
  "recommendation": "1 actionable tip"
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
          overallScore,
          breakdown: {
            skillsMatch: { score: skillsScore, weight: "50%", matched: matchedSkills },
            preferences: { score: preferenceScore, weight: "20%" },
            location: { score: locationScore, weight: "15%", isNearby: locMatch },
            readiness: { score: readinessScore, weight: "15%" },
          },
          explanation: aiData.explanation || fallbackSummary,
          recommendation: aiData.recommendation || "Submit your profile with completed task evidence.",
          source: "gemini_ai",
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: {
          overallScore,
          breakdown: {
            skillsMatch: { score: skillsScore, weight: "50%", matched: matchedSkills },
            preferences: { score: preferenceScore, weight: "20%" },
            location: { score: locationScore, weight: "15%", isNearby: locMatch },
            readiness: { score: readinessScore, weight: "15%" },
          },
          explanation: fallbackSummary,
          recommendation: "Submit your profile with completed task evidence.",
          source: "deterministic_engine",
        },
      });
    }
  } catch (error) {
    console.error("Match explanation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

