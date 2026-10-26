"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { saveStoredAuthUser } from "@/lib/auth";
import { clearProfileDraft, getProfileDraft } from "@/lib/draft-store";
import {
  calculateConfidenceScore,
  saveStoredProfile,
} from "@/lib/store";
import { useKasirizeStore } from "@/store/kasirize-store";
import { ProfileSkill, YouthProfile } from "@/types";
import {
  ArrowRight,
  Check,
  Edit2,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getLocalFallbackSkills(story: string): ProfileSkill[] {
  const lower = story.toLowerCase();
  const suggestions: ProfileSkill[] = [];

  if (
    lower.includes("stock") ||
    lower.includes("count") ||
    lower.includes("inventor") ||
    lower.includes("shop") ||
    lower.includes("spaza")
  ) {
    suggestions.push({
      id: "ps-sug-1",
      skillId: "sk-1",
      skillName: "Stock Counting & Inventory Auditing",
      status: "self_declared",
      confidence: 65,
      userApproved: true,
    });
  }

  if (
    lower.includes("cash") ||
    lower.includes("till") ||
    lower.includes("drawer") ||
    lower.includes("money") ||
    lower.includes("float")
  ) {
    suggestions.push({
      id: "ps-sug-2",
      skillId: "sk-2",
      skillName: "Cash Handling & Till Reconciliation",
      status: "self_declared",
      confidence: 70,
      userApproved: true,
    });
  }

  if (
    lower.includes("phone") ||
    lower.includes("screen") ||
    lower.includes("electron") ||
    lower.includes("fix") ||
    lower.includes("repair")
  ) {
    suggestions.push({
      id: "ps-sug-3",
      skillId: "sk-3",
      skillName: "Smartphone & Hardware Diagnostics",
      status: "self_declared",
      confidence: 75,
      userApproved: true,
    });
  }

  if (
    lower.includes("deliver") ||
    lower.includes("bicycle") ||
    lower.includes("route") ||
    lower.includes("courier")
  ) {
    suggestions.push({
      id: "ps-sug-4",
      skillId: "sk-4",
      skillName: "Local Route Planning & Logistics",
      status: "self_declared",
      confidence: 65,
      userApproved: true,
    });
  }

  if (
    lower.includes("sound") ||
    lower.includes("church") ||
    lower.includes("music") ||
    lower.includes("event") ||
    lower.includes("mic")
  ) {
    suggestions.push({
      id: "ps-sug-5",
      skillId: "sk-5",
      skillName: "Live Event Audio & PA Setup",
      status: "self_declared",
      confidence: 65,
      userApproved: true,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: "ps-sug-def1",
        skillId: "sk-def1",
        skillName: "Customer Service & Community Communication",
        status: "self_declared",
        confidence: 60,
        userApproved: true,
      },
      {
        id: "ps-sug-def2",
        skillId: "sk-def2",
        skillName: "Task Execution & Time Management",
        status: "self_declared",
        confidence: 60,
        userApproved: true,
      },
    );
  }

  return suggestions;
}

export default function ReviewSkillsPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(() => getProfileDraft());

  const [skills, setSkills] = useState<ProfileSkill[]>(() => {
    return getLocalFallbackSkills(draft.experienceStory || "");
  });

  const [aiSource, setAiSource] = useState<string>("Analyzing experience...");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Live extract via /api/ai/extract-skills if story is present
  useEffect(() => {
    const currentDraft = getProfileDraft();
    setDraft(currentDraft);

    if (!currentDraft.experienceStory || currentDraft.experienceStory.length < 10) {
      setIsAiLoading(false);
      setAiSource("Standard taxonomy applied");
      return;
    }

    let isMounted = true;
    setIsAiLoading(true);

    fetch("/api/ai/extract-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story: currentDraft.experienceStory }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json.success && json.data?.skills?.length > 0) {
          const extracted: ProfileSkill[] = json.data.skills.map(
            (
              s: { name: string; suggestedConfidence?: number },
              idx: number,
            ) => ({
              id: `ps-ai-${idx}-${Date.now()}`,
              skillId: `sk-gen-${idx}`,
              skillName: s.name,
              status: "self_declared" as const,
              confidence: s.suggestedConfidence || 65,
              userApproved: true,
            }),
          );
          setSkills(extracted);
          setAiSource(
            json.data.source === "gemini_ai"
              ? "Extracted with Gemini AI reasoning"
              : "Extracted via Kasirize skills taxonomy",
          );
        } else {
          setAiSource("Standard taxonomy applied");
        }
      })
      .catch((err) => {
        console.warn("API extraction error:", err);
        setAiSource("Standard taxonomy applied");
      })
      .finally(() => {
        if (isMounted) setIsAiLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleApprove = (id: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, userApproved: !s.userApproved } : s,
      ),
    );
    if (errorMessage) setErrorMessage("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const startEdit = (skill: ProfileSkill) => {
    setEditingId(skill.id);
    setEditName(skill.skillName);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, skillName: editName.trim() } : s)),
    );
    setEditingId(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const newSkill: ProfileSkill = {
      id: `ps-custom-${Date.now()}`,
      skillId: `sk-custom-${Date.now()}`,
      skillName: customSkillName.trim(),
      status: "self_declared",
      confidence: 55,
      userApproved: true,
    };

    setSkills((prev) => [...prev, newSkill]);
    setCustomSkillName("");
    setShowAddCustom(false);
    if (errorMessage) setErrorMessage("");
  };

  const handleConfirmAndSave = () => {
    const approvedSkills = skills.filter((s) => s.userApproved);
    if (approvedSkills.length === 0) {
      setErrorMessage("Please approve at least one skill before launching your profile.");
      return;
    }

    const currentDraft = getProfileDraft();
    const guestId = `usr_guest_${Date.now()}`;
    const displayName = currentDraft.fullName || "Guest Seeker";
    const userLocation = currentDraft.location || "Soweto";
    const userProvince = currentDraft.province || "Gauteng";

    const userEmail = currentDraft.email?.trim() || `guest_${Date.now()}@kasirize.local`;

    const baseProfile: YouthProfile = {
      id: guestId,
      fullName: displayName,
      email: userEmail,
      location: userLocation,
      province: userProvince,
      experienceStory: currentDraft.experienceStory || "",
      overallConfidenceScore: 60,
      mockWalletCents: 0,
      completedTasksCount: 0,
      savedOpportunities: [],
      transportStipendEligible: true,
      createdAt: new Date().toISOString(),
      skills: approvedSkills,
    };

    baseProfile.overallConfidenceScore = calculateConfidenceScore(baseProfile);

    // Save locally as guest profile
    saveStoredProfile(baseProfile);

    // Save as guest auth user in localStorage and Zustand store
    const authGuestUser = {
      id: guestId,
      name: displayName,
      email: userEmail,
      role: "role-user" as const,
      isGuest: true,
      location: `${userLocation}, ${userProvince}`,
    };

    saveStoredAuthUser(authGuestUser);
    useKasirizeStore.getState().setAuthUser(authGuestUser);

    // Clear draft session storage
    clearProfileDraft();

    // Navigate to dashboard
    router.push("/dashboard/user");
  };

  const approvedCount = skills.filter((s) => s.userApproved).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-heading font-bold text-foreground">
              Kasirize
            </span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            Step 3 of 3: Skill Confirmation
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground mb-3">
            {isAiLoading ? (
              <>
                <Loader2 className="size-3.5 text-primary animate-spin" />
                <span>Extracting practical competencies with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-3.5 text-primary" />
                <span>{aiSource}</span>
              </>
            )}
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Confirm Your Practical Skills
          </h1>
          <p className="text-sm text-muted-foreground">
            We translated your experience story into structured competencies. You have full control: approve, edit names, remove what does not fit, or add custom skills.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* ─── AI LOADING STATE OR SKILLS LIST ─── */}
        {isAiLoading ? (
          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-md" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-md" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-6 rounded-md" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {skills.map((skill) => {
              const isEditing = editingId === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-xl border transition-all ${
                    skill.userApproved
                      ? "bg-card border-border shadow-xs"
                      : "bg-muted/40 border-border/50 opacity-60"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor={`edit-${skill.id}`}
                          className="text-xs font-medium mb-1.5"
                        >
                          Edit Skill Name
                        </Label>
                        <Input
                          id={`edit-${skill.id}`}
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full"
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => saveEdit(skill.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleApprove(skill.id)}
                          className={`size-6 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            skill.userApproved
                              ? "bg-primary border-primary text-white"
                              : "bg-background border-border text-transparent hover:border-primary"
                          }`}
                          title={
                            skill.userApproved
                              ? "Click to reject"
                              : "Click to approve"
                          }
                        >
                          <Check className="size-4 stroke-3" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-medium text-sm truncate ${
                                skill.userApproved
                                  ? "text-foreground"
                                  : "text-muted-foreground line-through"
                              }`}
                            >
                              {skill.skillName}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                              Self-Declared
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Base confidence: {skill.confidence}% • Proved by experience story
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => startEdit(skill)}
                          title="Edit name"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemoveSkill(skill.id)}
                          title="Delete skill"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── ADD CUSTOM SKILL ─── */}
        {showAddCustom ? (
          <form
            onSubmit={handleAddCustom}
            className="p-4 rounded-xl border border-dashed border-primary/40 bg-card mb-6 space-y-3"
          >
            <div>
              <Label
                htmlFor="custom-skill"
                className="text-xs font-semibold mb-1.5"
              >
                Add Another Skill You Have
              </Label>
              <Input
                id="custom-skill"
                type="text"
                placeholder="e.g. Basic Bookkeeping, WhatsApp Business Catalog, Audio Mixing"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddCustom(false);
                  setCustomSkillName("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add Skill
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 border-dashed"
            onClick={() => setShowAddCustom(true)}
            disabled={isAiLoading}
          >
            <Plus className="size-4 mr-1.5" />
            Add Another Skill
          </Button>
        )}

        {/* ─── TRUST & INTEGRITY CALLOUT ─── */}
        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 mb-6">
          <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-foreground block">
              Guest Profile Mode
            </span>
            <p className="text-muted-foreground">
              Your profile is saved locally as a guest. You will be able to browse verified tasks and opportunities. To apply or chat, you can create an account at any time with one click.
            </p>
          </div>
        </div>

        {/* ─── BOTTOM ACTIONS ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            <span className="font-bold text-foreground">{approvedCount}</span>{" "}
            skill
            {approvedCount === 1 ? "" : "s"} ready to be saved to your profile.
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-initial"
              onClick={() => router.push("/experience-story")}
              disabled={isAiLoading}
            >
              Back
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-initial font-semibold"
              onClick={handleConfirmAndSave}
              disabled={isAiLoading || approvedCount === 0}
            >
              <span>Save & Launch My Profile</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
