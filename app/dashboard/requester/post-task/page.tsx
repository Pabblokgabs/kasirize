"use client";

import { RequesterPlace } from "@/app/dashboard/requester/place/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Footprints,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ExtractedSkill {
  name: string;
  category: string;
  selected: boolean;
}

export default function PostTaskPage() {
  const [step, setStep] = useState<"details" | "skills" | "confirmation">(
    "details",
  );
  const [isExtracting, setIsExtracting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState("3");

  // Registered Places list and chosen place
  const [places] = useState<RequesterPlace[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(
          "kasirize_requester_business_places",
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: "place-1",
        name: "Khumalo Fresh Market & Spaza",
        category: "Spaza Shop",
        tagline:
          "Cornerstone grocery and dairy distributor in Orlando East since 2014",
        address: "74 Vilakazi & Khumalo Street",
        ward: "Ward 39",
        township: "Orlando East, Soweto",
        operatingHours: "07:00 AM - 19:30 PM (Daily)",
        contactNumber: "+27 11 935 2411",
        safetyCheckPassed: true,
        walkingDistanceWard: "Ward 39 & Ward 40 (Under 15 mins walk)",
        photos: [],
        description: "Trusted local spaza shop.",
        facilities: ["Safe Onsite Storage", "First Aid Station", "Clean Water"],
        stats: {
          tasksOffered: 24,
          tasksCompleted: 22,
          youthHelped: 18,
          totalPaidOutRands: 4860,
          averageRating: 4.9,
          repeatYouthWorkers: 6,
        },
      },
      {
        id: "place-2",
        name: "Orlando Corner Bakery Depot",
        category: "Bakery",
        tagline:
          "Artisan township bread, buns, and fresh morning confectionery",
        address: "12 Mosaka Way",
        ward: "Ward 39",
        township: "Orlando East, Soweto",
        operatingHours: "05:30 AM - 17:00 PM (Mon-Sat)",
        contactNumber: "+27 82 459 1102",
        safetyCheckPassed: true,
        walkingDistanceWard: "Ward 39 (Under 10 mins walk)",
        photos: [],
        description: "Community bakery.",
        facilities: ["Food Hygiene Certified", "Indoor Prep Area"],
        stats: {
          tasksOffered: 15,
          tasksCompleted: 15,
          youthHelped: 11,
          totalPaidOutRands: 2850,
          averageRating: 5.0,
          repeatYouthWorkers: 4,
        },
      },
    ];
  });

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(() => {
    return places[0]?.id || "custom";
  });
  const [customLocation, setCustomLocation] = useState("");

  const activeSelectedPlace = places.find((p) => p.id === selectedPlaceId);
  const location =
    selectedPlaceId === "custom"
      ? customLocation
      : activeSelectedPlace
        ? `${activeSelectedPlace.name} - ${activeSelectedPlace.address}, ${activeSelectedPlace.township}`
        : customLocation;

  // Workers & Budget distribution
  const [workersNeeded, setWorkersNeeded] = useState(2);
  const [budgetType, setBudgetType] = useState<"individual" | "total_equal">(
    "individual",
  );
  const [budgetAmount, setBudgetAmount] = useState("180"); // in Rands

  // AI Extracted Skills
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  // Step 1 -> Step 2: Trigger AI extraction
  const handleProceedToSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsExtracting(true);

    try {
      // Call AI endpoint or generate realistic skills based on task context
      const res = await fetch("/api/ai/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: `${title}. ${description}` }),
      });

      if (res.ok) {
        const data = await res.json();
        if (
          data.skills &&
          Array.isArray(data.skills) &&
          data.skills.length > 0
        ) {
          setExtractedSkills(
            data.skills.map(
              (s: {
                skillName?: string;
                name?: string;
                category?: string;
              }) => ({
                name: s.skillName || s.name || "Practical Task Execution",
                category: s.category || "trade",
                selected: true,
              }),
            ),
          );
        } else {
          fallbackExtraction();
        }
      } else {
        fallbackExtraction();
      }
    } catch {
      fallbackExtraction();
    } finally {
      setIsExtracting(false);
      setStep("skills");
    }
  };

  const fallbackExtraction = () => {
    const lower = `${title} ${description}`.toLowerCase();
    const skills: ExtractedSkill[] = [];

    if (
      lower.includes("stock") ||
      lower.includes("inventory") ||
      lower.includes("count")
    ) {
      skills.push({
        name: "Stock Auditing & Discrepancy Logging",
        category: "retail_sales",
        selected: true,
      });
    }
    if (
      lower.includes("cash") ||
      lower.includes("till") ||
      lower.includes("money") ||
      lower.includes("pay")
    ) {
      skills.push({
        name: "Cash Handling & Till Float Reconciliation",
        category: "retail_sales",
        selected: true,
      });
    }
    if (
      lower.includes("clean") ||
      lower.includes("pack") ||
      lower.includes("packag")
    ) {
      skills.push({
        name: "Organised Product Staging & Packing",
        category: "logistics",
        selected: true,
      });
    }
    if (
      lower.includes("deliver") ||
      lower.includes("drive") ||
      lower.includes("transport")
    ) {
      skills.push({
        name: "Township Route Navigation & Safe Handling",
        category: "logistics",
        selected: true,
      });
    }
    if (
      lower.includes("customer") ||
      lower.includes("assist") ||
      lower.includes("sales")
    ) {
      skills.push({
        name: "Direct Customer Engagement & Service",
        category: "hospitality",
        selected: true,
      });
    }

    if (skills.length === 0) {
      skills.push(
        {
          name: "Time Management & Punctuality",
          category: "admin_tech",
          selected: true,
        },
        {
          name: "Instruction Adherence & Safety",
          category: "trade",
          selected: true,
        },
      );
    }
    setExtractedSkills(skills);
  };

  const toggleSkill = (idx: number) => {
    setExtractedSkills((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, selected: !s.selected } : s)),
    );
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    setExtractedSkills((prev) => [
      ...prev,
      { name: customSkill.trim(), category: "general", selected: true },
    ]);
    setCustomSkill("");
  };

  const removeSkill = (idx: number) => {
    setExtractedSkills((prev) => prev.filter((_, i) => i !== idx));
  };

  // Calculation helpers
  const numWorkers = Math.max(1, workersNeeded);
  const rawBudget = Number(budgetAmount) || 0;
  const perWorkerPayout =
    budgetType === "individual"
      ? rawBudget
      : Math.round(rawBudget / numWorkers);
  const totalCommitment =
    budgetType === "individual" ? rawBudget * numWorkers : rawBudget;

  const handleFinalPublish = () => {
    // Save to localStorage or state so requester dashboard & active tasks page see it
    if (typeof window !== "undefined") {
      const existing = JSON.parse(
        localStorage.getItem("kasirize_active_requester_tasks") || "[]",
      );
      const newTask = {
        id: `task-${Date.now()}`,
        title,
        description,
        location,
        durationHours: Number(durationHours) || 3,
        workersNeeded: numWorkers,
        budgetType,
        perWorkerPayoutRands: perWorkerPayout,
        totalBudgetRands: totalCommitment,
        skillsToLearn: extractedSkills
          .filter((s) => s.selected)
          .map((s) => s.name),
        status: "active",
        createdAt: new Date().toISOString(),
        timeRemainingMinutes: (Number(durationHours) || 3) * 60,
        assignedYouth: [
          {
            id: "y1",
            name: "Sipho Dlamini",
            initials: "SD",
            progress: "On Site",
          },
          ...(numWorkers > 1
            ? [
                {
                  id: "y2",
                  name: "Nomvula Khumalo",
                  initials: "NK",
                  progress: "En Route",
                },
              ]
            : []),
        ],
      };
      localStorage.setItem(
        "kasirize_active_requester_tasks",
        JSON.stringify([newTask, ...existing]),
      );
    }
    setStep("confirmation");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-6 px-4 md:px-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/requester"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Requester Dashboard
        </Link>
      </div>

      {/* Progress Steps Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Step{" "}
            {step === "details"
              ? "1 of 2"
              : step === "skills"
                ? "2 of 2"
                : "Completed"}
          </span>
          <span className="text-xs text-muted-foreground">
            {step === "details"
              ? "Task Details & Budget"
              : step === "skills"
                ? "Skills To Learn Extraction"
                : "Task Live"}
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: step === "details" ? "50%" : "100%",
            }}
          />
        </div>
      </div>

      {/* ─── STEP 1: TASK DETAILS & WORKERS ALLOCATION ─── */}
      {step === "details" && (
        <form
          onSubmit={handleProceedToSkills}
          className="space-y-5 bg-card rounded-card border border-border shadow-card p-5"
        >
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Define Task & Worker Allocation
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify how many youth are needed and whether the budget applies
              per person or split equally.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              required
              placeholder="e.g. Spaza Stock Count & Till Register Reconciliation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              required
              rows={3}
              placeholder="What will the youth be doing? Detail the instructions so our AI can extract relevant learning skills..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Task Location: Pick from Registered Business Places or Enter Custom */}
          <div className="space-y-3 p-4 bg-muted/40 rounded-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Store className="size-4 text-primary" />
                  Task Location &amp; Venue
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Select which of your registered business places this task will
                  be offered at.
                </p>
              </div>
              <Link
                href="/dashboard/requester/place"
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="size-3" />
                <span>Manage Places</span>
              </Link>
            </div>

            {/* Place Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {places.map((place) => {
                const isSelected = selectedPlaceId === place.id;
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`p-3 rounded-btn border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-card border-border hover:bg-muted/70"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-bold text-xs text-foreground truncate">
                          {place.name}
                        </span>
                        {isSelected && (
                          <span className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Check className="size-2.5 stroke-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground line-clamp-1 flex items-center gap-1">
                        <MapPin className="size-3 text-primary shrink-0" />
                        <span>
                          {place.address}, {place.township}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <Footprints className="size-3" />
                        <span>Walking distance ward</span>
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {place.stats.youthHelped} youth helped
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Custom / Alternative Location Option */}
              <button
                type="button"
                onClick={() => setSelectedPlaceId("custom")}
                className={`p-3 rounded-btn border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlaceId === "custom"
                    ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                    : "bg-card border-border hover:bg-muted/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-xs text-foreground">
                      Other / Custom Location
                    </span>
                    {selectedPlaceId === "custom" && (
                      <span className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <Check className="size-2.5 stroke-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Specify an ad-hoc or client address for this specific task
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-border/60 text-[10px] text-primary font-medium">
                  Enter address manually below
                </div>
              </button>
            </div>

            {/* Custom Location input when 'custom' selected */}
            {selectedPlaceId === "custom" && (
              <div className="space-y-1.5 pt-2 animate-in fade-in-50">
                <Label htmlFor="customLoc" className="text-xs">
                  Custom Location Address
                </Label>
                <Input
                  id="customLoc"
                  required
                  placeholder="e.g. 102 Mokoena Street, Zone 6, Meadowlands"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="text-xs"
                />
              </div>
            )}

            {/* Selected venue summary pill */}
            {activeSelectedPlace && selectedPlaceId !== "custom" && (
              <div className="p-2.5 rounded-md bg-card border border-border text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] text-muted-foreground">
                    Selected:{" "}
                    <strong className="text-foreground">
                      {activeSelectedPlace.name}
                    </strong>{" "}
                    ({activeSelectedPlace.address})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Verified Place
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration">Estimated Duration (Hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="12"
              required
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
            />
          </div>

          {/* Workers Count & Budget Distribution */}
          <div className="p-4 bg-muted/40 rounded-card border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Users className="size-4 text-primary" />
                  Youth Needed for this Task
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  How many candidates do you wish to hire simultaneously?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => setWorkersNeeded((w) => Math.max(1, w - 1))}
                >
                  -
                </Button>
                <span className="font-heading font-bold text-base w-6 text-center">
                  {workersNeeded}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => setWorkersNeeded((w) => w + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Budget Calculation Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Coins className="size-3.5 text-primary" />
                Budget Distribution Model
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType("individual")}
                  className={`p-3 rounded-btn border text-left text-xs transition-all ${
                    budgetType === "individual"
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <p className="font-bold text-foreground">
                    Per Individual (Each)
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Each worker receives R {budgetAmount || 0}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBudgetType("total_equal")}
                  className={`p-3 rounded-btn border text-left text-xs transition-all ${
                    budgetType === "total_equal"
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <p className="font-bold text-foreground">
                    Split Total Equally
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Total pool of R {budgetAmount || 0} divided equally (
                    {numWorkers} ways)
                  </p>
                </button>
              </div>
            </div>

            {/* Payout Input & Local Proximity Notice */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label htmlFor="budgetAmount" className="text-xs">
                  {budgetType === "individual"
                    ? "Amount per youth (ZAR)"
                    : "Total task budget pool (ZAR)"}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-muted-foreground">
                    R
                  </span>
                  <Input
                    id="budgetAmount"
                    type="number"
                    min="50"
                    className="pl-7 text-xs"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-btn bg-background border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary shrink-0" />
                <span>
                  <strong>Hyper-local only:</strong> Tasks are exclusively
                  broadcast to youth within walking distance of the location. No
                  taxi fare is required.
                </span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-3 bg-card rounded-btn border border-border text-xs flex justify-between items-center">
              <div>
                <span className="text-muted-foreground">
                  Each worker receives:{" "}
                </span>
                <span className="font-bold text-primary font-heading text-sm">
                  R {perWorkerPayout}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Total escrow required:{" "}
                </span>
                <span className="font-bold text-foreground font-heading text-sm">
                  R {totalCommitment}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isExtracting} className="w-full">
            {isExtracting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="size-4 animate-spin" />
                Extracting Skills to Learn with AI...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Extract Skills to Learn
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* ─── STEP 2: EXTRACT SKILLS TO LEARN & CONFIRM ─── */}
      {step === "skills" && (
        <div className="space-y-5 bg-card rounded-card border border-border shadow-card p-5">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Confirm Skills to Learn
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our AI identified these transferable competencies for this task.
                Select and confirm the ones you will rate the youth on upon
                completion.
              </p>
            </div>
          </div>

          {/* Skill Confirmation Cards */}
          <div className="space-y-2">
            {extractedSkills.map((s, idx) => (
              <div
                key={idx}
                onClick={() => toggleSkill(idx)}
                className={`p-3.5 rounded-btn border flex items-center justify-between cursor-pointer transition-all ${
                  s.selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-5 rounded flex items-center justify-center border ${
                      s.selected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {s.selected && <Check className="size-3.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {s.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      {s.category.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkill(idx);
                  }}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Skill */}
          <div className="pt-2">
            <Label className="text-xs text-muted-foreground mb-1 block">
              Want to add a custom skill or specific requirement?
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Using Electronic Weighing Scales"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSkill}
              >
                <Plus className="size-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Summary Confirmation */}
          <div className="p-3 bg-muted/40 rounded-btn text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">
              Task Overview Summary:
            </p>
            <p>
              • {numWorkers} youth requested ·{" "}
              {budgetType === "individual"
                ? "R " + perWorkerPayout + " each"
                : "R " + totalCommitment + " split equally"}
            </p>
            <p>
              • {extractedSkills.filter((s) => s.selected).length} verified
              skills to be credited on their profiles.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("details")}
            >
              ← Edit Details
            </Button>
            <Button onClick={handleFinalPublish}>
              Confirm &amp; Publish Task
            </Button>
          </div>
        </div>
      )}

      {/* ─── CONFIRMATION STATE ─── */}
      {step === "confirmation" && (
        <div className="bg-card rounded-card border border-border shadow-card p-6 text-center space-y-4">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">
            Task Published &amp; Broadcasted!
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your task for{" "}
            <span className="font-semibold text-foreground">{title}</span>{" "}
            requesting {numWorkers} youth has been posted. You can track
            progress and rate workers in the active tasks dashboard.
          </p>

          <div className="pt-3 flex justify-center gap-3">
            <Link
              href="/dashboard/requester/tasks"
              className={buttonVariants({ variant: "default" })}
            >
              Manage in Active Tasks
            </Link>
            <Button variant="outline" onClick={() => setStep("details")}>
              Post Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
