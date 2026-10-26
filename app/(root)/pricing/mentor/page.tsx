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
import { MENTOR_PRICING_TABLE, MentorPricingItem } from "@/constants/pricing";
import {
  Award,
  Check,
  CheckCircle2,
  GraduationCap,
  Percent,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function MentorPricingPage() {
  const [allowed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("kasirize_role");
      return role === "role-mentor";
    }
    return false;
  });

  useEffect(() => {
    if (!allowed) {
      notFound();
    }
  }, [allowed]);

  const [selectedItem, setSelectedItem] = useState<MentorPricingItem | null>(
    null,
  );
  const [activeServices, setActiveServices] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("kasirize_mentor_active_services");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return ["basic_profile", "paid_sessions", "paid_workshops"];
  });

  const handleSelectItem = (item: MentorPricingItem) => {
    setSelectedItem(item);
  };

  const handleConfirmAction = () => {
    if (!selectedItem) return;

    if (!activeServices.includes(selectedItem.id)) {
      const next = [...activeServices, selectedItem.id];
      setActiveServices(next);
      try {
        localStorage.setItem(
          "kasirize_mentor_active_services",
          JSON.stringify(next),
        );
      } catch {
        // ignore
      }
    }

    if (selectedItem.id === "featured_listing") {
      toast.success(
        "Featured Mentor Listing activated! (R149/mo) — Your profile is now pinned to the top of the mentor directory.",
        { duration: 4000 },
      );
    } else {
      toast.success(
        `${selectedItem.service} settings updated and ready for bookings.`,
        { duration: 4000 },
      );
    }
    setSelectedItem(null);
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
                <GraduationCap className="size-5 text-primary" />
                <span>Skill Mentor Services &amp; Pricing</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Transparent rates, commission-free basic profiles, and artisan
                workshop revenue sharing
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
                Fair Mentor Monetisation &amp; Recognition
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                Turn Your Craft Into Sustainable Income
              </h2>
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                Basic mentor profiles are <strong>100% free forever</strong>.
                When you host paid 1-on-1 coaching sessions or hands-on
                apprentice workshops, Kasirize only charges a low{" "}
                <strong>12% platform fee</strong> to cover escrow payment
                processing, certificate generation, and safety compliance.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-btn bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold shrink-0">
              <Award className="size-4" />
              <span>12% Transparent Commission</span>
            </div>
          </div>
        </section>

        {/* ─── 4 SERVICE CARDS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MENTOR_PRICING_TABLE.map((item) => {
            const isActive = activeServices.includes(item.id);
            const isFeatured = item.id === "featured_listing";

            return (
              <div
                key={item.id}
                className={`rounded-card border p-5 flex flex-col justify-between transition-all relative ${
                  isFeatured
                    ? "bg-card border-primary ring-2 ring-primary/30 shadow-lift"
                    : "bg-card border-border shadow-card hover:border-primary/40"
                }`}
              >
                {item.badge && (
                  <div className="absolute -top-3 left-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                        isFeatured
                          ? "bg-brand-deep text-white"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {item.service}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {item.priceDisplay}
                    </span>
                    {item.billingType === "monthly" && (
                      <span className="text-xs text-muted-foreground ml-1 font-medium">
                        / month
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 pb-3 border-b border-border line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {item.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  {isFeatured && isActive ? (
                    <Button
                      disabled
                      className="w-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Active (Featured)
                    </Button>
                  ) : item.billingType === "free" ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full text-xs font-medium text-muted-foreground cursor-default"
                    >
                      <Check className="size-3.5 mr-1" />
                      Default Profile
                    </Button>
                  ) : item.billingType === "monthly" ? (
                    <Button
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-xs font-semibold bg-brand-deep text-white cursor-pointer shadow-xs"
                    >
                      <Sparkles className="size-3.5 mr-1 text-amber-300" />
                      Activate for R149/mo
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-xs font-semibold cursor-pointer"
                    >
                      <span>Fee Schedule</span>
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
              Official Skill Mentors Service Rate Card
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete breakdown of mentor directory options, visibility
              upgrades, and session revenue shares.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-bold">Service</th>
                  <th className="py-3 px-4 font-bold">Price / Platform Fee</th>
                  <th className="py-3 px-4 font-bold">Billing Model</th>
                  <th className="py-3 px-4 font-bold">What&apos;s Included</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {MENTOR_PRICING_TABLE.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                          <span>{item.service}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-heading font-bold text-sm text-foreground whitespace-nowrap">
                        {item.priceDisplay}
                        {item.billingType === "monthly" && (
                          <span className="text-[11px] text-muted-foreground font-normal">
                            {" "}
                            / month
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 capitalize text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium border border-border/50">
                          {item.billingType === "commission"
                            ? "12% on session completion"
                            : item.billingType === "monthly"
                              ? "Monthly Subscription"
                              : "No charge (Free)"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        <span className="line-clamp-1">{item.description}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectItem(item)}
                          className="text-xs h-7.5 font-semibold cursor-pointer"
                        >
                          {item.billingType === "monthly"
                            ? "Subscribe"
                            : "View Details"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── Artisan & Mentor Guarantee ─── */}
        <section className="p-5 rounded-card bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
              <Percent className="size-4 text-primary" />
              <span>How does the 12% fee work?</span>
            </h4>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              If you charge R200 for a 1-hour electrical apprentice practical
              session, the mentee pays R200. Kasirize retains R24 (12%) for
              escrow safety, insurance, and certificate issuance, and R176 is
              paid directly to your bank account or voucher wallet.
            </p>
          </div>

          <Link
            href="/dashboard/mentor/create-mentorship"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <span>Create Session Now</span>
          </Link>
        </section>
      </div>

      {/* ─── MODAL: SERVICE CONFIRMATION ─── */}
      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              {selectedItem?.billingType === "monthly" ? (
                <Star className="size-5" />
              ) : selectedItem?.billingType === "commission" ? (
                <Percent className="size-5" />
              ) : (
                <Award className="size-5" />
              )}
            </div>
            <DialogTitle className="font-heading text-lg font-bold">
              {selectedItem?.service}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-btn bg-muted/50 border border-border flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  Pricing / Fee:
                </span>
                <span className="font-heading font-bold text-base text-primary">
                  {selectedItem.priceDisplay}
                  {selectedItem.billingType === "monthly" ? " / month" : ""}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground">
                  Included capabilities:
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {selectedItem.features.map((feat, i) => (
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
              onClick={() => setSelectedItem(null)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmAction}
              className="text-xs font-semibold bg-brand-deep text-white cursor-pointer shadow-xs"
            >
              {selectedItem?.billingType === "monthly"
                ? "Activate (R149/mo)"
                : "Acknowledge Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
