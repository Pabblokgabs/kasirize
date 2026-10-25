"use client";

import { RequesterPlace } from "@/app/dashboard/requester/place/page";
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
import { ROLE_STORAGE_KEY } from "@/constants/roles";
import { useLiveUserData } from "@/hooks/queries";
import { getStoredAuthUser } from "@/lib/auth";
import { useKasirizeStore } from "@/store/kasirize-store";
import {
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  LogOut,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const PROFILE_KEY = "kasirize_requester_profile";
const VERIFICATION_KEY = "kasirize_requester_verified_badge";
const PAYMENT_SETTINGS_KEY = "kasirize_requester_payment_settings";
const PLACES_KEY = "kasirize_requester_business_places";

interface BusinessProfile {
  businessName: string;
  ownerName: string;
  businessType: string;
  phone: string;
  email: string;
  cipcRegistrationNumber: string;
  taxNumber: string;
  bio: string;
  payoutEscrowPreference: "automatic" | "manual_review";
  emergencyContact: string;
}

const DEFAULT_PROFILE: BusinessProfile = {
  businessName: "Lindiwe Mini Market & Spaza",
  ownerName: "Lindiwe Mazibuko",
  businessType: "spaza_shop",
  phone: "+27 82 555 4920",
  email: "lindiwe@minimarket.co.za",
  cipcRegistrationNumber: "2023/849201/07",
  taxNumber: "9482019482",
  bio: "Community-rooted retail and essentials store supporting youth skills in stock management, cashiering, and customer service in Soweto.",
  payoutEscrowPreference: "automatic",
  emergencyContact: "+27 11 982 4000 (Local CPF)",
};

interface PaymentSettings {
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: "cheque" | "savings";
  autoTopUpVouchers: boolean;
}

const DEFAULT_PAYMENTS: PaymentSettings = {
  bankName: "First National Bank (FNB)",
  accountNumber: "62849201948",
  branchCode: "250655",
  accountType: "cheque",
  autoTopUpVouchers: true,
};

export default function RequesterProfilePage() {
  const router = useRouter();
  const authUserFromStore = useKasirizeStore((state) => state.authUser);
  const authUser = authUserFromStore || getStoredAuthUser();
  const activeEmail = authUser?.email || "sipho@kasirize.org.za";

  const { data: liveData } = useLiveUserData(activeEmail);

  const [profile, setProfile] = useState<BusinessProfile>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROFILE;
  });

  // Sync profile with currently logged in requester / Neon live data
  useEffect(() => {
    if (liveData?.user || authUser) {
      const u = liveData?.user || authUser;
      setProfile((prev) => ({
        ...prev,
        ownerName: u?.name || prev.ownerName,
        email: u?.email || prev.email,
        bio: u?.bio || prev.bio,
      }));
      if (liveData?.user?.isVerifiedBadge !== undefined) {
        setIsVerified(Boolean(liveData.user.isVerifiedBadge));
      }
    }
  }, [liveData, authUser]);

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(PAYMENT_SETTINGS_KEY);
          if (raw) return { ...DEFAULT_PAYMENTS, ...JSON.parse(raw) };
        } catch {
          // fallback
        }
      }
      return DEFAULT_PAYMENTS;
    },
  );

  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(VERIFICATION_KEY);
      if (stored !== null) return stored === "true";
    }
    return false; // defaults to unverified so banner shows for new/unverified accounts
  });

  const [registeredPlaces] = useState<RequesterPlace[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(PLACES_KEY);
        if (raw) return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "verification" | "payouts"
  >("profile");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    toast.success("Business profile saved successfully!");
    setSavedNotice("Profile updated.");
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        PAYMENT_SETTINGS_KEY,
        JSON.stringify(paymentSettings),
      );
    }
    toast.success("Escrow & payment banking details saved!");
    setSavedNotice("Banking details updated.");
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleToggleVerifiedBadge = () => {
    const next = !isVerified;
    setIsVerified(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFICATION_KEY, String(next));
    }
    toast.success(
      next ? "Verified Requester badge activated!" : "Verified badge disabled.",
    );
    setShowVerifyModal(false);
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
                  Your Requester Account is Not Verified
                </p>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-bold text-amber-700">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified businesses receive 3.4x more verified youth
                applications and priority neighbourhood matching.
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

      {/* ─── Profile Header with Avatar & Badge ─── */}
      <div className="bg-card rounded-card border border-border shadow-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-brand-deep text-white flex items-center justify-center font-heading font-bold text-2xl shadow-lift shrink-0">
              {profile.businessName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {profile.businessName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldCheck className="size-3.5" />
                    Verified Requester
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldAlert className="size-3.5" />
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>Managed by {profile.ownerName}</span>
                <span>•</span>
                <span className="capitalize">
                  {profile.businessType.replace("_", " ")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant={isVerified ? "outline" : "default"}
              onClick={() => setShowVerifyModal(true)}
              className="text-xs font-semibold w-full sm:w-auto"
            >
              <Shield className="size-3.5 mr-1.5" />
              {isVerified ? "Manage Verification" : "Get Verified Badge"}
            </Button>
          </div>
        </div>

        {/* Overview Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-primary">
              14
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tasks Completed
            </p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              100%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Escrow Release
            </p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-amber-500">
              4.9 ★
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Youth Trust Rating
            </p>
          </div>
          <div className="p-3 bg-muted/40 rounded-btn text-center">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              {registeredPlaces.length || 1}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Active Places
            </p>
          </div>
        </div>
      </div>

      {/* ─── Pricing & Rate Card Banner ─── */}
      <div className="mb-6 bg-card rounded-card border border-border shadow-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-semibold text-sm text-foreground">
                Task Services, Add-ons & Rate Card
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                First Task Free
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Additional tasks R30, verified requester badge R99/mo, and
              priority matching R149/mo.
            </p>
          </div>
        </div>
        <Link
          href="/pricing/requester"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <span>View Rate Card</span>
          <ExternalLink className="size-3.5 ml-1.5" />
        </Link>
      </div>

      {/* ─── Profile Navigation Tabs ─── */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "profile"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Business Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("verification")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
            activeTab === "verification"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Compliance &amp; Badges
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
          Escrow &amp; Banking
        </button>
      </div>

      {/* ─── TAB 1: BUSINESS PROFILE ─── */}
      {activeTab === "profile" && (
        <>
          <form
            onSubmit={handleSaveProfile}
            className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">
                  Enterprise &amp; Store Information
                </h3>
                <p className="text-xs text-muted-foreground">
                  Visible to youth candidates when they review your posted
                  tasks.
                </p>
              </div>
              {savedNotice && (
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  <Check className="size-3.5" /> {savedNotice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessName">Business / Brand Name</Label>
                <Input
                  id="businessName"
                  required
                  value={profile.businessName}
                  onChange={(e) =>
                    setProfile({ ...profile, businessName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ownerName">Primary Contact / Owner Name</Label>
                <Input
                  id="ownerName"
                  required
                  value={profile.ownerName}
                  onChange={(e) =>
                    setProfile({ ...profile, ownerName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="businessType">Enterprise Category</Label>
                <select
                  id="businessType"
                  value={profile.businessType}
                  onChange={(e) =>
                    setProfile({ ...profile, businessType: e.target.value })
                  }
                  className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="spaza_shop">Spaza Shop / Corner Store</option>
                  <option value="small_business">
                    Small Retail / Local Bakery
                  </option>
                  <option value="household">Household Requester</option>
                  <option value="community_org">
                    Community Organization / NGO
                  </option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContact">
                  Emergency / CPF Contact
                </Label>
                <Input
                  id="emergencyContact"
                  placeholder="e.g. +27 11 982 4000 (Local CPF)"
                  value={profile.emergencyContact}
                  onChange={(e) =>
                    setProfile({ ...profile, emergencyContact: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone / WhatsApp Line</Label>
                <Input
                  id="phone"
                  required
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">
                About Your Business &amp; Work Environment
              </Label>
              <Textarea
                id="bio"
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Tell youth workers about your business expectations, safety values, and learning opportunities..."
              />
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-border">
              <span className="text-xs text-muted-foreground">
                Stored locally on this device
              </span>
              <Button type="submit" className="font-semibold text-xs">
                Save Profile Changes
              </Button>
            </div>
          </form>

          <Button
            variant="destructive"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem(ROLE_STORAGE_KEY);
                localStorage.removeItem("kasirize_auth_user");
              }
              router.push("/");
            }}
            className="flex-1 w-full md:hidden flex items-center  justify-center gap-2 mt-10"
          >
            <LogOut className="size-3.5" />
            <span>Log Out</span>
          </Button>
        </>
      )}

      {/* ─── TAB 2: COMPLIANCE & BADGES ─── */}
      {activeTab === "verification" && (
        <div className="space-y-5 bg-card rounded-card border border-border shadow-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Trust &amp; Verification Badges
              </h3>
              <p className="text-xs text-muted-foreground">
                Verified requesters attract 3.4x more verified youth applicants.
              </p>
            </div>
            {isVerified ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                Badge Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                Unverified
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-btn border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <h4 className="font-semibold text-sm text-foreground">
                  CIPC / Informal Trading Permit
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Registration:{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">
                  {profile.cipcRegistrationNumber || "Not recorded"}
                </code>
              </p>
              <p className="text-xs text-muted-foreground">
                Confirms your business operates legally within the municipal
                ward boundaries.
              </p>
            </div>

            <div className="p-4 rounded-btn border border-border bg-muted/30 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="size-5 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">
                  100% Escrow Guarantee
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Zero payment disputes on record. Youth are assured tasks are
                pre-funded safely before arrival.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-card bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                <span>Verified Requester Badge (R99/mo)</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Displays the verified shield on your tasks and unlocks priority
                push notifications to top-rated youth in your ward.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleToggleVerifiedBadge}
              className="text-xs font-semibold shrink-0"
              variant={isVerified ? "outline" : "default"}
            >
              {isVerified ? "Disable Badge" : "Activate Badge"}
            </Button>
          </div>
        </div>
      )}

      {/* ─── TAB 3: ESCROW & BANKING ─── */}
      {activeTab === "payouts" && (
        <form
          onSubmit={handleSavePaymentSettings}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Escrow Settlement &amp; Banking Details
              </h3>
              <p className="text-xs text-muted-foreground">
                South African bank account for escrow refunds and task payment
                settlements.
              </p>
            </div>
            <Banknote className="size-5 text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bankName">Bank Name</Label>
              <select
                id="bankName"
                value={paymentSettings.bankName}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    bankName: e.target.value,
                  })
                }
                className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="First National Bank (FNB)">
                  First National Bank (FNB)
                </option>
                <option value="Standard Bank">Standard Bank</option>
                <option value="Capitec Bank">Capitec Bank</option>
                <option value="Nedbank">Nedbank</option>
                <option value="Absa Bank">Absa Bank</option>
                <option value="TymeBank">TymeBank</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                value={paymentSettings.accountType}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    accountType: e.target.value as "cheque" | "savings",
                  })
                }
                className="w-full bg-background border border-input rounded-btn px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="cheque">Cheque / Current Account</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                required
                value={paymentSettings.accountNumber}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    accountNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input
                id="branchCode"
                required
                value={paymentSettings.branchCode}
                onChange={(e) =>
                  setPaymentSettings({
                    ...paymentSettings,
                    branchCode: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="p-4 rounded-btn bg-muted/40 border border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="autoRelease"
                className="text-sm font-semibold cursor-pointer"
              >
                Automatic Escrow Release on Task Sign-Off
              </Label>
              <p className="text-xs text-muted-foreground">
                Release funds automatically as soon as you confirm task
                satisfaction in the app.
              </p>
            </div>
            <input
              id="autoRelease"
              type="checkbox"
              checked={paymentSettings.autoTopUpVouchers}
              onChange={(e) =>
                setPaymentSettings({
                  ...paymentSettings,
                  autoTopUpVouchers: e.target.checked,
                })
              }
              className="size-4 rounded accent-primary cursor-pointer"
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-border">
            <span className="text-xs text-muted-foreground">
              Encrypted and stored in client storage
            </span>
            <Button type="submit" className="font-semibold text-xs">
              Save Banking Details
            </Button>
          </div>
        </form>
      )}

      {/* ─── MODAL: VERIFIED BADGE INFO ─── */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
              <ShieldCheck className="size-6" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              Verified Requester Badge
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Earn maximum trust from youth applicants with proof of business
              operations and guaranteed payment escrow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-btn bg-muted/50 border border-border space-y-1">
              <p className="font-semibold text-foreground">
                What verification provides:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>Green shield badge on all your task listings</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>
                    Priority notifications to top 10% highest-rated youth
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-600" />
                  <span>Reduced escrow dispute resolution window</span>
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
              onClick={handleToggleVerifiedBadge}
              className="text-xs font-semibold bg-brand-deep text-white shadow-xs"
            >
              {isVerified ? "Disable Badge" : "Confirm & Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
