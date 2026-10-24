"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_TASKS, MOCK_YOUTH_PROFILES } from "@/constants/mock-data";
import { Task } from "@/types";
import {
  Check,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface AssignedWorker {
  id: string;
  name: string;
  initials: string;
  rating: number;
  feedback: string;
  demonstratedSkills: string[];
}

export default function RequesterDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  // Rating modal state
  const [selectedTaskForRating, setSelectedTaskForRating] =
    useState<Task | null>(null);
  const [rateMode, setRateMode] = useState<"all" | "individual">("all");
  const [bulkRating, setBulkRating] = useState(5);
  const [bulkFeedback, setBulkFeedback] = useState(
    "Great punctuality and handled tasks diligently.",
  );
  const [assignedWorkers, setAssignedWorkers] = useState<AssignedWorker[]>([]);

  // Open the interactive rating modal instead of automatic completion
  const handleOpenRatingModal = (task: Task) => {
    setSelectedTaskForRating(task);

    // Prepare default assigned youth for this task
    const mockAssigned: AssignedWorker[] = [
      {
        id: "y1",
        name: MOCK_YOUTH_PROFILES[0]?.fullName || "Sipho Dlamini",
        initials: "SD",
        rating: 5,
        feedback: "Very diligent with stock counts and punctual.",
        demonstratedSkills:
          task.skillsRequired.length > 0
            ? [...task.skillsRequired]
            : ["Stock Auditing"],
      },
      {
        id: "y2",
        name: MOCK_YOUTH_PROFILES[1]?.fullName || "Nomvula Khumalo",
        initials: "NK",
        rating: 5,
        feedback: "Exceptional speed and customer etiquette.",
        demonstratedSkills:
          task.skillsRequired.length > 0
            ? [...task.skillsRequired]
            : ["Customer Service"],
      },
    ];

    setAssignedWorkers(mockAssigned);
  };

  const toggleWorkerSkill = (workerId: string, skill: string) => {
    setAssignedWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const current = w.demonstratedSkills;
          const updated = current.includes(skill)
            ? current.filter((s) => s !== skill)
            : [...current, skill];
          return { ...w, demonstratedSkills: updated };
        }
        return w;
      }),
    );
  };

  const handleConfirmAndRate = () => {
    if (!selectedTaskForRating) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForRating.id
          ? { ...t, status: "completed" as const }
          : t,
      ),
    );

    toast.success(
      "Ratings submitted and verified skills credited to youth profiles!",
    );
    setSelectedTaskForRating(null);
  };

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <div>
              <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Task Requester Dashboard
              </div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                Phiri Corner Stores &amp; Partners
              </h1>
            </div>
          </div>

          <div className="hidden md:block">
            <Link
              href="/dashboard/requester/post-task"
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="size-4 mr-1.5" />
              <span>Post New Task</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── YOUTH IMPACT & FUTURE SHAPING HERO CARD ─── */}
        <section className="relative overflow-hidden rounded-card bg-linear-to-br from-brand-deep via-primary-900 to-primary-950 p-6 text-white shadow-lift border border-primary-700/40">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-white border border-white/15">
                <HeartHandshake className="size-4 text-accent" />
                <span>Community Economic Multiplier</span>
              </div>
              <span className="text-xs text-white/70">
                Active in Soweto &amp; Greater Gauteng
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              <div className="md:col-span-2 space-y-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  You Have Directly Backed 14 Local Youth Into Meaningful Work
                </h2>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                  Every short gig you offer isn&apos;t just immediate income —
                  your verified task ratings and skill endorsements build a
                  permanent, evidence-backed CV that unlocks permanent jobs,
                  formal learnerships, and employer trust.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-accent" />
                    <span>
                      <strong>24</strong> Verified Skills Endorsed on Youth
                      Profiles
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-accent" />
                    <span>
                      <strong>100%</strong> of Workers Reached Level 2
                      Credibility
                    </span>
                  </div>
                </div>
              </div>

              {/* Impact Metric Pillar */}
              <div className="bg-white/10 rounded-card p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-white/75 uppercase tracking-wider block">
                    Youth Pathways Created
                  </span>
                  <div className="font-heading text-3xl font-bold text-white mt-1">
                    14 Youth
                  </div>
                  <p className="text-[11px] text-white/75 mt-1">
                    Transformed from informal gig workers into verified
                    candidates with employer-accepted references.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/15 mt-3 flex items-center justify-between text-[11px] text-white/80">
                  <span>Total Income Paid:</span>
                  <strong className="text-white text-sm">R 3,850</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUICK METRICS ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Active Posted Tasks
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              {tasks.filter((t) => t.status === "open").length}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Youth Applications
            </span>
            <span className="font-heading text-2xl font-bold text-primary">
              12
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Tasks Completed
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              {tasks.filter((t) => t.status === "completed").length + 7}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Badges Awarded
            </span>
            <span className="font-heading text-2xl font-bold text-accent">
              18
            </span>
          </div>
        </div>

        {/* ─── YOUR POSTED TASKS & ACTION QUEUE ─── */}
        <section className="space-y-3 mb-5 md:mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-3 md:mb-0">
              <h3 className="font-heading font-bold text-base text-foreground">
                Your Tasks &amp; Candidate Confirmations
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review assigned youth, endorse skills demonstrated on each task,
                and submit ratings.
              </p>
            </div>
            <Link
              href="/dashboard/requester/tasks"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Manage Active Shift Timers →
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      R {(task.payoutCents / 100).toFixed(0)} Payout
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {task.durationHours} hrs
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {task.status}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3 text-primary" />
                    <span>{task.location}</span>
                    {/* <span>•</span>
                    <span className="text-primary font-medium">
                      Walking distance / Local only
                    </span> */}
                  </div>

                  {/* Skills Tagged */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {task.skillsRequired.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-muted text-foreground text-[10px] px-2 py-0.5 rounded font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {task.status === "open" ? (
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs font-semibold"
                      onClick={() => handleOpenRatingModal(task)}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      <span>Confirm Done &amp; Rate Youth</span>
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <ShieldCheck className="size-4" />
                      <span>Completed &amp; Rated</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ACCEPTED YOUTH PROFILES READY FOR WORK ─── */}
        {/* <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-heading font-bold text-base text-foreground">
            Top Matched Youth in Your Area
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {MOCK_YOUTH_PROFILES.map((youth) => (
              <div
                key={youth.id}
                className="p-4 rounded-card bg-card border border-border shadow-card flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-sm text-foreground">
                      {youth.fullName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {youth.overallConfidenceScore}% Trust
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="size-3 text-primary" />
                    <span>{youth.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {youth.skills.slice(0, 2).map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
                      >
                        {s.skillName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 items-end">
                  <Link
                    href="/dashboard/requester/chat"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Direct Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </main>

      {/* ─── INTERACTIVE RATING DIALOG ─── */}
      <Dialog
        open={!!selectedTaskForRating}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskForRating(null);
        }}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Rate Assigned Youth &amp; Endorse Skills
            </DialogTitle>
            <DialogDescription>
              Task:{" "}
              <span className="text-foreground font-semibold">
                {selectedTaskForRating?.title}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedTaskForRating && (
            <div className="space-y-4 pt-2">
              {/* Rating Mode: All at once or individual */}
              <div className="p-3 bg-muted/50 rounded-btn space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Rating Method:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRateMode("all")}
                    className={`p-2 rounded-btn border text-xs font-semibold text-center transition-all ${
                      rateMode === "all"
                        ? "bg-card border-primary text-primary shadow-xs"
                        : "border-border text-muted-foreground hover:bg-card"
                    }`}
                  >
                    Rate All Workers Together
                  </button>
                  <button
                    type="button"
                    onClick={() => setRateMode("individual")}
                    className={`p-2 rounded-btn border text-xs font-semibold text-center transition-all ${
                      rateMode === "individual"
                        ? "bg-card border-primary text-primary shadow-xs"
                        : "border-border text-muted-foreground hover:bg-card"
                    }`}
                  >
                    Rate Each Youth Individually
                  </button>
                </div>
              </div>

              {/* Option A: Rate All Together */}
              {rateMode === "all" ? (
                <div className="space-y-4 bg-muted/20 p-4 rounded-btn border border-border">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Performance Score (All Workers)
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setBulkRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`size-6 ${
                              star <= bulkRating
                                ? "fill-amber-400 text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-foreground ml-2">
                        {bulkRating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      Team Feedback
                    </span>
                    <Textarea
                      rows={2}
                      value={bulkFeedback}
                      onChange={(e) => setBulkFeedback(e.target.value)}
                      className="text-xs"
                      placeholder="Write a short reference statement for all youth on this task..."
                    />
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-foreground block mb-1">
                      Endorse Demonstrated Skills (Applied to all workers)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTaskForRating.skillsRequired.map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-btn font-medium flex items-center gap-1"
                        >
                          <Check className="size-3.5" /> {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Option B: Rate Individually */
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {assignedWorkers.map((w) => (
                    <div
                      key={w.id}
                      className="bg-muted/30 p-4 rounded-btn border border-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                            {w.initials}
                          </div>
                          <span className="font-bold text-xs text-foreground">
                            {w.name}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setAssignedWorkers((prev) =>
                                  prev.map((item) =>
                                    item.id === w.id
                                      ? { ...item, rating: star }
                                      : item,
                                  ),
                                )
                              }
                            >
                              <Star
                                className={`size-4 ${
                                  star <= w.rating
                                    ? "fill-amber-400 text-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Demonstrated Skills Toggle */}
                      <div>
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                          Which skills did {w.name} demonstrate good capability
                          on?
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTaskForRating.skillsRequired.map(
                            (sk, idx) => {
                              const isSelected =
                                w.demonstratedSkills.includes(sk);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => toggleWorkerSkill(w.id, sk)}
                                  className={`text-[11px] px-2.5 py-1 rounded-btn font-medium border transition-all flex items-center gap-1 ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {isSelected && <Check className="size-3" />}
                                  {sk}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Individual feedback */}
                      <div>
                        <Textarea
                          rows={2}
                          value={w.feedback}
                          onChange={(e) =>
                            setAssignedWorkers((prev) =>
                              prev.map((item) =>
                                item.id === w.id
                                  ? { ...item, feedback: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          placeholder={`Individual note on ${w.name}'s performance...`}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTaskForRating(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmAndRate}>
              Confirm Ratings &amp; Release Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
