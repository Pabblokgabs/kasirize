"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Award,
  Bot,
  Bus,
  ChevronDown,
  Edit3,
  MapPin,
  Paperclip,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function YouthProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! Your Youth Profile setup has started.");
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── NAVIGATION HEADER ─── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-btn overflow-hidden bg-brand-deep flex items-center justify-center text-white font-bold text-lg shadow-xs">
              <span className="font-heading">K</span>
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Kasirize
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/tasks"
              className="hover:text-primary transition-colors"
            >
              Tasks
            </Link>
            <Link
              href="/contact-us"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/build-profile"
              className={buttonVariants({
                size: "sm",
                className: "font-semibold",
              })}
            >
              Create Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── HERO BANNER ─── */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/app-img/capture-info.jpg"
              alt="Young South African describing work skills"
              fill
              priority
              className="object-cover object-right sm:object-center opacity-65"
            />
            <div className="absolute inset-0 bg-linear-to-r from-brand-deep via-brand-deep/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 md:py-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 border border-white/20 mb-6 backdrop-blur">
                <Sparkles className="size-3.5 text-accent" />
                <span>Kasirize • South Africa</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-white">
                Youth Profile and Skills for South Africa
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-xl font-normal">
                Describe your informal experience and turn it into confirmed
                skills, evidence, and badges — with AI suggestions you review
                and approve yourself.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="#start-form"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "bg-white text-brand-deep hover:bg-white/90 font-semibold shadow-xs",
                  })}
                >
                  Build your profile
                </Link>
                <Link
                  href="#included"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-white/30 text-white hover:bg-white/10 backdrop-blur",
                  })}
                >
                  See what&apos;s included
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── START YOUR PROFILE FORM SECTION ─── */}
        <section
          id="start-form"
          className="py-16 sm:py-24 bg-muted/50 border-b border-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              <div>
                <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                  Start your Youth Profile and Skills
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-lg">
                  Tell us a little about yourself and we will help you get
                  started. No account needed.
                </p>
                <p className="text-xs text-muted-foreground/80 max-w-md">
                  We do not collect ID numbers and never show your details
                  publicly.
                </p>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-card border border-border shadow-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="youth-name"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      Name
                    </Label>
                    <Input
                      id="youth-name"
                      type="text"
                      required
                      placeholder="Your first name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-background"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="youth-email"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      Email
                    </Label>
                    <Input
                      id="youth-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-background"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="youth-experience"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      What informal experience can you describe?
                    </Label>
                    <Textarea
                      id="youth-experience"
                      rows={3}
                      required
                      placeholder="e.g. helping at a spaza shop, fixing phones, running errands..."
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Get started</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHAT THE YOUTH PROFILE AND SKILLS INCLUDES ─── */}
        <section
          id="included"
          className="py-20 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6"
        >
          <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">
            What the Youth Profile and Skills includes
          </h2>
          <p className="text-base text-muted-foreground mb-12 max-w-xl">
            Everything you need to make your experience visible and credible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Edit3 className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Experience capture
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Describe informal work in your own words, on any phone.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Bot className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Skill extraction you approve
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  AI suggests skills; you review, edit, accept or reject each
                  one.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Paperclip className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Evidence you upload
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Add proof of your work and request referee confirmation.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Award className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Badges and confidence scores
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  See clearly what counts towards your score and why.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Bus className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Transport support
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Get help reaching interviews once an employer invites you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUESTIONS ABOUT YOUTH PROFILE AND SKILLS ─── */}
        <section id="faq" className="py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12">
              <div>
                <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                  Questions about Youth Profile and Skills
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "Who does this fit me?",
                    a: "It fits anyone between 18 and 35 who has informal experience (spaza shop work, childcare, fixing appliances, volunteering) but lacks formal certificates or CV credentials.",
                  },
                  {
                    q: "Does AI decide my skills?",
                    a: "No. AI only extracts and suggests relevant skills from your written story. You retain full control to approve, modify, or reject any suggested skill before it appears on your profile.",
                  },
                  {
                    q: "How are self-declared skills kept separate?",
                    a: "Your profile clearly distinguishes between skills you have declared yourself and skills backed by confirmed completed tasks or referee verifications.",
                  },
                  {
                    q: "How does the confidence score work?",
                    a: "The score increases each time a local task requester, referee, or employer confirms your completed work, timeliness, and reliability.",
                  },
                  {
                    q: "Do I need an account to start?",
                    a: "No account or password is required to begin describing your experience and exploring skills.",
                  },
                  {
                    q: "Are my personal details private?",
                    a: "Yes. We never share your full contact info, national ID, or location publicly. Employers only see your verified skills and badge evidence.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-card border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between font-heading font-semibold text-sm sm:text-base text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform duration-200 ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CALL TO ACTION BANNER ─── */}
        <section className="relative overflow-hidden py-20 bg-brand-deep text-white text-center">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Open the door to what you can do
            </h2>
            <p className="text-sm sm:text-base text-white/85 mb-8 max-w-xl mx-auto">
              Describe your informal experience today and turn it into confirmed
              skills, evidence and badges.
            </p>
            <Link
              href="#start-form"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-white text-brand-deep hover:bg-white/90 font-semibold shadow-xs",
              })}
            >
              Build your profile
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        id="contact"
        className="bg-brand-deep/95 text-white/80 py-14 text-xs border-t border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-btn bg-white/15 flex items-center justify-center text-white font-bold text-xs">
                  K
                </div>
                <span className="font-heading font-bold text-sm text-white">
                  Kasirize
                </span>
              </div>
              <p className="text-white/80 max-w-xs leading-relaxed mb-4">
                Open the door to what you can do.
              </p>
              <div className="inline-flex items-center gap-1.5 text-white/60">
                <MapPin className="size-3.5 text-primary-foreground" />
                <span>South Africa</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 md:justify-end text-sm">
              <div className="space-y-2.5">
                <div>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </div>
                <div>
                  <Link
                    href="/#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </div>
                <div>
                  <Link
                    href="/tasks"
                    className="hover:text-white transition-colors"
                  >
                    Kasirize Tasks
                  </Link>
                </div>
                <div>
                  <Link
                    href="/contact-us"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div className="space-y-2.5 sm:pl-8">
                <div>
                  <Link
                    href="/youth-profile"
                    className="text-white font-medium hover:underline"
                  >
                    Youth Profile and Skills
                  </Link>
                </div>
                <div>
                  <Link
                    href="/#roles"
                    className="hover:text-white transition-colors"
                  >
                    Roles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[11px]">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3 text-primary-foreground" />
              <span>South Africa</span>
            </div>
            <div>© 2026 Kasirize. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
