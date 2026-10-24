"use client";

import { Button } from "@/components/ui/button";
import { MOCK_TASKS } from "@/constants/mock-data";
import { taskToSlug } from "@/lib/slugs";
import { getStoredProfile } from "@/lib/store";
import { Task, YouthProfile } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Lock,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useState } from "react";
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

export default function PublicTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [profile] = useState<YouthProfile>(() => getStoredProfile());
  const [appliedTaskIds, setAppliedTaskIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedApplied = localStorage.getItem(APPLIED_TASKS_KEY);
        if (storedApplied) return JSON.parse(storedApplied);
      } catch {
        // fallback
      }
    }
    return [];
  });
  const [isApplying, setIsApplying] = useState(false);

  // Decode the URL param (handles encoded slugs like %26 for &)
  const decodedParam = decodeURIComponent(id);

  // Retrieve task matching ID or slug
  const [task] = useState<Task | null>(() => {
    // 1. Check MOCK_TASKS
    const directMock = MOCK_TASKS.find(
      (t) => t.id === decodedParam || taskToSlug(t.title) === decodedParam,
    );
    if (directMock) return directMock;

    // 2. Check localStorage custom requester tasks
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(ACTIVE_TASKS_KEY);
        if (stored) {
          const customTasks = JSON.parse(stored) as RequesterTaskItem[];
          const foundCustom = customTasks.find(
            (ct) =>
              ct.id === decodedParam || taskToSlug(ct.title) === decodedParam,
          );
          if (foundCustom) {
            return {
              id: foundCustom.id,
              title: foundCustom.title,
              description: foundCustom.description,
              location: foundCustom.location,
              payoutCents:
                (foundCustom.perWorkerPayoutRands ||
                  foundCustom.totalBudgetRands ||
                  180) * 100,
              estimatedTaxiFareCents: 0,
              durationHours: foundCustom.durationHours || 3,
              deadline: "In 2 days",
              status: "open",
              requesterName:
                foundCustom.requesterName || "Local Spaza Requester",
              requesterType: "spaza_shop",
              skillsRequired: foundCustom.skillsToLearn || [
                "Customer Service",
                "Punctuality",
              ],
              safetyNotes:
                foundCustom.safetyNotes ||
                "Hyper-local task, walkable distance.",
              workersNeeded: foundCustom.workersNeeded || 1,
            };
          }
        }
      } catch {
        // fallback
      }
    }
    return null;
  });

  if (!task) {
    notFound();
  }

  const isApplied = appliedTaskIds.includes(task.id);
  const userSkillNames = (profile?.skills || []).map((s) =>
    s.skillName.toLowerCase(),
  );

  const verifiedOrExisting = (task.skillsRequired || []).filter((req) =>
    userSkillNames.some(
      (us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us),
    ),
  );

  const newToEarn = (task.skillsRequired || []).filter(
    (req) => !verifiedOrExisting.includes(req),
  );

  const matchPercent =
    task.skillsRequired.length > 0
      ? Math.min(
          98,
          Math.max(
            35,
            Math.round(
              (verifiedOrExisting.length / task.skillsRequired.length) * 60 +
                (profile?.location ? 30 : 15),
            ),
          ),
        )
      : 85;

  const payoutFormatted = `R ${(task.payoutCents / 100).toFixed(2)}`;

  const handleApply = () => {
    if (isApplied) return;
    setIsApplying(true);
    setTimeout(() => {
      const updated = [...appliedTaskIds, task.id];
      setAppliedTaskIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(APPLIED_TASKS_KEY, JSON.stringify(updated));
      }
      setIsApplying(false);
      toast.success(`Application sent to ${task.requesterName}!`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── TOP BREADCRUMB HEADER ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard/user"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>All tasks</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {matchPercent}% match
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* ─── LEFT COLUMN: DETAILS & SECTIONS (MATCHING SCREENSHOT) ─── */}
          <div className="space-y-6">
            {/* Header / Hero block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-3.5" />
                  <span>Verified requester</span>
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Demo task
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {task.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Posted by{" "}
                  <strong className="text-foreground">
                    {task.requesterName}
                  </strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-destructive font-medium">
                  <Calendar className="size-3.5" />
                  <span>Active &amp; Accepting</span>
                </span>
              </div>

              {/* Quick Stat Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <Coins className="size-3.5 text-primary" />
                    <span>Pay</span>
                  </div>
                  <div className="font-heading font-bold text-base text-foreground">
                    {payoutFormatted}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="size-3.5 text-primary" />
                    <span>Time needed</span>
                  </div>
                  <div className="font-heading font-bold text-base text-foreground">
                    {task.durationHours} hrs
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <MapPin className="size-3.5 text-primary" />
                    <span>Where</span>
                  </div>
                  <div className="font-heading font-bold text-xs text-foreground truncate">
                    {task.location}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-card border border-border">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1">
                    <Wifi className="size-3.5 text-primary" />
                    <span>Data</span>
                  </div>
                  <div className="font-heading font-bold text-xs text-foreground">
                    Low data (offline ok)
                  </div>
                </div>
              </div>
            </div>

            {/* Safety First Card (exact from image) */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <span className="font-heading font-bold text-sm text-foreground">
                    Safety first
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    Verified requester
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This requester has posted tasks before and had them completed
                successfully.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Never pay anything to take on a task — Kasirize tasks are
                    always free to accept.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Meet in a public or known place when you can, and tell
                    someone where you are going.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Keep your chat in Kasirize so there is a record, and report
                    anything that feels off.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Only share personal details (like your address) once you are
                    comfortable and it is needed.
                  </span>
                </div>
              </div>
            </div>

            {/* About this task card */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                About this task
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>

              <div className="pt-2 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  What is asked of you
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full border border-foreground/50 shrink-0" />
                    <span>
                      Able to stand or walk for the {task.durationHours}-hour
                      session
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full border border-foreground/50 shrink-0" />
                    <span>
                      Careful attention to task instructions and requester
                      check-in
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full border border-foreground/50 shrink-0" />
                    <span>Arrive on time at {task.location}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Skills this task uses (exact matching screenshot) */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3.5">
              <div>
                <h2 className="font-heading font-bold text-base text-foreground">
                  Skills this task uses
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Finish the task and get it confirmed by the requester, and
                  these skills become verified on your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Box 1: You already have */}
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <CheckCircle2 className="size-4" />
                    <span>You already have</span>
                  </div>
                  {verifiedOrExisting.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      {verifiedOrExisting.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-foreground font-medium"
                        >
                          <Check className="size-3.5 text-primary" />
                          <span>{s}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            (self-declared)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground pt-1">
                      None of these skills are on your profile yet.
                    </p>
                  )}
                </div>

                {/* Box 2: What this can verify */}
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Sparkles className="size-4 text-accent" />
                    <span>What this can verify / build</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {task.skillsRequired.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-xs text-foreground font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                        <div>
                          <span>{s}</span>{" "}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            — verified once confirmed
                          </span>
                        </div>
                      </div>
                    ))}
                    <p className="text-[11px] text-muted-foreground pt-1">
                      Missing skills never stop you from applying to a task.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting there & data */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3.5">
              <div>
                <h2 className="font-heading font-bold text-base text-foreground">
                  Getting there &amp; data
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We estimate the real cost of showing up, so a good task never
                  costs you money to take on.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2 text-xs">
                  <span className="font-bold text-foreground block">
                    Travel estimate
                  </span>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Where:</span>
                    <strong className="text-foreground">{task.location}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated travel time:</span>
                    <strong className="text-foreground">
                      Walkable township distance
                    </strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Eligibility:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Walking distance only (Local youth)
                    </strong>
                  </div>
                  <div className="pt-1.5 border-t border-border flex justify-between font-bold text-primary">
                    <span>You would earn:</span>
                    <span>{payoutFormatted} net</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2 text-xs">
                  <span className="font-bold text-foreground block">
                    Data you&apos;ll need
                  </span>
                  <p className="font-semibold text-foreground">Low data</p>
                  <p className="text-muted-foreground leading-relaxed">
                    You can mostly work offline. Only a little data is needed to
                    check in and confirm completion.
                  </p>
                </div>
              </div>
            </div>

            {/* About the requester */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3.5">
              <h2 className="font-heading font-bold text-base text-foreground">
                About the requester
              </h2>

              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-brand-deep text-white font-bold flex items-center justify-center font-heading text-base">
                  {task.requesterName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-foreground">
                      {task.requesterName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary/10 text-primary">
                      ID confirmed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-primary" />
                    <span>{task.location}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Runs a verified township enterprise and frequently hires youth
                for confirmed micro-shifts.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border">
                  <div className="font-bold text-foreground text-sm">★ 4.9</div>
                  <div className="text-[10px] text-muted-foreground">
                    Rating
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border">
                  <div className="font-bold text-foreground text-sm">14</div>
                  <div className="text-[10px] text-muted-foreground">
                    Tasks posted
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border">
                  <div className="font-bold text-foreground text-sm">2026</div>
                  <div className="text-[10px] text-muted-foreground">
                    Member since
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <Lock className="size-3 shrink-0" />
                <span>
                  Phone and exact address are never shown publicly — only shared
                  once you both agree on a task.
                </span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: STICKY APPLICATION ACTION CARD (MATCHING SCREENSHOT) ─── */}
          <div className="sticky top-20 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-lift space-y-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  You Earn
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {payoutFormatted}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {matchPercent}%
                  </span>
                </div>
                <span className="text-xs text-primary font-medium block mt-1">
                  100% net earnings (walkable township task)
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {verifiedOrExisting.length > 0
                  ? `You have ${verifiedOrExisting.length} of ${task.skillsRequired.length} listed skills. This task also builds ${newToEarn.length} new competency.`
                  : "You are free to apply and build brand-new verified competencies on this task."}
              </p>

              <div className="space-y-2 pt-1">
                <Button
                  className="w-full font-bold shadow-xs py-2.5"
                  onClick={handleApply}
                  disabled={isApplied || isApplying}
                >
                  <Send className="size-4 mr-2" />
                  {isApplied
                    ? "Applied for this task ✓"
                    : isApplying
                      ? "Submitting..."
                      : "Apply for this task"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold"
                  onClick={() => router.push("/dashboard/user/chat")}
                >
                  <MessageSquare className="size-4 mr-2" />
                  <span>Message the requester</span>
                </Button>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Time needed:</span>
                  <strong className="text-foreground">
                    {task.durationHours} hrs
                  </strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Status:</span>
                  <strong className="text-primary font-bold">Open</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Requester:</span>
                  <strong className="text-foreground">
                    {task.requesterName}
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  You never pay to take on a task. Report or block anyone from
                  the chat if something feels wrong.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
