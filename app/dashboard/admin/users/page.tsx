"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Youth" | "Requester" | "Employer" | "Mentor";
  location: string;
  joinedDate: string;
  status: "active" | "suspended";
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "Sipho Dlamini",
    email: "sipho.d@example.com",
    role: "Youth",
    location: "Soweto, GP",
    joinedDate: "2026-09-12",
    status: "active",
  },
  {
    id: "u2",
    name: "Lindiwe Mazibuko",
    email: "lindiwe.spaza@gmail.com",
    role: "Requester",
    location: "Soweto, GP",
    joinedDate: "2026-08-30",
    status: "active",
  },
  {
    id: "u3",
    name: "Massmart Logistics Hub",
    email: "talent@massmart.co.za",
    role: "Employer",
    location: "Johannesburg, GP",
    joinedDate: "2026-07-15",
    status: "active",
  },
  {
    id: "u4",
    name: "Bongani Sithole",
    email: "bongani.artisan@gmail.com",
    role: "Mentor",
    location: "Soweto, GP",
    joinedDate: "2026-06-20",
    status: "active",
  },
  {
    id: "u5",
    name: "Nomvula Khumalo",
    email: "nomvula.k@example.com",
    role: "Youth",
    location: "Alexandra, GP",
    joinedDate: "2026-09-28",
    status: "active",
  },
  {
    id: "u6",
    name: "Kagiso Mokoena",
    email: "kagiso.m@example.com",
    role: "Youth",
    location: "Tembisa, GP",
    joinedDate: "2026-10-01",
    status: "active",
  },
  {
    id: "u7",
    name: "Tshepo QuickWash",
    email: "tshepo.carwash@gmail.com",
    role: "Requester",
    location: "Vosloorus, GP",
    joinedDate: "2026-09-15",
    status: "suspended",
  },
  {
    id: "u8",
    name: "BriteStar Academy",
    email: "admissions@britestar.org",
    role: "Employer",
    location: "Pretoria, GP",
    joinedDate: "2026-08-10",
    status: "active",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
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
            User Accounts & Roles
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit user records, manage verification roles, and toggle
            suspensions.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-btn text-xs">
          {["All", "Youth", "Requester", "Employer", "Mentor"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-btn font-medium transition-colors ${
                roleFilter === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Filter by name, email, or province..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card text-xs"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-card border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5">
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {u.email}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-muted px-2 py-0.5 rounded-btn text-[11px] font-medium text-foreground">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{u.location}</td>
                  <td className="p-3.5 text-muted-foreground">
                    {u.joinedDate}
                  </td>
                  <td className="p-3.5">
                    {u.status === "active" ? (
                      <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                        Active
                      </span>
                    ) : (
                      <span className="text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-full text-[10px]">
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant={u.status === "active" ? "outline" : "default"}
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === "active" ? (
                        <>
                          <UserX className="size-3 mr-1 text-destructive" />{" "}
                          Suspend
                        </>
                      ) : (
                        <>
                          <UserCheck className="size-3 mr-1" /> Re-Activate
                        </>
                      )}
                    </Button>
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
