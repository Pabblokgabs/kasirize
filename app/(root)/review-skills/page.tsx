"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateConfidenceScore,
  getStoredProfile,
  saveStoredProfile,
} from "@/lib/store";
import { ProfileSkill } from "@/types";
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
import { toast } from "react-hot-toast";

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
    lower.includes("mic") ||
    lower.includes("audio")
  ) {
    suggestions.push({
      id: "ps-sug-6",
      skillId: "sk-6",
      skillName: "Community Event Audio & Equipment Setup",
      status: "self_declared",
      confidence: 65,
      userApproved: true,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: "ps-sug-1",
        skillId: "sk-1",
        skillName: "Stock Counting & Inventory Auditing",
        status: "self_declared",
        confidence: 60,
        userApproved: true,
      },
      {
        id: "ps-sug-5",
        skillId: "sk-5",
        skillName: "Customer Service & Conflict Resolution",
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
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [skills, setSkills] = useState<ProfileSkill[]>(() => {
    if (profile.skills && profile.skills.length > 0) {
      return profile.skills;
    }
    return getLocalFallbackSkills(profile.experienceStory || "");
  });

  const [aiSource, setAiSource] = useState<string>(() => {
    if (!profile.experienceStory || profile.experienceStory.length < 10) {
      return "Standard taxonomy applied";
    }
    return "Analyzing experience...";
  });
  const [isAiLoading, setIsAiLoading] = useState<boolean>(() => {
    return Boolean(
      profile.experienceStory && profile.experienceStory.length >= 10,
    );
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Live extract via /api/ai/extract-skills if story is present
  useEffect(() => {
    if (!profile.experienceStory || profile.experienceStory.length < 10) {
      return;
    }

    let isMounted = true;

    fetch("/api/ai/extract-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story: profile.experienceStory }),
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
        }
      })
      .catch((err) => {
        console.warn("API extraction error:", err);
      })
      .finally(() => {
        if (isMounted) setIsAiLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [profile.experienceStory]);

  const handleToggleApprove = (id: string) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, userApproved: !s.userApproved } : s,
      ),
    );
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Skill removed");
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
    toast.success("Skill updated");
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;

    const newSkill: ProfileSkill = {
      id: `ps-custom-${Date.now()}`,
      skillId: `sk-custom-${Date.now()}`,
      skillName: customSkillName.trim(),
      status: "self_declared",
      confidence: 50,
      userApproved: true,
    };

    setSkills((prev) => [...prev, newSkill]);
    setCustomSkillName("");
    setShowAddCustom(false);
    toast.success("Custom skill added!");
  };

  const handleConfirmAndSave = () => {
    const approvedSkills = skills.filter((s) => s.userApproved);
    if (approvedSkills.length === 0) {
      toast.error("Please approve at least one skill to continue.");
      return;
    }

    const updatedProfile = {
      ...profile,
      skills: approvedSkills,
      overallConfidenceScore: calculateConfidenceScore({
        ...profile,
        skills: approvedSkills,
      }),
    };

    saveStoredProfile(updatedProfile);
    setProfile(updatedProfile);
    toast.success("Profile saved with your confirmed skills!");
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
                <span>Extracting practical competencies...</span>
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
            We translated your experience story into structured, credible
            competencies. You have full control: approve, edit names, remove
            what does not fit, or add custom skills.
          </p>
        </div>

        {/* ─── SKILLS LIST ─── */}
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
                            {skill.status === "task_verified" ||
                            skill.status === "referee_confirmed"
                              ? "Verified"
                              : "Self-Declared"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Base confidence: {skill.confidence}% • Proved by
                          experience story
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
              Transparent Integrity Guarantee
            </span>
            <p className="text-muted-foreground">
              These skills start tagged as{" "}
              <strong className="text-foreground">Self-Declared</strong>. As you
              complete nearby tasks or add referees, Kasirize automatically
              elevates them to{" "}
              <strong className="text-foreground">Verified</strong> with
              permanent tamper-proof proof.
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
            >
              Back
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-initial font-semibold"
              onClick={handleConfirmAndSave}
              disabled={approvedCount === 0}
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
