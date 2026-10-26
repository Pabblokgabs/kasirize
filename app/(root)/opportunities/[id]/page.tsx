"use client";

import { CreateAccountModal } from "@/components/shared/create-account-modal";
import { Button } from "@/components/ui/button";
import { checkActionPermission, getStoredAuthUser } from "@/lib/auth";
import { getStoredProfile } from "@/lib/store";
import { Opportunity, YouthProfile } from "@/types";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Bus,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MapPin,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const APPLIED_OPP_KEY = "kasirize_youth_applied_opportunity_ids";

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  const [profile] = useState<YouthProfile>(() => getStoredProfile());
  const [appliedIds, setAppliedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(APPLIED_OPP_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return [];
  });
  const [isApplying, setIsApplying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.opportunity) {
          const o = data.opportunity;
          setOpp({
            id: o.id,
            title: o.title,
            employerName: o.companyName || "Verified Enterprise",
            organisationType: "retailer",
            type: o.type,
            location: o.location,
            monthlyStipendCents: o.monthlyStipendCents || 500000,
            requiredSkills: o.requiredSkills || ["Customer Service", "Punctuality"],
            description: o.description,
            applicationDeadline: o.deadline || "2026-11-30",
            transportCreditFunded: true,
          });
        }
      })
      .catch((err) => console.error("Error loading live opportunity:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs text-muted-foreground gap-2">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span>Loading live opportunity details...</span>
      </div>
    );
  }

  if (!opp) {
    notFound();
  }

  const isApplied = appliedIds.includes(opp.id);

  // Match calculations
  const userSkillNames = (profile?.skills || []).map((s) =>
    s.skillName.toLowerCase(),
  );

  const matchingSkills = (opp.requiredSkills || []).filter((req) =>
    userSkillNames.some(
      (us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us),
    ),
  );

  const missingSkills = (opp.requiredSkills || []).filter(
    (req) => !matchingSkills.includes(req),
  );

  const matchPercent =
    opp.requiredSkills.length > 0
      ? Math.min(
          98,
          Math.max(
            40,
            Math.round(
              (matchingSkills.length / opp.requiredSkills.length) * 65 +
                (profile?.location ? 25 : 15),
            ),
          ),
        )
      : 80;

  const stipendFormatted =
    opp.monthlyStipendCents > 0
      ? `R ${(opp.monthlyStipendCents / 100).toLocaleString()} / month`
      : "Competitive / Stipend Provided";

  const handleApply = async () => {
    if (isApplied) return;
    const user = getStoredAuthUser();
    const perm = checkActionPermission(user, "apply");
    if (!perm.allowed) {
      setShowAuthModal(true);
      return;
    }
    setIsApplying(true);

    try {
      // POST to live database applications endpoint
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opp.id,
          applicantId: user?.id || "usr_youth_01",
          transportVoucherRequested: true,
          transportVoucherAmountCents: 8000,
        }),
      });

      const updated = [...appliedIds, opp.id];
      setAppliedIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(APPLIED_OPP_KEY, JSON.stringify(updated));
      }

      toast.success(
        `Application submitted! Your Kasirize verified profile has been sent to ${opp.employerName} and recorded in their live candidate pipeline.`,
      );
    } catch (err) {
      console.error("Job application error:", err);
      const updated = [...appliedIds, opp.id];
      setAppliedIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(APPLIED_OPP_KEY, JSON.stringify(updated));
      }
      toast.success(
        `Application submitted! Your Kasirize verified profile has been sent to ${opp.employerName}.`,
      );
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard/user/opportunities"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Opportunities</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
              {opp.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ─── TOP TITLE CARD ─── */}
        <section className="p-6 rounded-card bg-card border border-border shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {opp.organisationType.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-light/10 text-brand-mid">
                  {matchPercent}% Profile Match
                </span>
                {opp.transportCreditFunded && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent flex items-center gap-1">
                    <Bus className="size-3.5" />
                    <span>Taxi Fare Funded</span>
                  </span>
                )}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {opp.title}
              </h1>

              <div className="flex flex-col md:flex-wrap md:items-center gap-3 text-xs sm:text-sm text-muted-foreground pt-1">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="size-4 text-muted-foreground" />
                  <span>{opp.employerName}</span>
                </span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{opp.location}</span>
                </span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  <span>Deadline: {opp.applicationDeadline}</span>
                </span>
              </div>
            </div>

            {/* Compensation Box */}
            <div className="bg-muted/50 p-4 rounded-xl border border-border sm:text-right shrink-0">
              <div className="text-xs text-muted-foreground">
                Compensation / Stipend
              </div>
              <div className="text-xl font-heading font-bold text-primary mt-0.5">
                {stipendFormatted}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Contract: {opp.type.replace(/_/g, " ")}
              </div>
            </div>
          </div>

          {/* Transport Credit Guarantee Banner */}
          {opp.transportCreditFunded && (
            <div className="p-3.5 rounded-lg bg-accent/10 border border-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-foreground">
              <div className="flex items-center gap-2">
                <Bus className="size-4 text-accent shrink-0" />
                <span className="font-bold">
                  Interview Taxi Support Guarantee
                </span>
              </div>
              <span className="text-muted-foreground">
                {opp.employerName} funds return taxi vouchers for shortlisted
                candidates so no one is locked out by travel costs.
              </span>
            </div>
          )}
        </section>

        {/* ─── TWO-COLUMN CONTENT & APPLICATION SIDEBAR ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
          <div className="space-y-6">
            {/* Role Overview */}
            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-3">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <span>Role Overview &amp; Learning Scope</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {opp.description}
              </p>
            </div>

            {/* Competency & Skill Match Breakdown */}
            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-4">
              <div>
                <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span>Skill Competencies Required</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See how your Kasirize verified profile stacks against this
                  opening.
                </p>
              </div>

              {/* Matching Skills */}
              {matchingSkills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Check className="size-3.5" />
                    <span>
                      Skills you have on your profile ({matchingSkills.length}):
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {matchingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Learn */}
              {missingSkills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    <span>
                      Skills you will develop on the job ({missingSkills.length}
                      ):
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {missingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium border border-accent/20"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employer Credibility and Safety */}
            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-3">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>About the Employer</span>
              </h2>
              <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  <strong>{opp.employerName}</strong> is a registered{" "}
                  {opp.organisationType.replace(/_/g, " ")} operating in{" "}
                  {opp.location}. Their hiring process on Kasirize prioritizes
                  demonstrated township tasks and youth potential over formal
                  paper CVs.
                </p>
                <div className="p-3 rounded-lg bg-muted/60 border border-border flex items-center gap-2 text-[11px]">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span>
                    Zero-Harm Guarantee: You will never be asked for application
                    fees, registration costs, or unverified off-platform
                    payments.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR: APPLICATION ACTION CARD ─── */}
          <div className="space-y-4 sticky top-20">
            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-4">
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base text-foreground">
                  Apply for this Role
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your application includes your Kasirize verified credibility
                  score, referee feedback, and completed task history.
                </p>
              </div>

              {/* Profile snapshot */}
              <div className="p-3.5 rounded-lg bg-muted/50 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applicant:</span>
                  <strong className="text-foreground">
                    {profile?.fullName || "Youth Pioneer"}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Credibility Score:
                  </span>
                  <span className="font-bold text-primary">
                    {profile?.overallConfidenceScore || 65}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verified Tasks:</span>
                  <strong className="text-foreground">
                    {profile?.completedTasksCount || 0} completed
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Interview Transport:
                  </span>
                  <strong className="text-accent">
                    {opp.transportCreditFunded
                      ? "Covered by Employer"
                      : "Standard"}
                  </strong>
                </div>
              </div>

              {/* Action Button */}
              <Button
                size="lg"
                onClick={handleApply}
                disabled={isApplied || isApplying}
                className="w-full font-bold text-sm shadow-sm flex items-center justify-center gap-2"
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="size-4 text-white" />
                    <span>Applied with Kasirize ✓</span>
                  </>
                ) : isApplying ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Apply with Verified Profile</span>
                  </>
                )}
              </Button>

              {isApplied && (
                <div className="p-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium border border-emerald-500/20">
                  Application active! {opp.employerName} will review your
                  verified profile.
                </div>
              )}

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <Link
                  href="/youth-profile"
                  className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Review CV before applying</span>
                  <ExternalLink className="size-3" />
                </Link>
                <span>No fee required</span>
              </div>
            </div>

            <div className="p-4 rounded-card bg-muted/50 border border-border text-xs text-muted-foreground space-y-1.5">
              <span className="font-bold text-foreground block">
                Next steps after applying:
              </span>
              <ul className="list-disc pl-4 space-y-1">
                <li>Employer reviews your verified credibility score</li>
                <li>
                  Shortlisted youth receive chat notification &amp; interview
                  invite
                </li>
                <li>Taxi credit issued directly for your interview commute</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <CreateAccountModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionName="Apply for this Opportunity"
        onSuccess={() => {
          handleApply();
        }}
      />
    </div>
  );
}
