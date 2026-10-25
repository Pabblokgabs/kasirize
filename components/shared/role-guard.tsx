"use client";

import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";
import { getStoredAuthUser } from "@/lib/auth";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredRoleSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  const user = getStoredAuthUser();
  return localStorage.getItem(ROLE_STORAGE_KEY) || user?.role || null;
}

function getServerSnapshot(): string | null {
  return null;
}

export function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const router = useRouter();
  const currentRole = useSyncExternalStore(
    subscribe,
    getStoredRoleSnapshot,
    getServerSnapshot,
  ) as UserRole | null;

  useEffect(() => {
    if (typeof window !== "undefined" && currentRole === null) {
      const rawUser = getStoredAuthUser();
      const immediateRole = localStorage.getItem(ROLE_STORAGE_KEY) || rawUser?.role;
      if (!immediateRole) {
        router.replace(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    }
  }, [currentRole, router]);

  // While mounting or redirecting
  if (currentRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Authorized
  if (currentRole === requiredRole || currentRole === "role-admin") {
    return <>{children}</>;
  }

  // Not authorized (different role)
  if (currentRole) {
    const targetDashboard = ROLE_CONFIGS[currentRole]?.dashboardUrl || "/";

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center shadow-lg">
          <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="size-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-1">Access Restricted</h2>
          <p className="text-xs text-muted-foreground mb-6">
            This workspace requires a{" "}
            <span className="font-semibold text-foreground">
              {ROLE_CONFIGS[requiredRole]?.name || requiredRole}
            </span>{" "}
            account. You are currently logged in with a different role.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href={targetDashboard}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Go to My {ROLE_CONFIGS[currentRole]?.name} Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Switch Account / Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Verifying authorization...</p>
      </div>
    </div>
  );
}
