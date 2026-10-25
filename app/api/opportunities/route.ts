import { db } from "@/db";
import { opportunities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/opportunities?employerId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employerId = searchParams.get("employerId");

    const allOpportunities = employerId
      ? await db.select().from(opportunities).where(eq(opportunities.employerId, employerId))
      : await db.select().from(opportunities);

    return NextResponse.json({ success: true, opportunities: allOpportunities });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching opportunities:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/opportunities - Employer posts a new job / learnership
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employerId,
      workplaceId,
      title,
      companyName,
      companyLogoUrl,
      organisationType,
      type,
      location,
      province,
      monthlyStipendCents,
      vacanciesCount,
      educationLevel,
      requiredSkills,
      description,
      deadline,
      transportCreditFunded,
      transportBudgetRands,
    } = body;

    if (!employerId || !title || !description || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required opportunity fields." },
        { status: 400 },
      );
    }

    const oppId = `opp_${Date.now()}`;
    const [newOpp] = await db
      .insert(opportunities)
      .values({
        id: oppId,
        employerId,
        workplaceId: workplaceId || null,
        title,
        companyName: companyName || "Verified Partner Enterprise",
        companyLogoUrl: companyLogoUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80",
        organisationType: organisationType || "logistics_hub",
        type: type || "entry_level_job",
        location,
        province: province || "Gauteng",
        monthlyStipendCents: monthlyStipendCents ? parseInt(monthlyStipendCents, 10) : 600000,
        vacanciesCount: vacanciesCount ? parseInt(vacanciesCount, 10) : 2,
        educationLevel: educationLevel || "grade_12",
        requiredSkills: requiredSkills || ["Inventory Stocking", "Customer Care"],
        description,
        deadline: deadline || "2026-11-30",
        transportCreditFunded: Boolean(transportCreditFunded),
        transportBudgetRands: transportBudgetRands ? parseInt(transportBudgetRands, 10) : 1500,
        isEscrowFunded: Boolean(transportCreditFunded),
        verifiedStatus: "active_live",
      })
      .returning();

    return NextResponse.json({ success: true, opportunity: newOpp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating opportunity:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

