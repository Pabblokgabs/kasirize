"use client";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import {
  ArrowRight,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

type ApplicationStage =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interview"
  | "offer";
type ApplicationStatus =
  | "withdrawn"
  | "awaiting_reply"
  | "interview"
  | "shortlisted"
  | "viewed"
  | "offer"
  | "not_this_time";

interface JobApplication {
  id: string;
  refCode: string;
  title: string;
  employerName: string;
  type: string; // Learnership | Internship | Job | Training | Micro-internship
  appliedDaysAgo: number;
  status: ApplicationStatus;
  currentStage: ApplicationStage;
  silentDays?: number;
  followedUp?: boolean;
  notes?: string;
}

const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    refCode: "KAS-K3MM41-2BK",
    title: "Business Admin Learnership (NQF 3)",
    employerName: "Bokamoso Skills Learnerships",
    type: "Learnership",
    appliedDaysAgo: 17,
    status: "withdrawn",
    currentStage: "submitted",
    notes: "You withdrew this application.",
  },
  {
    id: "app-2",
    refCode: "KAS-K3NR02-9XT",
    title: "Junior IT Support Internship",
    employerName: "Sefako Digital Academy",
    type: "Internship",
    appliedDaysAgo: 18,
    status: "interview",
    currentStage: "interview",
    notes: "Interview invitation sent. Employer covered your taxi voucher.",
  },
  {
    id: "app-3",
    refCode: "KAS-K2ZPQBZ-4H2",
    title: "Retail Sales Assistant",
    employerName: "Thuso Retail Group",
    type: "Job",
    appliedDaysAgo: 22,
    status: "shortlisted",
    currentStage: "shortlisted",
    notes: "Your verified profile was shortlisted by the store manager.",
  },
  {
    id: "app-4",
    refCode: "KAS-K2ZY99-7QW",
    title: "Digital Marketing Trainee",
    employerName: "Ubuhle Community Trust",
    type: "Training",
    appliedDaysAgo: 32,
    status: "viewed",
    currentStage: "viewed",
    silentDays: 32,
    followedUp: false,
    notes:
      "No reply for 32 days. A short, friendly follow-up message can help nudge things along.",
  },
  {
    id: "app-5",
    refCode: "KAS-K2WX10-5RD",
    title: "Stock Count Micro-internship",
    employerName: "Mamelodi Home Supplies",
    type: "Micro-internship",
    appliedDaysAgo: 40,
    status: "offer",
    currentStage: "offer",
    notes: "Congratulations! An official offer has been extended.",
  },
  {
    id: "app-6",
    refCode: "KAS-K2VN77-1LC",
    title: "Community Care Assistant",
    employerName: "GreenRoute Community Care",
    type: "Job",
    appliedDaysAgo: 48,
    status: "not_this_time",
    currentStage: "viewed",
    notes:
      "This one did not move ahead — it happens, and it says nothing about your worth. Keep going.",
  },
];

const STAGES: { id: ApplicationStage; label: string }[] = [
  { id: "submitted", label: "Submitted" },
  { id: "viewed", label: "Viewed" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
];

export default function YouthApplicationsPage() {
  const [applications, setApplications] =
    useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<
    "all" | "awaiting" | "inprogress" | "offers" | "closed"
  >("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Counts
  const totalApplied = applications.length;
  const awaitingCount = applications.filter(
    (a) => a.status === "awaiting_reply" || a.status === "viewed",
  ).length;
  const interviewCount = applications.filter(
    (a) => a.status === "interview",
  ).length;
  const offersCount = applications.filter((a) => a.status === "offer").length;
  const inProgressCount = applications.filter(
    (a) => a.status === "shortlisted" || a.status === "interview",
  ).length;
  const closedCount = applications.filter(
    (a) => a.status === "withdrawn" || a.status === "not_this_time",
  ).length;

  const silentApp = applications.find((a) => a.silentDays && !a.followedUp);

  const filteredApps = useMemo(() => {
    switch (activeTab) {
      case "awaiting":
        return applications.filter(
          (a) => a.status === "awaiting_reply" || a.status === "viewed",
        );
      case "inprogress":
        return applications.filter(
          (a) => a.status === "shortlisted" || a.status === "interview",
        );
      case "offers":
        return applications.filter((a) => a.status === "offer");
      case "closed":
        return applications.filter(
          (a) => a.status === "withdrawn" || a.status === "not_this_time",
        );
      default:
        return applications;
    }
  }, [applications, activeTab]);

  const handleMarkFollowedUp = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, followedUp: true } : a)),
    );
    toast.success("Marked as followed up! We've logged your check-in.");
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "withdrawn":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Withdrawn
          </span>
        );
      case "interview":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            Interview
          </span>
        );
      case "shortlisted":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            Shortlisted
          </span>
        );
      case "viewed":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Viewed
          </span>
        );
      case "offer":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            Offer
          </span>
        );
      case "not_this_time":
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Not this time
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            Active
          </span>
        );
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "learnership":
        return <GraduationCap className="size-4 text-primary" />;
      case "internship":
        return <Briefcase className="size-4 text-amber-600" />;
      case "micro-internship":
        return <Sparkles className="size-4 text-emerald-600" />;
      default:
        return <Building className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col font-body">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Title & Introduction */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Applications
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              Demo data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Everything you have applied for, in one place. Follow each one
            through every stage, follow up when it is quiet, and always keep the
            last word on what happens next.
          </p>
        </div>

        {/* ─── STATS CARD (MATCHING PHOTO) ─── */}
        <section className="p-5 sm:p-6 rounded-card bg-card border border-border shadow-card space-y-3.5">
          <h2 className="font-heading font-bold text-sm text-foreground">
            Your applications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-muted/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                <FileText className="size-4 text-foreground" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-foreground">
                  {totalApplied}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Total applied
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-foreground">
                  {awaitingCount}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Awaiting reply
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                <Calendar className="size-4 text-amber-600" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-amber-700 dark:text-amber-400">
                  {interviewCount}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Interviews
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                <Trophy className="size-4 text-emerald-600" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-emerald-700 dark:text-emerald-400">
                  {offersCount}
                </div>
                <div className="text-[11px] text-muted-foreground">Offers</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
            You are always in control of your applications. Move them along,
            follow up, or withdraw — nothing is decided about you automatically.
          </p>
        </section>

        {/* ─── QUIET FOLLOW-UP PROMPT BANNER ─── */}
        {silentApp && (
          <div className="p-4 rounded-card bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
            <Clock className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-foreground">
                1 application has been waiting quietly.{" "}
              </strong>
              <span className="text-muted-foreground">
                A short follow-up — thanking them and checking in — often nudges
                a reply along. Open a card to mark it as followed up.
              </span>
            </div>
          </div>
        )}

        {/* ─── FILTER TABS (MATCHING PHOTO) ─── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              activeTab === "all"
                ? "bg-brand-deep text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All {totalApplied}
          </button>
          <button
            onClick={() => setActiveTab("awaiting")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              activeTab === "awaiting"
                ? "bg-brand-deep text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Awaiting reply {awaitingCount}
          </button>
          <button
            onClick={() => setActiveTab("inprogress")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              activeTab === "inprogress"
                ? "bg-brand-deep text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            In progress {inProgressCount}
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              activeTab === "offers"
                ? "bg-brand-deep text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Offers {offersCount}
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
              activeTab === "closed"
                ? "bg-brand-deep text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Closed {closedCount}
          </button>
        </div>

        {/* ─── APPLICATION CARDS LIST ─── */}
        <div className="space-y-3.5">
          {filteredApps.map((app) => {
            const isExpanded = expandedId === app.id;
            const stageIndex = STAGES.findIndex(
              (s) => s.id === app.currentStage,
            );

            return (
              <div
                key={app.id}
                className="p-5 rounded-card bg-card border border-border shadow-card hover:border-primary/40 transition-colors space-y-4"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(app.type)}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-foreground">
                        {app.title}
                      </h3>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5">
                        {app.employerName}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Briefcase className="size-3" />
                          <span>{app.type}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>Applied {app.appliedDaysAgo} days ago</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-muted-foreground/80">
                          # {app.refCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    {getStatusBadge(app.status)}
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Demo
                    </span>
                  </div>
                </div>

                {/* Progress Stages Bar (For active / progressing apps) */}
                {app.status !== "withdrawn" &&
                  app.status !== "not_this_time" && (
                    <div className="space-y-1 pt-1">
                      <div className="grid grid-cols-5 gap-1.5">
                        {STAGES.map((s, idx) => {
                          const isReached = idx <= stageIndex;
                          const isCurrent = idx === stageIndex;

                          return (
                            <div key={s.id} className="space-y-1">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full transition-all",
                                  isReached
                                    ? app.status === "offer"
                                      ? "bg-emerald-500"
                                      : isCurrent
                                        ? "bg-yellow-500"
                                        : "bg-primary"
                                    : "bg-muted",
                                )}
                              />
                              <div
                                className={`text-[10px] text-center truncate ${
                                  isCurrent
                                    ? "font-bold text-foreground"
                                    : isReached
                                      ? "text-muted-foreground font-medium"
                                      : "text-muted-foreground/50"
                                }`}
                              >
                                {s.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Silent App Callout Box */}
                {app.silentDays && !app.followedUp && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-amber-600 shrink-0" />
                      <span className="text-muted-foreground">
                        No reply for {app.silentDays} days. A short, friendly
                        follow-up message can help.
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkFollowedUp(app.id)}
                      className="text-xs font-semibold shrink-0"
                    >
                      Mark as followed up
                    </Button>
                  </div>
                )}

                {/* Notes if withdrawn or not moved ahead */}
                {app.notes &&
                  (app.status === "withdrawn" ||
                    app.status === "not_this_time") && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {app.status === "withdrawn" ? (
                        <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <HelpCircle className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span>{app.notes}</span>
                    </div>
                  )}

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-2.5 animate-in fade-in-50 duration-200">
                    <div className="font-semibold text-foreground">
                      Follow-up &amp; Application History:
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {app.notes}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
                      <span>Kasirize verification badge attached</span>
                      <span>•</span>
                      <span>Interview taxi fare covered</span>
                      <span>•</span>
                      <span>Reference ID: {app.refCode}</span>
                    </div>
                  </div>
                )}

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Details &amp; follow-up</span>
                    {isExpanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </button>

                  <Link
                    href="/dashboard/user/opportunities"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>View listing</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── BOTTOM REASSURANCE BANNER (MATCHING PHOTO) ─── */}
        <div className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="size-4.5 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-foreground">
                You are never reduced to a status.{" "}
              </strong>
              <span className="text-muted-foreground">
                A &quot;no&quot; here says nothing about what you are worth — it
                just means this one was not a fit.
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/user/tasks"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-btn bg-brand-deep text-white font-semibold text-xs shrink-0 hover:opacity-90 transition-opacity"
          >
            <span>Earn new evidence</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          These applications are demo data saved on this device only. Real
          updates from employers appear here and follow-ups are sent securely on
          your behalf.
        </p>
      </main>
    </div>
  );
}
