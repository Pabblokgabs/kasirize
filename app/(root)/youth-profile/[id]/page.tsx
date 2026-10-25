"use client";

import { buttonVariants } from "@/components/ui/button";
import { getStoredAuthUser } from "@/lib/auth";
import { getStoredProfile } from "@/lib/store";
import { YouthProfile } from "@/types";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  CheckCircle2,
  FileCheck,
  FolderKanban,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

// Rich demonstration dataset for candidate profiles
interface CompletedTask {
  id: string;
  title: string;
  requesterName: string;
  requesterType: string;
  location: string;
  dateCompleted: string;
  payoutRands: number;
  earnedSkills: string[];
  requesterRating: number;
  requesterFeedback: string;
  youthRatingToRequester: number;
  youthFeedbackToRequester: string;
}

interface EnrolledProgram {
  id: string;
  type: "internship" | "task" | "mentorship";
  title: string;
  provider: string;
  category: string;
  status: "active" | "in_progress" | "completed";
  startDate: string;
  notes: string;
  badge?: string;
}

interface ComprehensiveYouthCandidate {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  province: string;
  phone: string;
  email: string;
  education: string;
  confidenceScore: number;
  reliabilityRate: number; // percentage
  onTimeAttendance: number; // percentage
  transportSupportEligible: boolean;
  verifiedSkills: Array<{
    name: string;
    verifiedBy: string;
    date: string;
    category: string;
    endorsementCount: number;
  }>;
  selfDeclaredSkills: Array<{
    name: string;
    category: string;
    proficiency: "Beginner" | "Intermediate" | "Experienced";
  }>;
  completedTasks: CompletedTask[];
  enrolledPrograms: EnrolledProgram[];
}

const PUBLIC_CANDIDATES: Record<string, ComprehensiveYouthCandidate> = {
  c1: {
    id: "c1",
    fullName: "Kagiso Mokoena",
    headline: "Retail Inventory Assistant & Verified Cashier",
    bio: "Passionate about retail operations with 2 years of hands-on informal store inventory experience in Soweto. Recognized for zero-variance stock counts, quick reconciliation of daily till floats, and strong punctuality.",
    location: "Soweto, Johannesburg",
    province: "Gauteng",
    phone: "+27 72 491 8023",
    email: "kagiso.mokoena@kasirize.org.za",
    education: "Grade 12 (Matric) with Accounting & Business Studies • NQF 2 Retail Competency",
    confidenceScore: 94,
    reliabilityRate: 98,
    onTimeAttendance: 100,
    transportSupportEligible: true,
    verifiedSkills: [
      {
        name: "Stock Counting & Inventory Auditing",
        verifiedBy: "Mama Dlamini (Meadowlands Superette)",
        date: "Oct 2026",
        category: "Retail Operations",
        endorsementCount: 14,
      },
      {
        name: "Cash Handling & Till Reconciliation",
        verifiedBy: "Diepkloof Express Grocers",
        date: "Sep 2026",
        category: "Point of Sale",
        endorsementCount: 11,
      },
      {
        name: "Customer Dispute Resolution",
        verifiedBy: "Kasi Mini Market",
        date: "Aug 2026",
        category: "Customer Service",
        endorsementCount: 8,
      },
      {
        name: "Barcode Scanning & Discrepancy Logging",
        verifiedBy: "Baragwanath Distribution Depot",
        date: "Jul 2026",
        category: "Logistics",
        endorsementCount: 6,
      },
    ],
    selfDeclaredSkills: [
      { name: "Google Sheets & Excel Basics", category: "Digital", proficiency: "Intermediate" },
      { name: "First Aid & Worksite Safety", category: "Compliance", proficiency: "Beginner" },
      { name: "Basic Forklift Hand-Pallet Handling", category: "Warehouse", proficiency: "Intermediate" },
      { name: "Stock Loss Prevention", category: "Retail", proficiency: "Experienced" },
    ],
    completedTasks: [
      {
        id: "tsk-c1-1",
        title: "Month-End Stock Counting & Expiry Check",
        requesterName: "Meadowlands Superette (Verified Spaza)",
        requesterType: "Retailer / Spaza",
        location: "Zone 4, Meadowlands, Soweto",
        dateCompleted: "12 Oct 2026",
        payoutRands: 280,
        earnedSkills: ["Stock Counting & Inventory Auditing", "Barcode Scanning"],
        requesterRating: 5.0,
        requesterFeedback: "Kagiso audited over 120 SKU items. Zero shrinkage variance and finished 30 minutes ahead of schedule. Highly recommended for full-time inventory roles.",
        youthRatingToRequester: 5.0,
        youthFeedbackToRequester: "Safe shop, clean shelves, clear instructions and payment was released immediately via escrow.",
      },
      {
        id: "tsk-c1-2",
        title: "Weekend Shift Till Float & Till Operation",
        requesterName: "Diepkloof Express Grocers",
        requesterType: "Retail Grocery",
        location: "Diepkloof Zone 2, Soweto",
        dateCompleted: "28 Sep 2026",
        payoutRands: 350,
        earnedSkills: ["Cash Handling & Till Reconciliation", "Customer Dispute Resolution"],
        requesterRating: 4.9,
        requesterFeedback: "Balanced daily takings of R14,200 with zero cash float discrepancies. Extremely polite with long queues.",
        youthRatingToRequester: 5.0,
        youthFeedbackToRequester: "Manager was supportive and provided lunch. Great learning experience.",
      },
      {
        id: "tsk-c1-3",
        title: "Dry Goods Intake & Pallet Unloading",
        requesterName: "Kasi Mini Market",
        requesterType: "Wholesale & Spaza",
        location: "Orlando West, Soweto",
        dateCompleted: "15 Sep 2026",
        payoutRands: 220,
        earnedSkills: ["Stock Counting & Inventory Auditing"],
        requesterRating: 5.0,
        requesterFeedback: "Careful with glass jars and crates. Stacked inventory neatly by batch dates.",
        youthRatingToRequester: 4.8,
        youthFeedbackToRequester: "Fast-paced but organized. Gloves were provided.",
      },
    ],
    enrolledPrograms: [
      {
        id: "prog-1",
        type: "internship",
        title: "Junior Inventory & Retail Assistant Micro-Internship",
        provider: "Spar Distribution Gauteng",
        category: "Supply Chain & Retail",
        status: "active",
        startDate: "01 Nov 2026",
        notes: "Pre-screened candidate shortlisted with travel voucher support.",
        badge: "Sponsored Placement",
      },
      {
        id: "prog-2",
        type: "mentorship",
        title: "Retail Management & Store Bookkeeping Coaching",
        provider: "Sipho Sithole (Master Craftsman & Business Coach)",
        category: "Commercial Mentorship",
        status: "in_progress",
        startDate: "18 Sep 2026",
        notes: "Completed 3 of 4 coaching check-ins on store P&L and supplier negotiations.",
        badge: "Active Mentee",
      },
      {
        id: "prog-3",
        type: "task",
        title: "Community Bulk Groceries Intake & Verification",
        provider: "Diepkloof Express Superette",
        category: "Neighbourhood Task",
        status: "completed",
        startDate: "28 Sep 2026",
        notes: "Verified 5-star performance rating logged on public blockchain escrow.",
        badge: "Verified Task Pass",
      },
    ],
  },
  c2: {
    id: "c2",
    fullName: "Nomvula Khumalo",
    headline: "Hospitality Barista & Certified POS Cashier",
    bio: "Punctual customer service operator with certified POS till handling. Experienced in fast-paced local coffee stand operations and shift stock inventory reconciliation in Alexandra.",
    location: "Alexandra, Johannesburg",
    province: "Gauteng",
    phone: "+27 83 912 4401",
    email: "nomvula.khumalo@kasirize.org.za",
    education: "Grade 12 (Matric) with Hospitality Studies • Level 1 Barista Training",
    confidenceScore: 88,
    reliabilityRate: 95,
    onTimeAttendance: 97,
    transportSupportEligible: true,
    verifiedSkills: [
      {
        name: "Barista Level 1 & Coffee Prep",
        verifiedBy: "Alex Kasi Roastery",
        date: "Oct 2026",
        category: "Hospitality",
        endorsementCount: 9,
      },
      {
        name: "Point of Sale (POS) Operating",
        verifiedBy: "Pan Africa Mall Cafe",
        date: "Sep 2026",
        category: "Retail",
        endorsementCount: 7,
      },
      {
        name: "Food Safety & Clean Station Standards",
        verifiedBy: "Township Food Kitchen",
        date: "Aug 2026",
        category: "Hygiene",
        endorsementCount: 8,
      },
    ],
    selfDeclaredSkills: [
      { name: "Espresso Machine Maintenance", category: "Hospitality", proficiency: "Intermediate" },
      { name: "Speed Serving & Order Queueing", category: "Operations", proficiency: "Experienced" },
      { name: "Inventory Stock Rotation", category: "Retail", proficiency: "Intermediate" },
    ],
    completedTasks: [
      {
        id: "tsk-c2-1",
        title: "Weekend Peak Coffee Stand Service",
        requesterName: "Alex Kasi Roastery",
        requesterType: "Hospitality",
        location: "12th Avenue, Alexandra",
        dateCompleted: "05 Oct 2026",
        payoutRands: 300,
        earnedSkills: ["Point of Sale (POS) Operating", "Barista Level 1 & Coffee Prep"],
        requesterRating: 4.8,
        requesterFeedback: "Nomvula handled 150+ orders during Sunday peak rush smoothly. Courteous, great espresso consistency.",
        youthRatingToRequester: 5.0,
        youthFeedbackToRequester: "Top team, clean grinder setup and friendly clientele.",
      },
    ],
    enrolledPrograms: [
      {
        id: "prog-c2-1",
        type: "mentorship",
        title: "Township Hospitality & Cafe Operations Masterclass",
        provider: "Zola Ndlovu (Artisan Barista & Cafe Owner)",
        category: "Hospitality",
        status: "in_progress",
        startDate: "02 Oct 2026",
        notes: "Learning bean origin profiling and milk steaming techniques.",
        badge: "Mentorship Enrolled",
      },
    ],
  },
  c3: {
    id: "c3",
    fullName: "Bafana Sithole",
    headline: "Electronics Diagnostic Technician & Solar Apprentice",
    bio: "Aspiring hardware technician with practical background repairing consumer smartphones, solar wiring inverters, and audio equipment across Ekurhuleni.",
    location: "Tembisa, Ekurhuleni",
    province: "Gauteng",
    phone: "+27 61 304 9912",
    email: "bafana.sithole@kasirize.org.za",
    education: "N2 Electrical Engineering Certificate • Grade 12 Matric Certificate",
    confidenceScore: 89,
    reliabilityRate: 94,
    onTimeAttendance: 96,
    transportSupportEligible: true,
    verifiedSkills: [
      {
        name: "Smartphone Diagnostics & Ribbon Fixes",
        verifiedBy: "Musa Electronics Repairs",
        date: "Sep 2026",
        category: "Hardware",
        endorsementCount: 11,
      },
      {
        name: "Soldering & Cable Harnessing",
        verifiedBy: "Tembisa Community Tech Hub",
        date: "Aug 2026",
        category: "Electronics",
        endorsementCount: 9,
      },
      {
        name: "Worksite Safety & Multimeter Auditing",
        verifiedBy: "Solar Youth Project",
        date: "Jul 2026",
        category: "Electrical",
        endorsementCount: 8,
      },
    ],
    selfDeclaredSkills: [
      { name: "Solar Inverter Fault Isolation", category: "Renewables", proficiency: "Intermediate" },
      { name: "Battery Capacity Load Testing", category: "Hardware", proficiency: "Intermediate" },
      { name: "Circuit Board Cleaning & Desoldering", category: "Electronics", proficiency: "Experienced" },
    ],
    completedTasks: [
      {
        id: "tsk-c3-1",
        title: "Screen Replacements & Motherboard Cleaning",
        requesterName: "Musa Electronics Repairs",
        requesterType: "Technical Repair",
        location: "Oakmoor Plaza, Tembisa",
        dateCompleted: "18 Sep 2026",
        payoutRands: 350,
        earnedSkills: ["Smartphone Diagnostics & Ribbon Fixes", "Soldering & Cable Harnessing"],
        requesterRating: 5.0,
        requesterFeedback: "Recovered 5 water-damaged devices without lifting any traces. Clean soldering work.",
        youthRatingToRequester: 5.0,
        youthFeedbackToRequester: "Tools provided in great condition. Learned a lot.",
      },
    ],
    enrolledPrograms: [
      {
        id: "prog-c3-1",
        type: "internship",
        title: "Electronics Diagnostic Apprenticeship",
        provider: "FixIt Cape Tech Hub",
        category: "Artisan Trade",
        status: "active",
        startDate: "15 Oct 2026",
        notes: "SETA-accredited technical apprentice program with tool kit provided.",
        badge: "Funded Apprenticeship",
      },
    ],
  },
  c4: {
    id: "c4",
    fullName: "Zanele Dube",
    headline: "Logistics Manifest Administrator & Data Capturer",
    bio: "Fast and organized administrator with 16 verified tasks capturing supplier invoices, auditing parcel manifests, and updating Google Sheets for township distribution hubs.",
    location: "Diepsloot, Johannesburg",
    province: "Gauteng",
    phone: "+27 79 510 8820",
    email: "zanele.dube@kasirize.org.za",
    education: "Grade 12 (Matric) with Mathematical Literacy • End User Computing Certificate",
    confidenceScore: 91,
    reliabilityRate: 98,
    onTimeAttendance: 99,
    transportSupportEligible: true,
    verifiedSkills: [
      {
        name: "Google Sheets & Fast Data Entry",
        verifiedBy: "Lindiwe Catering Services",
        date: "Oct 2026",
        category: "Digital Admin",
        endorsementCount: 16,
      },
      {
        name: "Filing, Archiving & Invoice Auditing",
        verifiedBy: "Diepsloot Business Chamber",
        date: "Sep 2026",
        category: "Administration",
        endorsementCount: 12,
      },
    ],
    selfDeclaredSkills: [
      { name: "Waybill & Manifest Reconciliation", category: "Logistics", proficiency: "Experienced" },
      { name: "Stock Picking & Barcode Verification", category: "Warehouse", proficiency: "Intermediate" },
    ],
    completedTasks: [
      {
        id: "tsk-c4-1",
        title: "Supplier Invoice Digitization & Expense Filing",
        requesterName: "Lindiwe Catering Services",
        requesterType: "Small Business",
        location: "Braamfontein, Johannesburg",
        dateCompleted: "02 Oct 2026",
        payoutRands: 280,
        earnedSkills: ["Google Sheets & Fast Data Entry", "Filing, Archiving & Invoice Auditing"],
        requesterRating: 5.0,
        requesterFeedback: "Transcribed 240 physical slips accurately with zero typos. Will hire again.",
        youthRatingToRequester: 5.0,
        youthFeedbackToRequester: "Quiet working desk, fast internet access, prompt payment.",
      },
    ],
    enrolledPrograms: [
      {
        id: "prog-c4-1",
        type: "internship",
        title: "Warehouse Dispatch & Logistics Trainee",
        provider: "Massmart Logistics Hub",
        category: "Supply Chain",
        status: "active",
        startDate: "01 Nov 2026",
        notes: "Full-time trainee posting with interview transport funded in platform escrow.",
        badge: "Escrow Secured",
      },
    ],
  },
};

export default function YouthPublicProfileDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "c1";

  // Check stored profile if user is viewing their own profile or demo profile
  const storedProfile = useMemo<YouthProfile>(() => getStoredProfile(), []);

  // Determine candidate data: match by ID in PUBLIC_CANDIDATES or build from storedProfile/MOCK
  const candidate = useMemo<ComprehensiveYouthCandidate>(() => {
    if (PUBLIC_CANDIDATES[rawId]) {
      return PUBLIC_CANDIDATES[rawId];
    }

    const authUser = getStoredAuthUser();
    const baseName =
      rawId === "me" || rawId === "user"
        ? authUser?.name || storedProfile?.fullName || "Kagiso Sithole"
        : storedProfile?.fullName || "Kagiso Sithole";

    return {
      id: rawId,
      fullName: baseName,
      headline: "Township Task Worker & Practical Competency Earner",
      bio:
        storedProfile?.experienceStory ||
        "Dedicated young South African gaining verified practical workplace experience through neighborhood tasks and accredited mentorships.",
      location: authUser?.location?.split(",")[0] || storedProfile?.location || "Soweto",
      province: authUser?.location?.split(",")[1]?.trim() || storedProfile?.province || "Gauteng",
      phone: "+27 71 555 0192",
      email: authUser?.email || storedProfile?.email || "applicant@kasirize.org.za",
      education: "Grade 12 (Matric Certificate) • Kasirize Verified Skills Portfolio",
      confidenceScore: 90,
      reliabilityRate: 96,
      onTimeAttendance: 98,
      transportSupportEligible: true,
      verifiedSkills: (storedProfile?.skills || []).map((sk) => ({
        name: sk.skillName,
        verifiedBy: sk.endorsedBy || "Verified Community Requester",
        date: "Recent",
        category: "Practical Skills",
        endorsementCount: 8,
      })),
      selfDeclaredSkills: [
        { name: "Time Management", category: "Core", proficiency: "Experienced" },
        { name: "Smartphone Communication", category: "Digital", proficiency: "Experienced" },
        { name: "Teamwork & Collaboration", category: "Soft Skills", proficiency: "Intermediate" },
      ],
      completedTasks: [
        {
          id: "tsk-gen-1",
          title: "Neighbourhood Retail & Stock Verification",
          requesterName: "Local Verified Spaza Shop",
          requesterType: "Retailer",
          location: storedProfile?.location || "Soweto",
          dateCompleted: "14 Oct 2026",
          payoutRands: 250,
          earnedSkills: ["Stock Auditing", "Punctuality"],
          requesterRating: 5.0,
          requesterFeedback: "Completed all checklist items cleanly and was very polite.",
          youthRatingToRequester: 5.0,
          youthFeedbackToRequester: "Friendly requester, safe environment.",
        },
      ],
      enrolledPrograms: [
        {
          id: "prog-gen-1",
          type: "mentorship",
          title: "Artisan Trade Preparation Mentorship",
          provider: "Sipho Sithole (Master Craftsman)",
          category: "Artisan Trade",
          status: "in_progress",
          startDate: "10 Oct 2026",
          notes: "Active coaching on workshop health, safety and tool care.",
          badge: "Active Mentee",
        },
      ],
    };
  }, [rawId, storedProfile]);

  const [activeTab, setActiveTab] = useState<"skills" | "tasks" | "programs">("skills");

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Public profile link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── PUBLIC NAVIGATION HEADER ─── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard/employer/candidates"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Candidates Pipeline</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Share2 className="size-3.5 mr-1.5" /> Share Profile
            </button>
            <Link
              href="/dashboard/employer/post-opportunity"
              className={buttonVariants({ size: "sm" })}
            >
              <Briefcase className="size-3.5 mr-1.5" /> Post Opportunity
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6 pb-20">
        {/* ─── PROFILE HERO CARD ─── */}
        <div className="bg-card rounded-card border border-border shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="size-3.5" />
                <span>Kasirize Evidenced Youth Passport</span>
              </div>

              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {candidate.fullName}
                </h1>
                <p className="text-sm font-medium text-primary mt-0.5">
                  {candidate.headline}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" />
                    {candidate.location}, {candidate.province}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3.5 text-primary" />
                    {candidate.education}
                  </span>
                </div>
              </div>
            </div>

            {/* TRUST & CONFIDENCE SCORE BADGE */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 p-4 bg-muted/40 rounded-card border border-border shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Overall Trust Score
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="size-6 text-emerald-600" />
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    {candidate.confidenceScore}%
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-muted-foreground space-y-0.5 border-l sm:border-l-0 sm:border-t border-border pl-3 sm:pl-0 sm:pt-2">
                <div>
                  <strong className="text-foreground">{candidate.reliabilityRate}%</strong> Task Completion
                </div>
                <div>
                  <strong className="text-foreground">{candidate.onTimeAttendance}%</strong> On-Time Record
                </div>
              </div>
            </div>
          </div>

          {/* BIO SUMMARY */}
          <div className="space-y-2 pt-2 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Candidate Background &amp; Motivation
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-btn border border-border">
              {candidate.bio}
            </p>
          </div>

          {/* VERIFIED CONTACT & TRANSPORT STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-muted/30 rounded-card border border-border flex items-center gap-2.5">
              <Phone className="size-4 text-primary shrink-0" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Verified Cellphone</span>
                <span className="font-semibold text-foreground">{candidate.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-card border border-border flex items-center gap-2.5">
              <Mail className="size-4 text-primary shrink-0" />
              <div>
                <span className="text-muted-foreground block text-[10px]">Verified Email</span>
                <span className="font-semibold text-foreground truncate">{candidate.email}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/5 rounded-card border border-emerald-500/20 flex items-center gap-2.5">
              <Bus className="size-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-emerald-700 block text-[10px] font-semibold">Interview Travel</span>
                <span className="font-bold text-emerald-600">
                  {candidate.transportSupportEligible
                    ? "Escrow Voucher Supported"
                    : "Self-Funded"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION TABS ─── */}
        <div className="flex border-b border-border gap-2 sm:gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("skills")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "skills"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="size-4" />
            <span>Skills ({candidate.verifiedSkills.length + candidate.selfDeclaredSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "tasks"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck className="size-4" />
            <span>Completed Tasks &amp; Ratings ({candidate.completedTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("programs")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "programs"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderKanban className="size-4" />
            <span>Enrolled Programs &amp; Internships ({candidate.enrolledPrograms.length})</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 1: SKILLS (VERIFIED VS SELF-DECLARED)
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Task-Verified Skills Section */}
            <div className="p-6 rounded-card bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-5 text-emerald-600" />
                    <span>Task-Verified Competencies</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Skills confirmed by local employers and business owners after successful real-world task completion.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full">
                  {candidate.verifiedSkills.length} Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {candidate.verifiedSkills.map((vSkill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-muted/30 rounded-card border border-border flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-sm text-foreground">{vSkill.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Endorsed by: <strong className="text-foreground/90">{vSkill.verifiedBy}</strong> • {vSkill.date}
                      </p>
                      <span className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full inline-block">
                        {vSkill.category}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-600 block">
                        ✓ {vSkill.endorsementCount} Endorsements
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Declared Skills Section */}
            <div className="p-6 rounded-card bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                    <UserCheck className="size-5 text-primary" />
                    <span>Self-Declared Skills &amp; Capabilities</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Competencies stated by the candidate and ready to be tested or reinforced through upcoming opportunities.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                  {candidate.selfDeclaredSkills.length} Declared
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {candidate.selfDeclaredSkills.map((sSkill, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/20 rounded-card border border-border space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">{sSkill.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>{sSkill.category}</span>
                      <span className="font-medium text-primary bg-primary/5 px-2 py-0.2 rounded">
                        {sSkill.proficiency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 2: COMPLETED TASKS & TWO-WAY RATINGS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-foreground text-sm">Two-Way Rating Transparency</h3>
                <p className="text-muted-foreground">
                  Kasirize publishes transparent two-way feedback from both local township requesters and youth.
                </p>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Average Rating</span>
                  <span className="font-bold text-amber-500 text-sm flex items-center gap-1">
                    ★ 5.0 / 5.0
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Tasks Logged</span>
                  <span className="font-bold text-foreground text-sm">{candidate.completedTasks.length} Completed</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {candidate.completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 rounded-card bg-card border border-border shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-border">
                    <div>
                      <h4 className="font-heading font-bold text-base text-foreground">
                        {task.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="size-3.5 text-primary" />
                        {task.requesterName} ({task.requesterType}) • {task.location}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center sm:justify-end gap-1">
                        <Calendar className="size-3" /> {task.dateCompleted}
                      </span>
                      <span className="font-heading font-bold text-sm text-foreground">
                        R {task.payoutRands} Escrow Payout
                      </span>
                    </div>
                  </div>

                  {/* Skills confirmed by this task */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground font-semibold mr-1">Skills Verified:</span>
                    {task.earnedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>

                  {/* Two-Way Feedback Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    {/* Requester to Youth Review */}
                    <div className="p-3.5 bg-muted/40 rounded-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Requester Evaluation</span>
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          ★ {task.requesterRating}.0
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                        &ldquo;{task.requesterFeedback}&rdquo;
                      </p>
                    </div>

                    {/* Youth to Requester Review */}
                    <div className="p-3.5 bg-muted/40 rounded-card border border-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Youth Experience Note</span>
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          ★ {task.youthRatingToRequester}.0
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                        &ldquo;{task.youthFeedbackToRequester}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 3: ENROLLED PROGRAMS, INTERNSHIPS & MENTORSHIPS
        ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "programs" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-card border border-border text-xs text-muted-foreground space-y-1">
              <h3 className="font-bold text-foreground text-sm">Active &amp; Completed Commitments</h3>
              <p>
                Track internships, accredited learnerships, and one-on-one mentorship sessions this youth is currently enrolled in.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidate.enrolledPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="p-5 rounded-card bg-card border border-border shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {prog.type}
                      </span>
                      {prog.badge && (
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                          {prog.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading font-bold text-base text-foreground">
                      {prog.title}
                    </h4>

                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Building2 className="size-3.5 text-primary" />
                        <span>Provider: <strong className="text-foreground">{prog.provider}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        <span>Start Date: {prog.startDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-foreground/80 bg-muted/30 p-2.5 rounded-btn border border-border">
                      {prog.notes}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-bold text-emerald-600 capitalize flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> {prog.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
