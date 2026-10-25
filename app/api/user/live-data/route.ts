import { db } from "@/db";
import {
  applications,
  employerProfiles,
  employerWorkplaces,
  opportunities,
  tasks,
  users,
  youthProfiles,
  youthSkills,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/user/live-data?email=...&userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    const userId = searchParams.get("userId");

    if (!email && !userId) {
      return NextResponse.json({ success: false, error: "email or userId is required" }, { status: 400 });
    }

    // 1. Fetch user record from database
    let matchedUser = null;
    if (userId) {
      const byId = await db.select().from(users).where(eq(users.id, userId));
      if (byId.length > 0) matchedUser = byId[0];
    }
    if (!matchedUser && email) {
      const byEmail = await db.select().from(users).where(eq(users.email, email));
      if (byEmail.length > 0) matchedUser = byEmail[0];
    }

    if (!matchedUser) {
      return NextResponse.json({ success: false, error: "User not found in database" }, { status: 404 });
    }

    // 2. Load Role-Specific Live Data
    if (matchedUser.role === "youth") {
      // Youth Profile
      const youthProf = await db.select().from(youthProfiles).where(eq(youthProfiles.userId, matchedUser.id));
      const profile = youthProf[0] || null;

      // Youth Skills
      const skills = await db.select().from(youthSkills).where(eq(youthSkills.userId, matchedUser.id));

      // Tasks assigned to this youth
      const myTasks = await db.select().from(tasks).where(eq(tasks.assignedYouthId, matchedUser.id));

      // Open available tasks in area
      const availableTasks = await db.select().from(tasks).where(eq(tasks.status, "open"));

      // Applications submitted by this youth
      const myApplications = await db
        .select({
          id: applications.id,
          opportunityId: applications.opportunityId,
          status: applications.status,
          transportVoucherRequested: applications.transportVoucherRequested,
          transportVoucherAmountCents: applications.transportVoucherAmountCents,
          transportVoucherApproved: applications.transportVoucherApproved,
          interviewDate: applications.interviewDate,
          interviewTime: applications.interviewTime,
          employerNotes: applications.employerNotes,
          createdAt: applications.createdAt,
          jobTitle: opportunities.title,
          jobLocation: opportunities.location,
          employerName: opportunities.companyName,
          type: opportunities.type,
        })
        .from(applications)
        .leftJoin(opportunities, eq(applications.opportunityId, opportunities.id))
        .where(eq(applications.applicantId, matchedUser.id));

      // Available opportunities
      const availableOpps = await db.select().from(opportunities).limit(10);

      return NextResponse.json({
        success: true,
        user: matchedUser,
        profile,
        skills,
        tasks: {
          assigned: myTasks,
          available: availableTasks,
        },
        applications: myApplications,
        opportunities: availableOpps,
      });
    }

    if (matchedUser.role === "requester") {
      // Tasks posted by this requester
      const myTasks = await db.select().from(tasks).where(eq(tasks.requesterId, matchedUser.id));

      return NextResponse.json({
        success: true,
        user: matchedUser,
        tasks: myTasks,
      });
    }

    if (matchedUser.role === "employer") {
      // Employer Profile & Workplaces
      const empProf = await db.select().from(employerProfiles).where(eq(employerProfiles.userId, matchedUser.id));
      const profile = empProf[0] || null;
      let workplaces: Array<typeof employerWorkplaces.$inferSelect> = [];
      if (profile) {
        workplaces = await db.select().from(employerWorkplaces).where(eq(employerWorkplaces.employerProfileId, profile.id));
      }

      // Opportunities posted by employer
      const myOpps = await db.select().from(opportunities).where(eq(opportunities.employerId, matchedUser.id));

      // Candidates who applied to this employer's postings
      const candidates = await db
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
          jobTitle: opportunities.title,
          applicantName: users.name,
          applicantEmail: users.email,
          applicantLocation: users.location,
          applicantConfidenceScore: users.confidenceScore,
        })
        .from(applications)
        .leftJoin(opportunities, eq(applications.opportunityId, opportunities.id))
        .leftJoin(users, eq(applications.applicantId, users.id))
        .where(eq(opportunities.employerId, matchedUser.id));

      return NextResponse.json({
        success: true,
        user: matchedUser,
        profile,
        workplaces,
        opportunities: myOpps,
        candidates,
      });
    }

    return NextResponse.json({ success: true, user: matchedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching live user data:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

