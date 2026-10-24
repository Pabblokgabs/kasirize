"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MOCK_OPPORTUNITIES, MOCK_TASKS } from "@/constants/mock-data";
import { taskToSlug } from "@/lib/slugs";
import { getStoredProfile } from "@/lib/store";
import { Opportunity, Task, YouthProfile } from "@/types";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  MapPin,
  Plus,
  Shield,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const APPLIED_TASKS_KEY = "kasirize_youth_applied_task_ids";
const ACTIVE_TASKS_KEY = "kasirize_active_requester_tasks";

interface RequesterTaskItem {
  id: string;
  title: string;
  description: string;
  location: string;
  durationHours: number;
  workersNeeded?: number;
  budgetType?: string;
  perWorkerPayoutRands?: number;
  totalBudgetRands?: number;
  skillsToLearn?: string[];
  safetyNotes?: string;
  requesterName?: string;
}

export default function YouthDashboardPage() {
  const [profile] = useState<YouthProfile>(() =>
    getStoredProfile(),
  );

  // Load merged list of mock tasks and any requester-posted tasks from local storage
  const [allTasks] = useState<Task[]>(() => {
    let combined: Task[] = [...MOCK_TASKS];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(ACTIVE_TASKS_KEY);
        if (stored) {
          const customTasks = JSON.parse(stored) as RequesterTaskItem[];
          const adapted: Task[] = customTasks.map((ct) => ({
            id: ct.id,
            title: ct.title,
            description: ct.description,
            location: ct.location,
            payoutCents:
              (ct.perWorkerPayoutRands || ct.totalBudgetRands || 180) * 100,
            estimatedTaxiFareCents: 0,
            durationHours: ct.durationHours || 3,
            deadline: new Date(Date.now() + 86400000).toISOString(),
            status: "open",
            requesterName: ct.requesterName || "Local Requester",
            requesterType: "spaza_shop",
            skillsRequired: ct.skillsToLearn || [
              "Customer Service",
              "Punctuality",
            ],
            safetyNotes:
              ct.safetyNotes || "Hyper-local task, walkable distance.",
            workersNeeded: ct.workersNeeded || 1,
          }));
          combined = [...adapted, ...MOCK_TASKS];
        }
      } catch (err) {
        console.warn("Could not load custom requester tasks:", err);
      }
    }
    return combined;
  });

  const [opportunities] = useState<Opportunity[]>(
    MOCK_OPPORTUNITIES.slice(0, 3),
  );

  // Applied tasks state synced with localStorage
  const [appliedTaskIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(APPLIED_TASKS_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [expandedBreakdownTaskId, setExpandedBreakdownTaskId] = useState<
    string | null
  >(null);

  // Helper to categorize skills into "Verify existing" vs "Add new skill"
  const getSkillMatchBreakdown = (taskSkills: string[]) => {
    const userSkillNames = (profile?.skills || []).map((s) =>
      s.skillName.toLowerCase(),
    );
    const verifiedOrExisting: string[] = [];
    const newToEarn: string[] = [];

    taskSkills.forEach((skill) => {
      const match = userSkillNames.some(
        (us) =>
          us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us),
      );
      if (match) {
        verifiedOrExisting.push(skill);
      } else {
        newToEarn.push(skill);
      }
    });

    const matchPercent =
      taskSkills.length > 0
        ? Math.round(
            (verifiedOrExisting.length / taskSkills.length) * 60 +
              (profile?.location ? 30 : 15),
          )
        : 85;

    return {
      verifiedOrExisting,
      newToEarn,
      matchPercent: Math.min(98, Math.max(35, matchPercent)),
    };
  };

  // const handleSimulateCompletion = (task: Task) => {
  //   if (!profile) return;
  //   const payout = task.payoutCents;

  //   // Add or verify skills on profile
  //   const existingSkills = [...(profile.skills || [])];
  //   task.skillsRequired.forEach((reqSkill) => {
  //     const existingIdx = existingSkills.findIndex(
  //       (s) =>
  //         s.skillName.toLowerCase().includes(reqSkill.toLowerCase()) ||
  //         reqSkill.toLowerCase().includes(s.skillName.toLowerCase()),
  //     );
  //     if (existingIdx >= 0) {
  //       // Upgrade to verified with boosted confidence
  //       existingSkills[existingIdx] = {
  //         ...existingSkills[existingIdx],
  //         status: "task_verified",
  //         confidence: Math.min(
  //           100,
  //           existingSkills[existingIdx].confidence + 15,
  //         ),
  //         endorsedBy: task.requesterName,
  //       };
  //     } else {
  //       // Add as newly proven skill
  //       existingSkills.push({
  //         id: `ps-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
  //         skillId: `sk-custom-${Date.now()}`,
  //         skillName: reqSkill,
  //         status: "task_verified",
  //         confidence: 85,
  //         userApproved: true,
  //         endorsedBy: task.requesterName,
  //       });
  //     }
  //   });

  //   const updatedProfile: YouthProfile = {
  //     ...profile,
  //     skills: existingSkills,
  //     completedTasksCount: (profile.completedTasksCount || 0) + 1,
  //     mockWalletCents: (profile.mockWalletCents || 0) + payout,
  //     overallConfidenceScore: Math.min(
  //       100,
  //       (profile.overallConfidenceScore || 65) + 6,
  //     ),
  //   };

  //   saveStoredProfile(updatedProfile);
  //   setProfile(updatedProfile);
  //   toast.success(
  //     `Task completed! R ${(payout / 100).toFixed(0)} credited & skills verified on your profile!`,
  //   );
  // };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-muted-foreground text-sm">
        Loading Youth Dashboard...
      </div>
    );
  }

  const walletRands = ((profile.mockWalletCents || 0) / 100).toFixed(2);
  const confidence = profile.overallConfidenceScore || 65;

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── APP HEADER ─── */}
      <header className="sticky md:hidden lg:block top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <span className="font-heading">K</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Sawubona,</div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                {profile.fullName || "Youth Pioneer"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Wallet className="size-3.5" />
              <span>R {walletRands}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── CREDIBILITY & INCOME HERO CARD ─── */}
        <section className="p-5 sm:p-6 rounded-card bg-linear-to-br from-brand-deep to-primary-900 text-white shadow-lift relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 text-white mb-2">
                <ShieldCheck className="size-3.5 text-accent" />
                <span>Verified Practical Credibility</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight mb-1 text-white">
                Confidence Score: {confidence}%
              </h2>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Shortening the distance to jobs. Each verified task and referee
                confirmation improves your employer match ranking.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                  ✅ {profile.completedTasksCount || 0} Tasks Completed
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15">
                  ⭐ 4.9 Requester Avg
                </span>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/15 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">Available Earnings</span>
                <span className="font-bold text-white text-sm">
                  R {walletRands}
                </span>
              </div>
              <div className="text-[11px] text-white/70">
                Earned via confirmed local tasks. Safe escrow credited
                immediately upon requester sign-off.
              </div>
              <Button
                size="sm"
                className="w-full bg-white text-brand-deep hover:bg-white/90 font-bold text-xs shadow-xs"
                onClick={() =>
                  toast(
                    "Mock payout request initiated. Payouts processed every Friday.",
                  )
                }
              >
                Withdraw Mock Earnings
              </Button>
            </div>
          </div>
        </section>

        {/* ─── SAFETY BANNER (INSPIRED BY Kasirize) ─── */}
        <div className="p-3.5 rounded-card bg-primary/5 border border-primary/20 flex items-start gap-3">
          <Shield className="size-4.5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-foreground">
              Safety comes first.{" "}
            </span>
            <span className="text-muted-foreground">
              Every task shows who the requester is and their verification
              status. You never pay to take on a task, and your payout is
              secured in local escrow before you start.
            </span>
          </div>
        </div>

        {/* ─── CONFIRMED SKILLS ROW ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-foreground">
              Your Confirmed Skills
            </h3>
            <Link
              href="/review-skills"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage Skills</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="shrink-0 p-3 rounded-card bg-card border border-border shadow-card min-w-50 max-w-60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                      {skill.status === "task_verified" ||
                      skill.status === "referee_confirmed"
                        ? "Verified"
                        : "Self-Declared"}
                    </span>
                    <span className="text-[11px] font-bold text-primary">
                      {skill.confidence}%
                    </span>
                  </div>
                  <h4 className="font-medium text-xs text-foreground line-clamp-1">
                    {skill.skillName}
                  </h4>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {skill.endorsedBy
                      ? `Verified by ${skill.endorsedBy}`
                      : skill.status === "referee_confirmed"
                        ? "Confirmed by referee"
                        : "Derived from story"}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-card bg-card border border-border text-xs text-muted-foreground">
                No skills added yet. Complete a task to earn your first verified
                skill!
              </div>
            )}
          </div>
        </section>

        {/* ─── NEARBY TASKS (WITH SKILL VERIFICATION & PROFILE ADDITION) ─── */}
        <section className="space-y-4">
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span>Verified Township Tasks</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {allTasks.length} Available
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete tasks to earn money and immediately verify or add
                demonstrated skills to your profile.
              </p>
            </div>
            <Link
              href="/dashboard/user/tasks"
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              See all tasks →
            </Link>
          </div>

          <div className="flex md:hidden">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                Verified Township Tasks
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete tasks to earn money and immediately verify or add
                demonstrated skills to your profile.
              </p>
            </div>

            <div className="flex flex-row items-center justify-between mt-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {allTasks.length} Available
              </span>
              <Link
                href="/dashboard/user/tasks"
                className="text-xs font-semibold text-primary hover:underline shrink-0"
              >
                See all tasks →
              </Link>
            </div>
          </div>

          <div className="space-y-3.5">
            {allTasks.map((task) => {
              // const isApplied = appliedTaskIds.includes(task.id);
              const { verifiedOrExisting, newToEarn, matchPercent } =
                getSkillMatchBreakdown(task.skillsRequired || []);
              const isBreakdownOpen = expandedBreakdownTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className="p-4 sm:p-5 rounded-card bg-card border border-border shadow-card hover:border-primary/40 transition-all space-y-3.5"
                >
                  {/* Top Bar: Verification Badge, Match Score, Payout */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        <ShieldCheck className="size-3" />
                        <span>Verified Requester</span>
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-light/10 text-brand-mid">
                        {matchPercent}% Match
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base sm:text-lg font-heading font-bold text-foreground block">
                        R {(task.payoutCents / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h4 className="font-heading font-bold text-base text-foreground mb-1">
                      {task.title}
                    </h4>

                    <div className="flex flex-col md:flex-row md:items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground">
                        {task.requesterName}
                      </span>
                      <span className="hidden md:block">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary" />
                        {task.location}
                      </span>
                      <span className="hidden md:block">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {task.durationHours} hrs
                      </span>
                    </div>
                  </div>

                  {/* ─── SKILLS IMPACT BANNER (INSPIRATION: YOU HAVE / BUILDS) ─── */}
                  <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-2 border border-border/60">
                    <div className="text-muted-foreground text-[11px]">
                      {verifiedOrExisting.length > 0 &&
                      newToEarn.length === 0 ? (
                        <span>
                          You have every listed skill. Finish this task to get
                          them officially verified!
                        </span>
                      ) : verifiedOrExisting.length > 0 ? (
                        <span>
                          You have {verifiedOrExisting.length} of{" "}
                          {task.skillsRequired.length} listed skills. This task
                          also builds {newToEarn.length} new skill
                          {newToEarn.length > 1 ? "s" : ""} on your profile.
                        </span>
                      ) : (
                        <span>
                          You do not have these skills on your profile yet.
                          Great way to add them — you are free to apply!
                        </span>
                      )}
                    </div>

                    {/* Skill Pills: You have (Verify) vs Builds (Add to Profile) */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {verifiedOrExisting.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-foreground">
                            You have:
                          </span>
                          {verifiedOrExisting.map((skill, idx) => (
                            <span
                              key={`have-${idx}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium text-[11px]"
                            >
                              <Check className="size-3" />
                              <span>{skill}</span>
                              <span className="text-[9px] text-primary/70 font-bold uppercase">
                                (Verify)
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {newToEarn.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-foreground">
                            Builds:
                          </span>
                          {newToEarn.map((skill, idx) => (
                            <span
                              key={`build-${idx}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium text-[11px]"
                            >
                              <Plus className="size-3" />
                              <span>{skill}</span>
                              <span className="text-[9px] text-accent/80 font-bold uppercase">
                                (Add)
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Match Breakdown Drawer/Card Section (Inspired by Kasirize reference) */}
                  {isBreakdownOpen && (
                    <div className="rounded-xl bg-muted/40 border border-border/80 p-4 space-y-4 text-xs animate-in fade-in-50 duration-200">
                      {/* Overview summary */}
                      <p className="text-muted-foreground leading-relaxed">
                        {task.description}
                      </p>

                      {/* What is asked of you */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                          What is asked of you
                        </span>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full border border-foreground/40 shrink-0" />
                            <span>
                              Able to perform the required duties for the{" "}
                              {task.durationHours}-hour session
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full border border-foreground/40 shrink-0" />
                            <span>
                              Follow requester guidelines and check in on
                              arrival
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full border border-foreground/40 shrink-0" />
                            <span>Arrive on time at {task.location}</span>
                          </li>
                        </ul>
                      </div>

                      {/* How this match is worked out */}
                      <div className="space-y-3 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                          How this match is worked out
                        </span>

                        {/* Metric 1: Skills you have */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">
                              Skills you have
                            </span>
                            <span className="font-medium text-muted-foreground">
                              {verifiedOrExisting.length > 0
                                ? Math.round(
                                    (verifiedOrExisting.length /
                                      (task.skillsRequired.length || 1)) *
                                      45,
                                  )
                                : 0}
                              /45
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width: `${(verifiedOrExisting.length / (task.skillsRequired.length || 1)) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            You have {verifiedOrExisting.length} of{" "}
                            {task.skillsRequired.length} listed skills.
                          </p>
                        </div>

                        {/* Metric 2: Getting there */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">
                              Getting there
                            </span>
                            <span className="font-medium text-muted-foreground">
                              20/20
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-full" />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Hyper-local walking distance in {task.location}. Only
                            youth living within walking distance can take this task.
                          </p>
                        </div>

                        {/* Metric 3: Requester safety */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">
                              Requester safety
                            </span>
                            <span className="font-medium text-muted-foreground">
                              20/20
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-full" />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            This requester ({task.requesterName}) has a
                            confirmed history on Kasirize and pre-funded escrow.
                          </p>
                        </div>

                        {/* Metric 4: Evidence & readiness */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">
                              Evidence &amp; readiness
                            </span>
                            <span className="font-medium text-muted-foreground">
                              {verifiedOrExisting.length > 0 ? "12/15" : "0/15"}
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{
                                width:
                                  verifiedOrExisting.length > 0 ? "80%" : "0%",
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {verifiedOrExisting.length} of{" "}
                            {task.skillsRequired.length} matching skills are
                            verified. Completing this task can verify the rest.
                          </p>
                        </div>
                      </div>

                      {/* Score guidance footnote */}
                      <div className="pt-2 border-t border-border/80 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Shield className="size-3.5 text-muted-foreground shrink-0" />
                        <span>
                          This score is guidance only. It never decides for you
                          — you choose what to take on.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedBreakdownTaskId(
                          isBreakdownOpen ? null : task.id,
                        )
                      }
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>
                        {isBreakdownOpen
                          ? "Hide match details"
                          : "Why this matches"}
                      </span>
                      {isBreakdownOpen ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </button>

                    <div className="flex items-center gap-2 ml-auto">
                      <Link
                        href={`/tasks/${taskToSlug(task.title)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-brand-deep text-white hover:opacity-90 text-xs font-semibold transition-opacity"
                      >
                        <Eye className="size-3.5" />
                        <span>{appliedTaskIds.includes(task.id) ? "View / Applied ✓" : "View Details & Apply"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── MATCHED CAREER OPPORTUNITIES ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Matched Opportunities
              </h3>
              <p className="text-xs text-muted-foreground">
                Longer-term learnerships and jobs matching your verified
                competencies.
              </p>
            </div>
            <Link
              href="/dashboard/user/opportunities"
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      {opp.type.replace("_", " ")}
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {opp.monthlyStipendCents
                        ? `R ${(opp.monthlyStipendCents / 100).toLocaleString()} / month`
                        : "Market competitive"}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {opp.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {opp.employerName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {opp.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "flex-1 sm:flex-initial text-xs font-semibold",
                    })}
                  >
                    View Details &amp; Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
