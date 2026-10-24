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
import {
  ArrowLeft,
  Award,
  Check,
  CheckCircle,
  Clock,
  MapPin,
  PlusCircle,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface AssignedWorker {
  id: string;
  name: string;
  initials: string;
  rating: number; // 1-5
  feedback: string;
  demonstratedSkills: string[]; // skill names this worker was good at
}

interface ManageableTask {
  id: string;
  title: string;
  description: string;
  location: string;
  durationHours: number;
  workersNeeded: number;
  perWorkerPayoutRands: number;
  totalBudgetRands: number;
  skillsToLearn: string[];
  status: "active" | "finished" | "rated";
  timeRemainingMinutes: number; // countdown
  assignedYouth: AssignedWorker[];
}

const INITIAL_ACTIVE_TASKS: ManageableTask[] = [
  {
    id: "req-task-1",
    title: "Weekend Spaza Inventory Count & Cash Reconciliation",
    description:
      "Audit shelves, log stock variances, and reconcile till cash float.",
    location: "Orlando East, Soweto",
    durationHours: 3,
    workersNeeded: 2,
    perWorkerPayoutRands: 200,
    totalBudgetRands: 400,
    skillsToLearn: [
      "Stock Auditing & Variance Logging",
      "Cash Till Float Reconciliation",
      "Customer Service & Etiquette",
    ],
    status: "active",
    timeRemainingMinutes: 45,
    assignedYouth: [
      {
        id: "y1",
        name: "Sipho Dlamini",
        initials: "SD",
        rating: 5,
        feedback: "Very diligent with stock counts and punctual.",
        demonstratedSkills: ["Stock Auditing & Variance Logging"],
      },
      {
        id: "y2",
        name: "Nomvula Khumalo",
        initials: "NK",
        rating: 5,
        feedback: "Exceptional cash reconciliation accuracy.",
        demonstratedSkills: [
          "Cash Till Float Reconciliation",
          "Customer Service & Etiquette",
        ],
      },
    ],
  },
  {
    id: "req-task-2",
    title: "Bakery Scone Packaging & Morning Dispatch Staging",
    description:
      "Package fresh baked scones and organize crates for local delivery.",
    location: "Meadowlands, Soweto",
    durationHours: 2,
    workersNeeded: 1,
    perWorkerPayoutRands: 160,
    totalBudgetRands: 160,
    skillsToLearn: [
      "Food Hygiene & Packaging Standards",
      "Dispatch Inventory Organization",
    ],
    status: "active",
    timeRemainingMinutes: 15,
    assignedYouth: [
      {
        id: "y3",
        name: "Kagiso Mokoena",
        initials: "KM",
        rating: 5,
        feedback: "Handled packaging fast and cleanly.",
        demonstratedSkills: ["Food Hygiene & Packaging Standards"],
      },
    ],
  },
  {
    id: "req-task-3",
    title: "Flyer Handout & Promotions at Taxi Rank",
    description:
      "Distribute marketing flyers to commuters and announce weekend promotions.",
    location: "Bara Taxi Rank, Diepkloof",
    durationHours: 4,
    workersNeeded: 2,
    perWorkerPayoutRands: 250,
    totalBudgetRands: 500,
    skillsToLearn: [
      "Township Promotional Marketing",
      "Direct Verbal Communication",
    ],
    status: "finished",
    timeRemainingMinutes: 0,
    assignedYouth: [
      {
        id: "y4",
        name: "Lerato Mokoena",
        initials: "LM",
        rating: 5,
        feedback: "Energetic and great with passing commuters.",
        demonstratedSkills: [
          "Township Promotional Marketing",
          "Direct Verbal Communication",
        ],
      },
      {
        id: "y5",
        name: "Bafana Sithole",
        initials: "BS",
        rating: 4,
        feedback: "Reliable and stayed till all flyers were done.",
        demonstratedSkills: ["Township Promotional Marketing"],
      },
    ],
  },
];

export default function RequesterTasksPage() {
  const [tasks, setTasks] = useState<ManageableTask[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_active_requester_tasks");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ACTIVE_TASKS;
  });

  const [activeTab, setActiveTab] = useState<"active" | "finished">("active");
  const [selectedTaskForRating, setSelectedTaskForRating] =
    useState<ManageableTask | null>(null);

  // Rating modal state
  const [rateMode, setRateMode] = useState<"all" | "individual">("all");
  const [bulkRating, setBulkRating] = useState(5);
  const [bulkFeedback, setBulkFeedback] = useState(
    "Great work and demonstrated practical skill.",
  );
  const [workerRatings, setWorkerRatings] = useState<
    Record<
      string,
      { rating: number; feedback: string; demonstratedSkills: string[] }
    >
  >({});

  // Move task to finished manually
  const handleMarkAsFinished = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "finished" as const, timeRemainingMinutes: 0 }
          : t,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "kasirize_active_requester_tasks",
          JSON.stringify(updated),
        );
      }
      return updated;
    });
    toast.success("Task time ended! Ready to rate youth and release payout.");
  };

  // Open Rating modal
  const openRatingModal = (task: ManageableTask) => {
    setSelectedTaskForRating(task);
    const initialWorkerMap: Record<
      string,
      { rating: number; feedback: string; demonstratedSkills: string[] }
    > = {};
    task.assignedYouth.forEach((w) => {
      initialWorkerMap[w.id] = {
        rating: w.rating || 5,
        feedback: w.feedback || "Showed strong commitment and competence.",
        demonstratedSkills: [...task.skillsToLearn], // default all
      };
    });
    setWorkerRatings(initialWorkerMap);
  };

  const toggleSkillDemonstrated = (workerId: string, skill: string) => {
    setWorkerRatings((prev) => {
      const current = prev[workerId]?.demonstratedSkills || [];
      const updated = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
      return {
        ...prev,
        [workerId]: {
          ...prev[workerId],
          demonstratedSkills: updated,
        },
      };
    });
  };

  const handleSaveRatings = () => {
    if (!selectedTaskForRating) return;

    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === selectedTaskForRating.id) {
          const updatedWorkers = t.assignedYouth.map((w) => {
            if (rateMode === "all") {
              return {
                ...w,
                rating: bulkRating,
                feedback: bulkFeedback,
                demonstratedSkills: t.skillsToLearn,
              };
            } else {
              const r = workerRatings[w.id];
              return {
                ...w,
                rating: r?.rating || 5,
                feedback: r?.feedback || "Great performance.",
                demonstratedSkills: r?.demonstratedSkills || t.skillsToLearn,
              };
            }
          });
          return {
            ...t,
            status: "rated" as const,
            assignedYouth: updatedWorkers,
          };
        }
        return t;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "kasirize_active_requester_tasks",
          JSON.stringify(updated),
        );
      }
      return updated;
    });

    toast.success(
      "Ratings submitted and verified skills credited to youth profiles!",
    );
    setSelectedTaskForRating(null);
  };

  const activeTasks = tasks.filter((t) => t.status === "active");
  const finishedTasks = tasks.filter(
    (t) => t.status === "finished" || t.status === "rated",
  );

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-6 px-4 md:px-8 max-w-5xl mx-auto font-body">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/dashboard/requester"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Manage Tasks &amp; Active Requests
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor countdown timers, end shifts, and endorse demonstrated
            skills for hired youth.
          </p>
        </div>

        <Link
          href="/dashboard/requester/post-task"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <PlusCircle className="size-4 mr-1.5" /> Post New Task
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-muted p-1 rounded-btn w-fit mb-6 text-xs">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-1.5 rounded-btn font-semibold transition-all ${
            activeTab === "active"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active In Progress ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("finished")}
          className={`px-4 py-1.5 rounded-btn font-semibold transition-all ${
            activeTab === "finished"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Finished &amp; To Rate ({finishedTasks.length})
        </button>
      </div>

      {/* ─── ACTIVE TASKS VIEW ─── */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="bg-card rounded-card border border-border p-8 text-center space-y-3">
              <Clock className="size-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">
                No active tasks right now.
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Post a task to get matched with verified local youth for quick
                gig assistance.
              </p>
              <Link
                href="/dashboard/requester/post-task"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Post a Task
              </Link>
            </div>
          ) : (
            activeTasks.map((t) => (
              <div
                key={t.id}
                className="bg-card rounded-card border border-border shadow-card p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="size-3" /> In Progress
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3 text-primary" /> {t.location}
                      </span>
                    </div>
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      {t.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                      {t.description}
                    </p>
                  </div>

                  {/* Countdown Timer Badge */}
                  <div className="bg-muted p-3 rounded-card text-center min-w-32 border border-border shrink-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Time to finish
                    </p>
                    <p className="font-heading text-xl font-bold text-primary">
                      {t.timeRemainingMinutes > 0
                        ? `${t.timeRemainingMinutes}m left`
                        : "Ready"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Shift: {t.durationHours}h
                    </p>
                  </div>
                </div>

                {/* Hired Youth on this task */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" />
                      Assigned Youth ({t.assignedYouth.length} /{" "}
                      {t.workersNeeded})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Payout:{" "}
                      <strong className="text-foreground">
                        R {t.perWorkerPayoutRands} each
                      </strong>{" "}
                      (Total: R {t.totalBudgetRands})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.assignedYouth.map((y) => (
                      <div
                        key={y.id}
                        className="bg-muted/40 p-2.5 rounded-btn border border-border flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                            {y.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {y.name}
                            </p>
                            <span className="text-[10px] text-primary font-medium">
                              On Site Performing Task
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-foreground font-semibold">
                          R {t.perWorkerPayoutRands}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills being learned */}
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Skills Youth Learn on this Task:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.skillsToLearn.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary text-[11px] font-medium px-2.5 py-0.5 rounded-btn"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action to end task */}
                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <Button
                    onClick={() => handleMarkAsFinished(t.id)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <CheckCircle className="size-3.5 mr-1.5 text-primary" />
                    Complete &amp; Proceed to Rating
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── FINISHED & RATING VIEW ─── */}
      {activeTab === "finished" && (
        <div className="space-y-4">
          {finishedTasks.map((t) => (
            <div
              key={t.id}
              className="bg-card rounded-card border border-border shadow-card p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === "rated"
                          ? "bg-accent/15 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {t.status === "rated"
                        ? "✓ Rated & Endorsed"
                        : "Ready for Rating & Payout"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.location}
                    </span>
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {t.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Paid</p>
                  <p className="font-heading text-lg font-bold text-foreground">
                    R {t.totalBudgetRands}
                  </p>
                </div>
              </div>

              {/* Workers Review Summary */}
              <div className="divide-y divide-border border-y border-border py-2">
                {t.assignedYouth.map((y) => (
                  <div
                    key={y.id}
                    className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">
                        {y.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {y.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground italic">
                          &ldquo;{y.feedback || "Task performed efficiently."}
                          &rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center text-amber-500 mr-2 text-xs font-bold">
                        <Star className="size-3.5 fill-amber-500 mr-1" />
                        {y.rating || 5}.0
                      </div>
                      {y.demonstratedSkills?.map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-muted text-foreground text-[10px] px-2 py-0.5 rounded-btn font-medium"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  {t.status === "rated"
                    ? "Ratings permanently credited to youth CV profile"
                    : "Ratings release escrow to worker wallet"}
                </span>

                <Button
                  onClick={() => openRatingModal(t)}
                  variant={t.status === "rated" ? "outline" : "default"}
                  size="sm"
                  className="text-xs"
                >
                  <Award className="size-3.5 mr-1.5" />
                  {t.status === "rated"
                    ? "Edit Rating & Skills"
                    : "Rate Workers & Endorse Skills"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── RATING DIALOG ─── */}
      <Dialog
        open={!!selectedTaskForRating}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskForRating(null);
        }}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              Rate Hired Youth &amp; Endorse Skills
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

              {/* Option A: Rate All at the same time */}
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
                      {selectedTaskForRating.skillsToLearn.map((sk, idx) => (
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
                /* Option B: Rate Each Worker Individually */
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {selectedTaskForRating.assignedYouth.map((w) => {
                    const state = workerRatings[w.id] || {
                      rating: 5,
                      feedback: "",
                      demonstratedSkills: selectedTaskForRating.skillsToLearn,
                    };

                    return (
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
                                  setWorkerRatings((prev) => ({
                                    ...prev,
                                    [w.id]: { ...prev[w.id], rating: star },
                                  }))
                                }
                              >
                                <Star
                                  className={`size-4 ${
                                    star <= state.rating
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
                            Which skills did {w.name} demonstrate good
                            capability on?
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTaskForRating.skillsToLearn.map(
                              (sk, idx) => {
                                const isSelected =
                                  state.demonstratedSkills.includes(sk);
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() =>
                                      toggleSkillDemonstrated(w.id, sk)
                                    }
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
                            value={state.feedback}
                            onChange={(e) =>
                              setWorkerRatings((prev) => ({
                                ...prev,
                                [w.id]: {
                                  ...prev[w.id],
                                  feedback: e.target.value,
                                },
                              }))
                            }
                            placeholder={`Individual note on ${w.name}'s performance...`}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
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
            <Button onClick={handleSaveRatings}>
              Confirm Ratings &amp; Release Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
