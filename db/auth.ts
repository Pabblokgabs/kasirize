import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./index";
import * as schema from "./schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "youth",
      },
      isGuest: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      location: {
        type: "string",
        required: false,
      },
      province: {
        type: "string",
        required: false,
      },
      confidenceScore: {
        type: "number",
        required: false,
        defaultValue: 60,
      },
    },
  },
});

