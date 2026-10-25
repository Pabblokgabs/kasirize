"use client";

import { ROLE_CONFIGS } from "@/constants/roles";
import { saveStoredAuthUser } from "@/lib/auth";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

type OrgRole = "role-employer" | "role-requester" | "role-mentor";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");

  const [role, setRole] = useState<OrgRole>(() => {
    if (initialRole === "employer") return "role-employer";
    if (initialRole === "mentor") return "role-mentor";
    return "role-requester";
  });

  const [orgName, setOrgName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Johannesburg, Gauteng");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !email.trim()) {
      toast.error("Please fill in Organization Name and Email.");
      return;
    }

    const displayName = contactPerson.trim() || orgName.trim();

    const cleanEmail = email.trim().toLowerCase();
    const cleanId = cleanEmail.replace(/[^a-z0-9]/g, "_");

    saveStoredAuthUser({
      id: `usr_${role.replace("role-", "")}_${cleanId}`,
      name: displayName,
      email: cleanEmail,
      role,
      location,
    });

    toast.success(`Account registered! Welcome to the ${ROLE_CONFIGS[role].name} portal.`);
    router.push(ROLE_CONFIGS[role].dashboardUrl);
  };

  const getRoleInfo = (r: OrgRole) => {
    switch (r) {
      case "role-employer":
        return {
          title: "Employer / Enterprise",
          desc: "Post learnerships, internships, and jobs with interview transport vouchers.",
          icon: Briefcase,
        };
      case "role-requester":
        return {
          title: "Task Requester",
          desc: "Spaza shops, community projects, and businesses posting paid micro-tasks.",
          icon: Users,
        };
      case "role-mentor":
        return {
          title: "Skill Mentor",
          desc: "Training institutions, coaches, and industry mentors endorsing youth skills.",
          icon: GraduationCap,
        };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── Header ─── */}
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
                Partner Registration
              </span>
            </div>
          </Link>

          <Link
            href="/sign-in"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Already have an account? Sign In <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl w-full">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* Header info */}
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Sparkles className="size-3.5" />
                <span>Organizations & Partners</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                For Employers, Task Requesters & Mentors. Youth sign up directly via our free{" "}
                <Link href="/build-profile" className="text-primary font-semibold hover:underline">
                  Profile Builder
                </Link>
                .
              </p>
            </div>

            {/* Role Switcher */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-foreground mb-2">
                Select Your Partner Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["role-requester", "role-employer", "role-mentor"] as const).map((r) => {
                  const info = getRoleInfo(r);
                  const Icon = info.icon;
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-foreground font-bold shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className={`size-5 mb-1.5 ${isSelected ? "text-primary" : ""}`} />
                      <span className="text-xs leading-tight font-semibold">{info.title.split("/")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Business / Household / Institution Name *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Innovate Logistics SA or Sipho's Spaza"
                  required
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Themba Ndaba"
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.co.za"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="071 234 5678"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Operating Location (Town / Province)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Soweto, Gauteng"
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md mt-6 cursor-pointer"
              >
                <span>Register & Open Dashboard</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Instant activation enabled. No email confirmation required.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs">
          Loading sign-up portal...
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}

