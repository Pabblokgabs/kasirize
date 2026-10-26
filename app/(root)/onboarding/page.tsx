"use client";

import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

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

  const getRoleMeta = () => {
    switch (role) {
      case "role-requester":
        return {
          roleParam: "requester",
          title: "Join as Task Requester",
          badge: "Households, Spaza Shops & Community Orgs",
          icon: Users,
          benefit1: "Post short tasks with clear budgets & transport stipends",
          benefit2: "Connect directly with verified local young talent",
          benefit3: "Rate performance and issue verified task badges",
          desc: "Requester accounts require real registration to post tasks, fund escrows, and rate youth.",
        };
      case "role-employer":
        return {
          roleParam: "employer",
          title: "Join as an Employer",
          badge: "Township Businesses, Hubs & Enterprises",
          icon: Briefcase,
          benefit1: "Post entry-level jobs, learnerships & internships",
          benefit2: "Browse candidate pools with verified evidence",
          benefit3: "Sponsor interview taxi vouchers for shortlisted youth",
          desc: "Employer accounts require verified registration to publish opportunities and conduct hiring.",
        };
      case "role-mentor":
        return {
          roleParam: "mentor",
          title: "Join as a Skill Mentor",
          badge: "Training Providers, Coaches & Senior Mentors",
          icon: GraduationCap,
          benefit1: "Review candidate experience stories & practical portfolios",
          benefit2: "Endorse verified skills to boost hiring trust",
          benefit3: "Provide feedback and track youth career outcomes",
          desc: "Mentor accounts require registration to issue official endorsements and verify credentials.",
        };
      default:
        return {
          roleParam: "requester",
          title: "Join Kasirize",
          badge: "Verified Access",
          icon: Users,
          benefit1: "Township economic opportunities",
          benefit2: "Verified skills credibility",
          benefit3: "Direct community matches",
          desc: "Create an account to continue.",
        };
    }
  };

  const meta = getRoleMeta();
  const IconComponent = meta.icon;

  const handleContinueToSignUp = () => {
    router.push(`/sign-up?role=${meta.roleParam}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-heading font-bold text-foreground">
              Kasirize
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="text-xs font-semibold px-3 py-1.5 rounded-btn border border-border hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        {/* Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground mb-3">
            <Lock className="size-3.5 text-primary" />
            <span>Registration Required (No Guest Access)</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Get Started on Kasirize
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Employers, Task Requesters, and Mentors must register an account to interact with verified youth profiles, fund escrows, or issue endorsements.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-card bg-muted border border-border mb-8">
          <button
            type="button"
            onClick={() => setRole("role-requester")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-btn text-xs sm:text-sm font-semibold transition-all ${
              role === "role-requester"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Requester</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("role-employer")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-btn text-xs sm:text-sm font-semibold transition-all ${
              role === "role-employer"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="size-4" />
            <span>Employer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("role-mentor")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-btn text-xs sm:text-sm font-semibold transition-all ${
              role === "role-mentor"
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="size-4" />
            <span>Mentor</span>
          </button>
        </div>

        {/* Selected Role Card */}
        <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <IconComponent className="size-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                {meta.badge}
              </div>
              <h2 className="text-xl font-bold font-heading text-foreground">
                {meta.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {meta.desc}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              What you can do once registered:
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>{meta.benefit1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>{meta.benefit2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>{meta.benefit3}</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-muted border border-border flex items-start gap-3">
            <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-foreground block">
                Verification & Compliance Policy
              </span>
              <p className="text-muted-foreground">
                Unlike youth who can preview the platform as guests, organizational roles require account creation to guarantee trust, accountability, and secure payments.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              className="flex-1 h-11 text-base font-semibold"
              onClick={handleContinueToSignUp}
            >
              <span>Create {meta.title.replace("Join as ", "")} Account</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => router.push(`/sign-in?role=${meta.roleParam}`)}
            >
              Already Registered? Sign In
            </Button>
          </div>
        </div>

        {/* Youth alternative */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Looking for work, tasks, or taxi vouchers?{" "}
          <Link href="/build-profile" className="text-primary font-semibold hover:underline">
            Build your Youth Profile (Guest Mode available)
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
