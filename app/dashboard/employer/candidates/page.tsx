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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "cn";
import {
  Briefcase,
  Bus,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface TaskEvidence {
  taskTitle: string;
  requester: string;
  rating: number;
  dateCompleted: string;
  verifiedSnippet: string;
}

interface Candidate {
  id: string;
  name: string;
  jobId: string;
  jobTitle: string;
  location: string;
  province: string;
  confidenceScore: number;
  skills: string[];
  education: string;
  tasksCompleted: number;
  appliedDate: string;
  phone: string;
  email: string;
  bio: string;
  transportSupportEligible: boolean;
  transportEstimateZar: number;
  shortlisted: boolean;
  interviewStatus?: "none" | "invited" | "accepted";
  evidences: TaskEvidence[];
}

const DEFAULT_JOBS = [
  { id: "all", title: "All Active Opportunities" },
  { id: "opp-1", title: "Junior Inventory & Retail Assistant" },
  { id: "opp-2", title: "Electronics Diagnostic Apprenticeship" },
  { id: "opp-3", title: "Warehouse Dispatch & Logistics Trainee" },
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Kagiso Mokoena",
    jobId: "opp-1",
    jobTitle: "Junior Inventory & Retail Assistant",
    location: "Soweto, Johannesburg",
    province: "Gauteng",
    confidenceScore: 94,
    skills: [
      "Cash Reconciliation",
      "Inventory Audits",
      "Customer Dispute Resolution",
      "Stock Taking",
    ],
    education: "Grade 12 (Matric) with Accounting + NQF 2 Retail Skills",
    tasksCompleted: 14,
    appliedDate: "Today, 10:15 AM",
    phone: "+27 72 491 8023",
    email: "kagiso.mokoena@kasirize.org.za",
    bio: "Passionate retail assistant with 2 years of informal store inventory auditing experience. Managed cash float reconciliations and stock rotation at Meadowlands Superette.",
    transportSupportEligible: true,
    transportEstimateZar: 45,
    shortlisted: true,
    interviewStatus: "invited",
    evidences: [
      {
        taskTitle: "End of Month Stock Audit",
        requester: "Meadowlands Superette (Verified Spaza)",
        rating: 5,
        dateCompleted: "12 Oct 2026",
        verifiedSnippet:
          "Audited 120 SKU dry grocery items with 0% shrinkage variance. Very punctual and accurate.",
      },
      {
        taskTitle: "Till Float Reconciliation & Customer Intake",
        requester: "Diepkloof Express Grocers",
        rating: 4.9,
        dateCompleted: "28 Sep 2026",
        verifiedSnippet:
          "Balanced daily takings of R14,200 with zero cash float discrepancies.",
      },
    ],
  },
  {
    id: "c2",
    name: "Nomvula Khumalo",
    jobId: "opp-1",
    jobTitle: "Junior Inventory & Retail Assistant",
    location: "Alexandra, Johannesburg",
    province: "Gauteng",
    confidenceScore: 88,
    skills: [
      "Barista Level 1",
      "Point of Sale (POS)",
      "Food Safety Standards",
      "Shift Logging",
    ],
    education: "Grade 12 (Matric)",
    tasksCompleted: 9,
    appliedDate: "Yesterday, 3:40 PM",
    phone: "+27 83 912 4401",
    email: "nomvula.khumalo@kasirize.org.za",
    bio: "Punctual customer service operator with certified POS till handling. Experienced in fast-paced local coffee stand operations and shift stock inventory reconciliation.",
    transportSupportEligible: true,
    transportEstimateZar: 60,
    shortlisted: false,
    interviewStatus: "none",
    evidences: [
      {
        taskTitle: "Weekend Shift POS Operation",
        requester: "Alex Township Kasi Roastery",
        rating: 4.8,
        dateCompleted: "05 Oct 2026",
        verifiedSnippet:
          "Handled 150+ point-of-sale customer orders smoothly during Sunday afternoon peak.",
      },
    ],
  },
  {
    id: "c3",
    name: "Bafana Sithole",
    jobId: "opp-2",
    jobTitle: "Electronics Diagnostic Apprenticeship",
    location: "Tembisa, Ekurhuleni",
    province: "Gauteng",
    confidenceScore: 89,
    skills: [
      "Smartphone Diagnostics",
      "Soldering & Cable Harnessing",
      "Tool Inventory Management",
      "Site Safety",
    ],
    education: "N2 Electrical Engineering Certificate + Matric",
    tasksCompleted: 11,
    appliedDate: "2 days ago",
    phone: "+27 61 304 9912",
    email: "bafana.sithole@kasirize.org.za",
    bio: "Aspiring technician with solid practical foundation repairing consumer phones and household electronics. Completed 11 verified community equipment fixes.",
    transportSupportEligible: true,
    transportEstimateZar: 110,
    shortlisted: true,
    interviewStatus: "none",
    evidences: [
      {
        taskTitle: "Screen Replacements & Motherboard Cleaning",
        requester: "Musa Electronics Repairs (Khayelitsha)",
        rating: 5,
        dateCompleted: "18 Sep 2026",
        verifiedSnippet:
          "Successfully recovered 5 water-damaged devices and replaced LCD ribbons cleanly.",
      },
    ],
  },
  {
    id: "c4",
    name: "Zanele Dube",
    jobId: "opp-3",
    jobTitle: "Warehouse Dispatch & Logistics Trainee",
    location: "Diepsloot, Johannesburg",
    province: "Gauteng",
    confidenceScore: 91,
    skills: ["Data Entry", "Google Sheets", "Stock Picking", "Order Labeling"],
    education: "Grade 12 (Matric) with Mathematics Literacy",
    tasksCompleted: 16,
    appliedDate: "3 days ago",
    phone: "+27 79 510 8820",
    email: "zanele.dube@kasirize.org.za",
    bio: "Fast and organized administrator who excels at tracking manifests, cataloging parcels, and matching waybills with physical warehouse inventory.",
    transportSupportEligible: true,
    transportEstimateZar: 55,
    shortlisted: false,
    interviewStatus: "none",
    evidences: [
      {
        taskTitle: "Supplier Invoice Digitization",
        requester: "Lindiwe Catering Services",
        rating: 5,
        dateCompleted: "02 Oct 2026",
        verifiedSnippet:
          "Transcribed 240 physical slips accurately into Google Sheets under strict deadline.",
      },
    ],
  },
  {
    id: "c5",
    name: "Siyabonga Cele",
    jobId: "opp-3",
    jobTitle: "Warehouse Dispatch & Logistics Trainee",
    location: "Umlazi, Durban (Willing to relocate)",
    province: "KwaZulu-Natal",
    confidenceScore: 84,
    skills: [
      "Dispatch Packaging",
      "Stock Picking",
      "Pallet Loading",
      "Forklift Basics",
    ],
    education: "Grade 11 + Warehouse Assistant NQF 1",
    tasksCompleted: 7,
    appliedDate: "4 days ago",
    phone: "+27 82 770 1934",
    email: "siyabonga.cele@kasirize.org.za",
    bio: "Energetic logistics worker with heavy lifting and pallet stacking background. Punctual and safety-conscious during morning inventory truck unloads.",
    transportSupportEligible: true,
    transportEstimateZar: 320, // Inter-provincial long-distance travel
    shortlisted: false,
    interviewStatus: "none",
    evidences: [
      {
        taskTitle: "Wholesale Unloading & Crating",
        requester: "Tembisa Fresh Wholesalers",
        rating: 4.7,
        dateCompleted: "24 Sep 2026",
        verifiedSnippet:
          "Loaded and stacked 40 produce crates with 0 damaged goods. Good team spirit.",
      },
    ],
  },
  {
    id: "c6",
    name: "Lerato Mabaso",
    jobId: "opp-1",
    jobTitle: "Junior Inventory & Retail Assistant",
    location: "Mamelodi, Pretoria",
    province: "Gauteng",
    confidenceScore: 92,
    skills: [
      "Cash Handling",
      "Customer Service",
      "Shelf Merchandising",
      "Barcode Scanning",
    ],
    education: "Grade 12 (Matric)",
    tasksCompleted: 13,
    appliedDate: "5 days ago",
    phone: "+27 71 884 1029",
    email: "lerato.mabaso@kasirize.org.za",
    bio: "Friendly retail worker known for excellent customer relations and accurate till operations. Over a dozen verified reviews from local community shop owners.",
    transportSupportEligible: true,
    transportEstimateZar: 85,
    shortlisted: true,
    interviewStatus: "none",
    evidences: [
      {
        taskTitle: "Superette Weekend Rush Cashier",
        requester: "Mamelodi East Minimarket",
        rating: 5,
        dateCompleted: "29 Sep 2026",
        verifiedSnippet:
          "Demonstrated great calm during long queues. Float was balanced to the cent.",
      },
    ],
  },
];

export default function EmployerCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted">("all");

  // Profile Drawer / Modal
  const [activeProfileCandidate, setActiveProfileCandidate] =
    useState<Candidate | null>(null);

  // Quick message modal
  const [messageTargetCandidate, setMessageTargetCandidate] =
    useState<Candidate | null>(null);
  const [quickMessageText, setQuickMessageText] = useState("");

  // Filter candidates by job and tab and search
  const filtered = candidates.filter((c) => {
    const matchesJob = selectedJobId === "all" || c.jobId === selectedJobId;
    const matchesTab =
      activeTab === "all" || (activeTab === "shortlisted" && c.shortlisted);
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.education.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return matchesJob && matchesTab && matchesSearch;
  });

  // Calculate job counts
  const getJobApplicantCount = (jobId: string) => {
    if (jobId === "all") return candidates.length;
    return candidates.filter((c) => c.jobId === jobId).length;
  };

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.shortlisted;
          toast.success(
            next
              ? `${c.name} added to shortlist!`
              : `${c.name} removed from shortlist.`,
          );
          return { ...c, shortlisted: next };
        }
        return c;
      }),
    );
  };

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageTargetCandidate || !quickMessageText.trim()) return;
    toast.success(
      `Message sent to ${messageTargetCandidate.name} via Kasirize in-app messaging.`,
    );
    setMessageTargetCandidate(null);
    setQuickMessageText("");
  };

  const handleInviteToInterview = (candidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id
          ? { ...c, shortlisted: true, interviewStatus: "invited" }
          : c,
      ),
    );
    toast.success(
      `Interview invite sent to ${candidate.name}! Travel assistance voucher (R${candidate.transportEstimateZar}) activated.`,
    );
    if (activeProfileCandidate?.id === candidate.id) {
      setActiveProfileCandidate({
        ...candidate,
        shortlisted: true,
        interviewStatus: "invited",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12 pt-6 px-4 md:px-8 max-w-6xl mx-auto font-body">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Candidate Pipeline &amp; Profiles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review verified youth applications organized by posting, examine
            real task evidence, and invite qualified candidates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-btn w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Applicants ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab("shortlisted")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-btn transition-colors cursor-pointer ${
              activeTab === "shortlisted"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Shortlist ({candidates.filter((c) => c.shortlisted).length})
          </button>
        </div>
      </div>

      {/* ─── OPPORTUNITY PILLS (Separate by Job) ─── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
          <Briefcase className="size-3.5 text-primary" />
          <span>Filter by Opportunity Posting:</span>
        </div>
        <ScrollArea>
          <div className="flex  gap-2">
            {DEFAULT_JOBS.map((job) => {
              const isSelected = selectedJobId === job.id;
              const count = getJobApplicantCount(job.id);
              return (
                <Button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={cn(
                    "px-3.5 py-2  rounded-btn text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                      : "bg-card text-foreground border-border hover:bg-muted/60",
                  )}
                >
                  <span>{job.title}</span>
                  <span
                    className={cn(
                      "text-[11px] px-1.5 py-0.2 rounded-full font-bold",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
          <ScrollBar hidden />
        </ScrollArea>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, location, school/education, or verified skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      {/* ─── Candidate Grid ─── */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-card border border-border p-12 text-center space-y-3">
          <Users className="size-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading font-bold text-lg text-foreground">
            No candidates match your filter
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try selecting a different opportunity pill above or clearing your
            search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveProfileCandidate(c)}
              className="bg-card rounded-card border border-border shadow-xs hover:shadow-card hover:border-primary/50 transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Applied Opportunity Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full truncate max-w-[55">
                    Applied: {c.jobTitle}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> {c.appliedDate}
                  </span>
                </div>

                {/* Candidate Name & Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {c.name}
                      {c.interviewStatus === "invited" && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.2 rounded-full font-semibold">
                          Interview Invited
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3.5 text-primary" />
                      {c.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      <ShieldCheck className="size-3.5" />
                      {c.confidenceScore}% Trust
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {c.tasksCompleted} verified tasks
                    </span>
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-center gap-1.5 text-xs text-foreground/80 mb-3 bg-muted/40 p-2 rounded-btn">
                  <GraduationCap className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{c.education}</span>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 4).map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-muted text-muted-foreground text-[11px] px-2 py-0.5 rounded-btn font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{c.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Transport Eligibility Note */}
                {c.transportSupportEligible && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/15">
                    <Bus className="size-3 text-emerald-600" />
                    <span>
                      Interview travel support eligible (Est. R
                      {c.transportEstimateZar})
                    </span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button
                  variant={c.shortlisted ? "outline" : "ghost"}
                  size="sm"
                  onClick={(e) => toggleShortlist(c.id, e)}
                  className={`text-xs h-8 cursor-pointer ${
                    c.shortlisted ? "border-amber-500/50 text-amber-600" : ""
                  }`}
                >
                  {c.shortlisted ? (
                    <>
                      <Check className="size-3.5 mr-1 text-amber-600" />{" "}
                      Shortlisted
                    </>
                  ) : (
                    <>
                      <Star className="size-3.5 mr-1" /> Shortlist
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageTargetCandidate(c);
                    }}
                    className="text-xs h-8 cursor-pointer"
                  >
                    <Mail className="size-3.5 mr-1" /> Message
                  </Button>
                  <Link
                    href={`/youth-profile/${c.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "text-xs h-8 cursor-pointer",
                    })}
                  >
                    <ExternalLink className="size-3.5 mr-1" /> View Full Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          CANDIDATE FULL PROFILE MODAL (Everything the Employer Needs to Know)
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!activeProfileCandidate}
        onOpenChange={(open) => !open && setActiveProfileCandidate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-body">
          {activeProfileCandidate && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-border pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      Applied for: {activeProfileCandidate.jobTitle}
                    </span>
                    <DialogTitle className="font-heading text-2xl font-bold text-foreground">
                      {activeProfileCandidate.name}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3.5 text-primary" />
                      {activeProfileCandidate.location},{" "}
                      {activeProfileCandidate.province} • Applied{" "}
                      {activeProfileCandidate.appliedDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold w-fit ml-auto">
                      <ShieldCheck className="size-4" />
                      {activeProfileCandidate.confidenceScore}% Trust Score
                    </div>
                    <span className="text-[11px] text-muted-foreground block mt-1">
                      {activeProfileCandidate.tasksCompleted} Verified Tasks
                    </span>
                  </div>
                </div>
              </DialogHeader>

              {/* Bio & Practical Background */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  About &amp; Work Background
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3.5 rounded-card border border-border">
                  {activeProfileCandidate.bio}
                </p>
              </div>

              {/* Verified Education & Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-muted/40 rounded-card border border-border space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-primary" /> Education
                    &amp; Certifications
                  </span>
                  <p className="text-muted-foreground">
                    {activeProfileCandidate.education}
                  </p>
                </div>

                <div className="p-3 bg-muted/40 rounded-card border border-border space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Bus className="size-4 text-emerald-600" /> Interview
                    Transport Assistance
                  </span>
                  <p className="text-muted-foreground">
                    {activeProfileCandidate.transportSupportEligible ? (
                      <span>
                        Eligible for platform escrow taxi voucher (~R
                        {activeProfileCandidate.transportEstimateZar} route
                        cost)
                      </span>
                    ) : (
                      "Self-funded transport"
                    )}
                  </p>
                </div>
              </div>

              {/* Contact Direct Strip */}
              <div className="p-3 bg-card rounded-card border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary" />
                  <span className="font-semibold text-foreground">
                    {activeProfileCandidate.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-primary" />
                  <span className="text-muted-foreground">
                    {activeProfileCandidate.email}
                  </span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Verified Cellphone Number
                </span>
              </div>

              {/* Task-Verified Competencies */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Task-Verified Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProfileCandidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium"
                    >
                      <CheckCircle2 className="size-3" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real Task References & Evidence */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>
                    Completed Township Task References (
                    {activeProfileCandidate.evidences.length})
                  </span>
                  <span className="text-[11px] text-primary lowercase font-normal">
                    Evidence-backed ratings
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {activeProfileCandidate.evidences.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3 bg-background rounded-card border border-border space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">
                          {ev.taskTitle}
                        </span>
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          ★ {ev.rating}.0
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Requester: {ev.requester}</span>
                        <span>{ev.dateCompleted}</span>
                      </div>
                      <p className="text-[11px] text-foreground/80 italic bg-muted/30 p-2 rounded border border-border/60">
                        &ldquo;{ev.verifiedSnippet}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <DialogFooter className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleShortlist(activeProfileCandidate.id)}
                  className="w-full sm:w-auto text-xs"
                >
                  {activeProfileCandidate.shortlisted ? (
                    <>
                      <Check className="size-3.5 mr-1 text-amber-600" /> Remove
                      Shortlist
                    </>
                  ) : (
                    <>
                      <Star className="size-3.5 mr-1" /> Add to Shortlist
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={`/youth-profile/${activeProfileCandidate.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "text-xs",
                    })}
                  >
                    <ExternalLink className="size-3.5 mr-1" /> Open Dedicated
                    Page
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMessageTargetCandidate(activeProfileCandidate);
                      setActiveProfileCandidate(null);
                    }}
                    className="text-xs"
                  >
                    <Mail className="size-3.5 mr-1" /> Direct Message
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      handleInviteToInterview(activeProfileCandidate)
                    }
                    className="text-xs bg-brand-deep text-white cursor-pointer"
                  >
                    <Send className="size-3.5 mr-1" />
                    {activeProfileCandidate.interviewStatus === "invited"
                      ? "Re-send Interview Invite"
                      : "Invite to Interview"}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          QUICK MESSAGE MODAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={!!messageTargetCandidate}
        onOpenChange={(open) => !open && setMessageTargetCandidate(null)}
      >
        <DialogContent className="max-w-md font-body">
          {messageTargetCandidate && (
            <form onSubmit={handleSendQuickMessage} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-heading text-lg font-bold">
                  Message {messageTargetCandidate.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Regarding application for{" "}
                  <strong>{messageTargetCandidate.jobTitle}</strong>.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <textarea
                  rows={4}
                  required
                  placeholder={`Hi ${messageTargetCandidate.name}, we reviewed your verified task references and would like to ask a quick question...`}
                  value={quickMessageText}
                  onChange={(e) => setQuickMessageText(e.target.value)}
                  className="w-full bg-background border border-input rounded-btn p-3 text-xs text-foreground focus:outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  Messages are sent directly through the Kasirize messaging chat
                  to protect applicant privacy.
                </p>
              </div>

              <DialogFooter className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMessageTargetCandidate(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="font-semibold text-xs"
                >
                  <Send className="size-3.5 mr-1.5" /> Send Message
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
