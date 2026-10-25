import { db } from "@/db";
import { users, youthProfiles, youthSkills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const user = await db.select().from(users).where(eq(users.id, id));
      if (user.length === 0) {
        return NextResponse.json({ success: false, error: "Youth not found" }, { status: 404 });
      }
      const profile = await db.select().from(youthProfiles).where(eq(youthProfiles.userId, id));
      const skills = await db.select().from(youthSkills).where(eq(youthSkills.userId, id));

      return NextResponse.json({
        success: true,
        youth: {
          ...user[0],
          profile: profile[0] || null,
          skills: skills || [],
        },
      });
    }

    const allYouth = await db.select().from(users).where(eq(users.role, "youth"));
    return NextResponse.json({ success: true, youth: allYouth });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

