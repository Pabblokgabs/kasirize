"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ROLE_CONFIGS, ROLE_STORAGE_KEY, UserRole } from "@/constants/roles";
import { getStoredProfile } from "@/lib/store";
import { YouthProfile } from "@/types";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CheckSquare,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  Shield,
  Store,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

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

interface TabletNavDrawerProps {
  role: UserRole;
}

export function TabletNavDrawer({ role }: TabletNavDrawerProps) {
  const [profile] = React.useState<YouthProfile>(() => getStoredProfile());
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const config = ROLE_CONFIGS[role];

  if (!config) return null;

  return (
    <div className="hidden md:flex lg:hidden sticky top-0 z-40 bg-card/90 backdrop-blur border-b border-border px-4 py-2.5 items-center justify-between w-full">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-sm shadow-sm">
          <span className="font-heading">K</span>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Sawubona,</div>
          <h1 className="font-heading font-bold text-base text-foreground leading-tight">
            {profile.fullName || "Youth Pioneer"}
          </h1>
        </div>
      </div>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        swipeDirection="left"
        showSwipeHandle
      >
        <DrawerTrigger
          render={
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Menu className="size-4" />
              <span>Menu</span>
            </Button>
          }
        />
        <DrawerContent className="w-72 sm:w-80 h-full max-h-screen">
          <DrawerHeader className="border-b border-border pb-3 px-6 pt-4 text-left">
            <DrawerTitle className="text-base font-bold flex items-center gap-2">
              <div className="w-6 h-6 rounded-btn bg-brand-deep flex items-center justify-center text-white font-bold text-xs">
                <span className="font-heading">K</span>
              </div>
              <span>{config.name} Navigation</span>
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-1.5 overflow-y-auto">
            {config.navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = ICON_MAP[item.iconName] || Home;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-btn transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <IconComponent
                    className={`size-4.5 shrink-0 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(ROLE_STORAGE_KEY);
                  }
                  router.push("/");
                }}
                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-btn transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
