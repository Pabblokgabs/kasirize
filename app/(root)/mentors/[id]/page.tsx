import { buttonVariants } from "@/components/ui/button";
import { MOCK_MENTORS } from "@/constants/mock-data";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return MOCK_MENTORS.map((m) => ({
    id: m.id,
  }));
}

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = MOCK_MENTORS.find((m) => m.id === id);

  if (!mentor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── HEADER ─── */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/mentors"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Mentors</span>
          </Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
            Verified Skill Mentor
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* ─── HERO CARD ─── */}
        <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                {mentor.organization}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {mentor.fullName}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">
                  {mentor.roleTitle}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  {mentor.location}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-muted-foreground">
                Active Mentees
              </div>
              <div className="text-xl font-heading font-bold text-primary">
                {mentor.activeMenteesCount} Mentees Coached
              </div>
            </div>
          </div>
        </div>

        {/* ─── BIO & DETAILS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                Mentor Bio &amp; Background
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mentor.bio}
              </p>
            </div>

            <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-3">
              <h2 className="font-heading font-bold text-base text-foreground">
                Verified Skill Specialties
              </h2>
              <div className="space-y-2">
                {mentor.specialties.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-muted flex items-center justify-between text-xs text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary" />
                      <span className="font-semibold">{s}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      Practical Referee &amp; Badging
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-4">
            <div className="p-5 rounded-card bg-card border border-border shadow-card space-y-4">
              <h3 className="font-heading font-bold text-sm text-foreground">
                Connect with this Mentor
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get coaching, join micro-workshops, and have your informal work
                verified to unlock higher confidence scores.
              </p>

              <Link
                href="/dashboard/user"
                className={buttonVariants({
                  className: "w-full font-semibold shadow-xs justify-center",
                })}
              >
                Connect via Youth Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
