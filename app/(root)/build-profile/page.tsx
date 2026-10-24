"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoredProfile, saveStoredProfile } from "@/lib/store";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function BuildProfilePage() {
  const router = useRouter();
  const [profile] = useState(() => getStoredProfile());
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email || "");
  const [location, setLocation] = useState(profile.location);
  const [province, setProvince] = useState(profile.province || "Gauteng");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !location.trim()) {
      toast.error("Please enter your name and town/area.");
      return;
    }

    const updated = {
      ...profile,
      fullName: fullName.trim(),
      email: email.trim(),
      location: location.trim(),
      province,
    };

    saveStoredProfile(updated);
    toast.success("Profile saved! Now describe your experience.");
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
            <a
              className="inline-flex items-center gap-1.5 font-label text-sm font-medium text-foreground-500 transition-colors hover:text-foreground-800"
              href="/preview/f362a67a-a4da-4732-9679-b3aa975409b6/14897190/onboarding"
              data-discover="true"
            >
              <ArrowLeft size={14} />
              Back
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Guest Profile</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Let&apos;s start with your name and area
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use your area to calculate realistic taxi fares and match you
            with tasks you can actually get to.
          </p>
        </div>

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
              placeholder="e.g. Thabiso Ndlovu"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background"
            />
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
              placeholder="you@example.com (optional for updates)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="location"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Town, Township or Suburb
            </Label>
            <Input
              id="location"
              type="text"
              required
              placeholder="e.g. Soweto, Khayelitsha, Umlazi, Tembisa"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-background"
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
              className="w-full h-9 px-2.5 py-1 text-sm rounded-md border border-input bg-background text-foreground shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            >
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="North West">North West</option>
              <option value="Northern Cape">Northern Cape</option>
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-semibold cursor-pointer"
            >
              <span>Continue to Experience Story</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span>Private by default. Never published publicly.</span>
          </div>
        </form>
      </main>
    </div>
  );
}
