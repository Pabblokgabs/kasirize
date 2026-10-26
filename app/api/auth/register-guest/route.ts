import { db } from "@/db";
import { skills, users, youthProfiles, youthSkills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      location = "Soweto",
      province = "Gauteng",
      experienceStory = "",
      confidenceScore = 65,
      skills: profileSkills = [],
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, cleanEmail))
      .limit(1);

    let userId: string;

    if (existing) {
      // Upgrade existing guest user if applicable
      userId = existing.id;
      await db
        .update(users)
        .set({
          name: name.trim(),
          isGuest: false,
          location,
          province,
          confidenceScore,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      userId = `usr_youth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(users).values({
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        role: "youth",
        isGuest: false,
        location,
        province,
        confidenceScore,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Upsert youth profile
    const [existingProfile] = await db
      .select()
      .from(youthProfiles)
      .where(eq(youthProfiles.userId, userId))
      .limit(1);

    if (existingProfile) {
      await db
        .update(youthProfiles)
        .set({
          experienceStory,
          transportEligible: true,
          updatedAt: new Date(),
        })
        .where(eq(youthProfiles.userId, userId));
    } else {
      await db.insert(youthProfiles).values({
        id: `yp_${userId}`,
        userId,
        headline: "Verified Township Talent",
        experienceStory,
        educationLevel: "grade_12",
        transportEligible: true,
        tasksCompletedCount: 0,
        reliabilityRate: 100,
        onTimeRate: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert approved skills if provided
    if (Array.isArray(profileSkills) && profileSkills.length > 0) {
      for (const skill of profileSkills) {
        const skillName = skill.skillName || skill.name;
        if (!skillName) continue;

        // Upsert skill in skills master catalogue
        const skillMasterId = `sk_${skillName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        const [existingSkill] = await db
          .select()
          .from(skills)
          .where(eq(skills.id, skillMasterId))
          .limit(1);

        if (!existingSkill) {
          try {
            await db.insert(skills).values({
              id: skillMasterId,
              name: skillName,
              category: "Practical Skills",
              description: `Extracted competency: ${skillName}`,
              verifiedCount: 1,
              createdAt: new Date(),
            });
          } catch {
            // Already exists or unique constraint, safe to continue
          }
        }

        // Add user skill link
        const youthSkillId = `ysk_${userId}_${skillMasterId}`;
        const [existingYouthSkill] = await db
          .select()
          .from(youthSkills)
          .where(eq(youthSkills.id, youthSkillId))
          .limit(1);

        if (!existingYouthSkill) {
          try {
            await db.insert(youthSkills).values({
              id: youthSkillId,
              userId,
              skillId: skillMasterId,
              isVerified: false,
              category: "Practical Skills",
              confidence: skill.confidence || 65,
              proficiency: "Intermediate",
              createdAt: new Date(),
            });
          } catch {
            // Safe to ignore duplicate
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        role: "role-user",
        isGuest: false,
        location: `${location}, ${province}`,
      },
    });
  } catch (err: unknown) {
    console.error("Error registering guest user:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create account" },
      { status: 500 },
    );
  }
}

