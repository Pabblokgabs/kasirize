"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EXAMPLE_PROMPTS } from "@/constants";
import { ROLE_STORAGE_KEY } from "@/constants/roles";
import { getStoredProfile, saveStoredProfile } from "@/lib/store";
import { cn } from "cn";
import {
  ArrowRight,
  CheckCircle,
  Info,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ExperienceStoryPage() {
  const router = useRouter();
  const [profile] = useState(() => getStoredProfile());
  const [story, setStory] = useState(profile.experienceStory || "");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleUsePrompt = (text: string, ) => {
    setStory((prev) => (prev ? `${prev}\n\n${text}` : text));
  };

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim() || story.trim().length < 15) {
      toast.error("Please describe your work with at least a sentence or two.");
      return;
    }

    setIsExtracting(true);

    try {
      // Save current story into profile state
      const updated = {
        ...profile,
        experienceStory: story.trim(),
      };
      saveStoredProfile(updated);

      toast.success("Experience saved! Extracting skills...");
      router.push("/review-skills");

       if (typeof window !== "undefined") {
      localStorage.setItem(ROLE_STORAGE_KEY, 'role-user');
    }
    } catch (err) {
      console.error("Failed to save experience:", err);
      toast.error("Could not proceed. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="font-heading font-bold text-foreground">
              Kasirize
            </span>
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            Step 2 of 3: Experience Story
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground mb-3">
            <Sparkles className="size-3.5 text-primary" />
            <span>Plain language • No formal CV required</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Describe the work you have done
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tell us about anything that took effort, responsibility, or skill —
            paid or unpaid. Kasirize will look for the skills inside your own
            words.
          </p>
        </div>

        <form onSubmit={handleProceed} className="space-y-6">
          {/* Quick inspiration helpers */}
          <div className="p-4 rounded-card bg-muted border border-border">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-2">
              <Lightbulb className="size-4 text-amber-500" />
              <span>
                Need a nudge? Tap an example to start — then change it to your
                own words:
              </span>
            </div>
            <div className="space-y-2">
              {EXAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUsePrompt(prompt)}
                  className="w-full text-left text-xs p-2.5 rounded-btn bg-card hover:bg-card/80 border border-border text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-2">
            <Label
              htmlFor="experienceStory"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Your Experience in Your Own Words
            </Label>
            <Textarea
              id="experienceStory"
              rows={6}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="e.g. For the past year, I helped my aunt run her hair salon and spaza shop. I balanced the cash drawer at 5pm, took customer orders, and counted inventory when stock arrived..."
              className="bg-background min-h-35"
            />
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>Plain South African English or casual style is fine</span>
            </div>

            <div className="space-y-2.5 mt-5">
              <div className="flex flex-row items-center justify-between text-xs">
                <div
                  className={cn(
                    "flex flex-row items-center gap-2",
                    story.trim().length < 1
                      ? "text-muted-foreground"
                      : story.trim().length <= 50
                        ? "text-yellow-700"
                        : "text-primary",
                  )}
                >
                  {story.trim().length < 1 ? (
                    <>
                      <Info className="size-4 rotate-180" />
                      Start by writing a sentence or two. There is no wrong way
                      to do this
                    </>
                  ) : story.trim().length <= 50 ? (
                    <>
                      <Info className="size-4 rotate-180" />
                      Almost there — add a little more so we have something to
                      work with
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-4 text-primary" />
                      Looks good. We can work with this.
                    </>
                  )}
                </div>

                <span
                  className={cn(
                    story.trim().length < 1
                      ? "text-muted-foreground"
                      : story.trim().length <= 50
                        ? "text-yellow-700"
                        : "text-primary",
                  )}
                >
                  {story.length}/500
                </span>
              </div>

              <div className="w-full h-1.5 bg-border rounded-full">
                <div
                  style={{ width: `${(story.length / 500) * 100}%` }}
                  className="bg-primary flex-1 h-full rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isExtracting || story.trim().length <= 50}
              size="lg"
              
              className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              <span>
                {isExtracting
                  ? "Extracting skills..."
                  : "Extract & Review Skills"}
              </span>
              <ArrowRight className="size-4" />
            </Button>

            <Link
              href="/build-profile"
              className="block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to basic details
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
