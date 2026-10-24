"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  RotateCcw,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([
    {
      id: "rep-1",
      type: "Task Dispute",
      parties: "Soweto Supermarket vs Lindiwe M.",
      reason: "Stock discrepancy dispute on till float",
      status: "pending",
      severity: "medium",
    },
    {
      id: "rep-2",
      type: "Requester Verification",
      parties: "Gauteng Deliveries Express",
      reason: "Proof of business registration submitted",
      status: "pending",
      severity: "low",
    },
  ]);

  const handleResolve = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Dispute resolved and logged in audit trail.");
  };

  const handleResetPlatformDemo = () => {
    if (confirm("Reset all platform demo data to default baseline?")) {
      localStorage.clear();
      toast.success("Platform demo data reset successfully.");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* ─── ADMIN HEADER ─── */}
      <header className="border-b border-border bg-card px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-destructive flex items-center justify-center text-white font-bold text-sm">
              <Shield className="size-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-destructive uppercase tracking-wider">
                Internal Trust &amp; Safety
              </div>
              <h1 className="font-heading font-bold text-base text-foreground leading-tight">
                Kasirize Admin Console
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10"
              onClick={handleResetPlatformDemo}
            >
              <RotateCcw className="size-3.5 mr-1" />
              <span>Reset Demo State</span>
            </Button>
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-xs",
              })}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* ─── PLATFORM HEALTH METRICS ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>System Health</span>
              <Activity className="size-3.5 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold text-primary">
              100% Operational
            </span>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Open Reports</span>
              <AlertTriangle className="size-3.5 text-accent" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              {reports.length}
            </span>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Verified Users</span>
              <Users className="size-3.5 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              1,240
            </span>
          </div>

          <div className="p-4 rounded-card bg-card border border-border shadow-card">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Transport Credits</span>
              <Database className="size-3.5 text-primary" />
            </div>
            <span className="font-heading text-xl font-bold text-primary">
              R 14,800 Active
            </span>
          </div>
        </div>

        {/* ─── ESCALATION & DISPUTE QUEUE ─── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-foreground">
              Dispute Resolution &amp; Trust Reports
            </h3>
            <span className="text-xs text-muted-foreground">
              {reports.length} pending moderation
            </span>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-card bg-card border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                        {rep.type}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {rep.parties}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {rep.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-initial text-xs font-semibold"
                      onClick={() => handleResolve(rep.id)}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      <span>Review &amp; Resolve</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-card bg-card border border-border text-center text-xs text-muted-foreground">
              No outstanding disputes or safety escalations. Platform status
              healthy.
            </div>
          )}
        </section>

        {/* ─── AUDIT TRAIL ─── */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-heading font-bold text-base text-foreground">
            Platform Audit Trail
          </h3>
          <div className="p-4 rounded-card bg-muted/60 border border-border text-xs text-muted-foreground space-y-2">
            <div>
              • [Auth] Requester &quot;Phiri Corner Stores&quot; completed
              identity verification.
            </div>
            <div>
              • [Transport] R120 taxi transport voucher disbursed for candidate
              interview #204.
            </div>
            <div>
              • [Badge] Tamper-proof badge &quot;Inventory Auditing&quot; issued
              to youth #01.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
