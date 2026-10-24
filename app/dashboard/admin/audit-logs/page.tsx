import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Shield, Terminal } from "lucide-react";
import Link from "next/link";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip: string;
}

const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "LOG-9921",
    timestamp: "2026-10-23 02:14:02 SAST",
    actor: "Admin Console (System)",
    role: "System",
    action: "SECURITY_SCAN_COMPLETED",
    target: "All Endpoints",
    ip: "127.0.0.1",
  },
  {
    id: "LOG-9920",
    timestamp: "2026-10-23 01:58:19 SAST",
    actor: "Lindiwe Mazibuko",
    role: "Requester",
    action: "TASK_PUBLISHED",
    target: "Task: Spaza Stock Count",
    ip: "102.132.84.***",
  },
  {
    id: "LOG-9919",
    timestamp: "2026-10-23 01:42:33 SAST",
    actor: "Bongani Sithole",
    role: "Mentor",
    action: "SKILL_ENDORSED",
    target: "Youth: Tebogo Sithole (Electrical)",
    ip: "197.89.21.***",
  },
  {
    id: "LOG-9918",
    timestamp: "2026-10-23 00:15:10 SAST",
    actor: "System Escrow Daemon",
    role: "System",
    action: "PAYMENT_ESCROW_RELEASED",
    target: "Youth: Lerato Mokoena (R180.00)",
    ip: "internal",
  },
  {
    id: "LOG-9917",
    timestamp: "2026-10-22 22:50:44 SAST",
    actor: "Admin Moderator #2",
    role: "Admin",
    action: "ACCOUNT_SUSPENDED",
    target: "Requester: Tshepo QuickWash",
    ip: "41.13.72.***",
  },
  {
    id: "LOG-9916",
    timestamp: "2026-10-22 21:12:05 SAST",
    actor: "Massmart Logistics",
    role: "Employer",
    action: "TAXI_CREDIT_ISSUED",
    target: "Candidate: Kagiso Mokoena (R100.00)",
    ip: "165.25.10.***",
  },
  {
    id: "LOG-9915",
    timestamp: "2026-10-22 19:40:12 SAST",
    actor: "Sipho Dlamini",
    role: "Youth",
    action: "PROFILE_STORY_ANALYZED",
    target: "Gemini AI Skill Extraction",
    ip: "105.4.192.***",
  },
  {
    id: "LOG-9914",
    timestamp: "2026-10-22 17:05:31 SAST",
    actor: "System Guard Bot",
    role: "System",
    action: "HARASSMENT_FILTER_FLAG",
    target: "Chat Session #38402",
    ip: "internal",
  },
  {
    id: "LOG-9913",
    timestamp: "2026-10-22 15:22:18 SAST",
    actor: "Nomvula Khumalo",
    role: "Youth",
    action: "TASK_APPLICATION_SUBMITTED",
    target: "Bakery Assistance (R150.00)",
    ip: "196.21.144.***",
  },
  {
    id: "LOG-9912",
    timestamp: "2026-10-22 14:01:00 SAST",
    actor: "Admin Moderator #1",
    role: "Admin",
    action: "DATABASE_CHECKPOINT_SAVED",
    target: "Production Ledger",
    ip: "10.0.0.4",
  },
];

export default function AdminAuditLogsPage() {
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
            System Audit Trail & Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Immutable security event logs, payout escrows, and administrative
            actions.
          </p>
        </div>
        <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Shield className="size-3.5" /> POPIA & Audit Compliant
        </span>
      </div>

      {/* Log Feed */}
      <div className="bg-card rounded-card border border-border shadow-card overflow-hidden">
        <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-mono">
            <Terminal className="size-3.5 text-primary" />
            <span>syslog_stream: stdout (retention: 365d)</span>
          </div>
          <span>Displaying last 10 entries</span>
        </div>

        <div className="divide-y divide-border">
          {MOCK_AUDIT_LOGS.map((entry) => (
            <div
              key={entry.id}
              className="p-3.5 hover:bg-muted/15 transition-colors font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="flex items-start md:items-center gap-2.5">
                <span className="text-[10px] text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded">
                  {entry.id}
                </span>
                <div>
                  <span className="text-primary font-bold">{entry.action}</span>
                  <span className="text-muted-foreground mx-1.5">→</span>
                  <span className="text-foreground">{entry.target}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground shrink-0">
                <span>
                  by{" "}
                  <span className="text-foreground font-medium">
                    {entry.actor}
                  </span>{" "}
                  ({entry.role})
                </span>
                <span className="text-muted-foreground/60">•</span>
                <span>{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
