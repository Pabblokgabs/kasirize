"use client";

import { CreateAccountModal } from "@/components/shared/create-account-modal";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveUserData } from "@/hooks/queries";
import { taskToSlug } from "@/lib/slugs";
import { getStoredProfile } from "@/lib/store";
import { getCurrentUserData } from "@/lib/user-data";
import { useKasirizeStore } from "@/store/kasirize-store";
import { Opportunity, Task, YouthProfile } from "@/types";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Lock,
  MapPin,
  Plus,
  Shield,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export default function YouthDashboardPage() {
  const currentData = getCurrentUserData();
  const authUser = useKasirizeStore((state) => state.authUser);
  const activeEmail =
    authUser?.email || currentData.user?.email || "kagiso@kasirize.org.za";

  const { data: liveData, isLoading } = useLiveUserData(activeEmail);
  const [expandedBreakdownTaskId, setExpandedBreakdownTaskId] = useState<
    string | null
  >(null);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

  const isGuestUser = Boolean(
    authUser?.isGuest ||
    (!liveData?.profile && authUser?.id?.startsWith("usr_guest_"))
  );

  // Derive profile cleanly from query result or fallback
  const profile: YouthProfile = useMemo(() => {
    // Only users who went through the guest onboarding flow without a live DB account are guests
    const isGuest = Boolean(
      authUser?.isGuest ||
      (liveData?.user && liveData.user.isGuest) ||
      (!liveData?.profile && authUser?.id?.startsWith("usr_guest_"))
    );

    // If genuinely a guest user with a locally stored draft
    if (isGuest) {
      const stored = getStoredProfile();
      if (stored) return stored;
    }

    // For real logged-in users with live Neon DB data
    if (liveData?.profile) {
      return {
        id: liveData.profile.userId || liveData.user?.id || "usr_youth_01",
        fullName:
          liveData.user?.name || currentData.user?.name || "Kagiso Sithole",
        email: liveData.user?.email || activeEmail,
        location:
          liveData.profile.location ||
          currentData.youthProfile?.location ||
          "Soweto",
        province:
          liveData.profile.province ||
          currentData.youthProfile?.province ||
          "Gauteng",
        experienceStory:
          liveData.profile.experienceStory ||
          currentData.youthProfile?.experienceStory ||
          "Logistics and retail assistant.",
        overallConfidenceScore:
          liveData.profile.confidenceScore ||
          liveData.user?.confidenceScore ||
          91,
        mockWalletCents: liveData.profile.walletBalanceCents ?? 45000,
        completedTasksCount: liveData.profile.completedTasksCount ?? 14,
        savedOpportunities: ["opp_01"],
        transportStipendEligible: true,
        createdAt: liveData.profile.createdAt || new Date().toISOString(),
        skills: (liveData.skills || []).map(
          (s: {
            id: string;
            skillId: string;
            skillName: string;
            verified: boolean;
            confidenceScore: number;
          }) => ({
            id: s.id,
            skillId: s.skillId,
            skillName: s.skillName,
            status: s.verified
              ? ("task_verified" as const)
              : ("self_declared" as const),
            confidence: s.confidenceScore || 85,
            userApproved: true,
          }),
        ),
      };
    }
    return (
      currentData.youthProfile || {
        id: "usr_youth_01",
        fullName: currentData.user.name || "Kagiso Sithole",
        email: activeEmail,
        location: "Soweto",
        province: "Gauteng",
        experienceStory: "Logistics and retail assistant.",
        overallConfidenceScore: 91,
        mockWalletCents: 45000,
        completedTasksCount: 14,
        savedOpportunities: ["opp_01"],
        transportStipendEligible: true,
        createdAt: new Date().toISOString(),
        skills: [],
      }
    );
  }, [liveData, activeEmail, currentData, authUser?.isGuest, authUser?.id]);
  console.log(profile);

  // Derive tasks cleanly from query result
  const allTasks: Task[] = useMemo(() => {
    const rawList = [
      ...(liveData?.tasks?.assigned || []),
      ...(liveData?.tasks?.available || []),
    ];

    if (rawList.length === 0) return [];

    const mapped: Task[] = rawList.map(
      (t: {
        id: string;
        title: string;
        description: string;
        location: string;
        payoutCents: number;
        estimatedTaxiFareCents?: number;
        durationHours?: number;
        deadline?: string;
        status?: string;
        requesterName?: string;
        skillsRequired?: string[] | string;
        safetyNotes?: string;
        workersNeeded?: number;
      }) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        location: t.location,
        payoutCents: t.payoutCents || 15000,
        estimatedTaxiFareCents: t.estimatedTaxiFareCents || 0,
        durationHours: t.durationHours || 3,
        deadline: t.deadline || new Date().toISOString(),
        status: (t.status as Task["status"]) || "open",
        requesterName: t.requesterName || "Township Enterprise",
        requesterType: "spaza_shop",
        skillsRequired: Array.isArray(t.skillsRequired)
          ? t.skillsRequired
          : typeof t.skillsRequired === "string"
            ? JSON.parse(t.skillsRequired || "[]")
            : ["Customer Service", "Punctuality"],
        safetyNotes: t.safetyNotes || "Verified local task.",
        workersNeeded: t.workersNeeded || 1,
      }),
    );

    return Array.from(new Map(mapped.map((t) => [t.id, t])).values());
  }, [liveData]);

  // Derive opportunities cleanly
  const opportunities: Opportunity[] = useMemo(() => {
    if (!liveData?.opportunities || !Array.isArray(liveData.opportunities))
      return [];

    return liveData.opportunities
      .slice(0, 5)
      .map(
        (o: {
          id: string;
          title: string;
          companyName: string;
          location: string;
          stipendCents?: number;
          type?: string;
          description?: string;
          requirements?: string[];
        }) => ({
          id: o.id,
          title: o.title,
          employerName: o.companyName,
          employerId: "emp_1",
          location: o.location,
          organisationType: "retailer",
          type: (o.type as Opportunity["type"]) || "learnership",
          description: o.description || "",
          requiredSkills: Array.isArray(o.requirements)
            ? o.requirements
            : ["Hardworking", "Punctual"],
          applicationDeadline: new Date(
            Date.now() + 86400000 * 14,
          ).toISOString(),
          monthlyStipendCents: o.stipendCents || 450000,
          transportCreditFunded: true,
        }),
      );
  }, [liveData]);

  // Applied task ids
  const appliedTaskIds: string[] = useMemo(() => {
    return (liveData?.tasks?.assigned || []).map((t: { id: string }) => t.id);
  }, [liveData]);

  // Skill matching helper
  const getSkillMatchBreakdown = (taskSkills: string[]) => {
    const userSkillNames = (profile?.skills ?? [])
      .map((s) => s.skillName?.trim().toLowerCase())
      .filter((name): name is string => Boolean(name));

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

  const walletRands = ((profile.mockWalletCents || 0) / 100).toFixed(2);
  const confidence = profile.overallConfidenceScore || 91;

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
        {/* ─── GUEST BANNER (Only if user has no live account and is in guest mode) ─── */}
        {isGuestUser && (
          <div className="p-4 rounded-card bg-primary/10 border-2 border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0 mt-0.5">
                <Lock className="size-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>Guest Mode Profile Active</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-white">
                    Limited Access
                  </span>
                </span>
                <p className="text-xs text-muted-foreground">
                  Your profile and skills are saved locally. To apply for tasks,
                  unlock transport funding, or chat with businesses, create a
                  permanent account.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateAccountModal(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-btn bg-brand-deep text-white hover:opacity-90 font-semibold text-xs shrink-0 cursor-pointer transition-opacity"
            >
              Create Account
            </button>
          </div>
        )}
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
              <button
                type="button"
                className="w-full bg-white text-brand-deep hover:bg-white/90 font-bold text-xs py-2 px-3 rounded-md shadow-xs cursor-pointer"
                onClick={() =>
                  toast(
                    "Payout request logged. Payouts processed every Friday directly to your wallet.",
                  )
                }
              >
                Withdraw Earnings
              </button>
            </div>
          </div>
        </section>

        {/* ─── SAFETY BANNER ─── */}
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
                        : "Derived from profile"}
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

        {/* ─── NEARBY TASKS ─── */}
        <section className="space-y-4">
          <div className="items-center justify-between hidden md:flex">
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

          <div className="flex md:hidden items-center justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
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
              <span className="font-heading font-bold text-base text-foreground">
                Verified Township Tasks
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete tasks to earn money and immediately verify or add
                demonstrated skills to your profile.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-card bg-card border border-border shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-28 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <div className="flex justify-between pt-2 border-t border-border">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-32 rounded-btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3.5">
              {allTasks.map((task) => {
                const { verifiedOrExisting, newToEarn, matchPercent } =
                  getSkillMatchBreakdown(task.skillsRequired || []);
                const isBreakdownOpen = expandedBreakdownTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className="p-4 sm:p-5 rounded-card bg-card border border-border shadow-card hover:border-primary/40 transition-all space-y-3.5"
                  >
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

                    {/* Skills Impact */}
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
                            {task.skillsRequired.length} listed skills. This
                            task also builds {newToEarn.length} new skill
                            {newToEarn.length > 1 ? "s" : ""} on your profile.
                          </span>
                        ) : (
                          <span>
                            You do not have these skills on your profile yet.
                            Great way to add them — you are free to apply!
                          </span>
                        )}
                      </div>

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

                    {/* Breakdown */}
                    {isBreakdownOpen && (
                      <div className="rounded-xl bg-muted/40 border border-border/80 p-4 space-y-4 text-xs animate-in fade-in-50 duration-200">
                        <p className="text-muted-foreground leading-relaxed">
                          {task.description}
                        </p>
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
                          <span>
                            {appliedTaskIds.includes(task.id)
                              ? "View / Applied ✓"
                              : "View Details & Apply"}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── MATCHED OPPORTUNITIES ─── */}
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
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-24 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-8 w-36 rounded-btn" />
                  </div>
                ))}
              </div>
            ) : (
              opportunities.map((opp) => (
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
                        className:
                          "flex-1 sm:flex-initial text-xs font-semibold",
                      })}
                    >
                      View Details &amp; Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <CreateAccountModal
        isOpen={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
        actionName="Unlock Full Access"
      />
    </div>
  );
}
