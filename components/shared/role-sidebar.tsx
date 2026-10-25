"use client";

import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckSquare,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PlusCircle,
  Shield,
  Store,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface RoleSidebarProps {
  role: UserRole;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  CheckSquare,
  Briefcase,
  MessageSquare,
  User,
  LayoutDashboard,
  PlusCircle,
  Users,
  AlertTriangle,
  Shield,
  Store,
  Building2,
};

export function RoleSidebar({ role }: RoleSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const config = ROLE_CONFIGS[role];

  if (!config) return null;

  return (
    <aside
      aria-label="Desktop Dashboard Sidebar"
      className="hidden lg:flex flex-col w-64 shrink-0 bg-card border-r border-border min-h-screen sticky top-0 h-screen z-30"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <span className="font-heading">K</span>
          </div>
          <div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground block leading-none">
              Kasirize
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              {config.name} Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
        </div>

        {config.navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = ICON_MAP[item.iconName] || Home;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-btn transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <IconComponent
                className={`size-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info & Role Switcher */}
      <div className="p-3.5 border-t border-border bg-muted/20">
        <div className="bg-card rounded-card border border-border p-3 mb-3">
          <p className="text-xs font-bold text-foreground truncate">
            {config.name}
          </p>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
            {config.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem(ROLE_STORAGE_KEY);
              localStorage.removeItem("kasirize_auth_user");
            }
            router.push("/");
          }}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-btn transition-colors cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
