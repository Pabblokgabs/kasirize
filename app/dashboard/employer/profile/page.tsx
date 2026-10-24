"use client";

import { EmployerPlace } from "@/app/dashboard/employer/place/page";
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
import {
  ArrowLeft,
  Award,
  Building2,
  Check,
  CreditCard,
  Crown,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const PROFILE_KEY = "kasirize_employer_profile";
const WORKPLACES_KEY = "kasirize_employer_business_places";
const ACTIVE_PLAN_KEY = "kasirize_employer_active_plan_id";
const VERIFICATION_KEY = "kasirize_employer_verified_badge";

interface EmployerProfileData {
  companyName: string;
  registrationNumber: string;
  bbbeeLevel: string;
  setaSponsorship: string;
  industry: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
}

const DEFAULT_EMPLOYER_PROFILE: EmployerProfileData = {
  companyName: "Massmart Supply Chain & Distribution",
  registrationNumber: "1998/024810/06",
  bbbeeLevel: "Level 1 B-BBEE Contributor",
  setaSponsorship: "W&RSETA Accredited Learnership Partner",
  industry: "Logistics, Warehousing & Retail",
  location: "City Deep, Johannesburg, Gauteng",
  contactEmail: "talent-pathways@massmart.co.za",
  contactPhone: "+27 11 517 0000",
  website: "https://www.massmart.co.za/careers",
  description:
    "Committed to creating verified youth pathways into warehouse logistics, inventory control, and store operations across southern Africa with evidence-backed candidate matching.",
};

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfileData>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(PROFILE_KEY);
        if (item) return { ...DEFAULT_EMPLOYER_PROFILE, ...JSON.parse(item) };
      } catch {
        // fallback
      }
    }
    return DEFAULT_EMPLOYER_PROFILE;
  });

  const [activePlanId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ACTIVE_PLAN_KEY) || "growth";
    }
    return "growth";
  });

  const [workplaces] = useState<EmployerPlace[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(WORKPLACES_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(VERIFICATION_KEY);
      if (stored !== null) return stored === "true";
    }
    return false; // defaults to unverified so alert banner shows
  });

  const [activeTab, setActiveTab] = useState<"enterprise" | "compliance">(
    "enterprise",
  );
  const [saved, setSaved] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleToggleVerification = () => {
    const next = !isVerified;
    setIsVerified(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFICATION_KEY, String(next));
    }
    toast.success(
      next
        ? "Employer verification active!"
        : "Employer verification disabled.",
    );
    setShowVerifyModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    setSaved(true);
    toast.success("Employer profile saved successfully!");
    setTimeout(() => setSaved(false), 3000);
  };

  const planName =
    activePlanId === "starter"
      ? "Starter Plan (R499/mo)"
      : activePlanId === "enterprise"
        ? "Enterprise Partner"
        : "Growth Plan (R1,499/mo)";

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12 pt-6 px-4 md:px-8 max-w-4xl mx-auto font-body">
      {/* ─── Unverified Alert Banner ─── */}
      {!isVerified && (
        <div className="mb-6 rounded-card border border-amber-500/30 bg-amber-500/10 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-heading font-semibold text-sm text-foreground">
                  Your Employer Account is Not Verified
                </p>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-bold text-amber-700">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete enterprise credential review to unlock AI shortlists,
                workplace tags, and candidate interviews.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowVerifyModal(true)}
            className="text-xs font-semibold shrink-0 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
          >
            <ShieldCheck className="size-4 mr-1.5" />
            Start Verification
          </Button>
        </div>
      )}

      {/* ─── Back to Dashboard ─── */}
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/dashboard/employer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
        <Link
          href="/dashboard/employer/place"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Building2 className="size-4 mr-1.5" /> Workplaces (
          {workplaces.length || 1})
        </Link>
      </div>

      {/* ─── Profile Header with Badge ─── */}
      <div className="bg-card rounded-card border border-border shadow-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-brand-deep text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lift shrink-0">
              {profile.companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {profile.companyName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldCheck className="size-3.5" />
                    Verified Employer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldAlert className="size-3.5" />
                    Pending Verification
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-semibold">
                  <Crown className="size-3.5" />
                  {planName.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{profile.industry}</span>
                <span>•</span>
                <span>{profile.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isVerified ? "outline" : "default"}
              onClick={() => setShowVerifyModal(true)}
              className="text-xs font-semibold"
            >
              <ShieldCheck className="size-3.5 mr-1" />
              {isVerified ? "Verified Status" : "Verify Profile"}
            </Button>
            <Link
              href="/pricing/employer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <CreditCard className="size-3.5 mr-1.5" /> Manage Subscription
            </Link>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-primary">
              2
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active Roles
            </p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              12
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Candidates Shortlisted
            </p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              {workplaces.length || 1}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Hiring Facilities
            </p>
          </div>
        </div>
      </div>

      {/* ─── Plan & Subscription Banner Link ─── */}
      <div className="mb-6 bg-card rounded-card border border-border shadow-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-semibold text-sm text-foreground">
                Employer Subscription: {planName}
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                Active Tier
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Includes candidate shortlists, verified skill badges, and taxi
              voucher tracking.
            </p>
          </div>
        </div>
        <Link
          href="/pricing/employer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <span>Change Plan</span>
          <ExternalLink className="size-3.5 ml-1.5" />
        </Link>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("enterprise")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "enterprise"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Company Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("compliance")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "compliance"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          B-BBEE &amp; SETA Accreditation
        </button>
      </div>

      {/* ─── TAB 1: COMPANY INFORMATION ─── */}
      {activeTab === "enterprise" && (
        <form
          onSubmit={handleSave}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Enterprise &amp; Brand Details
              </h3>
              <p className="text-xs text-muted-foreground">
                Company branding displayed across youth opportunity listings.
              </p>
            </div>
            {saved && (
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Check className="size-3.5" /> Company profile saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">Enterprise / Brand Name</Label>
              <Input
                id="companyName"
                required
                value={profile.companyName}
                onChange={(e) =>
                  setProfile({ ...profile, companyName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="industry">Industry / Sector</Label>
              <Input
                id="industry"
                required
                value={profile.industry}
                onChange={(e) =>
                  setProfile({ ...profile, industry: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Headquarters / Main Facility</Label>
              <Input
                id="location"
                required
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Careers Portal / Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Talent Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                required
                value={profile.contactEmail}
                onChange={(e) =>
                  setProfile({ ...profile, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Talent Desk Phone</Label>
              <Input
                id="contactPhone"
                value={profile.contactPhone}
                onChange={(e) =>
                  setProfile({ ...profile, contactPhone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc">
              About the Company &amp; Youth Opportunities
            </Label>
            <Textarea
              id="desc"
              rows={3}
              value={profile.description}
              onChange={(e) =>
                setProfile({ ...profile, description: e.target.value })
              }
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">
              Saves locally in browser
            </span>
            <Button type="submit" className="font-semibold text-xs">
              Save Company Profile
            </Button>
          </div>
        </form>
      )}

      {/* ─── TAB 2: B-BBEE & SETA COMPLIANCE ─── */}
      {activeTab === "compliance" && (
        <form
          onSubmit={handleSave}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                B-BBEE Scorecard &amp; SETA Learnership Compliance
              </h3>
              <p className="text-xs text-muted-foreground">
                Track youth learnership tax incentives (Section 12H) and skills
                development points.
              </p>
            </div>
            <Award className="size-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="regNum">CIPC Company Registration Number</Label>
              <Input
                id="regNum"
                value={profile.registrationNumber}
                onChange={(e) =>
                  setProfile({ ...profile, registrationNumber: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bbbee">B-BBEE Status Rating</Label>
              <Input
                id="bbbee"
                value={profile.bbbeeLevel}
                onChange={(e) =>
                  setProfile({ ...profile, bbbeeLevel: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seta">SETA Association / Accredited Partner</Label>
            <Input
              id="seta"
              value={profile.setaSponsorship}
              onChange={(e) =>
                setProfile({ ...profile, setaSponsorship: e.target.value })
              }
              placeholder="e.g. W&RSETA, MerSETA, Services SETA..."
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">
              Generates verifiable audit export
            </span>
            <Button type="submit" className="font-semibold text-xs">
              Save Compliance Credentials
            </Button>
          </div>
        </form>
      )}

      {/* ─── MODAL: EMPLOYER VERIFICATION ─── */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <ShieldCheck className="size-6" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              Employer Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Verify your company registration and learnership accreditation to
              attract pre-vetted youth candidates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-btn bg-muted/50 border border-border space-y-1">
              <p className="font-semibold text-foreground">
                Verified Employers Receive:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>
                    Official green verified shield on all job opportunities
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>
                    Access to youth with demonstrated practical skills
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>
                    Automated interview scheduling and candidate shortlists
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowVerifyModal(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleToggleVerification}
              className="text-xs font-semibold bg-brand-deep text-white shadow-xs"
            >
              {isVerified ? "Disable Badge" : "Confirm Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
