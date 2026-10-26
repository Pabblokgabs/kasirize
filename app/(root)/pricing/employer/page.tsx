"use client";

import Footer from "@/components/footer/page";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EMPLOYER_PLANS_TABLE, EmployerPlanItem } from "@/constants/pricing";
import {
  ArrowLeft,
  Building2,
  Bus,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function EmployerPricingPage() {
  const [allowed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("kasirize_role");
      return role === "role-employer";
    }
    return false;
  });

  useEffect(() => {
    if (!allowed) {
      notFound();
    }
  }, [allowed]);

  const [selectedPlan, setSelectedPlan] = useState<EmployerPlanItem | null>(
    null,
  );
  const [activePlanId, setActivePlanId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_employer_active_plan_id");
        if (stored) return stored;
      } catch {
        // fallback
      }
    }
    return "growth";
  });

  const handleSelectPlan = (plan: EmployerPlanItem) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlanChange = () => {
    if (!selectedPlan) return;

    if (selectedPlan.id === "enterprise") {
      toast.success(
        "Thank you! Our enterprise youth partnerships director will contact you within 2 business hours.",
        { duration: 5000 },
      );
      setSelectedPlan(null);
      return;
    }

    setActivePlanId(selectedPlan.id);
    try {
      localStorage.setItem("kasirize_employer_active_plan_id", selectedPlan.id);
    } catch {
      // ignore
    }

    toast.success(
      `Employer account upgraded to the ${selectedPlan.plan} Plan! (${selectedPlan.priceDisplay} / month)`,
      { duration: 4000 },
    );
    setSelectedPlan(null);
  };

  if (!allowed) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background font-body">
      {/* ─── Top Header ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/employer"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeft className="size-4 mr-1" />
            </Link>

            <div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <CreditCard className="size-5 text-primary" />
                <span>Employer Hiring Plans &amp; Pricing</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Transparent monthly plans for hiring pre-verified youth with
                funded interview transport
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-24 md:pb-16 space-y-8 flex-1 w-full">
        {/* ─── Banner ─── */}
        <section className="bg-card rounded-card border border-border p-5 sm:p-6 shadow-card bg-linear-to-r from-card via-card to-primary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Fair Youth Talent Acquisition
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Predictable Subscription Plans for Every Hiring Team
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Connect with candidates whose skills are backed by confirmed
                local tasks. All employer plans include integrated interview
                scheduling, workplace facility integration, and SETA learnership
                compliant tracking.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-btn bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold shrink-0">
              <Bus className="size-4" />
              <span>Includes Transport Voucher Tools</span>
            </div>
          </div>
        </section>

        {/* ─── 3 PRICING TIERS (CARDS) ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EMPLOYER_PLANS_TABLE.map((plan) => {
            const isCurrentPlan = activePlanId === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-card border p-6 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "bg-card border-primary ring-2 ring-primary/30 shadow-lift"
                    : "bg-card border-border shadow-card hover:border-primary/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-deep text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Crown className="size-3 text-amber-400" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-foreground">
                      {plan.plan}
                    </h3>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Current Plan
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="font-heading text-3xl font-bold text-foreground">
                      {plan.priceDisplay}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                      {plan.billingPeriod}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-primary mb-4 pb-3 border-b border-border">
                    {plan.includesSummary}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  {isCurrentPlan ? (
                    <Button
                      disabled
                      className="w-full text-xs font-semibold bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      <CheckCircle2 className="size-4 mr-1.5" />
                      Current Active Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      variant={plan.popular ? "default" : "outline"}
                      className={`w-full text-xs font-semibold cursor-pointer ${
                        plan.popular ? "bg-brand-deep text-white shadow-xs" : ""
                      }`}
                    >
                      {plan.ctaLabel}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* ─── OFFICIAL RATE CARD TABLE VIEW ─── */}
        <section className="bg-card rounded-card border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-heading font-bold text-sm text-foreground">
              Employer Plan Comparison Table
            </h3>
            <p className="text-xs text-muted-foreground">
              Detailed side-by-side specifications of active postings, candidate
              shortlists, and interview tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-bold">Plan</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Includes</th>
                  <th className="py-3 px-4 font-bold">Postings Limit</th>
                  <th className="py-3 px-4 text-right font-bold">
                    Status / Choice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {EMPLOYER_PLANS_TABLE.map((plan) => {
                  const isCurrent = activePlanId === plan.id;

                  return (
                    <tr
                      key={plan.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                          <span>{plan.plan}</span>
                          {plan.popular && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-heading font-bold text-sm text-foreground whitespace-nowrap">
                        {plan.priceDisplay}
                        <span className="text-[11px] text-muted-foreground font-normal">
                          {" "}
                          / month
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {plan.includesSummary}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium border border-border/50">
                          {plan.activeJobPostsLimit === "unlimited"
                            ? "Unlimited Posts"
                            : `${plan.activeJobPostsLimit} Active Posts`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="size-3" />
                            <span>Active Plan</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectPlan(plan)}
                            className="text-xs h-7.5 font-semibold cursor-pointer"
                          >
                            <span>Choose {plan.plan}</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Enterprise Consultation Guarantee ─── */}
        <section className="p-5 rounded-card bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>
                Need Custom Enterprise Volume or B-BBEE Scorecard Alignment?
              </span>
            </h4>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              We design custom youth learnership pipelines for corporate
              retailers, national supply chains, and municipal training
              providers with full transport credit accounting.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() =>
              handleSelectPlan(
                EMPLOYER_PLANS_TABLE.find((p) => p.id === "enterprise") ||
                  EMPLOYER_PLANS_TABLE[2],
              )
            }
            className="text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
          >
            <span>Contact Enterprise Team</span>
          </Button>
        </section>
      </div>

      {/* ─── MODAL: CONFIRM PLAN SELECTION ─── */}
      <Dialog
        open={Boolean(selectedPlan)}
        onOpenChange={(open) => {
          if (!open) setSelectedPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <Crown className="size-5" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              {selectedPlan?.id === "enterprise"
                ? "Contact Enterprise Solutions"
                : `Upgrade to ${selectedPlan?.plan} Plan`}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {selectedPlan?.includesSummary}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-btn bg-muted/50 border border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Subscription Rate:
                </span>
                <span className="font-heading font-bold text-base text-primary">
                  {selectedPlan.priceDisplay}
                  {selectedPlan.priceCents ? " / month" : ""}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground">
                  Included in this plan:
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {selectedPlan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedPlan(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmPlanChange}
              className="text-xs font-semibold bg-brand-deep text-white cursor-pointer shadow-xs"
            >
              {selectedPlan?.id === "enterprise"
                ? "Submit Inquiry"
                : "Confirm Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
