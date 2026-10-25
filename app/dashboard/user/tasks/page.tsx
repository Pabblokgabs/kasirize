"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/hooks/queries";
import { taskToSlug } from "@/lib/slugs";
import { getStoredProfile } from "@/lib/store";
import { Task, YouthProfile } from "@/types";
import {
  Award,
  Check,
  Clock,
  ExternalLink,
  Filter,
  Footprints,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function YouthTasksDashboard() {
  const [profile] = useState<YouthProfile>(() => getStoredProfile());
  const { data: tasksData, isLoading } = useTasks();

  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState<
    "all" | "high_match" | "local_only" | "applied"
  >("all");

  // Format raw database tasks
  const allTasks: Task[] = useMemo(() => {
    if (!tasksData?.tasks || !Array.isArray(tasksData.tasks)) return [];

    return tasksData.tasks.map((t: {
      id: string;
      title: string;
      description: string;
      location: string;
      payoutCents: number;
      estimatedTaxiFareCents?: number;
      durationHours?: number;
      deadline?: string;
      status?: string;
      requesterName?: string;
      skillsRequired?: string[] | string;
      safetyNotes?: string;
      workersNeeded?: number;
      assignedYouthId?: string;
    }) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      location: t.location,
      payoutCents: t.payoutCents || 15000,
      estimatedTaxiFareCents: t.estimatedTaxiFareCents || 0,
      durationHours: t.durationHours || 3,
      deadline: t.deadline || new Date().toISOString(),
      status: (t.status as Task["status"]) || "open",
      requesterName: t.requesterName || "Local Township Enterprise",
      requesterType: "spaza_shop",
      skillsRequired: Array.isArray(t.skillsRequired)
        ? t.skillsRequired
        : typeof t.skillsRequired === "string"
        ? JSON.parse(t.skillsRequired || "[]")
        : ["Punctuality", "Customer Service"],
      safetyNotes: t.safetyNotes || "Verified hyper-local task.",
      workersNeeded: t.workersNeeded || 1,
    }));
  }, [tasksData]);

  // Applied tasks
  const appliedIds = useMemo(() => {
    if (!tasksData?.tasks || !Array.isArray(tasksData.tasks)) return [];
    return tasksData.tasks
      .filter((t: { assignedYouthId?: string }) => t.assignedYouthId === profile?.id || t.assignedYouthId === "usr_youth_01")
      .map((t: { id: string }) => t.id);
  }, [tasksData, profile?.id]);

  // Calculate skills match helper
  const getSkillMatch = (taskSkills: string[]) => {
    const userSkillNames = (profile?.skills || []).map((s) =>
      s.skillName.toLowerCase(),
    );
    const verifiedOrExisting: string[] = [];
    const newToEarn: string[] = [];

    (taskSkills || []).forEach((skill) => {
      const match = userSkillNames.some(
        (us) =>
          us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us),
      );
      if (match) {
        verifiedOrExisting.push(skill);
      } else {
        newToEarn.push(skill);
      }
    });

    const matchPercent =
      taskSkills.length > 0
        ? Math.round(
            (verifiedOrExisting.length / taskSkills.length) * 60 +
              (profile?.location ? 30 : 15),
          )
        : 80;

    return {
      verifiedOrExisting,
      newToEarn,
      matchPercent: Math.min(98, Math.max(35, matchPercent)),
    };
  };

  // Distinct locations for filter pills
  const availableLocations = useMemo(() => {
    const locs = Array.from(
      new Set(allTasks.map((t) => t.location.split(",")[0].trim())),
    );
    return ["all", ...locs];
  }, [allTasks]);

  // Filtered task results
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.requesterName.toLowerCase().includes(search.toLowerCase()) ||
        task.location.toLowerCase().includes(search.toLowerCase()) ||
        task.skillsRequired.some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (
        selectedLocation !== "all" &&
        !task.location.toLowerCase().includes(selectedLocation.toLowerCase())
      ) {
        return false;
      }

      if (selectedDuration === "short" && task.durationHours > 3) return false;
      if (
        selectedDuration === "half_day" &&
        (task.durationHours < 4 || task.durationHours > 6)
      )
        return false;
      if (selectedDuration === "full_day" && task.durationHours < 7)
        return false;

      const isApplied = appliedIds.includes(task.id);
      if (selectedTab === "applied" && !isApplied) return false;

      const { matchPercent } = getSkillMatch(task.skillsRequired);
      if (selectedTab === "high_match" && matchPercent < 75) return false;
      if (
        selectedTab === "local_only" &&
        profile?.location &&
        !task.location.toLowerCase().includes(profile.location.toLowerCase())
      )
        return false;

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allTasks,
    search,
    selectedLocation,
    selectedDuration,
    selectedTab,
    appliedIds,
  ]);

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-base sm:text-lg text-foreground">
              Township Task Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Find verified, escrow-backed gig work near you
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {filteredTasks.length} Available
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        {/* ─── SEARCH & FILTER BAR ─── */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by task title, skill, requester, or township..."
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
              All Tasks ({allTasks.length})
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
              onClick={() => setSelectedTab("local_only")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTab === "local_only"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Footprints className="size-3 text-primary" />
              <span>In My Ward / Township</span>
            </button>
            <button
              onClick={() => setSelectedTab("applied")}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1 ${
                selectedTab === "applied"
                  ? "bg-brand-deep text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Check className="size-3 text-emerald-500" />
              <span>Applied ({appliedIds.length})</span>
            </button>
          </div>

          {/* Filter Dropdowns / Secondary Row */}
          <div className="flex flex-row items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-md">
              <MapPin className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">Area:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">Everywhere</option>
                {availableLocations
                  .filter((loc) => loc !== "all")
                  .map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-card border border-border px-2.5 py-1.5 rounded-md">
              <Clock className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Duration:
              </span>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">Any duration</option>
                <option value="short">Short (&le; 3 hrs)</option>
                <option value="half_day">Half Day (4-6 hrs)</option>
                <option value="full_day">Full Day (7+ hrs)</option>
              </select>
            </div>

            {(selectedLocation !== "all" ||
              selectedDuration !== "all" ||
              search) && (
              <button
                onClick={() => {
                  setSelectedLocation("all");
                  setSelectedDuration("all");
                  setSearch("");
                }}
                className="text-[11px] text-primary hover:underline font-semibold ml-auto"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* ─── TASKS GRID ─── */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading tasks from Neon database...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center rounded-card bg-card border border-border space-y-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Filter className="size-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-foreground">
              No matching tasks found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search criteria, clearing filters, or exploring
              different areas nearby.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTasks.map((task) => {
              const isApplied = appliedIds.includes(task.id);
              const { verifiedOrExisting, newToEarn, matchPercent } =
                getSkillMatch(task.skillsRequired || []);

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2">
                    {/* Top Row: Verification, Match Badge, Payout */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="size-3" />
                          <span>Verified Escrow</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light/10 text-brand-mid">
                          {matchPercent}% Match
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-heading font-bold text-foreground block">
                          R {(task.payoutCents / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <div>
                      <h3 className="font-heading font-bold text-sm text-foreground hover:text-primary transition-colors">
                        <Link href={`/tasks/${taskToSlug(task.title)}`}>
                          {task.title}
                        </Link>
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-foreground">
                          {task.requesterName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {task.location}
                        </span>
                      </div>
                    </div>

                    {/* Proximity & Duration */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-muted/60 rounded-md p-2">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{task.durationHours} hours</span>
                      </span>

                      <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Footprints className="size-3" />
                        <span>Walking distance only</span>
                      </span>
                    </div>

                    {/* Skills Breakdown pill preview */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Award className="size-3 text-primary" />
                        <span>Skills Impact:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {verifiedOrExisting.slice(0, 2).map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
                          >
                            <Check className="size-2.5" />
                            <span>{s}</span>
                          </span>
                        ))}
                        {newToEarn.slice(0, 2).map((s, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium"
                          >
                            <Plus className="size-2.5" />
                            <span>{s}</span>
                          </span>
                        ))}
                        {task.skillsRequired.length > 4 && (
                          <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                            +{task.skillsRequired.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Link to Full Task Details Page */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Link
                      href={`/tasks/${taskToSlug(task.title)}`}
                      className={buttonVariants({
                        size: "sm",
                        className:
                          "w-full text-xs font-semibold gap-1.5 justify-center",
                      })}
                    >
                      <span>
                        {isApplied
                          ? "View / Applied ✓"
                          : "View Details & Apply"}
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
