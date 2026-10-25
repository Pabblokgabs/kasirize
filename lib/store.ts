import {
  DEMO_DATA_STORAGE_KEY,
  ROLE_STORAGE_KEY,
  UserRole,
} from "@/constants/roles";
import { getStoredAuthUser } from "@/lib/auth";
import { Opportunity, ProfileSkill, Task, YouthProfile } from "@/types";

export const DEFAULT_GUEST_PROFILE: YouthProfile = {
  id: "usr_youth_guest",
  fullName: "Guest Job Seeker",
  email: "guest.youth@kasirize.org.za",
  location: "Soweto",
  province: "Gauteng",
  experienceStory: "Exploring verified township work and skills opportunities.",
  overallConfidenceScore: 65,
  mockWalletCents: 0,
  completedTasksCount: 0,
  savedOpportunities: [],
  transportStipendEligible: true,
  createdAt: new Date().toISOString(),
  skills: [],
};

export interface KasirizeStoreState {
  currentRole: UserRole;
  youthProfile: YouthProfile;
  tasks: Task[];
  opportunities: Opportunity[];
  setRole: (role: UserRole) => void;
  updateExperienceStory: (story: string) => void;
  updateSkills: (skills: ProfileSkill[]) => void;
  toggleSaveOpportunity: (oppId: string) => void;
  completeTask: (taskId: string, mockRewardCents: number) => void;
  resetDemoData: () => void;
}

// Client-safe LocalStorage helper
export function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "role-user";
  const authUser = getStoredAuthUser();
  if (authUser?.role) return authUser.role;
  const stored = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
  return stored || "role-user";
}

export function getStoredProfile(): YouthProfile {
  if (typeof window === "undefined") return DEFAULT_GUEST_PROFILE;
  try {
    const raw = localStorage.getItem(DEMO_DATA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as YouthProfile;
      // If user is logged in, prioritize their identity
      const authUser = getStoredAuthUser();
      if (authUser && !authUser.isGuest && parsed.email !== authUser.email && authUser.email) {
        return {
          ...parsed,
          id: authUser.id,
          fullName: authUser.name,
          email: authUser.email,
          location: authUser.location?.split(",")[0] || parsed.location,
          province: authUser.location?.split(",")[1]?.trim() || parsed.province,
        };
      }
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to parse stored profile, falling back to default:", err);
  }

  // If no manually saved draft, build directly from logged in user
  const authUser = getStoredAuthUser();
  if (authUser) {
    return {
      id: authUser.id,
      fullName: authUser.name,
      email: authUser.email,
      location: authUser.location?.split(",")[0] || "Soweto",
      province: authUser.location?.split(",")[1]?.trim() || "Gauteng",
      experienceStory: authUser.isGuest
        ? "Exploring verified township work and skills opportunities."
        : "High reliability logistics and store assistant with verified completed township tasks.",
      overallConfidenceScore: authUser.isGuest ? 65 : 91,
      mockWalletCents: authUser.isGuest ? 0 : 45000,
      completedTasksCount: authUser.isGuest ? 0 : 14,
      savedOpportunities: ["opp_01"],
      transportStipendEligible: true,
      createdAt: new Date().toISOString(),
      skills: authUser.isGuest
        ? []
        : [
            {
              id: "s-1",
              skillId: "sk_delivery",
              skillName: "Delivery Management",
              status: "task_verified",
              confidence: 93,
              userApproved: true,
              endorsedBy: "Sipho Nkosi",
            },
            {
              id: "s-2",
              skillId: "sk_stocktake",
              skillName: "Stocktaking",
              status: "task_verified",
              confidence: 88,
              userApproved: true,
              endorsedBy: "Sipho Nkosi",
            },
          ],
    };
  }

  return DEFAULT_GUEST_PROFILE;
}

export function saveStoredProfile(profile: YouthProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DEMO_DATA_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save profile to localStorage:", err);
  }
}

export function saveStoredRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function clearDemoStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_STORAGE_KEY);
  localStorage.removeItem(DEMO_DATA_STORAGE_KEY);
}

/**
 * Calculates candidate confidence score according to Kasirize specification:
 * 40% requester rating + 25% task completion + 20% evidence quality + 15% repeat performance
 */
export function calculateConfidenceScore(profile: YouthProfile): number {
  const verifiedSkillsCount = profile.skills.filter(
    (s) => s.status === "task_verified" || s.status === "referee_confirmed",
  ).length;

  const completionPoints = Math.min(profile.completedTasksCount * 5, 25); // up to 25 pts
  const evidencePoints = Math.min(verifiedSkillsCount * 6.5, 20); // up to 20 pts
  const repeatPoints =
    profile.completedTasksCount >= 3 ? 15 : profile.completedTasksCount * 4; // up to 15 pts
  const ratingBaseline = profile.completedTasksCount > 0 ? 35 : 0; // up to 40 pts

  const total = Math.round(
    completionPoints + evidencePoints + repeatPoints + ratingBaseline,
  );
  return Math.min(Math.max(total, 0), 100);
}
