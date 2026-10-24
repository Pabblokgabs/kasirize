import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ReportItem {
  id: string;
  type:
    | "payment_dispute"
    | "harassment"
    | "fake_profile"
    | "task_not_completed";
  reporter: string;
  reported: string;
  status: "open" | "under_review" | "resolved";
  date: string;
  description: string;
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: "REP-104",
    type: "payment_dispute",
    reporter: "Sipho Dlamini (Youth)",
    reported: "QuickBite Takeaways (Requester)",
    status: "open",
    date: "2026-10-22",
    description:
      "Task completed and verified by photo evidence, but R180 payout still pending after 48h.",
  },
  {
    id: "REP-103",
    type: "harassment",
    reporter: "Nomvula Khumalo (Youth)",
    reported: "User-89312 (Requester)",
    status: "under_review",
    date: "2026-10-21",
    description:
      "Requester asked for off-platform phone number and made inappropriate comments in chat.",
  },
  {
    id: "REP-102",
    type: "task_not_completed",
    reporter: "Lindiwe Mazibuko (Requester)",
    reported: "Bafana Sithole (Youth)",
    status: "resolved",
    date: "2026-10-19",
    description:
      "Candidate arrived 2 hours late and left before stock count was finalized. Refunded R75 to requester.",
  },
  {
    id: "REP-101",
    type: "fake_profile",
    reporter: "System Guard Bot",
    reported: "Apex Recruitment Agency (Employer)",
    status: "resolved",
    date: "2026-10-18",
    description:
      "Employer account requested application fees from youth candidates. Account terminated.",
  },
];

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-6 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link
          href="/dashboard/admin"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="size-4 mr-1.5" /> Back to Admin Console
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Trust & Safety Dispute Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active flags, safety escalations, and escrow payment disputes across
            the platform.
          </p>
        </div>
      </div>

      {/* Reports Summary Table */}
      <div className="bg-card rounded-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Violation Type</th>
                <th className="p-3.5">Complainant</th>
                <th className="p-3.5">Reported Subject</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_REPORTS.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono text-muted-foreground font-semibold">
                    {r.id}
                  </td>
                  <td className="p-3.5 font-medium text-foreground">
                    <span className="capitalize">
                      {r.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-3.5 text-foreground">{r.reporter}</td>
                  <td className="p-3.5 text-foreground">{r.reported}</td>
                  <td className="p-3.5">
                    {r.status === "open" && (
                      <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold">
                        Open
                      </span>
                    )}
                    {r.status === "under_review" && (
                      <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
                        Under Review
                      </span>
                    )}
                    {r.status === "resolved" && (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        Resolved
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                    {r.date}
                  </td>
                  <td
                    className="p-3.5 max-w-xs truncate text-muted-foreground"
                    title={r.description}
                  >
                    {r.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
