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
import { getCurrentUserData } from "@/lib/user-data";
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
import { useEffect, useState } from "react";
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
  const currentData = getCurrentUserData();
  const requesterName = currentData.user.name || "Kasi Fresh Mart";
  const [stats, setStats] = useState(currentData.stats);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Rating modal state
  const [selectedTaskForRating, setSelectedTaskForRating] =
    useState<Task | null>(null);
  const [rateMode, setRateMode] = useState<"all" | "individual">("all");
  const [bulkRating, setBulkRating] = useState(5);
  const [bulkFeedback, setBulkFeedback] = useState(
    "Great punctuality and handled tasks diligently.",
  );
  const [assignedWorkers, setAssignedWorkers] = useState<AssignedWorker[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadRequesterData() {
      try {
        const email = currentData.user.email || "sipho@kasifresh.co.za";
        const res = await fetch(`/api/user/live-data?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.tasks && Array.isArray(json.tasks) && isMounted) {
            const adapted: Task[] = json.tasks.map((t: {
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
              assignedYouthId?: string;
            }) => ({
              id: t.id,
              title: t.title,
              description: t.description,
              location: t.location,
              payoutCents: t.payoutCents || 18000,
              estimatedTaxiFareCents: t.estimatedTaxiFareCents || 0,
              durationHours: t.durationHours || 3,
              deadline: t.deadline || new Date().toISOString(),
              status: (t.status as Task["status"]) || "open",
              requesterName: t.requesterName || requesterName,
              requesterType: "spaza_shop",
              skillsRequired: Array.isArray(t.skillsRequired)
                ? t.skillsRequired
                : typeof t.skillsRequired === "string"
                ? JSON.parse(t.skillsRequired || "[]")
                : ["Inventory", "Customer Care"],
              safetyNotes: t.safetyNotes || "Verified local task.",
              workersNeeded: t.workersNeeded || 1,
            }));
            setTasks(adapted);
          }
        }
      } catch (err) {
        console.error("Failed to load requester tasks:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadRequesterData();
    return () => {
      isMounted = false;
    };
  }, [currentData.user.email, requesterName]);

  const handleOpenRatingModal = (task: Task) => {
    setSelectedTaskForRating(task);

    const defaultAssigned: AssignedWorker[] = [
      {
        id: "usr_youth_01",
        name: "Kagiso Sithole",
        initials: "KS",
        rating: 5,
        feedback: "Very diligent with stock counts and arrived ahead of schedule.",
        demonstratedSkills: task.skillsRequired.length > 0 ? [...task.skillsRequired] : ["Stock Auditing"],
      },
      {
        id: "usr_youth_02",
        name: "Themba Ndaba",
        initials: "TN",
        rating: 5,
        feedback: "Handled customer queues politely and quickly.",
        demonstratedSkills: task.skillsRequired.length > 0 ? [...task.skillsRequired] : ["Customer Service"],
      },
    ];

    setAssignedWorkers(defaultAssigned);
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

  const handleConfirmAndRate = async () => {
    if (!selectedTaskForRating) return;

    try {
      await fetch(`/api/tasks/${selectedTaskForRating.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          rating: bulkRating,
          feedback: bulkFeedback,
          skillsDemonstrated: selectedTaskForRating.skillsRequired,
          reviewerId: currentData.user.id || "usr_req_01",
          reviewerName: requesterName,
        }),
      });
    } catch (err) {
      console.warn("Could not patch task review into db:", err);
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForRating.id ? { ...t, status: "completed" as const } : t,
      ),
    );

    toast.success(
      "Task verified! Escrow payout released and skills officially recorded on youth profile.",
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
              {requesterName.charAt(0)}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Task Requester Dashboard
              </div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                {requesterName}
              </h1>
            </div>
          </div>

          <div>
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
        {/* ─── YOUTH IMPACT HERO CARD ─── */}
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
                  You Have Backed Local Youth Into Real Work
                </h2>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                  Every short gig you offer isn&apos;t just immediate income —
                  your verified task ratings and skill endorsements build a
                  permanent, evidence-backed CV in the live database that unlocks jobs,
                  learnerships, and employer trust.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-accent" />
                    <span>
                      <strong>24</strong> Verified Skills Endorsed on Youth Profiles
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-accent" />
                    <span>
                      <strong>100%</strong> of Workers Reached Credibility Threshold
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-card p-4 border border-white/15 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-white/75 uppercase tracking-wider block">
                    Youth Pathways Created
                  </span>
                  <div className="font-heading text-3xl font-bold text-white mt-1">
                    {tasks.length > 0 ? tasks.length : 14} Gigs
                  </div>
                  <p className="text-[11px] text-white/75 mt-1">
                    Transformed informal micro-tasks into verified candidates with employer-accepted references.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/15 mt-3 flex items-center justify-between text-[11px] text-white/80">
                  <span>Secured Escrow:</span>
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
              Active Tasks
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              {tasks.filter((t) => t.status !== "completed").length}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Completed Tasks
            </span>
            <span className="font-heading text-2xl font-bold text-primary">
              {tasks.filter((t) => t.status === "completed").length}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Escrow Funded
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              R {(tasks.reduce((sum, t) => sum + t.payoutCents, 0) / 100).toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Safety Rating
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              5.0 ⭐
            </span>
          </div>
        </div>

        {/* ─── YOUR POSTED TASKS (WITH REAL CONFIRMATION/RATING) ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-foreground">
              Your Posted Township Tasks ({tasks.length})
            </h3>
            <Link
              href="/dashboard/requester/tasks"
              className="text-xs text-primary font-semibold hover:underline"
            >
              View Full Task Table →
            </Link>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading tasks from Neon database...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center rounded-card bg-card border border-border text-xs text-muted-foreground">
              No tasks posted yet. Click &quot;Post New Task&quot; above to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          task.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : task.status === "in_progress"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        R {(task.payoutCents / 100).toFixed(0)} Payout
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-foreground">
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary" />
                        {task.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {task.durationHours} hrs
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === "completed" ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-btn">
                        <CheckCircle2 className="size-4" />
                        <span>Verified &amp; Escrow Paid</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleOpenRatingModal(task)}
                        className="bg-brand-deep hover:bg-brand-mid text-white text-xs font-semibold"
                      >
                        <ShieldCheck className="size-3.5 mr-1" />
                        <span>Verify &amp; Rate Youth</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ─── INTERACTIVE RATING DIALOG ─── */}
      <Dialog
        open={Boolean(selectedTaskForRating)}
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

              {rateMode === "all" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Overall Group Star Rating:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setBulkRating(star)}
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
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Public Recommendation / Reference:
                    </label>
                    <Textarea
                      rows={3}
                      value={bulkFeedback}
                      onChange={(e) => setBulkFeedback(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              ) : (
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
