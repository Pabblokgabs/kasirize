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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_OPPORTUNITIES, MOCK_YOUTH_PROFILES } from "@/constants/mock-data";
import { Opportunity, YouthProfile } from "@/types";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Bus,
  ExternalLink,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface InterviewInviteModalData {
  candidateId: string;
  candidateName: string;
  opportunityTitle: string;
  transportVoucherCents: number;
  interviewDate: string;
  interviewTime: string;
  locationAddress: string;
  notes: string;
}

export default function EmployerDashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(
          "kasirize_employer_custom_opportunities",
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return [...parsed, ...MOCK_OPPORTUNITIES];
          }
        }
      } catch {
        // fallback
      }
    }
    return MOCK_OPPORTUNITIES;
  });

  const [candidates] = useState<YouthProfile[]>(MOCK_YOUTH_PROFILES);
  const [candidateFilter, setCandidateFilter] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "shortlisted" | "interviewed"
  >("all");

  // Interview funding state
  const [fundedInterviewIds, setFundedInterviewIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(
          "kasirize_employer_funded_interview_ids",
        );
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Modal: Post Opportunity
  const [showPostModal, setShowPostModal] = useState(false);
  const [newOpp, setNewOpp] = useState<{
    title: string;
    type: Opportunity["type"];
    stipendRands: string;
    location: string;
    skills: string;
    description: string;
  }>({
    title: "",
    type: "entry_level_job",
    stipendRands: "6500",
    location: "City Deep Distribution Center, Gate 3, Johannesburg",
    skills: "Inventory Auditing, Stock Replenishment, Barcode Scanning",
    description: "",
  });

  // Modal: Schedule & Fund Interview Voucher
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] =
    useState<YouthProfile | null>(null);
  const [interviewForm, setInterviewForm] = useState<InterviewInviteModalData>({
    candidateId: "",
    candidateName: "",
    opportunityTitle: "Junior Logistics & Stock Assistant",
    transportVoucherCents: 12000, // R120
    interviewDate: "2026-10-28",
    interviewTime: "10:30 AM",
    locationAddress: "Massmart Academy Building, Gate 3, City Deep",
    notes:
      "Please arrive 10 minutes early. Taxi voucher code will activate on your mobile pass.",
  });

  // Open interview modal
  const handleOpenInterviewModal = (candidate: YouthProfile) => {
    setSelectedCandidateForInterview(candidate);
    setInterviewForm({
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      opportunityTitle:
        opportunities[0]?.title || "Junior Operations Associate",
      transportVoucherCents: 12000,
      interviewDate: "2026-10-28",
      interviewTime: "10:30 AM",
      locationAddress: "Massmart Academy Building, Gate 3, City Deep",
      notes:
        "Voucher credited. Practical demonstration of till & inventory tools required.",
    });
  };

  // Submit interview invite
  const handleConfirmInterviewAndVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInterview) return;

    const nextFunded = [
      ...fundedInterviewIds,
      selectedCandidateForInterview.id,
    ];
    setFundedInterviewIds(nextFunded);
    try {
      localStorage.setItem(
        "kasirize_employer_funded_interview_ids",
        JSON.stringify(nextFunded),
      );
    } catch {
      // ignore
    }

    toast.success(
      `Interview scheduled! R${(interviewForm.transportVoucherCents / 100).toFixed(0)} taxi voucher credited to ${selectedCandidateForInterview.fullName}.`,
      { duration: 4500 },
    );
    setSelectedCandidateForInterview(null);
  };

  // Post opportunity submit
  const handlePostOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title.trim()) {
      toast.error("Please enter a job or learnership title.");
      return;
    }

    const created: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newOpp.title,
      employerName: "Massmart Supply Chain (Verified)",
      organisationType: "retailer",
      type: newOpp.type,
      location: newOpp.location,
      monthlyStipendCents: Number(newOpp.stipendRands || 5500) * 100,
      requiredSkills: newOpp.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description:
        newOpp.description ||
        "SETA-accredited pathway with practical on-the-job mentorship and full interview transport funding.",
      applicationDeadline: "Open until filled",
      transportCreditFunded: true,
    };

    const nextOpps = [created, ...opportunities];
    setOpportunities(nextOpps);
    try {
      localStorage.setItem(
        "kasirize_employer_custom_opportunities",
        JSON.stringify([created]),
      );
    } catch {
      // ignore
    }

    setShowPostModal(false);
    toast.success("Opportunity published! Matching verified youth talent.");
  };

  // Filtered candidate list
  const filteredCandidates = candidates.filter((cand) => {
    const q = candidateFilter.toLowerCase();
    const matchesSearch =
      cand.fullName.toLowerCase().includes(q) ||
      cand.location.toLowerCase().includes(q) ||
      cand.skills.some((s) => s.skillName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (activeTab === "interviewed") {
      return fundedInterviewIds.includes(cand.id);
    }
    if (activeTab === "shortlisted") {
      return cand.overallConfidenceScore >= 85;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col font-body min-h-screen bg-background pb-24 md:pb-12">
      {/* ─── TOP PORTAL HEADER ─── */}
      <header className="border-b border-border bg-card/95 backdrop-blur px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Employer Talent Hub
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="size-3" />
                  <span>SETA &amp; Fair Placement Verified</span>
                </span>
              </div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-foreground leading-tight">
                Massmart Supply Chain &amp; Distribution
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/employer/place"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Building2 className="size-3.5 mr-1 text-primary" />
              <span className="hidden sm:inline">Manage Workplace</span>
            </Link>

            <Button
              size="sm"
              className="font-semibold text-xs flex items-center gap-1.5 bg-brand-deep text-white hover:opacity-90 cursor-pointer shadow-xs"
              onClick={() => setShowPostModal(true)}
            >
              <Plus className="size-4" />
              <span>Post Opportunity</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-6 space-y-6">
        {/* ─── KEY RECRUITMENT & TRANSPORT METRICS ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Open Positions</span>
              <Briefcase className="size-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {opportunities.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Active Listings
              </span>
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Evidenced Talent</span>
              <Users className="size-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                {candidates.length}
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                Pre-verified practical scores
              </span>
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Funded Interviews</span>
              <Bus className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-emerald-600">
                {fundedInterviewIds.length}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Taxi vouchers activated
              </span>
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Transport Escrow Pool</span>
              <TrendingUp className="size-4 text-primary" />
            </div>
            <div className="mt-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                R 3,600
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                Guaranteed youth attendance
              </span>
            </div>
          </div>
        </section>

        {/* ─── WORKPLACE INTEGRATION HERO BANNER ─── */}
        <section className="bg-card rounded-card border border-border p-4.5 sm:p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-card via-card to-primary/5">
          <div className="flex items-start gap-3.5">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm sm:text-base font-bold text-foreground">
                  Primary Hiring Site: Massmart City Deep Logistics Center
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  Active Facility
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
                24 Enterprise Blvd, City Deep. Interviews held at Academy
                Building, Gate 3. All invited youth automatically receive your
                R120 taxi transport voucher directly to their mobile pass.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Link
              href="/dashboard/employer/place"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <span>Workplace Details</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </div>
        </section>

        {/* ─── CANDIDATE MATCHING & SHORTLIST HUB ─── */}
        <section className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Users className="size-4.5 text-primary" />
                <span>Evidence-Matched Youth Candidates</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked by demonstrated practical tasks, punctuality scores, and
                verified referee endorsements.
              </p>
            </div>

            {/* Filter Search & Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Filter by skill, ward, name..."
                  value={candidateFilter}
                  onChange={(e) => setCandidateFilter(e.target.value)}
                  className="pl-8.5 h-8.5 text-xs w-48 sm:w-56 bg-card"
                />
              </div>

              <div className="flex items-center bg-muted/60 p-0.5 rounded-btn border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-2.5 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === "all"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({candidates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("shortlisted")}
                  className={`px-2.5 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === "shortlisted"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Top Match
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("interviewed")}
                  className={`px-2.5 py-1 rounded-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === "interviewed"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Funded ({fundedInterviewIds.length})
                </button>
              </div>
            </div>
          </div>

          {/* Candidate Cards Feed */}
          <div className="space-y-3">
            {filteredCandidates.map((cand) => {
              const isFunded = fundedInterviewIds.includes(cand.id);

              return (
                <div
                  key={cand.id}
                  className={`p-4 rounded-card bg-card border transition-all ${
                    isFunded
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                      : "border-border shadow-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-foreground">
                          {cand.fullName}
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {cand.overallConfidenceScore}% Credibility
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          <span>{cand.location}</span>
                        </span>
                        {isFunded && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                            <Bus className="size-3" />
                            <span>Interview &amp; Taxi Voucher Activated</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-2xl italic">
                        &quot;{cand.experienceStory}&quot;
                      </div>

                      {/* Skills Demonstrated */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                          Evidenced Skills:
                        </span>
                        {cand.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium flex items-center gap-1 border border-border/50"
                          >
                            <ShieldCheck className="size-3 text-emerald-600" />
                            <span>{skill.skillName}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
                      <Link
                        href="/dashboard/employer/chat"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        <MessageSquare className="size-3.5 mr-1" />
                        <span>Message</span>
                      </Link>

                      <Button
                        size="sm"
                        variant={isFunded ? "outline" : "default"}
                        className={`text-xs font-semibold flex items-center gap-1.5 ${
                          isFunded
                            ? "border-emerald-600 text-emerald-700 dark:text-emerald-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                        }`}
                        onClick={() => handleOpenInterviewModal(cand)}
                        disabled={isFunded}
                      >
                        <Bus className="size-3.5" />
                        <span>
                          {isFunded
                            ? "Voucher Issued (R120)"
                            : "Invite & Fund Taxi (R120)"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── ACTIVE OPPORTUNITIES ACCORDION / GRID ─── */}
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <span>Your Active Opportunity Postings</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Learnerships, micro-internships, and entry-level positions
                linked to your workplace facilities.
              </p>
            </div>
            <Link
              href="/dashboard/employer/post-opportunity"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Plus className="size-3.5 mr-1" />
              <span>New Listing</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {opp.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {opp.monthlyStipendCents
                        ? `R ${(opp.monthlyStipendCents / 100).toLocaleString()} / mo`
                        : "Stipend Included"}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-foreground line-clamp-1">
                    {opp.title}
                  </h4>

                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3 text-primary shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="border-t border-border/80 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Bus className="size-3" />
                    <span>Taxi transport funded</span>
                  </span>
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5 text-xs"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── MODAL: FUND INTERVIEW & TAXI VOUCHER ─── */}
      <Dialog
        open={Boolean(selectedCandidateForInterview)}
        onOpenChange={(open) => {
          if (!open) setSelectedCandidateForInterview(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="size-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-1">
              <Bus className="size-5" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              Fund Interview Taxi Voucher for{" "}
              {selectedCandidateForInterview?.fullName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Remove the financial barrier to formal employment interviews. Your
              transport voucher code will be credited directly to the youth’s
              mobile ticket.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleConfirmInterviewAndVoucher}
            className="space-y-4 pt-2"
          >
            <div className="p-3 bg-muted/40 rounded-btn border border-border flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Voucher Payout Value:
              </span>
              <strong className="text-sm font-bold text-emerald-600">
                R {(interviewForm.transportVoucherCents / 100).toFixed(0)}{" "}
                (Escrow Guaranteed)
              </strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Interview Date</Label>
                <Input
                  type="date"
                  value={interviewForm.interviewDate}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      interviewDate: e.target.value,
                    })
                  }
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Interview Time</Label>
                <Input
                  value={interviewForm.interviewTime}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      interviewTime: e.target.value,
                    })
                  }
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Interview Arrival Location
              </Label>
              <Input
                value={interviewForm.locationAddress}
                onChange={(e) =>
                  setInterviewForm({
                    ...interviewForm,
                    locationAddress: e.target.value,
                  })
                }
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Instructions for Candidate
              </Label>
              <Textarea
                rows={2}
                value={interviewForm.notes}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, notes: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCandidateForInterview(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                <Bus className="size-3.5" />
                <span>Confirm &amp; Fund R120 Voucher</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: POST OPPORTUNITY ─── */}
      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Post Opportunity, Learnership or Apprenticeship
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Match with local candidates whose practical competencies have been
              verified on local tasks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePostOpp} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Role Title *</Label>
              <Input
                required
                placeholder="e.g. Junior Warehouse Coordinator / Barista Lead"
                value={newOpp.title}
                onChange={(e) =>
                  setNewOpp({ ...newOpp, title: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Opportunity Type
                </Label>
                <select
                  value={newOpp.type}
                  onChange={(e) =>
                    setNewOpp({
                      ...newOpp,
                      type: e.target.value as Opportunity["type"],
                    })
                  }
                  className="w-full text-xs h-9 px-3 rounded-md bg-background border border-input focus:ring-1"
                >
                  <option value="entry_level_job">Entry-Level Job</option>
                  <option value="micro_internship">
                    Micro-Internship (2-4 Weeks)
                  </option>
                  <option value="learnership">
                    SETA-Accredited Learnership
                  </option>
                  <option value="apprenticeship">Trade Apprenticeship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Monthly Stipend (ZAR)
                </Label>
                <Input
                  type="number"
                  value={newOpp.stipendRands}
                  onChange={(e) =>
                    setNewOpp({ ...newOpp, stipendRands: e.target.value })
                  }
                  placeholder="6500"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Location / Operational Workplace
              </Label>
              <Input
                value={newOpp.location}
                onChange={(e) =>
                  setNewOpp({ ...newOpp, location: e.target.value })
                }
                placeholder="e.g. Massmart Distribution Center, City Deep"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Required Skills (Comma-separated)
              </Label>
              <Input
                value={newOpp.skills}
                onChange={(e) =>
                  setNewOpp({ ...newOpp, skills: e.target.value })
                }
                placeholder="Inventory Auditing, Customer Etiquette, Stock Tally"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Role Description</Label>
              <Textarea
                rows={3}
                value={newOpp.description}
                onChange={(e) =>
                  setNewOpp({ ...newOpp, description: e.target.value })
                }
                placeholder="Detail the daily responsibilities, training curriculum, and workplace perks..."
                className="text-xs"
              />
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-btn flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <Bus className="size-4 shrink-0 text-emerald-600" />
              <span>
                Kasirize Fair Opportunity Guarantee: All shortlisted applicants
                receive funded interview transport vouchers.
              </span>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPostModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Publish Opportunity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
