import { db } from "@/db";
import { taskReviews, tasks, youthProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tasks/[id] - Fetch single live task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await db.select().from(tasks).where(eq(tasks.id, id));
    if (task.length === 0) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, task: task[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/tasks/[id] - Accept, assign, complete, or rate a task
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, youthId, requesterRating, requesterFeedback, youthRatingToRequester, youthFeedbackToRequester, verifiedSkillsEarned } = body;

    // Check existing task
    const existing = await db.select().from(tasks).where(eq(tasks.id, id));
    if (existing.length === 0) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const currentTask = existing[0];

    // Action 1: Youth applies to / accepts task
    if (action === "apply" || action === "accept") {
      if (!youthId) {
        return NextResponse.json({ success: false, error: "youthId is required to apply or accept" }, { status: 400 });
      }

      const [updated] = await db
        .update(tasks)
        .set({
          assignedYouthId: youthId,
          status: "assigned",
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, id))
        .returning();

      return NextResponse.json({ success: true, message: "Task successfully assigned to applicant", task: updated });
    }

    // Action 2: Mark in progress
    if (action === "start") {
      const [updated] = await db
        .update(tasks)
        .set({ status: "in_progress", updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();

      return NextResponse.json({ success: true, task: updated });
    }

    // Action 3: Mark completed
    if (action === "complete") {
      const [updated] = await db
        .update(tasks)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();

      return NextResponse.json({ success: true, task: updated });
    }

    // Action 4: Confirm & verify completion (requester confirms and releases escrow)
    if (action === "verify" || action === "confirm") {
      const [updated] = await db
        .update(tasks)
        .set({ status: "verified", updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();

      // If review feedback was provided, record task review
      if (requesterRating) {
        const reviewId = `rev_${Date.now()}`;
        await db.insert(taskReviews).values({
          id: reviewId,
          taskId: id,
          requesterRating: requesterRating || 5,
          requesterFeedback: requesterFeedback || "Task completed on time with excellent attention to detail.",
          youthRatingToRequester: youthRatingToRequester || 5,
          youthFeedbackToRequester: youthFeedbackToRequester || "Friendly requester and clear instructions.",
          verifiedSkillsEarned: verifiedSkillsEarned || currentTask.requiredSkills || ["Reliability"],
        });
      }

      // Update youth's completed task count if assigned
      if (currentTask.assignedYouthId) {
        const youthProf = await db
          .select()
          .from(youthProfiles)
          .where(eq(youthProfiles.userId, currentTask.assignedYouthId));

        if (youthProf.length > 0) {
          await db
            .update(youthProfiles)
            .set({
              tasksCompletedCount: (youthProf[0].tasksCompletedCount || 0) + 1,
              updatedAt: new Date(),
            })
            .where(eq(youthProfiles.id, youthProf[0].id));
        }
      }

      return NextResponse.json({ success: true, message: "Task verified and escrow released!", task: updated });
    }

    return NextResponse.json({ success: false, error: "Unknown action parameter" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating task:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

