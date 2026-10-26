"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EXAMPLE_PROMPTS } from "@/constants";
import { getProfileDraft, saveProfileDraft } from "@/lib/draft-store";
import { ArrowLeft, ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperienceStoryPage() {
  const router = useRouter();
  const [draft] = useState(() => getProfileDraft());
  const [story, setStory] = useState(draft.experienceStory || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUsePrompt = (text: string) => {
    setStory((prev) => (prev ? `${prev}\n\n${text}` : text));
    if (errorMessage) setErrorMessage("");
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim() || story.trim().length < 15) {
      setErrorMessage("Please describe your work with at least a sentence or two (minimum 15 characters).");
      return;
    }

    setErrorMessage("");

    // Save only to temporary draft session, NOT to localStorage or database
    saveProfileDraft({
      experienceStory: story.trim(),
    });

    router.push("/review-skills");
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
          <div className="flex flex-row items-center gap-2 mb-3">
            <Link
              className="inline-flex items-center gap-1.5 font-label text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              href="/build-profile"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Plain language • No formal CV required</span>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Describe the work you have done
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tell us about anything that took effort, responsibility, or skill —
            paid or unpaid. Kasirize will extract verified practical competencies.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleProceed} className="space-y-6">
          {/* Quick inspiration helpers */}
          <div className="p-4 rounded-card bg-muted border border-border">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-foreground">
              <Lightbulb className="size-4 text-warning" />
              <span>Township & community examples (click to paste):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUsePrompt(promptText)}
                  className="text-xs px-2.5 py-1 rounded-full bg-card hover:bg-card/80 border border-border text-foreground transition-colors text-left"
                >
                  + {promptText.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="experienceStory"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Your Story in Your Own Words
              </Label>
              <span className="text-xs text-muted-foreground">
                {story.length} characters
              </span>
            </div>
            <Textarea
              id="experienceStory"
              rows={7}
              placeholder="For example: I worked at my uncle's spaza shop in Soweto for a year. Every Saturday morning I received delivery stock from the wholesaler, counted cartons, checked expiry dates, and unpacked shelves. I also handled cash sales and worked the card machine..."
              value={story}
              onChange={(e) => {
                setStory(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              className="w-full text-base leading-relaxed"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={() => router.push("/build-profile")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-2 h-11 font-semibold group"
            >
              <span>Extract Skills with AI</span>
              <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
