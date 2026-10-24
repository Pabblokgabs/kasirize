import { z } from "zod";

export const UserRoleSchema = z.enum([
  "role-user",
  "role-requester",
  "role-employer",
  "role-mentor",
  "role-admin",
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const VerificationStatusSchema = z.enum([
  "self_declared",
  "evidence_uploaded",
  "referee_confirmed",
  "task_verified",
  "employer_confirmed",
  "expired",
  "revoked",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const SkillCategorySchema = z.enum([
  "trade",
  "retail_sales",
  "hospitality",
  "admin_tech",
  "care_community",
  "logistics",
  "creative",
]);
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: SkillCategorySchema,
  description: z.string(),
  verifiedCount: z.number().default(0),
});
export type Skill = z.infer<typeof SkillSchema>;

export const ProfileSkillSchema = z.object({
  id: z.string(),
  skillId: z.string(),
  skillName: z.string(),
  status: VerificationStatusSchema,
  endorsedBy: z.string().optional(),
  evidenceId: z.string().optional(),
  confidence: z.number().min(0).max(100),
  userApproved: z.boolean().default(true),
});
export type ProfileSkill = z.infer<typeof ProfileSkillSchema>;

export const YouthProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email().optional(),
  location: z.string(),
  province: z.string(),
  experienceStory: z.string(),
  skills: z.array(ProfileSkillSchema),
  overallConfidenceScore: z.number().min(0).max(100).default(0),
  mockWalletCents: z.number().default(0), // stored in cents (R150 = 15000)
  completedTasksCount: z.number().default(0),
  savedOpportunities: z.array(z.string()).default([]),
  transportStipendEligible: z.boolean().default(true),
  createdAt: z.string(),
});
export type YouthProfile = z.infer<typeof YouthProfileSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  requesterName: z.string(),
  requesterType: z.enum([
    "spaza_shop",
    "small_business",
    "household",
    "community_org",
  ]),
  location: z.string(),
  estimatedTaxiFareCents: z.number(), // transport-aware
  payoutCents: z.number(), // stored in cents
  durationHours: z.number(),
  deadline: z.string(),
  skillsRequired: z.array(z.string()),
  description: z.string(),
  safetyNotes: z.string(),
  status: z.enum(["open", "in_progress", "completed", "disputed"]),
});
export type Task = z.infer<typeof TaskSchema>;

export const OpportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  employerName: z.string(),
  organisationType: z.enum([
    "retailer",
    "logistics_hub",
    "tech_academy",
    "hospitality",
    "manufacturing",
  ]),
  location: z.string(),
  type: z.enum([
    "micro_internship",
    "entry_level_job",
    "learnership",
    "apprenticeship",
  ]),
  monthlyStipendCents: z.number(),
  transportCreditFunded: z.boolean().default(true),
  requiredSkills: z.array(z.string()),
  description: z.string(),
  applicationDeadline: z.string(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const EvidenceSchema = z.object({
  id: z.string(),
  youthId: z.string(),
  title: z.string(),
  description: z.string(),
  fileType: z.enum(["image", "audio_note", "referee_contact", "receipt"]),
  fileUrl: z.string().optional(),
  refereeName: z.string().optional(),
  refereeRole: z.string().optional(),
  verified: z.boolean().default(false),
  createdAt: z.string(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const MentorSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  roleTitle: z.string(),
  organization: z.string(),
  location: z.string(),
  specialties: z.array(z.string()),
  bio: z.string(),
  activeMenteesCount: z.number(),
});
export type Mentor = z.infer<typeof MentorSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderRole: UserRoleSchema,
  recipientId: z.string(),
  message: z.string(),
  timestamp: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
