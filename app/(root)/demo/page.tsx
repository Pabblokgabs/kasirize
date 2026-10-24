"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function DemoModePage() {
  const handleClearData = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      toast.success("Local demo storage wiped clean.");
      setTimeout(() => window.location.reload(), 400);
    }
  };

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
            Kasirize Demo Sandbox
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Database className="size-3.5" />
            <span>Client-Safe Demo Mode</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            Demo Environment &amp; Local Data Control
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kasirize operates safely inside your browser session using
            LocalStorage. You can test Youth, Requester, Employer, and Mentor
            journeys without modifying live remote records.
          </p>
        </div>

        <div className="p-6 rounded-card bg-card border border-border shadow-card space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground">
            Reset Demo Data
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Clearing your local demo data will reset your active role, mock
            wallet balance, completed task counts, and return the application to
            its clean state.
          </p>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearData}
            className="font-semibold text-xs flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            <span>Delete Local Demo Data</span>
          </Button>
        </div>

        <div className="p-6 rounded-card bg-muted/60 border border-border space-y-3 text-xs text-muted-foreground">
          <h3 className="font-bold text-foreground">Quick Switch Roles</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/user"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary text-foreground font-semibold text-center"
            >
              Youth Dashboard
            </Link>
            <Link
              href="/dashboard/requester"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary text-foreground font-semibold text-center"
            >
              Requester Dashboard
            </Link>
            <Link
              href="/dashboard/employer"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary text-foreground font-semibold text-center"
            >
              Employer Dashboard
            </Link>
            <Link
              href="/dashboard/mentor"
              className="p-3 rounded-lg bg-card border border-border hover:border-primary text-foreground font-semibold text-center"
            >
              Mentor Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
