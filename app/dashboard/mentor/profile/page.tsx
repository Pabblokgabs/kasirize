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
import { useLiveUserData } from "@/hooks/queries";
import { getStoredAuthUser } from "@/lib/auth";
import { useKasirizeStore } from "@/store/kasirize-store";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  ExternalLink,
  Percent,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "kasirize_mentor_profile";
const REVENUE_SETTINGS_KEY = "kasirize_mentor_revenue_settings";
const VERIFICATION_KEY = "kasirize_mentor_verified_badge";

interface MentorProfileData {
  fullName: string;
  roleTitle: string;
  organization: string;
  location: string;
  bio: string;
  specialties: string;
  hourlyRateRands: number;
  accreditationBody: string;
  yearsExperience: number;
  contactEmail: string;
  contactPhone: string;
}

const DEFAULT_MENTOR_PROFILE: MentorProfileData = {
  fullName: "Bongani Sithole",
  roleTitle: "Master Electrician & Red Seal Artisan",
  organization: "Soweto Artisan Guild",
  location: "Orlando East, Soweto",
  bio: "Over 18 years mentoring apprentice electricians across Gauteng townships. Passionate about practical DB boards, single-phase wiring, fault finding, and solar installations.",
  specialties: "Single-phase wiring, DB boards, Solar PV installation, Safety compliance",
  hourlyRateRands: 200,
  accreditationBody: "Red Seal Artisan (Department of Higher Education & NAMB)",
  yearsExperience: 18,
  contactEmail: "bongani@sowetoartisan.org.za",
  contactPhone: "+27 83 492 1044",
};

interface BankingData {
  bankName: string;
  accountNumber: string;
  branchCode: string;
  payoutMethod: "bank" | "voucher";
}

const DEFAULT_BANKING: BankingData = {
  bankName: "Standard Bank",
  accountNumber: "10192849201",
  branchCode: "051001",
  payoutMethod: "bank",
};

export default function MentorProfilePage() {
  const authUserFromStore = useKasirizeStore((state) => state.authUser);
  const authUser = authUserFromStore || getStoredAuthUser();
  const activeEmail = authUser?.email || "bongani@sowetoartisan.org.za";

  const { data: liveData } = useLiveUserData(activeEmail);

  const [profile, setProfile] = useState<MentorProfileData>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) return { ...DEFAULT_MENTOR_PROFILE, ...JSON.parse(item) };
      } catch {
        // fallback
      }
    }
    return DEFAULT_MENTOR_PROFILE;
  });

  // Sync profile with currently logged in mentor / Neon live data
  useEffect(() => {
    if (liveData?.user || authUser) {
      const u = liveData?.user || authUser;
      setProfile((prev) => ({
        ...prev,
        fullName: u?.name || prev.fullName,
        contactEmail: u?.email || prev.contactEmail,
        location: u?.location || prev.location,
        bio: u?.bio || prev.bio,
      }));
      if (liveData?.user?.isVerifiedBadge !== undefined) {
        setIsVerified(Boolean(liveData.user.isVerifiedBadge));
      }
    }
  }, [liveData, authUser]);

  const [banking, setBanking] = useState<BankingData>(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(REVENUE_SETTINGS_KEY);
        if (item) return { ...DEFAULT_BANKING, ...JSON.parse(item) };
      } catch {
        // fallback
      }
    }
    return DEFAULT_BANKING;
  });

  const [activeTab, setActiveTab] = useState<"credentials" | "rates" | "payouts">("credentials");
  const [saved, setSaved] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(VERIFICATION_KEY);
      if (stored !== null) return stored === "true";
    }
    return false; // defaults to unverified so alert banner shows
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleToggleVerification = () => {
    const next = !isVerified;
    setIsVerified(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFICATION_KEY, String(next));
    }
    toast.success(next ? "Mentor credential verification active!" : "Mentor verification disabled.");
    setShowVerifyModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(REVENUE_SETTINGS_KEY, JSON.stringify(banking));
    }
    setSaved(true);
    toast.success("Mentor profile saved successfully!");
    setTimeout(() => setSaved(false), 3000);
  };

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
                  Your Mentor Credentials Are Not Verified
                </p>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-bold text-amber-700">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submit trade papers or Red Seal qualification to endorse credible youth CV skills and accept paid coaching bookings.
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
          href="/dashboard/mentor"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
        <Link
          href="/dashboard/mentor/create-mentorship"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Plus className="size-4 mr-1.5" /> Host Workshop
        </Link>
      </div>

      {/* ─── Profile Header with Avatar & Accreditation ─── */}
      <div className="bg-card rounded-card border border-border shadow-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-brand-deep text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lift shrink-0">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {profile.fullName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldCheck className="size-3.5" />
                    Red Seal Certified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldAlert className="size-3.5" />
                    Pending Verification
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-semibold">
                  <Star className="size-3.5 text-amber-500 fill-amber-500" />
                  Master Mentor
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{profile.roleTitle}</span>
                <span>•</span>
                <span>{profile.organization}</span>
              </p>
            </div>
          </div>

          <Link
            href="/pricing/mentor"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <CreditCard className="size-3.5 mr-1.5" /> Mentor Rates (12% Fee)
          </Link>
        </div>

        {/* Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-primary">4</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active Mentees</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">28</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Skills Endorsed</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-600">
              {profile.yearsExperience} yrs
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Trade Experience</p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              R {profile.hourlyRateRands}/hr
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Base Coaching Rate</p>
          </div>
        </div>
      </div>

      {/* ─── Pricing Link Banner ─── */}
      <div className="mb-6 bg-card rounded-card border border-border shadow-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-semibold text-sm text-foreground">
                Mentor Monetisation &amp; Platform Fees
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                12% Platform Fee
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Free basic profile, featured listing upgrade (R149/mo), and 12% fee only on paid sessions.
            </p>
          </div>
        </div>
        <Link
          href="/pricing/mentor"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <span>View Rates &amp; Upgrades</span>
          <ExternalLink className="size-3.5 ml-1.5" />
        </Link>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("credentials")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "credentials"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Artisan Credentials
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "rates"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Session Rates &amp; Bookings
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payouts")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "payouts"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Banking &amp; Revenue
        </button>
      </div>

      {/* ─── TAB 1: ARTISAN CREDENTIALS ─── */}
      {activeTab === "credentials" && (
        <form
          onSubmit={handleSave}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Artisan Profile &amp; Verification
              </h3>
              <p className="text-xs text-muted-foreground">
                Your credentials give youth credible, employer-accepted skill verifications.
              </p>
            </div>
            {saved && (
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Check className="size-3.5" /> Profile saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name &amp; Honorific</Label>
              <Input
                id="fullName"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roleTitle">Professional Title</Label>
              <Input
                id="roleTitle"
                required
                value={profile.roleTitle}
                onChange={(e) => setProfile({ ...profile, roleTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="org">Guild / Association / Employer</Label>
              <Input
                id="org"
                required
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accreditation">Accreditation / Trade Certificate</Label>
              <Input
                id="accreditation"
                value={profile.accreditationBody}
                onChange={(e) => setProfile({ ...profile, accreditationBody: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Base Location</Label>
              <Input
                id="location"
                required
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experience">Years of Trade Practice</Label>
              <Input
                id="experience"
                type="number"
                min="1"
                value={profile.yearsExperience}
                onChange={(e) => setProfile({ ...profile, yearsExperience: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialties">Specialties &amp; Skill Tracks (comma separated)</Label>
            <Input
              id="specialties"
              value={profile.specialties}
              onChange={(e) => setProfile({ ...profile, specialties: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Mentor Bio &amp; Philosophy</Label>
            <Textarea
              id="bio"
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">Stored locally on this device</span>
            <Button type="submit" className="font-semibold text-xs">
              Save Mentor Profile
            </Button>
          </div>
        </form>
      )}

      {/* ─── TAB 2: RATES & REVENUE ─── */}
      {activeTab === "rates" && (
        <form
          onSubmit={handleSave}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Coaching Fees &amp; 12% Revenue Share
              </h3>
              <p className="text-xs text-muted-foreground">
                Set transparent pricing for 1-on-1 practical coaching and workshop admissions.
              </p>
            </div>
            <Percent className="size-5 text-emerald-600" />
          </div>

          <div className="p-4 rounded-card bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span className="font-semibold text-sm text-foreground">12% Transparent Platform Fee</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When youth book a session at your rate of <strong>R{profile.hourlyRateRands}</strong>, you take home <strong>R{(profile.hourlyRateRands * 0.88).toFixed(0)}</strong> directly to your bank account. Kasirize retains 12% (R{(profile.hourlyRateRands * 0.12).toFixed(0)}) to fund escrow safety, apprentice insurance, and digital CV credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">1-on-1 Hourly Rate (ZAR)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="25"
                value={profile.hourlyRateRands}
                onChange={(e) => setProfile({ ...profile, hourlyRateRands: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="takeHome">Your Net Earnings Per Session</Label>
              <Input
                id="takeHome"
                disabled
                value={`R ${(profile.hourlyRateRands * 0.88).toFixed(0)} (After 12% fee)`}
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">Applies to all scheduled youth sessions</span>
            <Button type="submit" className="font-semibold text-xs">
              Save Coaching Rates
            </Button>
          </div>
        </form>
      )}

      {/* ─── TAB 3: BANKING & SETTLEMENT ─── */}
      {activeTab === "payouts" && (
        <form
          onSubmit={handleSave}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Mentor Earnings Settlement Account
              </h3>
              <p className="text-xs text-muted-foreground">
                Bank account where completed mentorship payouts are disbursed.
              </p>
            </div>
            <Coins className="size-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bankName">South African Bank</Label>
              <select
                id="bankName"
                value={banking.bankName}
                onChange={(e) => setBanking({ ...banking, bankName: e.target.value })}
                className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Standard Bank">Standard Bank</option>
                <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                <option value="Capitec Bank">Capitec Bank</option>
                <option value="Nedbank">Nedbank</option>
                <option value="Absa Bank">Absa Bank</option>
                <option value="TymeBank">TymeBank</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input
                id="branchCode"
                required
                value={banking.branchCode}
                onChange={(e) => setBanking({ ...banking, branchCode: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accNum">Account Number</Label>
            <Input
              id="accNum"
              required
              value={banking.accountNumber}
              onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">Settled within 2 hours of session completion</span>
            <Button type="submit" className="font-semibold text-xs">
              Save Settlement Details
            </Button>
          </div>
        </form>
      )}

      {/* ─── MODAL: MENTOR VERIFICATION ─── */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <ShieldCheck className="size-6" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              Skill Mentor Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Verify your trade credentials or Red Seal papers so that youth receive employer-recognized skill endorsements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-btn bg-muted/50 border border-border space-y-1">
              <p className="font-semibold text-foreground">Verification Benefits:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>Gold Red Seal badge on your mentor profile &amp; workshops</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>Authorize employer-accepted platform CV endorsements</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>Host paid 1-on-1 practical apprenticeship sessions</span>
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
