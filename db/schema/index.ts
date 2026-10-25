import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Enums ───
export const userRoleEnum = pgEnum("user_role", [
  "youth",
  "requester",
  "employer",
  "mentor",
  "admin",
]);

export const opportunityTypeEnum = pgEnum("opportunity_type", [
  "entry_level_job",
  "learnership",
  "apprenticeship",
  "micro_internship",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "open",
  "assigned",
  "in_progress",
  "completed",
  "verified",
  "cancelled",
]);

export const escrowStatusEnum = pgEnum("escrow_status", [
  "pending",
  "funded",
  "disbursed",
  "refunded",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "under_review",
  "shortlisted",
  "interview_invited",
  "accepted",
  "rejected",
]);

// ─── Core Users Table ───
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  phone: text("phone"),
  phoneVerified: boolean("phone_verified").default(false),
  role: userRoleEnum("role").default("youth").notNull(),
  isGuest: boolean("is_guest").default(false).notNull(), // Guest users have view-only access
  location: text("location"),
  province: text("province"),
  avatarUrl: text("avatar_url"),
  image: text("image"), // Better Auth standard avatar field
  bio: text("bio"),
  isVerifiedBadge: boolean("is_verified_badge").default(false),
  confidenceScore: integer("confidence_score").default(60),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Better Auth Tables ───
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Youth Extended Profiles ───
export const youthProfiles = pgTable("youth_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  headline: text("headline"),
  experienceStory: text("experience_story"),
  educationLevel: text("education_level").default("grade_12"),
  transportEligible: boolean("transport_eligible").default(true),
  tasksCompletedCount: integer("tasks_completed_count").default(0),
  reliabilityRate: integer("reliability_rate").default(100),
  onTimeRate: integer("on_time_rate").default(100),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Employer Profiles ───
export const employerProfiles = pgTable("employer_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  registrationNumber: text("registration_number"),
  industrySector: text("industry_sector"),
  bbbeeLevel: text("bbbee_level"),
  setaSponsorship: text("seta_sponsorship"),
  website: text("website"),
  activePlanId: text("active_plan_id").default("growth"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Employer Workplaces / Sites ───
export const employerWorkplaces = pgTable("employer_workplaces", {
  id: text("id").primaryKey(),
  employerProfileId: text("employer_profile_id")
    .notNull()
    .references(() => employerProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  siteType: text("site_type").default("Logistics Hub").notNull(),
  province: text("province").default("Gauteng").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Skills (Master Catalogue & Endorsements) ───
export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
  verifiedCount: integer("verified_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const youthSkills = pgTable("youth_skills", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  skillId: text("skill_id")
    .notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by"),
  category: text("category"),
  confidence: integer("confidence").default(60),
  proficiency: text("proficiency").default("Intermediate"), // Beginner, Intermediate, Experienced
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Opportunities (Jobs, Learnerships, Apprenticeships) ───
export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  employerId: text("employer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workplaceId: text("workplace_id").references(() => employerWorkplaces.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  companyName: text("company_name"),
  companyLogoUrl: text("company_logo_url"),
  organisationType: text("organisation_type").default("logistics_hub"),
  type: opportunityTypeEnum("type").default("entry_level_job").notNull(),
  location: text("location").notNull(),
  province: text("province").default("Gauteng"),
  monthlyStipendCents: integer("monthly_stipend_cents").default(0),
  vacanciesCount: integer("vacancies_count").default(1),
  applicationLimit: integer("application_limit").default(25),
  applicationsReceived: integer("applications_received").default(0),
  educationLevel: text("education_level").default("grade_12"),
  requiredSkills: text("required_skills").array(),
  description: text("description").notNull(),
  deadline: text("deadline"),
  transportCreditFunded: boolean("transport_credit_funded").default(false),
  transportBudgetRands: integer("transport_budget_rands").default(0),
  isEscrowFunded: boolean("is_escrow_funded").default(false),
  verifiedStatus: text("verified_status").default("active_live"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Tasks (Short micro-tasks by requesters) ───
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  requesterId: text("requester_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  requesterName: text("requester_name"),
  requesterAvatarUrl: text("requester_avatar_url"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  province: text("province").default("Gauteng"),
  category: text("category").default("General"),
  scheduledDate: text("scheduled_date"),
  timeSlot: text("time_slot"),
  durationHours: integer("duration_hours").default(3),
  payoutCents: integer("payout_cents").notNull(),
  estimatedTaxiFareCents: integer("estimated_taxi_fare_cents").default(0),
  requiredSkills: text("required_skills").array(),
  safetyNotes: text("safety_notes"),
  status: taskStatusEnum("status").default("open").notNull(),
  assignedYouthId: text("assigned_youth_id").references(() => users.id, {
    onDelete: "set null",
  }),
  isEscrowLocked: boolean("is_escrow_locked").default(false),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Applications ───
export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  opportunityId: text("opportunity_id")
    .notNull()
    .references(() => opportunities.id, { onDelete: "cascade" }),
  applicantId: text("applicant_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: applicationStatusEnum("status").default("submitted").notNull(),
  transportVoucherRequested: boolean("transport_voucher_requested").default(false),
  transportVoucherAmountCents: integer("transport_voucher_amount_cents").default(0),
  transportVoucherApproved: boolean("transport_voucher_approved").default(false),
  interviewDate: text("interview_date"),
  interviewTime: text("interview_time"),
  employerNotes: text("employer_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Two-Way Task Reviews & References ───
export const taskReviews = pgTable("task_reviews", {
  id: text("id").primaryKey(),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  requesterRating: integer("requester_rating").notNull(),
  requesterFeedback: text("requester_feedback"),
  youthRatingToRequester: integer("youth_rating_to_requester").notNull(),
  youthFeedbackToRequester: text("youth_feedback_to_requester"),
  verifiedSkillsEarned: text("verified_skills_earned").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Escrow Transactions ───
export const escrowTransactions = pgTable("escrow_transactions", {
  id: text("id").primaryKey(),
  payerId: text("payer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  payeeId: text("payee_id").references(() => users.id, { onDelete: "set null" }),
  relatedTaskId: text("related_task_id").references(() => tasks.id, {
    onDelete: "set null",
  }),
  relatedOpportunityId: text("related_opportunity_id").references(
    () => opportunities.id,
    { onDelete: "set null" },
  ),
  amountCents: integer("amount_cents").notNull(),
  purpose: text("purpose").notNull(), // "task_payout" | "interview_transport_pool"
  status: escrowStatusEnum("status").default("pending").notNull(),
  paymentMethod: text("payment_method").default("card"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
