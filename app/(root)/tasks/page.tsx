"use client";

import Footer from "@/components/footer/page";
import NavBar from "@/components/nav-bar/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bus,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function KasirizeTasksPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    category: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Thank you! You will now receive task updates for your area.",
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── NAVIGATION HEADER ─── */}
      <NavBar />

      <main className="flex-1">
        {/* ─── HERO BANNER ─── */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/app-img/complete-task.jpg"
              alt="Young South African completing paid tasks"
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
                <span>Short paid tasks near you</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-white">
                Kasirize Tasks: paid work near you in South Africa
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-xl font-normal">
                Find short tasks posted by local shops, households and
                organizations. Do them well, and turn each confirmed job into
                verified experience on your Kasirize profile.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="#updates-form">
                  <Button size="lg" className="bg-white text-primary">
                    <span className="text-primary">Find tasks near me</span>
                  </Button>
                </Link>
                <Link
                  href="#how-it-works"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "border-white/30 text-white hover:bg-white/10 backdrop-blur",
                  })}
                >
                  How Kasirize Tasks work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── GET TASK UPDATES FOR YOUR AREA ─── */}
        <section
          id="updates-form"
          className="py-16 sm:py-24 bg-muted/50 border-b border-border"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              <div>
                <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                  Get task updates for your area
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-4 max-w-lg">
                  Leave your details and we will point you to open Kasirize
                  Tasks near you.
                </p>
                <p className="text-xs text-muted-foreground/80 max-w-md">
                  Your details are only used to share nearby tasks. Nothing is
                  shown publicly.
                </p>
              </div>

              <div className="bg-card p-6 sm:p-8 rounded-card border border-border shadow-card">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="task-name"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      Full name
                    </Label>
                    <Input
                      id="task-name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-background"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="task-email"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      Email
                    </Label>
                    <Input
                      id="task-email"
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
                      htmlFor="task-location"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      Town or area
                    </Label>
                    <Input
                      id="task-location"
                      type="text"
                      required
                      placeholder="e.g. Soweto, Johannesburg"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-background"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="task-category"
                      className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                    >
                      What kind of tasks can you do?
                    </Label>
                    <select
                      id="task-category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full h-9 px-3 py-1 text-sm rounded-md border border-input bg-background text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                    >
                      <option value="">Choose a category</option>
                      <option value="retail">
                        Spaza / Retail stock counting
                      </option>
                      <option value="delivery">Deliveries & errands</option>
                      <option value="cleaning">Cleaning & organization</option>
                      <option value="repairs">Appliance & phone repairs</option>
                      <option value="events">Event setup & marshaling</option>
                      <option value="other">Other general tasks</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Send me details</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHAT A KASIRIZE TASK GIVES YOU ─── */}
        <section
          id="how-it-works"
          className="py-20 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6"
        >
          <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">
            What a Kasirize Task gives you
          </h2>
          <p className="text-base text-muted-foreground mb-12 max-w-xl">
            Every task is a small, real job that builds evidence of what you can
            do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <MapPin className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Tasks near you
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Short paid tasks from spaza shops, households and community
                  organizations close to where you live.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Clock className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Short and clear
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Each task shows the budget, the time needed and the skills it
                  asks for before you apply.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <CheckCircle2 className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Confirmed when done
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The requester confirms completion and rates your work, so
                  effort becomes real evidence.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Award className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Badges that count
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Finish similar tasks well and you earn task badges that
                  strengthen your profile.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Explained confidence score
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  See exactly which ratings, evidence and completions shape your
                  score, with no mystery numbers.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-card p-6 rounded-card border border-border shadow-card flex flex-col justify-between hover:border-primary/50 hover:shadow-lift transition-all">
              <div>
                <div className="size-10 rounded-btn bg-muted text-primary flex items-center justify-center mb-4 border border-border">
                  <Bus className="size-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                  Transport support
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  If getting to a task or interview is a problem, you can
                  request transport support from Kasirize.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── QUESTIONS ABOUT KASIRIZE TASKS ─── */}
        <section id="faq" className="py-20 bg-muted/40 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12">
              <div>
                <span className="w-12 h-1 bg-primary rounded-full block mb-6" />
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
                  Questions about Kasirize Tasks
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "What exactly is a Kasirize Task?",
                    a: "A Kasirize Task is a discrete, short paid micro-job (such as 2 hours of inventory auditing, stock packing, or running community deliveries) posted by verified local businesses and residents.",
                  },
                  {
                    q: "When does a task suit me?",
                    a: "Tasks are ideal if you want flexible paid work that is walking distance or a short taxi ride away, and want to turn your time into verified work history on your CV.",
                  },
                  {
                    q: "How does a task become verified experience?",
                    a: "When you finish, the poster inspects the work, marks it complete on Kasirize, and submits a rating. This automatically issues a verified evidence stamp on your profile.",
                  },
                  {
                    q: "Is my confidence score created automatically?",
                    a: "Yes. As soon as your first task is confirmed, your confidence score begins reflecting your punctuality, ratings, and repeat completion reliability.",
                  },
                  {
                    q: "How do I get to a task if transport is a problem?",
                    a: "Kasirize calculates the estimated local taxi fare beforehand. For qualifying tasks or interviews, transport support stipends can be requested upfront.",
                  },
                  {
                    q: "Who can see my details?",
                    a: "Only the verified task requester whose task you apply for can see your profile and ratings. Your private details and phone numbers are protected.",
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
              Your next task could be around the corner
            </h2>
            <p className="text-sm sm:text-base text-white/85 mb-8 max-w-xl mx-auto">
              Join Kasirize Tasks, complete short paid work near you and turn it
              into verified experience.
            </p>
            <Link
              href="/build-profile"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-white text-brand-deep hover:bg-white/90 font-semibold shadow-xs",
              })}
            >
              <span className="text-primary">Create My Profile</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}
