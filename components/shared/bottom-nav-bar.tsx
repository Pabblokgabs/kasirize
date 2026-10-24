"use client";

import { ROLE_CONFIGS, UserRole } from "@/constants/roles";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckSquare,
  Home,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Shield,
  Store,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
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

export function BottomNavBar({ role }: BottomNavProps) {
  const pathname = usePathname();
  const config = ROLE_CONFIGS[role];

  if (!config) return null;

  const visibleNavItems = config.navItems.filter(
    (item) => !item.hideOnBottomNav,
  );

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border h-20 px-2 py-1 shadow-lift"
    >
      <div className="flex items-center justify-around">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = ICON_MAP[item.iconName] || Home;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2.5 px-3 min-w-14 text-xs font-medium transition-colors rounded-btn ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComponent
                className={`size-5 mb-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="truncate max-w-16">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
