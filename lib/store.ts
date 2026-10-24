import { MOCK_YOUTH_PROFILES } from "@/constants/mock-data";
import {
  DEMO_DATA_STORAGE_KEY,
  ROLE_STORAGE_KEY,
  UserRole,
} from "@/constants/roles";
import { Opportunity, ProfileSkill, Task, YouthProfile } from "@/types";

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
  const stored = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
  return stored || "role-user";
}

export function getStoredProfile(): YouthProfile {
  if (typeof window === "undefined") return MOCK_YOUTH_PROFILES[0];
  try {
    const raw = localStorage.getItem(DEMO_DATA_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as YouthProfile;
    }
  } catch (err) {
    console.warn("Failed to parse stored profile, falling back to mock:", err);
  }
  return MOCK_YOUTH_PROFILES[0];
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
