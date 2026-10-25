import { db } from "@/db";
import { opportunities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const opp = await db.select().from(opportunities).where(eq(opportunities.id, id));
    if (opp.length === 0) {
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, opportunity: opp[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

