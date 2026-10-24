"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_YOUTH_PROFILES } from "@/constants/mock-data";
import { YouthProfile } from "@/types";
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function MentorDashboardPage() {
  const [mentees] = useState<YouthProfile[]>(MOCK_YOUTH_PROFILES);
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [workshopTitle, setWorkshopTitle] = useState("");

  const handleConfirmCompetency = (
    menteeId: string,
    menteeName: string,
    skillName: string,
  ) => {
    const key = `${menteeId}-${skillName}`;
    setConfirmedSkills((prev) => [...prev, key]);
    toast.success(
      `Milestone confirmed! "${skillName}" for ${menteeName} is now officially verified on their CV.`,
    );
  };

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopTitle) return;
    setShowWorkshopModal(false);
    setWorkshopTitle("");
    toast.success(
      "Practical micro-course published to youth in your community!",
    );
  };

  return (
    <div className="flex-1 flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <div>
              <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Skill Mentor &amp; Coach Portal
              </div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                Gauteng Youth Skills Coalition
              </h1>
            </div>
          </div>

          <Button
            size="sm"
            className="font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            onClick={() => setShowWorkshopModal(true)}
          >
            <Plus className="size-4" />
            <span>Create Workshop</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── OVERVIEW METRICS ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Active Mentees
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              {mentees.length}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Skills Verified
            </span>
            <span className="font-heading text-2xl font-bold text-primary">
              {confirmedSkills.length + 14}
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Workshops Delivered
            </span>
            <span className="font-heading text-2xl font-bold text-accent">
              6
            </span>
          </div>
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <span className="text-xs text-muted-foreground block mb-1">
              Mentor Rating
            </span>
            <span className="font-heading text-2xl font-bold text-foreground">
              4.9 ★
            </span>
          </div>
        </div>

        {/* ─── CREATE WORKSHOP MODAL ─── */}
        {showWorkshopModal && (
          <div className="p-5 rounded-card bg-card border border-primary/30 shadow-lift space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading font-bold text-base text-foreground">
                Offer Micro-Course or Workshop
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkshopModal(false)}
              >
                Cancel
              </Button>
            </div>
            <form onSubmit={handleCreateWorkshop} className="space-y-4">
              <div>
                <Label
                  htmlFor="ws-title"
                  className="text-xs font-semibold uppercase tracking-wider mb-1 block"
                >
                  Workshop Title *
                </Label>
                <Input
                  id="ws-title"
                  required
                  placeholder="e.g. Practical Inventory Counting & Shrinkage Prevention"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  className="w-full bg-background"
                />
              </div>
              <Button type="submit" className="w-full font-semibold shadow-xs">
                Publish Workshop to Mentees
              </Button>
            </form>
          </div>
        )}

        {/* ─── MENTEE ROSTER & VERIFICATION QUEUE ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Your Mentees &amp; Skill Verification Queue
              </h3>
              <p className="text-xs text-muted-foreground">
                Confirm practical competence to convert candidate self-declared
                skills into tamper-proof badges.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="p-4 rounded-card bg-card border border-border shadow-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-foreground">
                      {mentee.fullName}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {mentee.location}, {mentee.province} • Credibility:{" "}
                      {mentee.overallConfidenceScore}%
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {mentee.completedTasksCount} Practical Tasks Completed
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Skills Requiring Confirmation:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mentee.skills.map((skill) => {
                      const isConfirmed = confirmedSkills.includes(
                        `${mentee.id}-${skill.skillName}`,
                      );

                      return (
                        <div
                          key={skill.id}
                          className="p-3 rounded-lg bg-muted flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-semibold text-foreground">
                              {skill.skillName}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              Confidence: {skill.confidence}%
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant={isConfirmed ? "outline" : "default"}
                            className="text-xs font-semibold shrink-0"
                            onClick={() =>
                              handleConfirmCompetency(
                                mentee.id,
                                mentee.fullName,
                                skill.skillName,
                              )
                            }
                            disabled={isConfirmed}
                          >
                            <ShieldCheck className="size-3.5 mr-1" />
                            <span>
                              {isConfirmed ? "Confirmed" : "Confirm Skill"}
                            </span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
