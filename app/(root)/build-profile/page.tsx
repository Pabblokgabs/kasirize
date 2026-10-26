"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfileDraft, saveProfileDraft } from "@/lib/draft-store";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuildProfilePage() {
  const router = useRouter();
  const [draft] = useState(() => getProfileDraft());
  const [fullName, setFullName] = useState(draft.fullName);
  const [email, setEmail] = useState(draft.email);
  const [location, setLocation] = useState(draft.location);
  const [province, setProvince] = useState(draft.province || "Gauteng");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !location.trim()) {
      setErrorMessage("Please enter your name and town/area.");
      return;
    }

    setErrorMessage("");

    // Save only to temporary draft session, NOT to localStorage or database
    saveProfileDraft({
      fullName: fullName.trim(),
      email: email.trim(),
      location: location.trim(),
      province,
    });

    router.push("/experience-story");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-heading font-bold text-foreground">
              Kasirize
            </span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            Step 1 of 3: Basic Details
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex flex-row items-center gap-2 mb-4">
            <Link
              className="inline-flex items-center gap-1.5 font-label text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="/"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Guest Profile Setup</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Let&apos;s start with your name and area
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use your area to calculate realistic taxi fares and match you
            with tasks you can actually get to. No data is stored until you finalize.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-card bg-card border border-border shadow-card space-y-5"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Full Name or First Name
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Sindi or Kagiso Sithole"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full text-base"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">
              Whatever you want community task requesters to call you.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Email Address (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. kagiso@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-base"
            />
            <p className="text-[11px] text-muted-foreground">
              Used when you choose to create a permanent account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="location"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Township / Area
              </Label>
              <Input
                id="location"
                type="text"
                required
                placeholder="e.g. Soweto, Tembisa, Alexandra"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full text-base"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="province"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Province
              </Label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full h-10 px-3 rounded-btn border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Gauteng">Gauteng</option>
                <option value="Western Cape">Western Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="Free State">Free State</option>
                <option value="North West">North West</option>
                <option value="Northern Cape">Northern Cape</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-btn bg-muted border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
            <p>
              Your data stays in your browser memory until you review skills and finalize. You can complete the profile first without signing up.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold group"
          >
            <span>Continue to Experience Story</span>
            <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>
      </main>
    </div>
  );
}
