"use client";

import Footer from "@/components/footer/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  REQUESTER_PRICING_TABLE,
  RequesterPricingItem,
} from "@/constants/pricing";
import {
  Check,
  CheckCircle2,
  Coins,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function RequesterPricingPage() {
  const [allowed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("kasirize_role");
      return role === "role-requester";
    }
    return false;
  });

  useEffect(() => {
    if (!allowed) {
      notFound();
    }
  }, [allowed]);

  const [selectedService, setSelectedService] =
    useState<RequesterPricingItem | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(
            "kasirize_requester_subscriptions",
          );
          if (stored) return JSON.parse(stored);
        } catch {
          // fallback
        }
      }
      return ["basic_posting"];
    },
  );

  const handleSelectService = (service: RequesterPricingItem) => {
    setSelectedService(service);
  };

  const handleConfirmPurchase = () => {
    if (!selectedService) return;

    if (!activeSubscriptions.includes(selectedService.id)) {
      const nextSubs = [...activeSubscriptions, selectedService.id];
      setActiveSubscriptions(nextSubs);
      try {
        localStorage.setItem(
          "kasirize_requester_subscriptions",
          JSON.stringify(nextSubs),
        );
      } catch {
        // ignore
      }
    }

    toast.success(
      `${selectedService.service} successfully activated! (${selectedService.priceDisplay})`,
      { duration: 4000 },
    );
    setSelectedService(null);
  };

  if (!allowed) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background font-body">
      {/* ─── Top Header ─── */}
      <header className="border-b border-border bg-card/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-heading font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                <Coins className="size-5 text-primary" />
                <span>Task Requester Services &amp; Pricing</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Transparent micro-task fees, trust badges, and priority matching
                for township businesses
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-24 md:pb-16 space-y-6 flex-1 w-full">
        {/* ─── Transparency Hero ─── */}
        <section className="bg-card rounded-card border border-border p-5 shadow-card bg-linear-to-r from-card via-card to-primary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Fair Local Community Economics
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Affordable Township Task Posting
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Start with zero barrier: your{" "}
                <strong>first task is 100% free</strong>. Additional tasks are
                just R30. All youth earnings are held securely in platform
                escrow until you confirm satisfactory task completion.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-btn bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold shrink-0">
              <ShieldCheck className="size-4" />
              <span>100% Escrow Protected</span>
            </div>
          </div>
        </section>

        {/* ─── OFFICIAL PRICING TABLE ─── */}
        <section className="bg-card rounded-card border border-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-heading font-bold text-sm text-foreground">
              Official Task Requesters Service Rate Card
            </h3>
            <p className="text-xs text-muted-foreground">
              Service tiers and enhancements for spaza shops, bakeries,
              workshops, and household requesters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-bold">Service</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Billing Model</th>
                  <th className="py-3 px-4 font-bold">What&apos;s Included</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {REQUESTER_PRICING_TABLE.map((item) => {
                  const isCurrentActive = activeSubscriptions.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-foreground text-xs sm:text-sm">
                            {item.service}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-primary/10 text-primary shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                          {item.description}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-heading font-bold text-sm text-foreground whitespace-nowrap">
                        <span
                          className={
                            item.priceDisplay === "Free"
                              ? "text-emerald-600"
                              : "text-foreground"
                          }
                        >
                          {item.priceDisplay}
                        </span>
                        {item.billingType === "monthly" && (
                          <span className="text-[11px] text-muted-foreground font-normal">
                            {" "}
                            / month
                          </span>
                        )}
                        {item.billingType === "per_task" &&
                          item.priceDisplay !== "Free" && (
                            <span className="text-[11px] text-muted-foreground font-normal">
                              {" "}
                              / task
                            </span>
                          )}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium border border-border/50">
                          {item.billingType === "monthly"
                            ? "Monthly Subscription"
                            : "Pay As You Post"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <ul className="space-y-1 text-[11px] text-muted-foreground">
                          {item.features.slice(0, 2).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="size-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isCurrentActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="size-3" />
                            <span>Active / Eligible</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectService(item)}
                            className="text-xs h-7.5 font-semibold cursor-pointer"
                          >
                            <span>Select Service</span>
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

        {/* ─── SERVICE FEATURE CARDS ─── */}
        <section className="space-y-3">
          <h3 className="font-heading font-bold text-base text-foreground">
            Detailed Service Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {REQUESTER_PRICING_TABLE.slice(2).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-card bg-card border border-border shadow-card flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {item.badge || "Add-On"}
                    </span>
                    <span className="font-heading font-bold text-base text-foreground">
                      {item.priceDisplay}
                      <span className="text-xs text-muted-foreground font-normal">
                        {item.billingType === "monthly" ? " / mo" : " / task"}
                      </span>
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {item.service}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="space-y-1.5 mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                    {item.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSelectService(item)}
                  size="sm"
                  className="w-full text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Activate {item.service}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAQ & SAFETY ─── */}
        <section className="p-4 rounded-card bg-muted/40 border border-border text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <HelpCircle className="size-4 text-primary" />
            <span>How task payments and service fees work:</span>
          </div>
          <p className="leading-relaxed">
            Task payout amounts go 100% to the youth who completes your task.
            Kasirize service fees (such as R30 for additional postings or R50
            for featured boosts) cover safety monitoring, automated unwanted
            message interception, and verified community support.
          </p>
        </section>
      </div>

      {/* ─── MODAL: CONFIRM SERVICE SELECTION ─── */}
      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <Coins className="size-5" />
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              Activate {selectedService?.service}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-btn bg-muted/50 border border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Price:</span>
                <span className="font-heading font-bold text-base text-primary">
                  {selectedService.priceDisplay}
                  {selectedService.billingType === "monthly"
                    ? " / month"
                    : " / task"}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground">
                  Included with this service:
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {selectedService.features.map((feat, i) => (
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
              onClick={() => setSelectedService(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmPurchase}
              className="text-xs font-semibold bg-brand-deep text-white cursor-pointer"
            >
              Confirm &amp; Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
