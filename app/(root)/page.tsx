"use client";

import Footer from "@/components/footer/page";
import NavBar from "@/components/nav-bar/page";
import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";
import { ArrowRight, Check, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const router = useRouter();

  // Prevent logged-in users with a role from viewing landing page, redirect to their role dashboard
  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    if (savedRole && ROLE_CONFIGS[savedRole]) {
      router.replace(ROLE_CONFIGS[savedRole].dashboardUrl);
    }
  }, [router]);

  // Automatic role saving and onboarding routing
  const handleSelectRole = (role: UserRole) => {
    return router.push("/build-profile");

    if (role === "role-user") {
      toast.success("Welcome! Starting Youth profile builder.");
      router.push("/build-profile");
    } else if (role === "role-requester") {
      toast.success("Welcome! Starting Task Requester onboarding.");
      router.push("/onboarding?role=requester");
    } else if (role === "role-employer") {
      toast.success("Welcome! Starting Employer onboarding.");
      router.push("/onboarding?role=employer");
    } else if (role === "role-mentor") {
      toast.success("Welcome! Starting Skill Mentor onboarding.");
      router.push("/onboarding?role=mentor");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
      {/* ─── GUEST ANNOUNCEMENT BAR ─── */}
      <aside
        aria-label="Announcement"
        className="bg-primary text-primary-foreground hidden md:block"
      >
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2.5 text-center text-sm font-medium">
          <span>
            Free to join · No paperwork needed · No ID number asked for
          </span>
          <Link
            href="/build-profile"
            className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 hover:opacity-90 transition-opacity"
          >
            Create my profile
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </aside>

      {/* ─── STICKY HEADER ─── */}
      <NavBar />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════════
            1. HERO SECTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-brand-deep text-white py-20 sm:py-28 lg:py-32">
          <div className="absolute top-0 right-0 size-137.5 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flash-hero-overlay absolute inset-0 flex-1" />
          <div className="flash-hero-glow absolute inset-0 flex-1" />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl animate-[fade-up_0.7s_ease-out_both]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/95 border border-white/15 mb-6 backdrop-blur">
                <Sparkles className="size-3.5 text-accent" />
                <span>Shortening the distance to meaningful income</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-white text-balance">
                Shorten the distance to meaningful income.
              </h1>

              <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-xl font-normal">
                How might we translate what you can do into credible profiles,
                practical experience, work opportunities and career mobility?
                Kasirize removes the barriers between young South Africans and
                real opportunities.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  onClick={() => handleSelectRole("role-user")}
                  className="px-5 py-3 rounded-btn bg-white text-brand-deep font-semibold text-sm hover:bg-white/90 active:scale-[0.98] transition-all shadow-card cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Create My Profile</span>
                  <ArrowRight className="size-4" />
                </button>
                <Link
                  href="#roles"
                  className="px-5 py-3 rounded-btn border border-white/30 text-white font-medium text-sm hover:bg-white/10 active:scale-[0.98] transition-all backdrop-blur cursor-pointer"
                >
                  Post a task, hire or mentor
                </Link>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/85 md:text-base">
                <li className="flex items-center gap-2">
                  <Check className="size-4 flex-none text-white" />
                  Free to start — no paperwork, no ID number
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 flex-none text-white" />
                  You approve every skill on your profile
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-4 flex-none text-white" />
                  Confirmed work always shown apart from claims
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── STATS RIBBON ─── */}
        <section className="bg-card border-b border-border py-4 transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>No ID numbers asked for</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Zero public contact exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Built for cheap smartphones</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            2. CHOOSE YOUR ROLE (PRIMARY PATHWAYS)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section
          id="roles"
          className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-12"
        >
          <div className="max-w-2xl mb-12">
            <span className="text-primary font-semibold text-xs tracking-wider uppercase block mb-2">
              Who it&apos;s for
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built for the whole local economy.
            </h2>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              Kasirize connects households and small businesses who need help
              with young people ready to work, while giving employers an
              evidence-first way to spot real ability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1: Youth */}
            <div className="bg-brand-deep text-white p-6 rounded-card flex flex-col justify-between shadow-card hover:shadow-lift transition-all duration-300 group">
              <div>
                <div className="size-12 rounded-btn bg-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                  🌿
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">Youth</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-6">
                  Turn what you can do into verified skills, complete nearby
                  tasks, and access real jobs with interview transport.
                </p>
              </div>
              <button
                onClick={() => handleSelectRole("role-user")}
                className="inline-flex items-center justify-between text-xs font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-[0.98] px-3.5 py-2.5 rounded-btn transition-all cursor-pointer"
              >
                <span>Create My Profile</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Role 2: Task Requester */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card hover:shadow-lift hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="size-12 rounded-btn bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                  🏪
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Task Requester
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Find verified local help for short, clearly described
                  neighbourhood tasks with safe escrow payment release.
                </p>
              </div>
              <button
                onClick={() => handleSelectRole("role-requester")}
                className="inline-flex items-center justify-between text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 active:scale-[0.98] px-3.5 py-2.5 rounded-btn transition-all cursor-pointer"
              >
                <span>Join as Requester</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Role 3: Employer */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card hover:shadow-lift hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="size-12 rounded-btn bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                  🏢
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Employer
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  View evidence-based candidate profiles, invite to interviews
                  with taxi vouchers, and close hiring vacancies faster.
                </p>
              </div>
              <button
                onClick={() => handleSelectRole("role-employer")}
                className="inline-flex items-center justify-between text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 active:scale-[0.98] px-3.5 py-2.5 rounded-btn transition-all cursor-pointer"
              >
                <span>Join as Employer</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Role 4: Skill Mentor */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card hover:shadow-lift hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="size-12 rounded-btn bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                  👨‍🏫
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Skill Mentor
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Offer workshops, mentor mentees, confirm learning completion,
                  and guide local youth toward productive trades.
                </p>
              </div>
              <button
                onClick={() => handleSelectRole("role-mentor")}
                className="inline-flex items-center justify-between text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 active:scale-[0.98] px-3.5 py-2.5 rounded-btn transition-all cursor-pointer"
              >
                <span>Join as Skill Mentor</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            3. HOW KASIRIZE WORKS (THE 10-STEP LIFECYCLE)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-16 md:py-24 bg-muted/50 border-y border-border scroll-mt-12"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="block h-1 w-12 rounded-full bg-primary mb-3" />
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                How Kasirize Works
              </h2>
              <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                A transparent, human-first cycle: from telling your story to
                walking into an interview.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                {
                  step: "01",
                  title: "Tell your story",
                  desc: "Describe what you have done in your own words, on any smartphone.",
                },
                {
                  step: "02",
                  title: "AI extracts skills",
                  desc: "Kasirize analyzes your story and identifies candidate practical skills.",
                },
                {
                  step: "03",
                  title: "You confirm & approve",
                  desc: "Review each skill. Accept, edit, or reject. You stay in 100% control.",
                },
                {
                  step: "04",
                  title: "Complete a task",
                  desc: "Pick up nearby micro-work from verified local shops and households.",
                },
                {
                  step: "05",
                  title: "Get confirmed & rated",
                  desc: "Requester rates your timeliness, skill, and effort, adding real evidence.",
                },
                {
                  step: "06",
                  title: "Badges generated",
                  desc: "Confirmed achievements are added to your profile as verified badges.",
                },
                {
                  step: "07",
                  title: "Confidence builds",
                  desc: "Scores rise transparently with repeated performance and quality evidence.",
                },
                {
                  step: "08",
                  title: "Employer matching",
                  desc: "Matches calculate 50% skill overlap, 20% pref, 15% location, 15% readiness.",
                },
                {
                  step: "09",
                  title: "Interview invite",
                  desc: "Employers inspect verified evidence and invite candidates directly.",
                },
                {
                  step: "10",
                  title: "Transport support",
                  desc: "Transport credits unlock so travel cost never blocks career mobility.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-5 rounded-card bg-card border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-heading text-xl font-bold text-primary mb-2 block tabular-nums">
                      {item.step}
                    </span>
                    <h4 className="font-heading text-sm font-bold text-foreground mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            4. WHY JOIN KASIRIZE (VALUE PROPOSITIONS)
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="why-choose-us" className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="mb-10 flex max-w-2xl flex-col gap-3 md:mb-14">
              <span className="block h-1 w-12 rounded-full bg-primary" />
              <h2 className="text-3xl font-heading leading-tight md:text-[2.6rem] font-bold tracking-tight text-foreground">
                Why join Kasirize
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Because the work you have already done should count for
                something — and every step here builds proof you can carry.
              </p>
            </div>

            <div className="grid gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-6">
              <div className="rounded-card border p-6 shadow-card md:p-7 flex flex-col gap-4 lg:col-span-4 border-transparent bg-primary text-primary-foreground hover:shadow-lift transition-all">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-white/15">
                  ✍️
                </span>
                <h3 className="text-xl md:text-3xl font-heading font-bold">
                  Everyday experience counts
                </h3>
                <p className="leading-relaxed text-primary-foreground/90 md:text-lg">
                  Describe the work you already do in plain language. Kasirize
                  suggests possible skills, and you decide what stays on your
                  profile.
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-card md:p-7 hover:shadow-lift hover:border-primary/40 transition-all flex flex-col gap-4 lg:col-span-2">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-primary/10">
                  🪪
                </span>
                <h3 className="text-xl font-heading font-bold">
                  A profile without paperwork
                </h3>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  No qualification needed to start. Your profile is built from
                  experience you can name and confirm yourself.
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-card md:p-7 hover:shadow-lift hover:border-primary/40 transition-all flex flex-col gap-4 lg:col-span-2">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-primary/10">
                  📍
                </span>
                <h3 className="text-xl font-heading font-bold">
                  Practical work nearby
                </h3>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  Browse short tasks posted by households and small businesses,
                  apply for one, and get real experience doing it.
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-card md:p-7 hover:shadow-lift hover:border-primary/40 transition-all flex flex-col gap-4 lg:col-span-4">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-primary/10">
                  🧾
                </span>
                <h3 className="text-xl font-heading font-bold">
                  A record of work done
                </h3>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  When someone who posted a task confirms it, that confirmation
                  becomes permanent evidence on your public profile.
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-card md:p-7 hover:shadow-lift hover:border-primary/40 transition-all flex flex-col gap-4 lg:col-span-3">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-primary/10">
                  ✅
                </span>
                <h3 className="text-xl font-heading font-bold">
                  Skills you have confirmed
                </h3>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  Requesters and mentors confirm what they saw. Confirmed skills
                  are always shown separately from self-declared ones.
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 text-card-foreground shadow-card md:p-7 hover:shadow-lift hover:border-primary/40 transition-all flex flex-col gap-4 lg:col-span-3">
                <span className="grid size-14 place-items-center rounded-btn text-3xl leading-none bg-primary/10">
                  🚌
                </span>
                <h3 className="text-xl font-heading font-bold">
                  Interview transport support
                </h3>
                <p className="leading-relaxed text-muted-foreground text-sm">
                  Where an employer offers it, transport escrow support ensures
                  taxi fares never stand between you and an in-person interview.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            5. WHAT MAKES KASIRIZE DIFFERENT
        ═══════════════════════════════════════════════════════════════════════ */}
        <section
          id="different"
          className="py-16 md:py-24 bg-muted/40 border-y border-border"
        >
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.55fr] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <span className="block h-1 w-12 rounded-full bg-primary" />
                <h2 className="mt-4 text-3xl leading-tight md:text-[2.6rem] font-heading font-bold text-foreground">
                  What makes Kasirize different
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Plenty of places will let you write a profile. Very few can
                  show anyone that it is true. That gap is the whole product.
                </p>
              </div>

              <ol className="flex flex-col">
                <li className="grid gap-3 border-t border-border py-7 last:border-b md:grid-cols-[3.25rem_1fr] md:gap-6 md:py-9">
                  <span className="font-heading text-3xl leading-none text-primary/45 tabular-nums md:text-4xl">
                    01
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      Proof is attached to the claim
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                      On a paper profile everything is written by the person it
                      describes. Here, every confirmed skill carries the task
                      behind it, the rating, and the name of whoever confirmed
                      it.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Confirmed and self-declared are never mixed
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Every confirmation traces back to a verified person
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="grid gap-3 border-t border-border py-7 last:border-b md:grid-cols-[3.25rem_1fr] md:gap-6 md:py-9">
                  <span className="font-heading text-3xl leading-none text-primary/45 tabular-nums md:text-4xl">
                    02
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      Your first evidence comes from your own street
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                      You do not need a corporate job to start. Short tasks from
                      households and small businesses nearby are the way in, and
                      every one you finish adds to the record under your name.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Work nearby, not work you must travel for
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Experience grows without a formal qualification
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="grid gap-3 border-t border-border py-7 last:border-b md:grid-cols-[3.25rem_1fr] md:gap-6 md:py-9">
                  <span className="font-heading text-3xl leading-none text-primary/45 tabular-nums md:text-4xl">
                    03
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      No machine decides for you
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                      Kasirize never scores, ranks or auto-rejects a person.
                      Employers and requesters read the record themselves —
                      confirmed work first, claims clearly labelled — and you
                      can see what they are looking at.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        No automated blackbox shortlists
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Humans read evidence, not an ATS filter
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="grid gap-3 border-t border-border py-7 last:border-b md:grid-cols-[3.25rem_1fr] md:gap-6 md:py-9">
                  <span className="font-heading text-3xl leading-none text-primary/45 tabular-nums md:text-4xl">
                    04
                  </span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                      Built for a cheap phone, not a boardroom
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                      Low data, small screens, no documents to scan and no ID
                      number to type in. A system that only works on a laptop
                      with a printer would miss exactly the people it is meant
                      for.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Works smoothly on low-data 3G connections
                      </li>
                      <li className="flex items-center gap-2 font-medium">
                        <Check className="size-4 flex-none text-primary" />
                        Free to start, at every step
                      </li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            6. ABOUT KASIRIZE & MISSION CONTEXT
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
              <div className="relative aspect-4/3 overflow-hidden rounded-card shadow-lift ring-1 ring-border group">
                <Image
                  src="/app-img/youthWorking.jpg"
                  alt="Young South Africans collaborating"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col gap-5">
                <span className="block h-1 w-12 rounded-full bg-primary" />

                <h2 className="text-3xl leading-tight md:text-[2.6rem] font-heading font-bold text-foreground">
                  What Kasirize is, in one paragraph
                </h2>

                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">
                      The core problem:
                    </strong>{" "}
                    How might we shorten the distance between young people and
                    meaningful income by translating skills into credible
                    profiles, practical experience, work opportunities and
                    career mobility?
                  </p>
                  <p>
                    Kasirize directly tackles the six key friction points:{" "}
                    <strong className="text-foreground">
                      skills verification
                    </strong>
                    ,{" "}
                    <strong className="text-foreground">
                      entry-level matching
                    </strong>
                    ,{" "}
                    <strong className="text-foreground">
                      micro-internships
                    </strong>
                    , <strong className="text-foreground">mentorship</strong>,{" "}
                    <strong className="text-foreground">
                      recognizing informal experience
                    </strong>
                    , and overcoming{" "}
                    <strong className="text-foreground">
                      transport and data barriers
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            7. TRUST & PRIVACY FIRST
        ═══════════════════════════════════════════════════════════════════════ */}
        {/* <section
          id="trust"
          className="py-16 md:py-24 bg-muted/60 border-y border-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <span className="block h-1 w-12 rounded-full bg-primary mb-4" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">
              Trust &amp; Privacy First
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-12 max-w-2xl">
              We designed Kasirize around strict POPIA principles and dignified privacy protections for young job seekers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-card bg-card border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all">
                <div className="text-3xl mb-3">🛡️</div>
                <h4 className="font-heading text-base font-bold text-foreground mb-2">
                  You control your info
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nothing is published without permission. Only requesters and employers you apply to see your profile evidence.
                </p>
              </div>

              <div className="p-6 rounded-card bg-card border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all">
                <div className="text-3xl mb-3">🚫</div>
                <h4 className="font-heading text-base font-bold text-foreground mb-2">
                  No ID numbers asked
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We never collect national ID numbers. You can build and use your profile completely free from identity risk.
                </p>
              </div>

              <div className="p-6 rounded-card bg-card border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all">
                <div className="text-3xl mb-3">🏷️</div>
                <h4 className="font-heading text-base font-bold text-foreground mb-2">
                  Clear verification tags
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Self-declared skills are always clearly distinguished from task-verified evidence on your profile.
                </p>
              </div>

              <div className="p-6 rounded-card bg-card border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-heading text-base font-bold text-foreground mb-2">
                  Start as a guest
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Explore and create a local profile on your phone without needing a password or credit card.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* ═══════════════════════════════════════════════════════════════════════
            8. TIMELINE: WHY THIS IS THE FUTURE
        ═══════════════════════════════════════════════════════════════════════ */}
        <section id="timeline" className="py-16 md:py-24 text-muted/60">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="mb-10 flex max-w-2xl flex-col gap-3 md:mb-14">
              <span className="block h-1 w-12 rounded-full bg-primary" />
              <h2 className="text-3xl leading-tight md:text-[2.6rem] font-heading font-bold text-foreground">
                Why this is the future of job seeking
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Work is changing faster than the paper around it. Evidence is
                replacing the paper profile, and that shift is already
                happening.
              </p>
            </div>

            <ol className="relative mx-auto max-w-3xl border-s-2 border-border ps-8 md:ps-12">
              <li className="relative pb-12 last:pb-0">
                <span
                  className="absolute left-[-2.35rem] md:left-[-3.35rem] top-1.5 size-4 rounded-full border-4 border-background bg-primary ring-2 ring-primary/30"
                  aria-hidden="true"
                />
                <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider">
                  Yesterday
                </span>
                <h3 className="mt-1 text-xl md:text-2xl font-heading font-bold text-foreground">
                  One document decided everything
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                  A profile on paper was written once and stood in for years of
                  work. If it did not look right, the interview never happened —
                  no matter what the person could actually do.
                </p>
              </li>

              <li className="relative pb-12 last:pb-0">
                <span
                  className="absolute left-[-2.35rem] md:left-[-3.35rem] top-1.5 size-4 rounded-full border-4 border-background bg-primary ring-2 ring-primary/30"
                  aria-hidden="true"
                />
                <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider">
                  Right now
                </span>
                <h3 className="mt-1 text-xl md:text-2xl font-heading font-bold text-foreground">
                  A generation works outside the system
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                  Short tasks, informal trade, side hustles and community roles
                  are how young people earn and build skill. Almost none of it
                  is recorded anywhere an employer can look.
                </p>
              </li>

              <li className="relative pb-12 last:pb-0">
                <span
                  className="absolute left-[-2.35rem] md:left-[-3.35rem] top-1.5 size-4 rounded-full border-4 border-background bg-primary ring-2 ring-primary/30"
                  aria-hidden="true"
                />
                <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider">
                  Next
                </span>
                <h3 className="mt-1 text-xl md:text-2xl font-heading font-bold text-foreground">
                  Proof of work becomes the new profile
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm">
                  When confirmed tasks, ratings and mentor sign-offs sit next to
                  your name, a stranger can see what you have really done. That
                  is what Kasirize is building — starting now.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            9. FAQ SECTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-24 bg-muted/40 border-y border-border">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
              <div className="mb-6 flex max-w-2xl flex-col gap-3">
                <span className="block h-1 w-12 rounded-full bg-primary" />
                <h2 className="text-3xl leading-tight md:text-[2.6rem] font-heading font-bold text-foreground">
                  Frequently asked questions
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  Everything you need to know about getting started,
                  verification, and privacy on Kasirize.
                </p>
              </div>

              <Accordion defaultValue={["item-1"]} className="cursor-pointer">
                {[
                  {
                    value: "item-1",
                    trigger: "Does it cost anything to use Kasirize?",
                    content:
                      "No. Building your profile, having your skills identified, and discovering tasks is completely free for young job seekers.",
                  },
                  {
                    value: "item-2",
                    trigger: "What counts as informal experience?",
                    content:
                      "Anything you have done: helping out in a local shop or tuck shop, caring for family, organising church or community events, fixing phones or gadgets, or casual deliveries.",
                  },
                  {
                    value: "item-3",
                    trigger: "Does AI decide my skills or hire me?",
                    content:
                      "No. AI only extracts and suggests potential skills from your story. You must review and approve every skill yourself. Kasirize never makes automated hiring or rejection decisions.",
                  },
                  {
                    value: "item-4",
                    trigger: "How does transport support work?",
                    content:
                      "When an employer or task requester offers transport credits, you can request an interview transport stipend calculated based on real local taxi fares.",
                  },
                ].map((faq) => (
                  <AccordionItem
                    key={faq.value}
                    value={faq.value}
                    className="border-border cursor-pointer bg-card px-4 rounded-card border mb-3 shadow-xs"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground py-4 hover:no-underline">
                      {faq.trigger}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                      {faq.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            10. FINAL CALL TO ACTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <section
          id="start"
          className="py-20 sm:py-24 bg-brand-deep text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-white text-balance">
              Open the door to what you can do
            </h2>
            <p className="text-base sm:text-lg text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
              Describe your informal experience today and turn it into confirmed
              skills, evidence, and badges.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleSelectRole("role-user")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-white text-brand-deep font-semibold text-sm hover:bg-white/95 active:scale-[0.98] transition-all shadow-card cursor-pointer"
              >
                <span>Build your profile</span>
                <ArrowRight className="size-4" />
              </button>
              <Link
                href="/tasks"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn border border-white/30 text-white font-medium text-sm hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Browse local tasks
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}
