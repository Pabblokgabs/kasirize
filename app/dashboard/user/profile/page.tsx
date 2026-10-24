"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getStoredProfile, saveStoredProfile } from "@/lib/store";
import { ProfileSkill, YouthProfile } from "@/types";
import {
  ArrowRight,
  Briefcase,
  Check,
  Edit2,
  FileText,
  FolderKanban,
  Lock,
  MapPin,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const USER_ACCOUNT_KEY = "kasirize_registered_user_account";
const USER_VERIFICATION_KEY = "kasirize_user_identity_verified";

export default function YouthProfileDetailPage() {
  const [profile, setProfile] = useState<YouthProfile>(() =>
    getStoredProfile(),
  );

  // Account & User Verification State (default to guest / not created account yet)
  const [hasAccount, setHasAccount] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(USER_ACCOUNT_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return false;
  });

  const [isUserVerified, setIsUserVerified] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(USER_VERIFICATION_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return false;
  });

  // Create account modal
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [accountEmail, setAccountEmail] = useState(profile?.email || "");
  const [accountPhone, setAccountPhone] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  // Verify identity modal
  const [isVerifyUserOpen, setIsVerifyUserOpen] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [refereeContact, setRefereeContact] = useState("");

  // Edit header details modal
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(profile?.fullName || "");
  const [editHeadline, setEditHeadline] = useState(
    profile?.experienceStory?.slice(0, 60) ||
      "Job seeker & practical township task worker",
  );
  const [editLocation, setEditLocation] = useState(
    profile?.location || "Soweto, Gauteng",
  );
  const [editRoleStatus, setEditRoleStatus] = useState("Job seeker");

  // Edit/Add skills modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Customer & Sales");

  // Show public profile toggle
  const [showPublicProfile, setShowPublicProfile] = useState(true);

  // Experience story edit
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [storyText, setStoryText] = useState(profile?.experienceStory || "");

  // Profile completeness checklist calculation
  const hasName = Boolean(profile?.fullName && profile.fullName.trim() !== "");
  const hasLocation = Boolean(
    profile?.location && profile.location.trim() !== "",
  );
  const hasStory = Boolean(
    profile?.experienceStory && profile.experienceStory.trim().length > 10,
  );
  const totalSkills = profile?.skills?.length || 0;
  const verifiedSkillsCount =
    profile?.skills?.filter(
      (s) => s.status === "task_verified" || s.status === "referee_confirmed",
    ).length || 0;
  const hasAtLeastOneSkill = totalSkills >= 1;
  const hasFourSkills = totalSkills >= 4;

  // Calculate percentage based on criteria
  const checklistItems = [
    { label: "Add your name", done: hasName },
    { label: "Add a short headline", done: Boolean(editHeadline) },
    { label: "Add the area you work in", done: hasLocation },
    { label: "Write your experience story", done: hasStory },
    { label: "Confirm at least one skill", done: hasAtLeastOneSkill },
    { label: "Confirm four or more skills", done: hasFourSkills },
    { label: "Verify your user identity", done: isUserVerified },
  ];

  const completedCount = checklistItems.filter((i) => i.done).length;
  const completenessPercent = Math.round(
    (completedCount / checklistItems.length) * 100,
  );

  // Categorize skills
  const categorizedSkills =
    profile?.skills?.reduce(
      (acc, skill) => {
        const name = skill.skillName.toLowerCase();
        let category = "Customer & Sales";
        if (
          name.includes("stock") ||
          name.includes("inventory") ||
          name.includes("admin") ||
          name.includes("reconciliation") ||
          name.includes("data") ||
          name.includes("filing")
        ) {
          category = "Organising & Admin";
        } else if (
          name.includes("tool") ||
          name.includes("mechanic") ||
          name.includes("plumb") ||
          name.includes("weld") ||
          name.includes("driver") ||
          name.includes("repair")
        ) {
          category = "Trades & Operations";
        }

        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, ProfileSkill[]>,
    ) || {};

  const categories = Object.keys(categorizedSkills);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountEmail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const updated = {
      ...profile,
      email: accountEmail.trim(),
    };
    saveStoredProfile(updated);
    setProfile(updated);
    setHasAccount(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ACCOUNT_KEY, JSON.stringify(true));
    }
    setIsCreateAccountOpen(false);
    toast.success("Account created successfully! Full app features unlocked.");
  };

  const handleVerifyUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserVerified(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_VERIFICATION_KEY, JSON.stringify(true));
    }
    setIsVerifyUserOpen(false);
    toast.success("Identity verified! You now carry the Verified User badge.");
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      fullName: editName.trim() || profile.fullName,
      location: editLocation.trim() || profile.location,
    };
    saveStoredProfile(updated);
    setProfile(updated);
    setIsEditingDetails(false);
    toast.success("Profile details updated!");
  };

  const handleSaveStory = () => {
    const updated = {
      ...profile,
      experienceStory: storyText.trim(),
    };
    saveStoredProfile(updated);
    setProfile(updated);
    setIsEditingStory(false);
    toast.success("Experience story saved!");
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: ProfileSkill = {
      id: `ps-${Date.now()}`,
      skillId: `sk-custom-${Date.now()}`,
      skillName: newSkillName.trim(),
      status: "self_declared",
      confidence: 65,
      userApproved: true,
    };

    const updated = {
      ...profile,
      skills: [...(profile.skills || []), newSkill],
    };

    saveStoredProfile(updated);
    setProfile(updated);
    setNewSkillName("");
    setIsAddSkillOpen(false);
    toast.success(`"${newSkill.skillName}" added to your profile!`);
  };

  const handleRemoveSkill = (id: string, name: string) => {
    const updated = {
      ...profile,
      skills: (profile.skills || []).filter((s) => s.id !== id),
    };
    saveStoredProfile(updated);
    setProfile(updated);
    toast.success(`Removed "${name}"`);
  };

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-base sm:text-lg text-foreground">
              My Profile
            </h1>
            {isUserVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="size-3" />
                <span>Verified User</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {profile.overallConfidenceScore || 65}% Credibility
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!hasAccount && (
              <Button
                size="sm"
                onClick={() => setIsCreateAccountOpen(true)}
                className="text-xs font-semibold gap-1.5 bg-brand-deep text-white hover:opacity-90"
              >
                <UserPlus className="size-3.5" />
                <span>Create Account</span>
              </Button>
            )}

            <Link
              href="/build-profile"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
            >
              <Sparkles className="size-3.5" />
              <span>Profile Builder</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* ─── BANNER LOGIC: 
            1. If user doesn't have an account: encourage them to create one for full experience.
            2. If user has account but is NOT verified: encourage them to start verification.
            3. If user is verified: show nothing.
        ─── */}
        {!hasAccount ? (
          <div className="p-4 rounded-card bg-brand-light/10 border border-brand-light/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <UserPlus className="size-5 text-brand-deep shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-sm block">
                  Create an account to unlock the full Kasirize experience
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  Join to save your profile permanently, apply for verified jobs
                  &amp; tasks, chat directly with requesters, and receive
                  interview transport credits.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreateAccountOpen(true)}
              className="font-semibold text-xs shrink-0 bg-brand-deep text-white hover:opacity-90 gap-1.5"
            >
              <span>Join Now (Free)</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        ) : !isUserVerified ? (
          <div className="p-4 rounded-card bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground text-sm block">
                  Get Verified on Kasirize
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  Start your user verification to confirm your identity and
                  community credibility, unlocking top priority on tasks and
                  employer learnership shortlists.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsVerifyUserOpen(true)}
                className="text-xs font-semibold"
              >
                Start Verification
              </Button>
              <Link
                href="/dashboard/user/tasks"
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-btn bg-brand-deep text-white font-semibold text-xs hover:opacity-90 transition-opacity"
              >
                <span>Take a Task</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* ─── TOP PROFILE BANNER (MATCHING PHOTO) ─── */}
        <section className="p-6 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar Initial Circle */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand-light/20 border-2 border-brand-mid/40 flex items-center justify-center text-brand-deep font-heading font-bold text-2xl shrink-0 shadow-sm">
              {profile.fullName
                ? profile.fullName.charAt(0).toUpperCase()
                : "K"}
            </div>
            {isUserVerified && (
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-card shadow-xs"
                title="Verified User"
              >
                <Check className="size-3.5 stroke-3" />
              </span>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    {profile.fullName || "Add your name"}
                  </h2>
                  {isUserVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      <ShieldCheck className="size-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {editHeadline}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingDetails(true)}
                className="text-xs font-semibold gap-1.5 shrink-0 self-start sm:self-center"
              >
                <Edit2 className="size-3.5" />
                <span>Edit details</span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground font-medium">
                <MapPin className="size-3 text-primary" />
                <span>{profile.location || "Add the area you work in"}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-deep/10 text-brand-deep font-medium">
                <Briefcase className="size-3" />
                <span>{editRoleStatus}</span>
              </span>

              {hasAccount ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  <UserCheck className="size-3" />
                  <span>Account Active</span>
                </span>
              ) : (
                <button
                  onClick={() => setIsCreateAccountOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 font-medium transition-colors"
                >
                  <UserPlus className="size-3" />
                  <span>Guest (Join Now)</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ─── MAIN 2-COLUMN GRID (MATCHING PHOTO STRUCTURE) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          {/* LEFT COLUMN: COMPLETENESS, SKILLS COUNT, EVIDENCE, APPLICATIONS, VISIBILITY */}
          <div className="space-y-4">
            {/* 1. Profile Completeness */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    Profile completeness
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    This just shows what is filled in. It never measures your
                    worth.
                  </p>
                </div>
                <span className="font-heading font-bold text-xl text-primary shrink-0 pl-2">
                  {completenessPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${completenessPercent}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-1 text-[11px]">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    {item.done ? (
                      <span className="size-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="size-2.5" />
                      </span>
                    ) : (
                      <span className="size-4 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 text-[10px]">
                        –
                      </span>
                    )}
                    <span
                      className={
                        item.done
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Your Skills Stat Box */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-3">
              <h3 className="font-heading font-bold text-sm text-foreground">
                Your skills
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-muted/60">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Total
                  </div>
                  <div className="font-heading font-bold text-lg text-foreground mt-0.5">
                    {totalSkills}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-600 font-semibold uppercase">
                    Verified
                  </div>
                  <div className="font-heading font-bold text-lg text-emerald-600 mt-0.5">
                    {verifiedSkillsCount}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/60">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Self-declared
                  </div>
                  <div className="font-heading font-bold text-lg text-foreground mt-0.5">
                    {totalSkills - verifiedSkillsCount}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                Verified skills have been confirmed by a task, referee, or
                employer. Self-declared skills are what you told us — still
                valuable, just not independently confirmed yet.
              </p>
            </div>

            {/* 3. Your Evidence */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    Your evidence
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                    Photos, requester messages and completed tasks. Connect them
                    to the skills they prove.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <FolderKanban className="size-4" />
                </div>
              </div>

              <Link
                href="/youth-profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ArrowRight className="size-3.5" />
                <span>View my evidence</span>
              </Link>
            </div>

            {/* 4. Your Applications */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    Your applications
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                    Follow every application through each stage, and follow up
                    when it goes quiet.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <FileText className="size-4" />
                </div>
              </div>

              <Link
                href="/dashboard/user/applications"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <ArrowRight className="size-3.5" />
                <span>Track my applications</span>
              </Link>
            </div>

            {/* 5. Show My Profile Toggle */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading font-bold text-sm text-foreground">
                  Show my profile
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPublicProfile}
                    onChange={(e) => {
                      setShowPublicProfile(e.target.checked);
                      toast.success(
                        e.target.checked
                          ? "Profile visible to verified providers"
                          : "Profile set to private",
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-deep"></div>
                </label>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Off by default. Turn this on when you want providers to see your
                confirmed skills.
              </p>

              <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-border">
                <Lock className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  Your phone, email and address are never shown publicly.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SKILLS BY CATEGORY (ACCURATELY MATCHING THE PHOTO) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Skills by category
                </h3>
                <span className="hidden md:block text-xs px-2.5 py-0.5 rounded-full bg-brand-light/20 text-brand-deep font-semibold">
                  {categories.length} categories
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddSkillOpen(true)}
                className="text-xs font-semibold gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Add more skills</span>
              </Button>
            </div>

            {/* Render Category Sections */}
            {categories.length === 0 ? (
              <div className="p-8 text-center rounded-card bg-card border border-border space-y-3">
                <p className="text-xs text-muted-foreground">
                  No skills listed on your profile yet. Add your practical
                  competencies to get matched with tasks and opportunities.
                </p>
                <Button size="sm" onClick={() => setIsAddSkillOpen(true)}>
                  Add your first skill
                </Button>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category} className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span>{category}</span>
                    <span className="px-1.5 py-0.2 rounded bg-muted text-[10px] text-foreground font-semibold">
                      {categorizedSkills[category].length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {categorizedSkills[category].map((skill) => {
                      const isVerified =
                        skill.status === "task_verified" ||
                        skill.status === "referee_confirmed";

                      return (
                        <div
                          key={skill.id}
                          className="p-4 sm:p-5 rounded-card bg-card border border-border shadow-card hover:border-primary/40 transition-colors space-y-2.5"
                        >
                          {/* Top Row: Skill Title & Badges */}
                          <div className="flex flex-col md:items-start justify-between gap-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-heading font-bold text-sm text-foreground truncate">
                                {skill.skillName}
                              </h4>

                              <button
                                onClick={() =>
                                  handleRemoveSkill(skill.id, skill.skillName)
                                }
                                className="text-muted-foreground hover:text-destructive p-1 transition-colors block md:hidden"
                                title="Remove skill"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                <FileText className="size-2.5" />
                                <span>
                                  {isVerified
                                    ? "Task-verified"
                                    : "Self-declared"}
                                </span>
                              </span>

                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-light/10 text-brand-mid">
                                <Sparkles className="size-2.5 text-accent" />
                                <span>Found by Kasirize</span>
                              </span>

                              <button
                                onClick={() =>
                                  handleRemoveSkill(skill.id, skill.skillName)
                                }
                                className="text-muted-foreground hover:text-destructive p-1 transition-colors hidden md:block"
                                title="Remove skill"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Skill description / story context */}
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {profile.experienceStory
                              ? `Context from your story: "${profile.experienceStory.slice(0, 100)}..."`
                              : "Demonstrated through informal experience and practical township task duties."}
                          </p>

                          {/* Provenance progress bar & note */}
                          <div className="flex items-center gap-3 pt-1">
                            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isVerified
                                    ? "bg-emerald-500 w-full"
                                    : "bg-primary w-2/5"
                                }`}
                              />
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">
                              {isVerified
                                ? "Fully confirmed by completed task"
                                : "Partly supported by what you wrote"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Experience Story Card */}
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    Written Experience Story
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Your authentic informal story from which skills are derived.
                  </p>
                </div>
                {!isEditingStory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold gap-1"
                    onClick={() => setIsEditingStory(true)}
                  >
                    <Edit2 className="size-3" />
                    <span>Edit</span>
                  </Button>
                )}
              </div>

              {isEditingStory ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full p-3 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Describe your practical work experience, family business responsibilities, volunteering, or community projects..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingStory(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveStory}
                      className="text-xs font-semibold"
                    >
                      Save Story
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/40 p-3.5 rounded-lg border border-border">
                  &quot;
                  {profile.experienceStory || "No experience story added yet."}
                  &quot;
                </p>
              )}
            </div>

            <p className="text-[11px] text-muted-foreground text-center pt-2">
              Last updated{" "}
              {new Date().toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              . Everything here is stored securely on your device.
            </p>
          </div>
        </div>
      </main>

      {/* ─── MODAL: CREATE ACCOUNT (JOIN KASIRIZE) ─── */}
      <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateAccount}>
            <DialogHeader>
              <DialogTitle className="font-heading text-base font-bold text-foreground">
                Join Kasirize &amp; Save Your Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Create a permanent account to unlock direct applications for
                jobs, local gigs, and employer interview credits.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="e.g. neo@gmail.com"
                  className="bg-card text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Phone Number (WhatsApp)
                </label>
                <Input
                  type="tel"
                  value={accountPhone}
                  onChange={(e) => setAccountPhone(e.target.value)}
                  placeholder="e.g. 072 123 4567"
                  className="bg-card text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="bg-card text-xs"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/60 border border-border text-[11px] text-muted-foreground">
                <p>
                  Zero cost guarantee: Kasirize is 100% free for young
                  job-seekers. You never pay to apply or register.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateAccountOpen(false)}
                className="text-xs"
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-semibold bg-brand-deep text-white hover:opacity-90"
              >
                Create Free Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: VERIFY USER IDENTITY ─── */}
      <Dialog open={isVerifyUserOpen} onOpenChange={setIsVerifyUserOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleVerifyUser}>
            <DialogHeader>
              <DialogTitle className="font-heading text-base font-bold text-foreground">
                Verify Your Identity
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Confirm your identity to receive the Verified User badge and get
                prioritized by employers and task requesters.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  SA ID or Passport Number
                </label>
                <Input
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 020512..."
                  className="bg-card text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Community Referee / Mentor Contact
                </label>
                <Input
                  value={refereeContact}
                  onChange={(e) => setRefereeContact(e.target.value)}
                  placeholder="Name and phone of local leader, teacher, or former employer"
                  className="bg-card text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
                Verified users enjoy higher trust scores, instant escrow
                payouts, and employer transport disbursements.
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsVerifyUserOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirm Verification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: EDIT NAME & HEADLINE DETAILS ─── */}
      <Dialog open={isEditingDetails} onOpenChange={setIsEditingDetails}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSaveDetails}>
            <DialogHeader>
              <DialogTitle className="font-heading text-base font-bold text-foreground">
                Edit Profile Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update how you appear to task requesters and potential
                employers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Neo Khumalo"
                  className="bg-card text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Headline / Short Bio
                </label>
                <Input
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  placeholder="e.g. Retail Assistant &amp; Stock Auditor"
                  className="bg-card text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Area / Township
                </label>
                <Input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Soweto, Gauteng"
                  className="bg-card text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Current Status
                </label>
                <select
                  value={editRoleStatus}
                  onChange={(e) => setEditRoleStatus(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="Job seeker">Job seeker</option>
                  <option value="Available for tasks">
                    Available for tasks
                  </option>
                  <option value="Student / Upskilling">
                    Student / Upskilling
                  </option>
                  <option value="Part-time employed">Part-time employed</option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingDetails(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: ADD MORE SKILLS ─── */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddSkill}>
            <DialogHeader>
              <DialogTitle className="font-heading text-base font-bold text-foreground">
                Add Skill to Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                List a skill you can perform. Completing a relevant local task
                will verify it.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Skill Name
                </label>
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Cash handling, Barista, Inventory Audit..."
                  className="bg-card text-xs"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="Customer & Sales">Customer &amp; Sales</option>
                  <option value="Organising & Admin">
                    Organising &amp; Admin
                  </option>
                  <option value="Trades & Operations">
                    Trades &amp; Operations
                  </option>
                </select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddSkillOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Add Skill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
