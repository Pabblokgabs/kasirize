import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks?requesterId=...&assignedYouthId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requesterId = searchParams.get("requesterId");
    const assignedYouthId = searchParams.get("assignedYouthId");

    let allTasks;
    if (requesterId) {
      allTasks = await db.select().from(tasks).where(eq(tasks.requesterId, requesterId));
    } else if (assignedYouthId) {
      allTasks = await db.select().from(tasks).where(eq(tasks.assignedYouthId, assignedYouthId));
    } else {
      allTasks = await db.select().from(tasks);
    }

    return NextResponse.json({ success: true, tasks: allTasks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task (by a requester)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      requesterId,
      requesterName,
      requesterAvatarUrl,
      title,
      description,
      location,
      province,
      category,
      scheduledDate,
      timeSlot,
      durationHours,
      payoutCents,
      estimatedTaxiFareCents,
      requiredSkills,
      safetyNotes,
      imageUrl,
    } = body;

    if (!requesterId || !title || !description || !payoutCents) {
      return NextResponse.json(
        { success: false, error: "Missing required task fields (requesterId, title, description, payoutCents)." },
        { status: 400 },
      );
    }

    const taskId = `tsk_${Date.now()}`;
    const [newTask] = await db
      .insert(tasks)
      .values({
        id: taskId,
        requesterId,
        requesterName: requesterName || "Verified Requester",
        requesterAvatarUrl: requesterAvatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        title,
        description,
        location: location || "Soweto, Gauteng",
        province: province || "Gauteng",
        category: category || "General",
        scheduledDate: scheduledDate || new Date().toISOString().split("T")[0],
        timeSlot: timeSlot || "09:00 - 13:00",
        durationHours: durationHours ? parseInt(durationHours, 10) : 4,
        payoutCents: parseInt(payoutCents, 10),
        estimatedTaxiFareCents: estimatedTaxiFareCents ? parseInt(estimatedTaxiFareCents, 10) : 4000,
        requiredSkills: requiredSkills || ["Reliability", "Customer Service"],
        safetyNotes: safetyNotes || "Standard township safety practices apply.",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
        status: "open",
        isEscrowLocked: true,
      })
      .returning();

    return NextResponse.json({ success: true, task: newTask });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating task:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

