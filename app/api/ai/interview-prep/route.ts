import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient } from "@/lib/gemini";

const RequestSchema = z.object({
  opportunityTitle: z.string(),
  companyName: z.string(),
  candidateSkills: z.array(z.string()).default([]),
  experienceSnippet: z.string().optional(),
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

    const { opportunityTitle, companyName, candidateSkills, experienceSnippet } = parsed.data;

    const fallbackQuestions = [
      {
        question: `Can you walk us through a time you applied ${candidateSkills[0] || "your practical skills"} to solve an unexpected problem?`,
        tip: "Use the STAR method: Situation, Task, Action, and what positive Result you achieved.",
      },
      {
        question: `How do you handle busy periods or customer requests when working under pressure at ${companyName}?`,
        tip: "Highlight your dependability, calmness, and how you prioritize urgent tasks.",
      },
      {
        question: "Why does this opportunity matter to you right now, and what are you eager to learn?",
        tip: "Show enthusiasm for practical growth and emphasize your reliability.",
      },
    ];

    const gemini = getGeminiClient();
    if (!gemini) {
      return NextResponse.json({
        success: true,
        data: {
          questions: fallbackQuestions,
          encouragement: "You have practical experience that employers value. Speak with confidence about the real work you have already completed.",
          source: "deterministic_baseline",
        },
      });
    }

    const prompt = `
You are an empathetic South African youth career coach at Kasirize.
A youth is preparing for an interview for "${opportunityTitle}" at "${companyName}".
Their skills: ${candidateSkills.join(", ") || "General practical competencies"}.
Background context: ${experienceSnippet || "Informal community work and micro-tasks"}.

Generate 3 realistic interview practice questions tailored to this role that help them translate informal experience into professional answers.
For each question, provide 1 supportive coaching tip.

Return pure JSON:
{
  "questions": [
    {
      "question": "Question text",
      "tip": "Coaching guidance"
    }
  ],
  "encouragement": "1 warm sentence of confidence-building encouragement."
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
      if (Array.isArray(aiData.questions)) {
        return NextResponse.json({
          success: true,
          data: {
            questions: aiData.questions,
            encouragement: aiData.encouragement || "You are well-prepared. Trust the work you have done.",
            source: "gemini_ai",
          },
        });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      data: {
        questions: fallbackQuestions,
        encouragement: "You have practical experience that employers value. Speak with confidence about the real work you have already completed.",
        source: "deterministic_baseline",
      },
    });
  } catch (error) {
    console.error("Interview prep error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

