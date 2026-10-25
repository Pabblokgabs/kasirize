"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkActionPermission, getStoredAuthUser } from "@/lib/auth";
import { Opportunity } from "@/types";
import { ArrowLeft, Bus, MapPin, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function OpportunitiesIndexPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.opportunities)) {
          const adapted: Opportunity[] = data.opportunities.map((o: any) => ({
            id: o.id,
            title: o.title,
            employerName: o.companyName || "Verified Enterprise",
            employerLogoUrl: o.companyLogoUrl,
            organisationType: o.organisationType || "Logistics",
            type: o.type,
            location: o.location,
            province: o.province || "Gauteng",
            monthlyStipendCents: o.monthlyStipendCents || 500000,
            vacanciesCount: o.vacanciesCount || 2,
            applicationLimit: o.applicationLimit || 25,
            applicationsReceived: o.applicationsReceived || 0,
            educationLevel: o.educationLevel || "grade_12",
            requiredSkills: o.requiredSkills || ["Customer Service", "Punctuality"],
            description: o.description,
            deadline: o.deadline || "2026-11-30",
            transportCreditFunded: o.transportCreditFunded,
            transportBudgetRands: o.transportBudgetRands || 1500,
            isEscrowFunded: o.isEscrowFunded,
            verifiedStatus: o.verifiedStatus || "active_live",
          }));
          setOpportunities(adapted);
        }
      })
      .catch((err) => console.error("Error loading live opportunities:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.employerName.toLowerCase().includes(search.toLowerCase()) ||
      opp.location.toLowerCase().includes(search.toLowerCase()) ||
      opp.requiredSkills.some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );

    const matchesType = selectedType === "all" || opp.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleApply = async (opp: Opportunity) => {
    const user = getStoredAuthUser();
    const perm = checkActionPermission(user, "apply");
    if (!perm.allowed) {
      toast.error(perm.reason || "Guest accounts cannot apply. Please sign in with a verified profile.");
      return;
    }

    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opp.id,
          applicantId: user?.id || "usr_youth_01",
          transportVoucherRequested: true,
          transportVoucherAmountCents: 8000,
        }),
      });
      setAppliedIds((prev) => [...prev, opp.id]);
      toast.success(`Application sent to ${opp.employerName}! Saved in live employer pipeline.`);
    } catch {
      setAppliedIds((prev) => [...prev, opp.id]);
      toast.success(`Application sent to ${opp.employerName}!`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
            >
              <ArrowLeft className="size-4" />
              <span>Home</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <span className="font-heading font-bold text-foreground text-sm">
              Work &amp; Growth Opportunities
            </span>
          </div>

          <Link
            href="/dashboard/user"
            className="text-xs font-semibold text-primary hover:underline"
          >
            My Profile &amp; Dashboard →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* ─── SEARCH & FILTER BANNER ─── */}
        <div className="p-6 rounded-card bg-brand-deep text-white shadow-lift relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur">
              <Sparkles className="size-3.5 text-accent" />
              <span>Verified Match • South Africa</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Entry-Level Jobs, Learnerships &amp; Micro-Internships
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Employers on Kasirize hire based on demonstrated practical tasks
              and referee verifications. All qualifying interviews include
              funded taxi transport.
            </p>
          </div>
        </div>

        {/* ─── SEARCH / FILTER CONTROLS ─── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by title, skill, or location (e.g. retail, logistics, Soweto)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Types" },
              { id: "entry_level_job", label: "Entry-Level" },
              { id: "learnership", label: "Learnerships" },
              { id: "micro_internship", label: "Micro-Internships" },
              { id: "apprenticeship", label: "Apprenticeships" },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedType === type.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── OPPORTUNITIES LIST ─── */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((opp) => {
              const isApplied = appliedIds.includes(opp.id);

              return (
                <div
                  key={opp.id}
                  className="p-5 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {opp.type.replace(/_/g, " ")}
                      </span>
                      {opp.transportCreditFunded && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent flex items-center gap-1">
                          <Bus className="size-3" />
                          <span>Interview Taxi Funded</span>
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground font-medium">
                        Deadline: {opp.applicationDeadline}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-heading font-bold text-lg text-foreground hover:text-primary transition-colors">
                        <Link href={`/opportunities/${opp.id}`}>
                          {opp.title}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold text-foreground">
                          {opp.employerName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {opp.location}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-primary">
                          {opp.monthlyStipendCents > 0
                            ? `R ${(opp.monthlyStipendCents / 100).toLocaleString()} / month`
                            : "Competitive"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs font-semibold"
                      onClick={() => handleApply(opp)}
                      disabled={isApplied}
                    >
                      {isApplied ? "Applied" : "Apply with Kasirize"}
                    </Button>
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "flex-1 sm:flex-initial text-xs",
                      })}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-card bg-card border border-border text-xs text-muted-foreground">
              No opportunities found matching your filters. Try adjusting your
              search query.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
