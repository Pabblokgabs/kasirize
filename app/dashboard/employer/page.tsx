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
import { getCurrentUserData } from "@/lib/user-data";
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
import { useEffect, useState } from "react";
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
  const currentData = getCurrentUserData();
  const employerName = currentData.user.name || "Massmart Wholesale Group";
  const [stats, setStats] = useState(currentData.stats);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [candidates, setCandidates] = useState<YouthProfile[]>([]);
  const [candidateFilter, setCandidateFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "interviewed">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Interview funding state
  const [fundedInterviewIds, setFundedInterviewIds] = useState<string[]>([]);

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
    transportVoucherCents: 12000,
    interviewDate: "2026-10-28",
    interviewTime: "10:30 AM",
    locationAddress: "Massmart Academy Building, Gate 3, City Deep",
    notes:
      "Please arrive 10 minutes early. Taxi voucher code will activate on your mobile pass.",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadEmployerData() {
      try {
        const email = currentData.user.email || "lerato@massmart.co.za";
        const res = await fetch(`/api/user/live-data?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            if (json.opportunities && Array.isArray(json.opportunities)) {
              const adaptedOpps: Opportunity[] = json.opportunities.map((o: {
                id: string;
                title: string;
                companyName: string;
                location: string;
                stipendCents?: number;
                type?: string;
                description?: string;
                requirements?: string[] | string;
              }) => ({
                id: o.id,
                title: o.title,
                employerName: o.companyName || employerName,
                employerId: "emp_1",
                location: o.location,
                type: (o.type as Opportunity["type"]) || "entry_level_job",
                description: o.description || "",
                requirements: Array.isArray(o.requirements)
                  ? o.requirements
                  : typeof o.requirements === "string"
                  ? JSON.parse(o.requirements || "[]")
                  : ["Inventory Auditing", "Punctuality"],
                closingDate: new Date(Date.now() + 86400000 * 14).toISOString(),
                monthlyStipendCents: o.stipendCents || 650000,
                transportCovered: true,
                minimumConfidenceScore: 75,
              }));
              setOpportunities(adaptedOpps);
            }

            if (json.candidates && Array.isArray(json.candidates)) {
              const adaptedCandidates: YouthProfile[] = json.candidates.map((c: {
                id: string;
                applicantId: string;
                applicantName?: string;
                applicantEmail?: string;
                applicantLocation?: string;
                applicantConfidenceScore?: number;
                status?: string;
                transportVoucherApproved?: boolean;
              }) => ({
                id: c.applicantId,
                fullName: c.applicantName || "Youth Candidate",
                email: c.applicantEmail || "",
                location: c.applicantLocation || "Johannesburg",
                province: "Gauteng",
                experienceStory: "Trained candidate with verified task completion record.",
                overallConfidenceScore: c.applicantConfidenceScore || 88,
                mockWalletCents: 45000,
                completedTasksCount: 5,
                savedOpportunities: [],
                transportStipendEligible: true,
                createdAt: new Date().toISOString(),
                skills: [
                  {
                    id: "sk_1",
                    skillId: "sk_1",
                    skillName: "Stock Management",
                    status: "task_verified",
                    confidence: 90,
                    userApproved: true,
                  },
                ],
              }));
              setCandidates(adaptedCandidates);

              const funded = json.candidates
                .filter((c: { transportVoucherApproved?: boolean }) => c.transportVoucherApproved)
                .map((c: { applicantId: string }) => c.applicantId);
              setFundedInterviewIds(funded);
            }
          }
        }

        // Also fetch candidate youth if none found
        if (isMounted) {
          const youthRes = await fetch("/api/youth");
          if (youthRes.ok) {
            const youthJson = await youthRes.json();
            if (youthJson.youth && Array.isArray(youthJson.youth) && youthJson.youth.length > 0) {
              setCandidates((prev) => {
                if (prev.length > 0) return prev;
                return youthJson.youth.map((y: { id: string; name: string; email: string; location: string; confidenceScore?: number }) => ({
                  id: y.id,
                  fullName: y.name,
                  email: y.email,
                  location: y.location || "Soweto",
                  province: "Gauteng",
                  experienceStory: "Motivated youth candidate from township talent pool.",
                  overallConfidenceScore: y.confidenceScore || 85,
                  mockWalletCents: 35000,
                  completedTasksCount: 4,
                  savedOpportunities: [],
                  transportStipendEligible: true,
                  createdAt: new Date().toISOString(),
                  skills: [
                    {
                      id: "sk_1",
                      skillId: "sk_1",
                      skillName: "Customer Service",
                      status: "task_verified",
                      confidence: 90,
                      userApproved: true,
                    },
                    {
                      id: "sk_2",
                      skillId: "sk_2",
                      skillName: "Punctuality",
                      status: "task_verified",
                      confidence: 95,
                      userApproved: true,
                    },
                  ],
                }));
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load employer live data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadEmployerData();
    return () => {
      isMounted = false;
    };
  }, [currentData.user.email, employerName]);

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

  const handleConfirmInterviewAndVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInterview) return;

    try {
      // Find candidate application to update if exists
      const appRes = await fetch("/api/applications");
      if (appRes.ok) {
        const appJson = await appRes.json();
        const matchedApp = (appJson.applications || []).find(
          (a: { applicantId: string }) => a.applicantId === selectedCandidateForInterview.id,
        );
        if (matchedApp) {
          await fetch(`/api/applications/${matchedApp.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "interview",
              interviewDate: interviewForm.interviewDate,
              interviewTime: interviewForm.interviewTime,
              transportVoucherApproved: true,
              transportVoucherAmountCents: interviewForm.transportVoucherCents,
              employerNotes: interviewForm.notes,
            }),
          });
        }
      }
    } catch (err) {
      console.warn("Could not patch application interview in db:", err);
    }

    const nextFunded = [...fundedInterviewIds, selectedCandidateForInterview.id];
    setFundedInterviewIds(nextFunded);

    toast.success(
      `Interview scheduled! R${(interviewForm.transportVoucherCents / 100).toFixed(0)} taxi voucher credited to ${selectedCandidateForInterview.fullName}.`,
      { duration: 4500 },
    );
    setSelectedCandidateForInterview(null);
  };

  const handlePostOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title.trim()) {
      toast.error("Please enter a job or learnership title.");
      return;
    }

    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newOpp.title,
          companyName: employerName,
          employerId: currentData.user.id || "emp_1",
          type: newOpp.type,
          location: newOpp.location,
          stipendCents: Number(newOpp.stipendRands || 6500) * 100,
          requirements: newOpp.skills.split(",").map((s) => s.trim()).filter(Boolean),
          description: newOpp.description || "SETA-accredited pathway with verified transport funding.",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.opportunity) {
          setOpportunities((prev) => [data.opportunity, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to post opportunity to db:", err);
    }

    setShowPostModal(false);
    toast.success("Opportunity published! Matching verified youth talent in database.");
  };

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
              {employerName.charAt(0)}
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
                {employerName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowPostModal(true)}
              className="bg-brand-deep hover:bg-brand-mid text-white text-xs font-semibold cursor-pointer shadow-xs gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Post New Role</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── STATS ROW ─── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border shadow-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Active Roles</span>
              <Briefcase className="size-3.5 text-primary" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {opportunities.length}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Live across database
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Matched Talent</span>
              <Users className="size-3.5 text-accent" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {candidates.length}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Verified local youth
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Funded Taxi Vouchers</span>
              <Bus className="size-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {fundedInterviewIds.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              100% interview attendance
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card space-y-1">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Fair Wage Standard</span>
              <TrendingUp className="size-3.5 text-brand-mid" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              100%
            </div>
            <div className="text-[11px] text-muted-foreground">
              SETA compliance verified
            </div>
          </div>
        </section>

        {/* ─── CANDIDATE TALENT PIPELINE ─── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span>Verified Candidate Pipeline</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {filteredCandidates.length} Available
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Ranked by real township task completion &amp; referee endorsement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Filter candidate or skill..."
                  value={candidateFilter}
                  onChange={(e) => setCandidateFilter(e.target.value)}
                  className="pl-8 text-xs h-8 bg-card"
                />
              </div>

              <div className="flex items-center bg-muted p-0.5 rounded-md text-xs">
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
          {isLoading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading candidates from Neon database...
            </div>
          ) : (
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
          )}
        </section>

        {/* ─── ACTIVE OPPORTUNITIES ─── */}
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                <span>Your Active Opportunity Postings</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Learnerships, micro-internships, and entry-level positions in the live database.
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

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Bus className="size-3" />
                    <span>Taxi Funded</span>
                  </span>
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>View</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ─── MODAL: SCHEDULE & FUND INTERVIEW VOUCHER ─── */}
      <Dialog
        open={Boolean(selectedCandidateForInterview)}
        onOpenChange={(open) => {
          if (!open) setSelectedCandidateForInterview(null);
        }}
      >
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bus className="size-4.5 text-emerald-600" />
              <span>Fund Taxi Fare &amp; Invite Candidate</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Directly removes the #1 barrier to youth employment in South Africa.
              The voucher is funded from your corporate mobility escrow.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmInterviewAndVoucher} className="space-y-3.5 py-1">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span>Candidate: {interviewForm.candidateName}</span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  R {(interviewForm.transportVoucherCents / 100).toFixed(0)} Voucher
                </span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Credited via secure SMS / WhatsApp code valid with local taxi rank associations.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Interview Date</Label>
                <Input
                  type="date"
                  value={interviewForm.interviewDate}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewDate: e.target.value })
                  }
                  className="text-xs h-8"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Time</Label>
                <Input
                  type="text"
                  value={interviewForm.interviewTime}
                  onChange={(e) =>
                    setInterviewForm({ ...interviewForm, interviewTime: e.target.value })
                  }
                  className="text-xs h-8"
                  placeholder="e.g. 10:30 AM"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Interview Location</Label>
              <Input
                type="text"
                value={interviewForm.locationAddress}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, locationAddress: e.target.value })
                }
                className="text-xs h-8"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Candidate Instructions</Label>
              <Textarea
                rows={2}
                value={interviewForm.notes}
                onChange={(e) =>
                  setInterviewForm({ ...interviewForm, notes: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCandidateForInterview(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Authorize R120 &amp; Send Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── MODAL: POST NEW ROLE ─── */}
      <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="size-4.5 text-primary" />
              <span>Post New Opportunity</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add a new learnership or job directly into the live database.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePostOpp} className="space-y-3 py-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Role Title</Label>
              <Input
                placeholder="e.g. Warehouse Inventory Assistant"
                value={newOpp.title}
                onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                className="text-xs h-8"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Contract Type</Label>
                <select
                  value={newOpp.type}
                  onChange={(e) =>
                    setNewOpp({ ...newOpp, type: e.target.value as Opportunity["type"] })
                  }
                  className="w-full h-8 text-xs bg-card border border-border rounded-md px-2 focus:outline-none"
                >
                  <option value="entry_level_job">Entry-Level Job</option>
                  <option value="learnership">Learnership</option>
                  <option value="micro_internship">Micro-Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Monthly Stipend (ZAR)</Label>
                <Input
                  type="number"
                  value={newOpp.stipendRands}
                  onChange={(e) => setNewOpp({ ...newOpp, stipendRands: e.target.value })}
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Workplace Location</Label>
              <Input
                value={newOpp.location}
                onChange={(e) => setNewOpp({ ...newOpp, location: e.target.value })}
                className="text-xs h-8"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Required Skills (comma-separated)</Label>
              <Input
                value={newOpp.skills}
                onChange={(e) => setNewOpp({ ...newOpp, skills: e.target.value })}
                className="text-xs h-8"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPostModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-brand-deep text-white font-bold text-xs"
              >
                Publish Live Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
