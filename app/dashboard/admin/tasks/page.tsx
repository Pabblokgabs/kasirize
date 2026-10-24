"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_TASKS } from "@/constants/mock-data";
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminTasksPage() {
  const [tasks] = useState(MOCK_TASKS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Task Moderation & Oversight
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit live, completed, and disputed short gigs across all townships.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-btn text-xs">
          {["all", "open", "in_progress", "completed", "disputed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-btn font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Filter tasks by title, requester, or township..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card text-xs"
        />
      </div>

      {/* Task List Table */}
      <div className="bg-card rounded-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <th className="p-3.5">Task Title</th>
                <th className="p-3.5">Requester</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Payout</th>
                <th className="p-3.5">Taxi Est.</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => {
                const isExpanded = expandedId === t.id;
                return (
                  <tr
                    key={t.id}
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-3.5" colSpan={7}>
                      <div
                        onClick={() => toggleExpand(t.id)}
                        className="grid grid-cols-7 items-center cursor-pointer"
                      >
                        <div className="col-span-1 font-semibold text-foreground truncate pr-2">
                          {t.title}
                        </div>
                        <div className="col-span-1 text-muted-foreground truncate pr-2">
                          {t.requesterName}
                        </div>
                        <div className="col-span-1 text-muted-foreground truncate pr-2">
                          {t.location}
                        </div>
                        <div className="col-span-1 font-bold text-foreground">
                          R {(t.payoutCents / 100).toFixed(0)}
                        </div>
                        <div className="col-span-1 text-muted-foreground">
                          R {(t.estimatedTaxiFareCents / 100).toFixed(0)}
                        </div>
                        <div className="col-span-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              t.status === "open"
                                ? "bg-primary/10 text-primary"
                                : t.status === "in_progress"
                                  ? "bg-muted text-foreground"
                                  : t.status === "completed"
                                    ? "bg-accent/15 text-accent"
                                    : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {t.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="col-span-1 flex justify-end text-muted-foreground">
                          {isExpanded ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </div>
                      </div>

                      {/* Expandable details row */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border/60 bg-muted/20 p-3 rounded-btn space-y-2 text-xs">
                          <p className="text-foreground">
                            <span className="font-semibold">Description:</span>{" "}
                            {t.description}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Safety Notes:
                            </span>{" "}
                            {t.safetyNotes}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <span className="font-semibold text-foreground mr-1">
                              Skills:
                            </span>
                            {t.skillsRequired.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-muted px-2 py-0.5 rounded text-[10px]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
