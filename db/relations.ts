import { relations } from "drizzle-orm";
import {
  applications,
  employerProfiles,
  employerWorkplaces,
  escrowTransactions,
  opportunities,
  skills,
  taskReviews,
  tasks,
  users,
  youthProfiles,
  youthSkills,
} from "./schema";

// ─── Users ───
export const usersRelations = relations(users, ({ one, many }) => ({
  youthProfile: one(youthProfiles, {
    fields: [users.id],
    references: [youthProfiles.userId],
  }),
  employerProfile: one(employerProfiles, {
    fields: [users.id],
    references: [employerProfiles.userId],
  }),
  youthSkills: many(youthSkills),
  postedTasks: many(tasks, { relationName: "requesterTasks" }),
  assignedTasks: many(tasks, { relationName: "assignedTasks" }),
  applications: many(applications),
  postedOpportunities: many(opportunities),
  escrowPayments: many(escrowTransactions, { relationName: "payerTransactions" }),
  escrowReceipts: many(escrowTransactions, { relationName: "payeeTransactions" }),
}));

// ─── Youth Profiles ───
export const youthProfilesRelations = relations(youthProfiles, ({ one }) => ({
  user: one(users, {
    fields: [youthProfiles.userId],
    references: [users.id],
  }),
}));

// ─── Employer Profiles ───
export const employerProfilesRelations = relations(
  employerProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [employerProfiles.userId],
      references: [users.id],
    }),
    workplaces: many(employerWorkplaces),
  }),
);

// ─── Employer Workplaces ───
export const employerWorkplacesRelations = relations(
  employerWorkplaces,
  ({ one, many }) => ({
    employerProfile: one(employerProfiles, {
      fields: [employerWorkplaces.employerProfileId],
      references: [employerProfiles.id],
    }),
    opportunities: many(opportunities),
  }),
);

// ─── Skills Catalogue ───
export const skillsRelations = relations(skills, ({ many }) => ({
  youthSkills: many(youthSkills),
}));

// ─── Youth Skills (junction) ───
export const youthSkillsRelations = relations(youthSkills, ({ one }) => ({
  user: one(users, {
    fields: [youthSkills.userId],
    references: [users.id],
  }),
  skill: one(skills, {
    fields: [youthSkills.skillId],
    references: [skills.id],
  }),
}));

// ─── Opportunities ───
export const opportunitiesRelations = relations(
  opportunities,
  ({ one, many }) => ({
    employer: one(users, {
      fields: [opportunities.employerId],
      references: [users.id],
    }),
    workplace: one(employerWorkplaces, {
      fields: [opportunities.workplaceId],
      references: [employerWorkplaces.id],
    }),
    applications: many(applications),
    escrowTransactions: many(escrowTransactions),
  }),
);

// ─── Tasks ───
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  requester: one(users, {
    fields: [tasks.requesterId],
    references: [users.id],
    relationName: "requesterTasks",
  }),
  assignedYouth: one(users, {
    fields: [tasks.assignedYouthId],
    references: [users.id],
    relationName: "assignedTasks",
  }),
  reviews: many(taskReviews),
  escrowTransactions: many(escrowTransactions),
}));

// ─── Applications ───
export const applicationsRelations = relations(applications, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [applications.opportunityId],
    references: [opportunities.id],
  }),
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
}));

// ─── Task Reviews ───
export const taskReviewsRelations = relations(taskReviews, ({ one }) => ({
  task: one(tasks, {
    fields: [taskReviews.taskId],
    references: [tasks.id],
  }),
}));

// ─── Escrow Transactions ───
export const escrowTransactionsRelations = relations(
  escrowTransactions,
  ({ one }) => ({
    payer: one(users, {
      fields: [escrowTransactions.payerId],
      references: [users.id],
      relationName: "payerTransactions",
    }),
    payee: one(users, {
      fields: [escrowTransactions.payeeId],
      references: [users.id],
      relationName: "payeeTransactions",
    }),
    relatedTask: one(tasks, {
      fields: [escrowTransactions.relatedTaskId],
      references: [tasks.id],
    }),
    relatedOpportunity: one(opportunities, {
      fields: [escrowTransactions.relatedOpportunityId],
      references: [opportunities.id],
    }),
  }),
);
