import { db } from "@/db";
import { applications, opportunities, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications?applicantId=...&opportunityId=...&employerId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get("applicantId");
    const opportunityId = searchParams.get("opportunityId");
    const employerId = searchParams.get("employerId");

    // Fetch joined applications with opportunity and user info
    const all = await db
      .select({
        id: applications.id,
        opportunityId: applications.opportunityId,
        applicantId: applications.applicantId,
        status: applications.status,
        transportVoucherRequested: applications.transportVoucherRequested,
        transportVoucherAmountCents: applications.transportVoucherAmountCents,
        transportVoucherApproved: applications.transportVoucherApproved,
        interviewDate: applications.interviewDate,
        interviewTime: applications.interviewTime,
        employerNotes: applications.employerNotes,
        createdAt: applications.createdAt,
        // Joined fields
        jobTitle: opportunities.title,
        jobLocation: opportunities.location,
        opportunityType: opportunities.type,
        employerId: opportunities.employerId,
        employerName: opportunities.companyName,
        applicantName: users.name,
        applicantEmail: users.email,
        applicantLocation: users.location,
        applicantConfidenceScore: users.confidenceScore,
      })
      .from(applications)
      .leftJoin(opportunities, eq(applications.opportunityId, opportunities.id))
      .leftJoin(users, eq(applications.applicantId, users.id));

    let filtered = all;
    if (applicantId) {
      filtered = filtered.filter((a) => a.applicantId === applicantId);
    }
    if (opportunityId) {
      filtered = filtered.filter((a) => a.opportunityId === opportunityId);
    }
    if (employerId) {
      filtered = filtered.filter((a) => a.employerId === employerId);
    }

    return NextResponse.json({ success: true, applications: filtered });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching applications:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/applications - Youth applies to a job / learnership
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      opportunityId,
      applicantId,
      transportVoucherRequested,
      transportVoucherAmountCents,
    } = body;

    if (!opportunityId || !applicantId) {
      return NextResponse.json(
        { success: false, error: "Missing opportunityId or applicantId." },
        { status: 400 },
      );
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(applications)
      .where(eq(applications.opportunityId, opportunityId));

    const alreadyApplied = existing.find((a) => a.applicantId === applicantId);
    if (alreadyApplied) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this opportunity." },
        { status: 400 },
      );
    }

    const appId = `app_${Date.now()}`;
    const [newApp] = await db
      .insert(applications)
      .values({
        id: appId,
        opportunityId,
        applicantId,
        status: "submitted",
        transportVoucherRequested: Boolean(transportVoucherRequested),
        transportVoucherAmountCents: transportVoucherAmountCents || 8000,
        transportVoucherApproved: false,
      })
      .returning();

    // Increment application count on opportunity
    const opp = await db.select().from(opportunities).where(eq(opportunities.id, opportunityId));
    if (opp.length > 0) {
      await db
        .update(opportunities)
        .set({
          applicationsReceived: (opp[0].applicationsReceived || 0) + 1,
        })
        .where(eq(opportunities.id, opportunityId));
    }

    return NextResponse.json({ success: true, application: newApp });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating application:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

