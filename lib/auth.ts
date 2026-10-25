import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isGuest?: boolean;
  location?: string;
  avatarUrl?: string;
}

export const AUTH_USER_KEY = "kasirize_auth_user";

// Predefined demo accounts for instant hackathon login
export const DEMO_ACCOUNTS: Array<{
  name: string;
  email: string;
  role: UserRole;
  isGuest?: boolean;
  roleLabel: string;
  badge: string;
  description: string;
}> = [
  {
    name: "Kagiso Sithole",
    email: "kagiso@kasirize.org.za",
    role: "role-user",
    isGuest: false,
    roleLabel: "Verified Youth",
    badge: "91 Confidence • Full Access",
    description: "Soweto • Full rights: take tasks, apply for learnerships, request vouchers",
  },
  {
    name: "Nomvula Dlamini",
    email: "nomvula@kasirize.org.za",
    role: "role-user",
    isGuest: false,
    roleLabel: "Youth Applicant",
    badge: "87 Confidence",
    description: "Alexandra • Retail & customer service micro-tasks",
  },
  {
    name: "Guest Youth Explorer",
    email: "guest.youth@kasirize.org.za",
    role: "role-user",
    isGuest: true,
    roleLabel: "Guest Youth (View Only)",
    badge: "Guest Mode • Limited",
    description: "Preview mode: can browse tasks & jobs, but cannot apply or chat without full verification",
  },
  {
    name: "Themba Ndaba (Innovate Logistics)",
    email: "themba@innovatelogistics.co.za",
    role: "role-employer",
    isGuest: false,
    roleLabel: "Employer",
    badge: "Enterprise Tier • Level 2 BBBEE",
    description: "Post opportunities, review candidates & fund transport",
  },
  {
    name: "Guest Employer Preview",
    email: "guest.employer@kasirize.org.za",
    role: "role-employer",
    isGuest: true,
    roleLabel: "Guest Employer",
    badge: "Guest Mode • View Only",
    description: "Browse candidate pools with demo permissions",
  },
  {
    name: "Sipho Nkosi (Spaza & Local Biz)",
    email: "sipho@kasirize.org.za",
    role: "role-requester",
    isGuest: false,
    roleLabel: "Task Requester",
    badge: "Active Requester",
    description: "Johannesburg CBD • Post short neighborhood micro-tasks",
  },
  {
    name: "Lindiwe Khumalo (Career Coach)",
    email: "lindiwe@kasirize.org.za",
    role: "role-mentor",
    isGuest: false,
    roleLabel: "Skill Mentor",
    badge: "Verified Coach",
    description: "Pretoria • Coach youth, track learning & endorse skills",
  },
  {
    name: "Kasirize Platform Admin",
    email: "admin@kasirize.org.za",
    role: "role-admin",
    isGuest: false,
    roleLabel: "Administrator",
    badge: "Root / Operations",
    description: "Audit logs, reports, dispute management & user controls",
  },
];

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch (err) {
    console.warn("Failed to parse stored auth user:", err);
  }
  return null;
}

export function saveStoredAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_STORAGE_KEY, user.role);
  } catch (err) {
    console.error("Failed to save auth user:", err);
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(ROLE_STORAGE_KEY);
}

export function getDashboardForRole(role: UserRole): string {
  return ROLE_CONFIGS[role]?.dashboardUrl || "/dashboard/user";
}

/**
 * Authorization check for actions (applying, chatting, posting)
 * Guests are restricted from submitting tasks or applying.
 */
export function checkActionPermission(user: AuthUser | null, action: "apply" | "chat" | "post"): {
  allowed: boolean;
  reason?: string;
} {
  if (!user) {
    return {
      allowed: false,
      reason: "Please sign in to perform this action.",
    };
  }

  if (user.isGuest) {
    return {
      allowed: false,
      reason: "Guest mode is view-only. Please upgrade or sign in with a verified account to " + action + ".",
    };
  }

  return { allowed: true };
}
