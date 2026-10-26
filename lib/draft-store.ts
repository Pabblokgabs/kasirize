// Session storage helper for onboarding profile drafts
// Ensures no data is saved to localStorage or Neon DB until the final review step is confirmed

export interface ProfileDraft {
  fullName: string;
  email: string;
  location: string;
  province: string;
  experienceStory: string;
}

const DRAFT_STORAGE_KEY = "kasirize_draft_profile";

export function getProfileDraft(): ProfileDraft {
  if (typeof window === "undefined") {
    return {
      fullName: "",
      email: "",
      location: "",
      province: "Gauteng",
      experienceStory: "",
    };
  }
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to parse profile draft:", err);
  }
  return {
    fullName: "",
    email: "",
    location: "",
    province: "Gauteng",
    experienceStory: "",
  };
}

export function saveProfileDraft(partial: Partial<ProfileDraft>): ProfileDraft {
  if (typeof window === "undefined") {
    return {
      fullName: "",
      email: "",
      location: "",
      province: "Gauteng",
      experienceStory: "",
      ...partial,
    };
  }
  const current = getProfileDraft();
  const updated: ProfileDraft = {
    ...current,
    ...partial,
  };
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to save profile draft to sessionStorage:", err);
  }
  return updated;
}

export function clearProfileDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

