"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_MENTORS } from "@/constants/mock-data";
import { Mentor } from "@/types";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function MentorsIndexPage() {
  const [search, setSearch] = useState("");
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const filtered = MOCK_MENTORS.filter((m) => {
    return (
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.organization.toLowerCase().includes(search.toLowerCase()) ||
      m.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties.some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      ) ||
      m.location.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRequestMentorship = (mentor: Mentor) => {
    setRequestedIds((prev) => [...prev, mentor.id]);
    toast.success(`Mentorship request sent to ${mentor.fullName}!`);
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
              Skill Mentors &amp; Coaches
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
        {/* ─── HERO BANNER ─── */}
        <div className="p-6 rounded-card bg-brand-deep text-white shadow-lift relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur">
              <GraduationCap className="size-3.5 text-accent" />
              <span>Skill Verification &amp; Mentorship</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Connect with Verified Community Mentors
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Skill Mentors provide coaching, micro-workshops, and referee
              confirmations to turn your informal practical work into
              tamper-proof verified competencies.
            </p>
          </div>
        </div>

        {/* ─── SEARCH ─── */}
        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by mentor name, specialty, or location (e.g. logistics, electronics, Cape Town)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        {/* ─── MENTOR CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((mentor) => {
            const isRequested = requestedIds.includes(mentor.id);

            return (
              <div
                key={mentor.id}
                className="p-5 rounded-card bg-card border border-border shadow-card flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading font-bold text-base text-foreground">
                        <Link href={`/mentors/${mentor.id}`}>
                          {mentor.fullName}
                        </Link>
                      </h2>
                      <div className="text-xs font-semibold text-primary">
                        {mentor.roleTitle}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-foreground">
                          {mentor.organization}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-primary" />
                          {mentor.location}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
                      {mentor.activeMenteesCount} Mentees
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Specialties &amp; Verifications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground font-medium flex items-center gap-1"
                        >
                          <ShieldCheck className="size-3 text-primary" />
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    className="flex-1 text-xs font-semibold"
                    onClick={() => handleRequestMentorship(mentor)}
                    disabled={isRequested}
                  >
                    {isRequested ? "Request Sent" : "Request Mentorship"}
                  </Button>
                  <Link
                    href={`/mentors/${mentor.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "text-xs font-medium",
                    })}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
