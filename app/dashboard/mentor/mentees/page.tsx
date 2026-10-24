"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  MessageSquare,
  Search,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Mentee {
  id: string;
  name: string;
  learningSkill: string;
  progressPercent: number;
  lastSession: string;
  confirmed: boolean;
}

const INITIAL_MENTEES: Mentee[] = [
  {
    id: "m1",
    name: "Tebogo Sithole",
    learningSkill: "Domestic Electrical Wiring & DB Boards",
    progressPercent: 85,
    lastSession: "2 days ago",
    confirmed: true,
  },
  {
    id: "m2",
    name: "Anathi Cele",
    learningSkill: "Point of Sale Cash Management",
    progressPercent: 60,
    lastSession: "Yesterday",
    confirmed: false,
  },
  {
    id: "m3",
    name: "Noluthando Ndlovu",
    learningSkill: "Espresso Calibration & Milk Steaming",
    progressPercent: 90,
    lastSession: "3 days ago",
    confirmed: true,
  },
  {
    id: "m4",
    name: "Vusi Khumalo",
    learningSkill: "Solar PV Panel Inverter Installation",
    progressPercent: 45,
    lastSession: "Oct 19",
    confirmed: false,
  },
];

export default function MentorMenteesPage() {
  const [mentees, setMentees] = useState<Mentee[]>(INITIAL_MENTEES);
  const [search, setSearch] = useState("");
  const [activeMentee, setActiveMentee] = useState<Mentee>(INITIAL_MENTEES[0]);
  const [chatNote, setChatNote] = useState("");
  const [notesLog, setNotesLog] = useState<string[]>([
    "Great work on testing continuity with the multimeter.",
    "Remember to practice the single-phase isolate drill before Wednesday.",
  ]);

  const filtered = mentees.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.learningSkill.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleConfirmSkill = (id: string) => {
    setMentees((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmed: !m.confirmed } : m)),
    );
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatNote.trim()) return;
    setNotesLog((prev) => [...prev, chatNote.trim()]);
    setChatNote("");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link
          href="/dashboard/mentor"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          My Mentees & Coaching Log
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track learning progress, share coaching notes, and endorse verified
          competencies.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search mentees by name or skill track..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      {/* Mentee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map((m) => (
          <div
            key={m.id}
            onClick={() => setActiveMentee(m)}
            className={`bg-card rounded-card border shadow-card p-4 transition-all cursor-pointer ${
              activeMentee.id === m.id
                ? "border-primary ring-1 ring-primary/30"
                : "border-border"
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-bold text-sm text-foreground">{m.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">
                  {m.learningSkill}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Last coached: {m.lastSession}
                </p>
              </div>

              {m.confirmed ? (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Endorsed
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                  In Training
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">
                  Competency Progress
                </span>
                <span className="font-semibold text-foreground">
                  {m.progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${m.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Card Buttons */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <Button
                variant={m.confirmed ? "outline" : "default"}
                size="sm"
                className="text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleConfirmSkill(m.id);
                }}
              >
                <Award className="size-3.5 mr-1" />
                {m.confirmed ? "Revoke Endorsement" : "Confirm Skill"}
              </Button>
              <span className="text-[11px] text-muted-foreground">
                Click to open notes
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Coaching Feed */}
      <div className="bg-card rounded-card border border-border shadow-card p-5">
        <h2 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          Coaching Log & Feedback for {activeMentee.name}
        </h2>

        <div className="space-y-2 mb-4 bg-muted/30 p-3 rounded-btn max-h-48 overflow-y-auto">
          {notesLog.map((note, idx) => (
            <div
              key={idx}
              className="bg-card p-2.5 rounded border border-border text-xs text-foreground"
            >
              {note}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendNote} className="flex gap-2">
          <Input
            placeholder={`Add coaching observation or guidance for ${activeMentee.name}...`}
            value={chatNote}
            onChange={(e) => setChatNote(e.target.value)}
            className="text-xs"
          />
          <Button type="submit" size="sm">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
