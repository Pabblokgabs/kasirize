"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApplications, useOpportunities } from "@/hooks/queries";
import { getStoredProfile } from "@/lib/store";
import { Opportunity, YouthProfile } from "@/types";
import {
  Briefcase,
  Building,
  Bus,
  CheckCircle2,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function YouthOpportunitiesDashboard() {
  const [profile] = useState<YouthProfile>(() => getStoredProfile());
  const { data: oppData, isLoading: oppLoading } = useOpportunities();
  const { data: appData, isLoading: appLoading } = useApplications();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<
    "all" | "high_match" | "transport_funded" | "applied"
  >("all");

  const isLoading = oppLoading || appLoading;

  const opportunities: Opportunity[] = useMemo(() => {
    if (!oppData?.opportunities || !Array.isArray(oppData.opportunities))
      return [];

    return oppData.opportunities.map(
      (o: {
        id: string;
        title: string;
        companyName: string;
        location: string;
        stipendCents?: number;
        type?: string;
        description?: string;
        requirements?: string[] | string;
      }) => ({
        id: o.id,
        title: o.title,
        employerName: o.companyName,
        organisationType: "retailer",
        location: o.location,
        type: (o.type as Opportunity["type"]) || "learnership",
        description: o.description || "",
        requiredSkills: Array.isArray(o.requirements)
          ? o.requirements
          : typeof o.requirements === "string"
            ? JSON.parse(o.requirements || "[]")
            : ["Punctuality", "Teamwork"],
        applicationDeadline: new Date(Date.now() + 86400000 * 14).toISOString(),
        monthlyStipendCents: o.stipendCents || 450000,
        transportCreditFunded: true,
      }),
    );
  }, [oppData]);

  const appliedIds = useMemo(() => {
    if (!appData?.applications || !Array.isArray(appData.applications))
      return [];
    return appData.applications
      .filter(
        (a: { applicantId?: string }) =>
          a.applicantId === profile?.id || a.applicantId === "usr_youth_01",
      )
      .map((a: { opportunityId: string }) => a.opportunityId);
  }, [appData, profile?.id]);

  // Calculate matching percentage for opportunities based on youth's skills
  const getMatchScore = (requiredSkills: string[]) => {
    const userSkills = (profile?.skills || []).map((s) =>
      s.skillName.toLowerCase(),
    );
    let matches = 0;
    requiredSkills.forEach((req) => {
      if (
        userSkills.some(
          (us) =>
            us.includes(req.toLowerCase()) || req.toLowerCase().includes(us),
        )
      ) {
        matches++;
      }
    });

    const percent =
      requiredSkills.length > 0
        ? Math.round(
            (matches / requiredSkills.length) * 70 +
              (profile?.location ? 25 : 15),
          )
        : 80;

    return {
      matchCount: matches,
      totalCount: requiredSkills.length,
      matchPercent: Math.min(98, Math.max(40, percent)),
    };
  };

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const oppSkills = opp.requiredSkills || [];
      const matchesSearch =
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.employerName.toLowerCase().includes(search.toLowerCase()) ||
        opp.location.toLowerCase().includes(search.toLowerCase()) ||
        oppSkills.some((s: string) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (selectedType !== "all" && opp.type !== selectedType) return false;

      const isApplied = appliedIds.includes(opp.id);
      if (selectedTab === "applied" && !isApplied) return false;
      if (selectedTab === "transport_funded" && !opp.transportCreditFunded)
        return false;

      const { matchPercent } = getMatchScore(oppSkills);
      if (selectedTab === "high_match" && matchPercent < 75) return false;

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunities, search, selectedType, selectedTab, appliedIds]);

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-base sm:text-lg text-foreground">
              Career &amp; Growth Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Verified learnerships, internships, and entry-level positions
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {filtered.length} Openings
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        {/* ─── SEARCH & FILTER BAR ─── */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search roles, required skills, employers, or towns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card text-xs pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                selectedTab === "all"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All Openings ({opportunities.length})
            </button>
            <button
              onClick={() => setSelectedTab("high_match")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTab === "high_match"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="size-3 text-amber-500" />
              <span>High Match (75%+)</span>
            </button>
            <button
              onClick={() => setSelectedTab("transport_funded")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTab === "transport_funded"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bus className="size-3 text-accent" />
              <span>Taxi Funded</span>
            </button>
            <button
              onClick={() => setSelectedTab("applied")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTab === "applied"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Applied ({appliedIds.length})</span>
            </button>
          </div>

          {/* Type Dropdown Filter */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-md">
              <Briefcase className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All contract types</option>
                <option value="learnership">Learnerships</option>
                <option value="micro_internship">Micro-Internships</option>
                <option value="entry_level_job">Entry-Level Jobs</option>
                <option value="apprenticeship">Apprenticeships</option>
              </select>
            </div>

            {(selectedType !== "all" || search) && (
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSearch("");
                }}
                className="text-[11px] text-primary hover:underline font-semibold ml-auto"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* ─── LIST ─── */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-card bg-card border border-border shadow-card space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-8 w-32 rounded-btn" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center rounded-card bg-card border border-border space-y-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Filter className="size-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-foreground">
              No matching openings
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search criteria, clearing filters, or exploring
              different opportunity types.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedType("all");
                setSelectedTab("all");
              }}
              className="text-xs"
            >
              Show all openings
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((opp) => {
              const isApplied = appliedIds.includes(opp.id);
              const oppSkills = opp.requiredSkills || [];
              const { matchPercent } = getMatchScore(oppSkills);

              return (
                <div
                  key={opp.id}
                  className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {opp.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light/10 text-brand-mid">
                        {matchPercent}% Match
                      </span>
                      {opp.transportCreditFunded && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent flex items-center gap-1">
                          <Bus className="size-3" />
                          <span>Taxi Fare Funded</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-sm text-foreground hover:text-primary transition-colors">
                      <Link href={`/opportunities/${opp.id}`}>{opp.title}</Link>
                    </h3>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Building className="size-3 text-muted-foreground" />
                        <span>{opp.employerName}</span>
                      </span>
                      <span className="hidden md:block">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary" />
                        {opp.location}
                      </span>
                      <span className="hidden md:block">•</span>
                      <span className="font-bold text-primary">
                        {opp.monthlyStipendCents > 0
                          ? `R ${(opp.monthlyStipendCents / 100).toLocaleString()} / mo`
                          : "Market Stipend"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {oppSkills.map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className={buttonVariants({
                        size: "sm",
                        className:
                          "flex-1 sm:flex-initial text-xs font-semibold gap-1.5",
                      })}
                    >
                      <span>
                        {isApplied ? "View / Applied ✓" : "View & Apply"}
                      </span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
