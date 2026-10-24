import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
          <span className="font-heading font-bold text-sm text-foreground">
            Kasirize Trust &amp; Privacy
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Lock className="size-3.5" />
            <span>Privacy-First Architecture</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Your Information Belongs to You
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kasirize was built specifically to remove invasive barriers for
            young South Africans. We design for zero-exploitation and complete
            candidate control.
          </p>
        </div>

        <div className="space-y-6 text-sm text-foreground">
          <section className="p-5 rounded-card bg-card border border-border shadow-card space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">
              1. You can start without an account
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can describe your informal work, extract competencies, and
              review skills offline in your device&apos;s local storage. No
              password or personal identification number is required to start.
            </p>
          </section>

          <section className="p-5 rounded-card bg-card border border-border shadow-card space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">
              2. Your details are private by default
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We never broadcast your phone number, full street address, or
              WhatsApp contacts publicly. Requesters and employers only receive
              direct communication access after a task or interview invitation
              is accepted.
            </p>
          </section>

          <section className="p-5 rounded-card bg-card border border-border shadow-card space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">
              3. Strict separation of self-declared vs verified data
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every skill badge on Kasirize is marked with transparent
              provenance. Self-declared experience is clearly distinguished from
              referee-confirmed or completed-task evidence.
            </p>
          </section>

          <section className="p-5 rounded-card bg-card border border-border shadow-card space-y-2">
            <h2 className="font-heading font-bold text-base text-foreground">
              4. Immediate right to delete local demo data
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You have the right at any point to erase all cached offline data,
              profiles, and stories stored in your browser with a single click.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
