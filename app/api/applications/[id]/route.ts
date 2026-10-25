import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/applications/[id] - Employer shortlists, invites to interview, accepts, or rejects
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      status, // "under_review" | "shortlisted" | "interview_invited" | "accepted" | "rejected"
      transportVoucherApproved,
      interviewDate,
      interviewTime,
      employerNotes,
    } = body;

    const existing = await db.select().from(applications).where(eq(applications.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status) updatePayload.status = status;
    if (transportVoucherApproved !== undefined) updatePayload.transportVoucherApproved = Boolean(transportVoucherApproved);
    if (interviewDate !== undefined) updatePayload.interviewDate = interviewDate;
    if (interviewTime !== undefined) updatePayload.interviewTime = interviewTime;
    if (employerNotes !== undefined) updatePayload.employerNotes = employerNotes;

    const [updated] = await db
      .update(applications)
      .set(updatePayload)
      .where(eq(applications.id, id))
      .returning();

    return NextResponse.json({ success: true, application: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating application:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

