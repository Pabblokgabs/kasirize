import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const mentor = await db.select().from(users).where(eq(users.id, id));
      if (mentor.length === 0) {
        return NextResponse.json({ success: false, error: "Mentor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, mentor: mentor[0] });
    }

    const mentors = await db.select().from(users).where(eq(users.role, "mentor"));
    return NextResponse.json({ success: true, mentors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

