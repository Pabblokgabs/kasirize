"use client";

import { EmployerPlace } from "@/app/dashboard/employer/place/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Bus,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  GraduationCap,
  Info,
  Loader2,
  Lock,
  MapPin,
  Send,
  ShieldAlert,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Step = "role_details" | "skills_requirements" | "transport_support" | "payment_activation";

interface MatchedCandidate {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  evidencedSkills: string[];
  education: string;
  invited: boolean;
}

const MOCK_MATCHED_YOUTH: MatchedCandidate[] = [
  {
    id: "m-1",
    name: "Kagiso Mokoena",
    location: "Soweto, Johannesburg (4.2 km)",
    matchScore: 94,
    evidencedSkills: ["Inventory Audits", "Cash Reconciliation", "Customer Care"],
    education: "Grade 12 (Matric) + Retail Operations NQF 2",
    invited: false,
  },
  {
    id: "m-2",
    name: "Zanele Dube",
    location: "Diepsloot, Johannesburg (6.1 km)",
    matchScore: 89,
    evidencedSkills: ["Stock Picking", "Google Sheets", "Filing & Dispatch"],
    education: "Grade 12 (Matric) with Accounting",
    invited: false,
  },
  {
    id: "m-3",
    name: "Bafana Sithole",
    location: "Tembisa, Ekurhuleni (7.8 km)",
    matchScore: 85,
    evidencedSkills: ["Tool Inventory Management", "Forklift Basics", "Site Safety"],
    education: "N2 Technical Certificate + Grade 12",
    invited: false,
  },
  {
    id: "m-4",
    name: "Nomvula Khumalo",
    location: "Alexandra, Johannesburg (5.4 km)",
    matchScore: 82,
    evidencedSkills: ["Point of Sale (POS)", "Food Safety Standards", "Shift Logging"],
    education: "Grade 12 (Matric)",
    invited: false,
  },
];

export default function PostOpportunityPage() {
  const [currentStep, setCurrentStep] = useState<Step>("role_details");

  // Employer plan from local storage (default to 'growth')
  const [activePlanId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("kasirize_employer_active_plan_id") || "growth";
    }
    return "growth";
  });
  const isGrowthOrAbove = activePlanId === "growth" || activePlanId === "enterprise";

  // Workplaces saved on device
  const [workplaces] = useState<EmployerPlace[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_employer_business_places");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return [];
  });

  // Step 1: Role Details
  const [title, setTitle] = useState("");
  const [employerName, setEmployerName] = useState("Massmart Logistics Hub");
  const [organisationType, setOrganisationType] = useState("logistics_hub");
  const [opportunityType, setOpportunityType] = useState("entry_level_job");
  // Auto-select location from the single workplace (or first if only one)
  const [location, setLocation] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_employer_business_places");
        if (stored) {
          const list: EmployerPlace[] = JSON.parse(stored);
          if (list.length === 1) return list[0].address || list[0].city || "";
        }
      } catch { /* ignore */ }
    }
    return "City Deep, Johannesburg";
  });
  // Auto-select id when only one workplace exists
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_employer_business_places");
        if (stored) {
          const list: EmployerPlace[] = JSON.parse(stored);
          if (list.length === 1) return list[0].id;
        }
      } catch { /* ignore */ }
    }
    return "";
  });
  const [monthlyStipendRands, setMonthlyStipendRands] = useState("4500");
  const [applicationDeadline, setApplicationDeadline] = useState("");

  // Step 2: Role Description, Skills & Education
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("Inventory logging, Forklift basics, Stock rotation");
  const [educationLevel, setEducationLevel] = useState("grade_12");
  const [availableSlots, setAvailableSlots] = useState("2");
  const [applicationLimit, setApplicationLimit] = useState("25");
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);

  // Step 3: Interview Transport Support (OPTIONAL - pure budget pool)
  const [offerTransportSupport, setOfferTransportSupport] = useState(false);
  const [transportBudget, setTransportBudget] = useState("1500");

  // Step 4: Escrow Payment & Verification
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "instant_eft" | "wallet">("card");

  // Growth-tier matched youth list
  const [matchedCandidates, setMatchedCandidates] = useState<MatchedCandidate[]>(MOCK_MATCHED_YOUTH);

  // Calculations
  const calculatedTransportBudget = offerTransportSupport ? Number(transportBudget || 0) : 0;

  // AI Skill & Education Extraction from Description
  const handleExtractSkillsFromDescription = async () => {
    if (!description.trim() || description.trim().length < 10) {
      toast.error("Please write a role description first so AI can extract required skills.");
      return;
    }

    setIsExtractingSkills(true);
    try {
      const res = await fetch("/api/ai/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: description }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
          const extractedNames: string[] = data.skills.map((s: { name: string }) => s.name);
          const currentList = requiredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          const combined = Array.from(new Set([...currentList, ...extractedNames])).join(", ");
          setRequiredSkills(combined);
          toast.success(`Extracted ${extractedNames.length} relevant competencies from description!`);
        } else {
          fallbackExtraction();
        }
      } else {
        fallbackExtraction();
      }
    } catch {
      fallbackExtraction();
    } finally {
      setIsExtractingSkills(false);
    }
  };

  const fallbackExtraction = () => {
    const text = description.toLowerCase();
    const discovered: string[] = [];
    if (text.includes("stock") || text.includes("count") || text.includes("inventor")) {
      discovered.push("Stock Counting & Auditing");
    }
    if (text.includes("cash") || text.includes("pos") || text.includes("till")) {
      discovered.push("Cash Handling & Till Reconciliation");
    }
    if (text.includes("forklift") || text.includes("warehouse") || text.includes("pack")) {
      discovered.push("Warehouse Packing & Safety");
    }
    if (text.includes("cust") || text.includes("client") || text.includes("assist")) {
      discovered.push("Customer Service & Communication");
    }
    if (text.includes("matric") || text.includes("grade 12")) {
      setEducationLevel("grade_12");
    }

    if (discovered.length > 0) {
      const currentList = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const combined = Array.from(new Set([...currentList, ...discovered])).join(", ");
      setRequiredSkills(combined);
      toast.success(`Extracted ${discovered.length} skills from your description.`);
    } else {
      toast("No additional skills detected. Add them manually in the skills field.");
    }
  };

  const toggleInviteCandidate = (candidateId: string) => {
    setMatchedCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const next = !c.invited;
          if (next) {
            toast.success(`Exclusive invitation sent to ${c.name}!`);
          }
          return { ...c, invited: next };
        }
        return c;
      })
    );
  };

  // Step Navigations
  const handleNextStep = () => {
    if (currentStep === "role_details") {
      if (!title.trim() || !employerName.trim() || !location.trim()) {
        toast.error("Please fill in role title, employer, and location");
        return;
      }
      // Require workplace selection when multiple workplaces exist
      if (workplaces.length > 1 && !selectedWorkplaceId) {
        toast.error("Please select a hiring workplace to continue");
        return;
      }
      setCurrentStep("skills_requirements");
    } else if (currentStep === "skills_requirements") {
      if (!description.trim()) {
        toast.error("Please enter a brief role description");
        return;
      }
      if (!requiredSkills.trim()) {
        toast.error("Please enter at least one required skill");
        return;
      }
      setCurrentStep("transport_support");
    } else if (currentStep === "transport_support") {
      if (offerTransportSupport && (!transportBudget || Number(transportBudget) <= 0)) {
        toast.error("Please specify your interview transport escrow budget pool (ZAR)");
        return;
      }
      setCurrentStep("payment_activation");
    }
  };

  const handleBackStep = () => {
    if (currentStep === "skills_requirements") setCurrentStep("role_details");
    else if (currentStep === "transport_support") setCurrentStep("skills_requirements");
    else if (currentStep === "payment_activation") setCurrentStep("transport_support");
  };

  // Final Action: Escrow deposit & Publish
  const handleConfirmAndActivate = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      // Save new opportunity to local storage so it renders in Employer Dashboard and Youth feed
      const newOpportunity = {
        id: `opp-custom-${Date.now()}`,
        title,
        employerName,
        employerLogo: "/demo-avatar.png",
        location,
        type: opportunityType,
        monthlyStipendCents: Number(monthlyStipendRands || 0) * 100,
        transportCreditFunded: offerTransportSupport,
        transportBudgetRands: offerTransportSupport ? calculatedTransportBudget : 0,
        isEscrowFunded: true,
        postedDate: "Just now",
        deadline: applicationDeadline || "Rolling Admissions",
        description,
        requiredSkills: requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
        educationLevel,
        availableSlots: Number(availableSlots || 1),
        applicationLimit: Number(applicationLimit || 25),
        applicationsReceived: 0,
        workplaceId: selectedWorkplaceId || undefined,
        verifiedStatus: "active_live",
      };

      if (typeof window !== "undefined") {
        try {
          const existing = localStorage.getItem("kasirize_employer_custom_opportunities");
          const list = existing ? JSON.parse(existing) : [];
          localStorage.setItem(
            "kasirize_employer_custom_opportunities",
            JSON.stringify([newOpportunity, ...list]),
          );
        } catch {
          // ignore
        }
      }

      toast.success(
        offerTransportSupport
          ? `Transport escrow of R${calculatedTransportBudget} secured! Opportunity is now LIVE for youth.`
          : "Opportunity published and live for youth applicants!",
        { duration: 5000 },
      );
    }, 1400);
  };

  // ─── GUARD: No workplaces saved ─────────────────────────────────────────
  if (workplaces.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-28 md:pb-12 pt-6 px-4 md:px-8 max-w-3xl mx-auto font-body">
        <div className="mb-6">
          <Link
            href="/dashboard/employer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-card rounded-card border border-border shadow-card p-8 text-center space-y-5">
          <div className="size-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="size-8" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              No Hiring Workplace Found
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              You need to add at least one workplace before you can post a job opportunity.
              Workplaces let youth know exactly where they will be working.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/dashboard/employer/place"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              <MapPin className="size-4 mr-1.5" /> Add a Workplace
            </Link>
            <Link
              href="/dashboard/employer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Go Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12 pt-6 px-4 md:px-8 max-w-3xl mx-auto font-body">
      {/* ─── Back Link ─── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/employer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
        <span className="text-xs text-muted-foreground font-medium">
          Step{" "}
          {currentStep === "role_details"
            ? "1 of 4"
            : currentStep === "skills_requirements"
            ? "2 of 4"
            : currentStep === "transport_support"
            ? "3 of 4"
            : "4 of 4"}
        </span>
      </div>

      {/* ─── Stepper Progress Bar ─── */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
          <span className={currentStep === "role_details" ? "text-primary font-bold" : ""}>
            1. Role Details
          </span>
          <span className={currentStep === "skills_requirements" ? "text-primary font-bold" : ""}>
            2. Skills &amp; Scope
          </span>
          <span className={currentStep === "transport_support" ? "text-primary font-bold" : ""}>
            3. Interview Support
          </span>
          <span className={currentStep === "payment_activation" ? "text-primary font-bold" : ""}>
            4. Review &amp; Launch
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
          <div
            className={`h-full bg-primary transition-all duration-300 ${
              currentStep === "role_details"
                ? "w-1/4"
                : currentStep === "skills_requirements"
                ? "w-2/4"
                : currentStep === "transport_support"
                ? "w-3/4"
                : "w-full"
            }`}
          />
        </div>
      </div>

      {/* ─── SUCCESS STATE ─── */}
      {paymentSuccess ? (
        <div className="bg-card rounded-card border border-border shadow-lift p-8 text-center space-y-6">
          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-8" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Opportunity is Live &amp; Ready for Youth!
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Your opportunity <strong className="text-foreground">{title}</strong> has been published
              {offerTransportSupport && (
                <span>
                  {" "}
                  with a dedicated transport escrow pool of <strong className="text-emerald-600">R{calculatedTransportBudget.toLocaleString()}</strong> secured for eligible candidate interview taxi fares
                </span>
              )}
              . Once <strong className="text-foreground">{applicationLimit} applications</strong> are received, this listing will close automatically.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-btn max-w-md mx-auto text-left text-xs space-y-1.5 border border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employer:</span>
              <span className="font-semibold text-foreground">{employerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Workplace:</span>
              <span className="font-semibold text-foreground">{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Stipend:</span>
              <span className="font-semibold text-foreground">R {monthlyStipendRands}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Applications Cap:</span>
              <span className="font-semibold text-foreground">{applicationLimit} applicants (auto-close)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Education:</span>
              <span className="font-semibold text-foreground capitalize">{educationLevel.replace("_", " ")}</span>
            </div>
            {offerTransportSupport ? (
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Bus className="size-3.5" /> Transport Escrow Pool:
                </span>
                <span className="font-bold text-emerald-600">Funded (R{calculatedTransportBudget.toLocaleString()})</span>
              </div>
            ) : (
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="text-muted-foreground">Interview Transport:</span>
                <span className="text-muted-foreground">Self-funded by applicant</span>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              GROWTH & ENTERPRISE: 80%+ MATCHED YOUTH DIRECT INVITE
          ═══════════════════════════════════════════════════════════════ */}
          {isGrowthOrAbove && (
            <div className="pt-4 border-t border-border text-left space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Pre-Matched Candidates (80%+ Verified Match)
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Because your company is on the <strong className="text-foreground capitalize">{activePlanId} Plan</strong>, you can directly invite verified local youth whose task evidence matches this role right now.
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full items-center gap-1">
                  <Users className="size-3" /> {matchedCandidates.length} Matched Youth
                </span>
              </div>

              <div className="space-y-3">
                {matchedCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3.5 bg-background rounded-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{candidate.name}</span>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {candidate.matchScore}% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-muted-foreground" /> {candidate.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="size-3 text-muted-foreground" /> {candidate.education}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {candidate.evidencedSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-foreground font-medium"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-end">
                      <Button
                        size="sm"
                        variant={candidate.invited ? "outline" : "default"}
                        onClick={() => toggleInviteCandidate(candidate.id)}
                        className={`text-xs h-8 px-3 whitespace-nowrap cursor-pointer ${
                          candidate.invited ? "border-emerald-500/50 text-emerald-600" : ""
                        }`}
                      >
                        {candidate.invited ? (
                          <>
                            <Check className="size-3.5 mr-1 text-emerald-600" /> Invited
                          </>
                        ) : (
                          <>
                            <Send className="size-3.5 mr-1" /> Send Invite
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/dashboard/employer/candidates"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Go to Candidate Pipeline
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPaymentSuccess(false);
                setCurrentStep("role_details");
                setTitle("");
                setDescription("");
                setOfferTransportSupport(false);
              }}
            >
              Post Another Opportunity
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-card border border-border shadow-card p-6 sm:p-8 space-y-6">
          {/* ═══════════════════════════════════════════════════════════════
              STEP 1: ROLE DETAILS
          ═══════════════════════════════════════════════════════════════ */}
          {currentStep === "role_details" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Step 1: Role Overview &amp; Placement
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define the core job title, contract type, and physical workplace site.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Opportunity Title</Label>
                <Input
                  id="title"
                  required
                  placeholder="e.g. Junior Inventory Assistant &amp; Dispatch Coordinator"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="employerName">Hiring Company Name</Label>
                  <Input
                    id="employerName"
                    required
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="orgType">Industry Sector</Label>
                  <select
                    id="orgType"
                    value={organisationType}
                    onChange={(e) => setOrganisationType(e.target.value)}
                    className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="retailer">Retail / FMCG Store</option>
                    <option value="logistics_hub">Logistics, Freight &amp; Warehousing</option>
                    <option value="tech_academy">Digital &amp; Tech Services</option>
                    <option value="hospitality">Hospitality &amp; Restaurant Operations</option>
                    <option value="manufacturing">Light Manufacturing &amp; Assembly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="type">Opportunity Type</Label>
                  <select
                    id="type"
                    value={opportunityType}
                    onChange={(e) => setOpportunityType(e.target.value)}
                    className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="entry_level_job">Entry-Level Permanent Job</option>
                    <option value="learnership">SETA-Accredited Learnership</option>
                    <option value="apprenticeship">Artisan Apprenticeship</option>
                    <option value="micro_internship">Micro-Internship (1–3 months)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="workplaceSelect">
                    Associated Hiring Workplace {workplaces.length > 1 && <span className="text-destructive">*</span>}
                  </Label>
                  {workplaces.length > 1 ? (
                    <div>
                      <select
                        id="workplaceSelect"
                        required
                        value={selectedWorkplaceId}
                        onChange={(e) => {
                          setSelectedWorkplaceId(e.target.value);
                          const match = workplaces.find((w) => w.id === e.target.value);
                          if (match) setLocation(match.address || match.city);
                        }}
                        className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
                      >
                        <option value="">-- Choose one of your workplaces --</option>
                        {workplaces.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.city}, {w.siteType})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Select which of your locations this role will be based at.
                      </p>
                    </div>
                  ) : workplaces.length === 1 ? (
                    <div className="p-2.5 bg-muted/40 rounded-btn border border-border flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{workplaces[0].name}</span>
                        <span className="text-muted-foreground block text-[11px]">
                          {workplaces[0].city} • {workplaces[0].siteType}
                        </span>
                      </div>
                      <span className="text-[11px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                        Assigned Workplace
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Workplace Location / Address</Label>
                  <Input
                    id="location"
                    required
                    placeholder="e.g. 14 Heidelberg Rd, City Deep, JHB"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stipend">Monthly Stipend / Wage (ZAR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-semibold">
                      R
                    </span>
                    <Input
                      id="stipend"
                      type="number"
                      min="1500"
                      className="pl-8"
                      value={monthlyStipendRands}
                      onChange={(e) => setMonthlyStipendRands(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleNextStep} className="font-semibold text-xs">
                  Next: Scope &amp; Skills <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 2: SKILLS & SCOPE
          ═══════════════════════════════════════════════════════════════ */}
          {currentStep === "skills_requirements" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Step 2: Role Scope, Education &amp; Evidenced Skills
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specify job duties, required educational level, and skills. You can also let AI automatically extract required skills from your description.
                </p>
              </div>

              {/* Description first so user can write and extract */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="desc">Role Description &amp; Growth Pathways</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleExtractSkillsFromDescription}
                    disabled={isExtractingSkills || !description.trim()}
                    className="h-7 text-xs text-primary hover:text-primary font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isExtractingSkills ? (
                      <>
                        <Loader2 className="size-3 animate-spin" /> Extracting Skills...
                      </>
                    ) : (
                      <>
                        <Wand2 className="size-3 text-primary" /> Extract Skills with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="desc"
                  rows={4}
                  required
                  placeholder="Explain the day-to-day work, training provided, shift patterns, stock management, and what successful candidates can achieve in this position..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  💡 Tip: Type your job description, then click <strong>Extract Skills with AI</strong> to automatically generate the competencies list below.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skills">Key Required Skills (comma separated)</Label>
                <Input
                  id="skills"
                  required
                  placeholder="e.g. Stock Taking, Excel Basics, Customer Service, DB Board Safety"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Our matching engine highlights youth whose local completed micro-tasks verified these competencies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="education">Minimum Education</Label>
                  <select
                    id="education"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="no_formal">No Minimum / Practical Skills First</option>
                    <option value="grade_10">Grade 10 / Junior Certificate</option>
                    <option value="grade_12">Grade 12 / Matric Certificate</option>
                    <option value="tvet_nqf4">TVET NQF 4 Certificate</option>
                    <option value="diploma">National Diploma / Higher Certificate</option>
                    <option value="degree">Bachelors Degree</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="slots">Open Positions</Label>
                  <Input
                    id="slots"
                    type="number"
                    min="1"
                    value={availableSlots}
                    onChange={(e) => setAvailableSlots(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="appLimit">
                    Applications Cap <span className="text-primary font-semibold">(Auto-Close)</span>
                  </Label>
                  <Input
                    id="appLimit"
                    type="number"
                    min="5"
                    max="500"
                    value={applicationLimit}
                    onChange={(e) => setApplicationLimit(e.target.value)}
                  />
                </div>
              </div>

              {/* Informational banner about how the application limit works */}
              <div className="p-3 bg-muted/40 rounded-card border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>How application caps work:</strong> To prevent overwhelming your team, the opportunity will automatically close once <strong>{applicationLimit || 25} applications</strong> have been submitted. You can adjust this threshold or reopen the listing at any time from your pipeline.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Application Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={handleBackStep} className="font-semibold text-xs">
                  <ArrowLeft className="size-4 mr-1.5" /> Back
                </Button>
                <Button onClick={handleNextStep} className="font-semibold text-xs">
                  Next: Interview Support <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 3: INTERVIEW TRANSPORT SUPPORT (OPTIONAL)
          ═══════════════════════════════════════════════════════════════ */}
          {currentStep === "transport_support" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Step 3: Interview Transport Support (Optional)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Decide if you wish to offer travel assistance to candidates invited for in-person interviews.
                </p>
              </div>

              {/* Option Choice Card */}
              <div
                onClick={() => setOfferTransportSupport(!offerTransportSupport)}
                className={`p-4 rounded-card border transition-all cursor-pointer flex items-start gap-3.5 ${
                  offerTransportSupport
                    ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30"
                    : "bg-muted/30 border-border hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  id="transportToggle"
                  checked={offerTransportSupport}
                  onChange={(e) => setOfferTransportSupport(e.target.checked)}
                  className="size-5 rounded mt-0.5 accent-emerald-600 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bus className={`size-4 ${offerTransportSupport ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <span className="font-heading font-semibold text-sm text-foreground">
                      Yes, sponsor an interview transport budget pool for this opportunity
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Set a total budget pool that works for your company. Kasirize evaluates applicant distance and location eligibility automatically upon application, disbursing vouchers accordingly (whether a candidate is local or traveling inter-provincially).
                  </p>
                </div>
              </div>

              {/* Pure budget pool input */}
              {offerTransportSupport ? (
                <div className="p-4 rounded-card bg-card border border-border shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border text-xs font-semibold text-primary">
                    <Sparkles className="size-4" />
                    <span>Set Transport Budget Pool</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="transportPool">Total Transport Budget Pool (ZAR)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-semibold">R</span>
                      <Input
                        id="transportPool"
                        type="number"
                        min="200"
                        step="100"
                        placeholder="e.g. 1500"
                        className="pl-8 text-base font-medium"
                        value={transportBudget}
                        onChange={(e) => setTransportBudget(e.target.value)}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Enter the total amount you want to allocate for candidate interview travel assistance.
                    </p>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-3 bg-emerald-500/5 rounded-btn border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Escrow Amount Required to Publish:</span>
                    <span className="font-heading font-bold text-base text-emerald-600">
                      R {Number(transportBudget || 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Clarification on how it works */}
                  <div className="p-3 bg-muted/40 rounded-btn border border-border space-y-1.5 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Info className="size-3.5 text-primary" /> How interview transport eligibility works:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                      <li>
                        <strong>Distance-adjusted disbursement:</strong> An applicant traveling from Limpopo to Gauteng will require different travel support than a nearby township resident. When youth apply, Kasirize calculates their eligibility and travel route from their verified location.
                      </li>
                      <li>
                        <strong>Employer protection:</strong> Funds remain securely held in escrow and are only released when you shortlist and invite eligible candidates to interview.
                      </li>
                      <li>
                        <strong>Refundable:</strong> Any remaining or unused transport budget after hiring concludes can be instantly refunded or rolled into future opportunities.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-card bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">No interview transport requested.</p>
                  <p>
                    Candidates will be informed upfront that interview travel is self-funded. You can always sponsor transport later during candidate shortlisting if needed.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={handleBackStep} className="font-semibold text-xs">
                  <ArrowLeft className="size-4 mr-1.5" /> Back
                </Button>
                <Button onClick={handleNextStep} className="font-semibold text-xs">
                  Next: Payment &amp; Activation <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              STEP 4: PAYMENT ACTIVATION & LAUNCH
          ═══════════════════════════════════════════════════════════════ */}
          {currentStep === "payment_activation" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Step 4: Escrow Funding &amp; Publication
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Confirm role details and secure the required transport escrow before the opportunity is shown to youth.
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="p-4 rounded-card bg-muted/30 border border-border space-y-3 text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-border">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{title}</h3>
                    <p className="text-muted-foreground">{employerName} • {location}</p>
                  </div>
                  <span className="font-heading font-bold text-sm text-primary">
                    R {monthlyStipendRands} / mo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div><strong>Sector:</strong> {organisationType.replace("_", " ")}</div>
                  <div><strong>Type:</strong> {opportunityType.replace("_", " ")}</div>
                  <div><strong>Vacancies:</strong> {availableSlots} youth</div>
                  <div><strong>Application Cap:</strong> {applicationLimit} candidates (auto-close)</div>
                  <div><strong>Education:</strong> {educationLevel.replace("_", " ")}</div>
                  <div><strong>Deadline:</strong> {applicationDeadline || "Rolling"}</div>
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-semibold">
                  <span>Required Upfront Payment:</span>
                  <span className="font-heading font-bold text-base text-foreground">
                    {offerTransportSupport ? `R ${calculatedTransportBudget.toLocaleString()} (Transport Escrow)` : "R 0.00 (Standard Listing)"}
                  </span>
                </div>
              </div>

              {/* Escrow Deposit Section (Only if transport support is on) */}
              {offerTransportSupport ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Lock className="size-4 text-emerald-600" />
                    <span>Deposit Transport Funds into Platform Escrow</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    To protect young job seekers, Kasirize requires interview transport funds to be held in escrow before publishing the opportunity.
                  </p>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("card")}
                      className={`p-3 rounded-btn border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === "card"
                          ? "bg-card border-primary ring-1 ring-primary shadow-xs"
                          : "bg-muted/30 border-border hover:bg-muted/50"
                      }`}
                    >
                      <CreditCard className="size-5 mx-auto mb-1 text-primary" />
                      <span className="text-[11px] font-semibold text-foreground block">Credit / Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("instant_eft")}
                      className={`p-3 rounded-btn border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === "instant_eft"
                          ? "bg-card border-primary ring-1 ring-primary shadow-xs"
                          : "bg-muted/30 border-border hover:bg-muted/50"
                      }`}
                    >
                      <Coins className="size-5 mx-auto mb-1 text-emerald-600" />
                      <span className="text-[11px] font-semibold text-foreground block">Instant EFT (Ozow)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("wallet")}
                      className={`p-3 rounded-btn border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === "wallet"
                          ? "bg-card border-primary ring-1 ring-primary shadow-xs"
                          : "bg-muted/30 border-border hover:bg-muted/50"
                      }`}
                    >
                      <Building2 className="size-5 mx-auto mb-1 text-primary" />
                      <span className="text-[11px] font-semibold text-foreground block">Corporate Account</span>
                    </button>
                  </div>

                  {/* Mock Card Form */}
                  {selectedPaymentMethod === "card" && (
                    <div className="p-4 rounded-card bg-card border border-border space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="cardNum">Card Number</Label>
                        <Input id="cardNum" placeholder="4242 •••• •••• 4242" defaultValue="5412 7500 9281 4820" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="exp">Expiry</Label>
                          <Input id="exp" placeholder="MM/YY" defaultValue="11/27" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" defaultValue="849" />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "instant_eft" && (
                    <div className="p-4 rounded-card bg-muted/40 border border-border text-xs text-muted-foreground space-y-2">
                      <p className="font-semibold text-foreground">Secure Bank Direct Transfer</p>
                      <p>You will be redirected to your online banking portal to authorize the R{calculatedTransportBudget} transport escrow deposit instantly.</p>
                    </div>
                  )}

                  {selectedPaymentMethod === "wallet" && (
                    <div className="p-4 rounded-card bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground">Pre-approved Employer Corporate Billing</p>
                      <p>Deducted from your company billing facility at end-of-month reconciliation.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-card bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Free Standard Publication</span>
                  </div>
                  <p>
                    No upfront transport deposit required. Your opportunity will be activated immediately upon clicking publish.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={handleBackStep} className="font-semibold text-xs">
                  <ArrowLeft className="size-4 mr-1.5" /> Back
                </Button>
                <Button
                  onClick={handleConfirmAndActivate}
                  disabled={isProcessingPayment}
                  className="font-semibold text-xs bg-brand-deep text-white cursor-pointer shadow-xs min-w-36"
                >
                  {isProcessingPayment ? (
                    <span>Securing Escrow...</span>
                  ) : offerTransportSupport ? (
                    <span>Pay R{calculatedTransportBudget} &amp; Publish</span>
                  ) : (
                    <span>Confirm &amp; Publish</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
