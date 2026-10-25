"use client";

import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";
import { getStoredAuthUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredAuthUser();
    const role = (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null) || user?.role;

    if (role && ROLE_CONFIGS[role]) {
      router.replace(ROLE_CONFIGS[role].dashboardUrl);
    } else {
      router.replace("/sign-in");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground text-xs text-muted-foreground">
      Redirecting to your dashboard...
    </div>
  );
}

