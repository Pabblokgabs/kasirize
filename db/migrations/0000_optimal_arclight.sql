CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'shortlisted', 'interview_invited', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."escrow_status" AS ENUM('pending', 'funded', 'disbursed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."opportunity_type" AS ENUM('entry_level_job', 'learnership', 'apprenticeship', 'micro_internship');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('open', 'assigned', 'in_progress', 'completed', 'verified', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('youth', 'requester', 'employer', 'mentor', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" text PRIMARY KEY NOT NULL,
	"opportunity_id" text NOT NULL,
	"applicant_id" text NOT NULL,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"transport_voucher_requested" boolean DEFAULT false,
	"transport_voucher_amount_cents" integer DEFAULT 0,
	"transport_voucher_approved" boolean DEFAULT false,
	"interview_date" text,
	"interview_time" text,
	"employer_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"company_name" text NOT NULL,
	"registration_number" text,
	"industry_sector" text,
	"bbbee_level" text,
	"seta_sponsorship" text,
	"website" text,
	"active_plan_id" text DEFAULT 'growth',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_workplaces" (
	"id" text PRIMARY KEY NOT NULL,
	"employer_profile_id" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"site_type" text DEFAULT 'Logistics Hub' NOT NULL,
	"province" text DEFAULT 'Gauteng' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "escrow_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"payer_id" text NOT NULL,
	"payee_id" text,
	"related_task_id" text,
	"related_opportunity_id" text,
	"amount_cents" integer NOT NULL,
	"purpose" text NOT NULL,
	"status" "escrow_status" DEFAULT 'pending' NOT NULL,
	"payment_method" text DEFAULT 'card',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"employer_id" text NOT NULL,
	"workplace_id" text,
	"title" text NOT NULL,
	"company_name" text,
	"company_logo_url" text,
	"organisation_type" text DEFAULT 'logistics_hub',
	"type" "opportunity_type" DEFAULT 'entry_level_job' NOT NULL,
	"location" text NOT NULL,
	"province" text DEFAULT 'Gauteng',
	"monthly_stipend_cents" integer DEFAULT 0,
	"vacancies_count" integer DEFAULT 1,
	"application_limit" integer DEFAULT 25,
	"applications_received" integer DEFAULT 0,
	"education_level" text DEFAULT 'grade_12',
	"required_skills" text[],
	"description" text NOT NULL,
	"deadline" text,
	"transport_credit_funded" boolean DEFAULT false,
	"transport_budget_rands" integer DEFAULT 0,
	"is_escrow_funded" boolean DEFAULT false,
	"verified_status" text DEFAULT 'active_live',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"verified_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skills_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "task_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"requester_rating" integer NOT NULL,
	"requester_feedback" text,
	"youth_rating_to_requester" integer NOT NULL,
	"youth_feedback_to_requester" text,
	"verified_skills_earned" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"requester_id" text NOT NULL,
	"requester_name" text,
	"requester_avatar_url" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"location" text NOT NULL,
	"province" text DEFAULT 'Gauteng',
	"category" text DEFAULT 'General',
	"scheduled_date" text,
	"time_slot" text,
	"duration_hours" integer DEFAULT 3,
	"payout_cents" integer NOT NULL,
	"estimated_taxi_fare_cents" integer DEFAULT 0,
	"required_skills" text[],
	"safety_notes" text,
	"status" "task_status" DEFAULT 'open' NOT NULL,
	"assigned_youth_id" text,
	"is_escrow_locked" boolean DEFAULT false,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"phone" text,
	"phone_verified" boolean DEFAULT false,
	"role" "user_role" DEFAULT 'youth' NOT NULL,
	"is_guest" boolean DEFAULT false NOT NULL,
	"location" text,
	"province" text,
	"avatar_url" text,
	"image" text,
	"bio" text,
	"is_verified_badge" boolean DEFAULT false,
	"confidence_score" integer DEFAULT 60,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "youth_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"headline" text,
	"experience_story" text,
	"education_level" text DEFAULT 'grade_12',
	"transport_eligible" boolean DEFAULT true,
	"tasks_completed_count" integer DEFAULT 0,
	"reliability_rate" integer DEFAULT 100,
	"on_time_rate" integer DEFAULT 100,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "youth_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"skill_id" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verified_by" text,
	"category" text,
	"confidence" integer DEFAULT 60,
	"proficiency" text DEFAULT 'Intermediate',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_workplaces" ADD CONSTRAINT "employer_workplaces_employer_profile_id_employer_profiles_id_fk" FOREIGN KEY ("employer_profile_id") REFERENCES "public"."employer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_payer_id_users_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_payee_id_users_id_fk" FOREIGN KEY ("payee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_related_task_id_tasks_id_fk" FOREIGN KEY ("related_task_id") REFERENCES "public"."tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_related_opportunity_id_opportunities_id_fk" FOREIGN KEY ("related_opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_workplace_id_employer_workplaces_id_fk" FOREIGN KEY ("workplace_id") REFERENCES "public"."employer_workplaces"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_reviews" ADD CONSTRAINT "task_reviews_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_youth_id_users_id_fk" FOREIGN KEY ("assigned_youth_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_profiles" ADD CONSTRAINT "youth_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_skills" ADD CONSTRAINT "youth_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_skills" ADD CONSTRAINT "youth_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;