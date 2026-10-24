"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveStoredRole } from "@/lib/store";
import { UserRole } from "@/types";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-hot-toast";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const [role, setRole] = useState<UserRole>(() => {
    if (initialRoleParam === "requester") return "role-requester";
    if (initialRoleParam === "employer") return "role-employer";
    if (initialRoleParam === "mentor") return "role-mentor";
    return "role-requester";
  });

  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    location: "Johannesburg, Gauteng",
    details: "",
    termsAccepted: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.email) {
      toast.error("Please fill in required fields.");
      return;
    }

    saveStoredRole(role);
    toast.success("Welcome aboard! Role confirmed.");

    if (role === "role-requester") {
      router.push("/dashboard/requester");
    } else if (role === "role-employer") {
      router.push("/dashboard/employer");
    } else if (role === "role-mentor") {
      router.push("/dashboard/mentor");
    } else {
      router.push("/dashboard/user");
    }
  };

  const getRoleMeta = () => {
    switch (role) {
      case "role-requester":
        return {
          title: "Join as Task Requester",
          badge: "Households, Spaza Shops & Community Orgs",
          icon: Users,
          fieldOrgLabel: "Business, Household or Shop Name",
          fieldDetailsLabel: "What kind of help do you usually need?",
          fieldDetailsPlaceholder:
            "e.g. Weekend stock counting, loading deliveries, packing orders, event setup",
          benefit1: "Post short tasks with clear budgets & deadlines",
          benefit2: "Connect directly with verified local young talent",
          benefit3: "Rate performance and issue verified task badges",
        };
      case "role-employer":
        return {
          title: "Join as Employer",
          badge: "Companies, Franchises & SMEs",
          icon: Briefcase,
          fieldOrgLabel: "Company / Enterprise Name",
          fieldDetailsLabel: "What opportunities do you offer?",
          fieldDetailsPlaceholder:
            "e.g. Learnerships, entry-level retail associates, micro-internships, logistics",
          benefit1: "Filter candidates by transparent credibility scores",
          benefit2:
            "Fund interview transport credits to eliminate candidate friction",
          benefit3: "Hire based on practical evidence, not outdated CV formats",
        };
      case "role-mentor":
        return {
          title: "Join as Skill Mentor",
          badge: "Coaches, Community Leaders & Trainers",
          icon: GraduationCap,
          fieldOrgLabel: "Mentorship Program / Institution Name",
          fieldDetailsLabel: "What skills do you coach or verify?",
          fieldDetailsPlaceholder:
            "e.g. Retail stock auditing, smartphone diagnostic repair, hospitality basics",
          benefit1: "Deliver micro-workshops and practical training",
          benefit2:
            "Confirm youth competency milestones with tamper-proof status",
          benefit3: "Track mentees from initial learning to paid employment",
        };
      default:
        return {
          title: "Get Started on Kasirize",
          badge: "Community Access",
          icon: Sparkles,
          fieldOrgLabel: "Name / Organization",
          fieldDetailsLabel: "Description",
          fieldDetailsPlaceholder: "",
          benefit1: "Transparent credibility",
          benefit2: "Direct opportunities",
          benefit3: "Community support",
        };
    }
  };

  const meta = getRoleMeta();
  const IconComponent = meta.icon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-heading font-bold text-foreground">
              Kasirize
            </span>
          </Link>

          {/* Role switcher pills */}
          <div className="flex items-center gap-1.5 p-1 bg-muted rounded-full text-xs">
            <button
              type="button"
              onClick={() => setRole("role-requester")}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                role === "role-requester"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Requester
            </button>
            <button
              type="button"
              onClick={() => setRole("role-employer")}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                role === "role-employer"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Employer
            </button>
            <button
              type="button"
              onClick={() => setRole("role-mentor")}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                role === "role-mentor"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mentor
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
          {/* Left: Role Value Proposition */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                <IconComponent className="size-3.5" />
                <span>{meta.badge}</span>
              </div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">
                {meta.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join Kasirize to shorten the distance between young South
                Africans and meaningful economic activity.
              </p>
            </div>

            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Why partner through Kasirize
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{meta.benefit1}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{meta.benefit2}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                  <span>{meta.benefit3}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-card bg-muted/60 border border-border flex items-start gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-foreground block">
                  Safe & Verified Ecosystem
                </strong>
                All requester, employer, and mentor accounts undergo
                verification to ensure safe work environments for young people.
              </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-card bg-card border border-border shadow-card space-y-4"
          >
            <div>
              <Label
                htmlFor="orgName"
                className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
              >
                {meta.fieldOrgLabel} *
              </Label>
              <Input
                id="orgName"
                type="text"
                required
                placeholder="e.g. Phiri Corner Stores / Ubuntu Tech Hub"
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                className="w-full bg-background"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="contactPerson"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
                >
                  Contact Person *
                </Label>
                <Input
                  id="contactPerson"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  className="w-full bg-background"
                />
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
                >
                  Location (City / Town)
                </Label>
                <Input
                  id="location"
                  type="text"
                  required
                  placeholder="e.g. Soweto, Gauteng"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="contact@domain.co.za"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-background"
                />
              </div>

              <div>
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
                >
                  Phone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="082 123 4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-background"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="details"
                className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 block"
              >
                {meta.fieldDetailsLabel}
              </Label>
              <Textarea
                id="details"
                rows={3}
                placeholder={meta.fieldDetailsPlaceholder}
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                className="w-full bg-background resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>Complete Onboarding & Enter Dashboard</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
