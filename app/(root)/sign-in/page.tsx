"use client";

import { ROLE_CONFIGS, UserRole } from "@/constants/roles";
import { DEMO_ACCOUNTS, saveStoredAuthUser } from "@/lib/auth";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  ShieldAlert,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [activeTab, setActiveTab] = useState<"quick" | "manual">("quick");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("role-user");
  const [isGuest, setIsGuest] = useState(false);
  const [name, setName] = useState("");

  const handleInstantLogin = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    saveStoredAuthUser({
      id: `usr_${acc.role.replace("role-", "")}_${acc.email.split("@")[0].replace(/[^a-z0-9]/g, "_")}`,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      isGuest: acc.isGuest ?? false,
      location: acc.description.split("•")[0]?.trim() || "Gauteng",
    });

    toast.success(
      acc.isGuest
        ? `Logged in as ${acc.name} (Guest Mode - View Only)`
        : `Logged in as ${acc.name} (${acc.roleLabel})`,
    );

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push(ROLE_CONFIGS[acc.role].dashboardUrl);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanId = cleanEmail.replace(/[^a-z0-9]/g, "_");
    const userName = name.trim() || email.split("@")[0];
    saveStoredAuthUser({
      id: `usr_custom_${cleanId}`,
      name: userName,
      email: cleanEmail,
      role,
      isGuest,
      location: "South Africa",
    });

    toast.success(
      isGuest
        ? `Logged in as ${userName} (Guest Account - Read Only)`
        : `Welcome, ${userName}! Logged in as ${ROLE_CONFIGS[role].name}.`,
    );

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push(ROLE_CONFIGS[role].dashboardUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── Top Brand Header ─── */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <span className="font-heading">K</span>
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-foreground block leading-none">
                Kasirize
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Access Portal
              </span>
            </div>
          </Link>

          <Link
            href="/sign-up"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Create an Account <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full">
          {/* Card Wrapper */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="text-center max-w-lg mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Sparkles className="size-3.5" />
                <span>Instant Hackathon Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                Sign in to Kasirize
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                No OTP or password friction. Choose a verified or guest persona below, or sign in directly with any email.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-muted p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("quick")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "quick"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                1-Click Persona Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "manual"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In with Any Email
              </button>
            </div>

            {activeTab === "quick" ? (
              /* ─── 1-Click Persona Grid ─── */
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select a test user persona:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const getIcon = () => {
                      if (acc.role === "role-user") return User;
                      if (acc.role === "role-employer") return Briefcase;
                      if (acc.role === "role-requester") return Users;
                      if (acc.role === "role-mentor") return GraduationCap;
                      return ShieldAlert;
                    };
                    const Icon = getIcon();

                    return (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => handleInstantLogin(acc)}
                        className={`flex flex-col text-left p-4 rounded-2xl border transition-all group cursor-pointer ${
                          acc.isGuest
                            ? "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60"
                            : "border-border bg-card hover:bg-muted/50 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
                                acc.isGuest
                                  ? "bg-amber-500/20 text-amber-700"
                                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                              }`}
                            >
                              <Icon className="size-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-foreground block leading-tight">
                                {acc.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {acc.roleLabel}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              acc.isGuest
                                ? "bg-amber-100 text-amber-800"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {acc.isGuest ? "Guest" : "Verified"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {acc.description}
                        </p>
                        <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-primary">
                          <span>Sign in as {acc.roleLabel}</span>
                          <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ─── Manual Email Form ─── */
              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email-input"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. you@example.co.za"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Your Full Name (Optional)
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kagiso Sithole"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Select Your Role Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { roleKey: "role-user", label: "Youth Candidate", icon: User },
                        { roleKey: "role-employer", label: "Employer", icon: Briefcase },
                        { roleKey: "role-requester", label: "Task Requester", icon: Users },
                        { roleKey: "role-mentor", label: "Skill Mentor", icon: GraduationCap },
                      ] as const
                    ).map(({ roleKey, label, icon: RoleIcon }) => (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => setRole(roleKey)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          role === roleKey
                            ? "border-primary bg-primary/10 text-foreground font-bold shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <RoleIcon className={`size-4 ${role === roleKey ? "text-primary" : ""}`} />
                        <span className="text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="guest-toggle"
                    type="checkbox"
                    checked={isGuest}
                    onChange={(e) => setIsGuest(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="guest-toggle" className="text-xs text-muted-foreground">
                    Sign in as <span className="font-semibold text-foreground">Guest User</span> (view-only authorization mode)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm mt-4 cursor-pointer"
                >
                  <KeyRound className="size-4" />
                  <span>Enter Dashboard Directly</span>
                </button>
              </form>
            )}

            {/* Explainer Notice */}
            <div className="mt-6 pt-5 border-t border-border flex items-start gap-2.5 text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <span className="font-semibold text-foreground">Authorization Rules:</span> Verified accounts enjoy complete functionality (applying to jobs, accepting tasks, chatting). Guest accounts have read access to test role-based guard rails.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs">
          Loading sign-in portal...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
