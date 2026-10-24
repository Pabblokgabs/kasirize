"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRole } from "@/constants/roles";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileFABProps {
  role: UserRole;
}

interface FABConfig {
  href: string;
  label: string;
  tooltipText: string;
  allowedPaths: string[];
}

export function MobileRoleFAB({ role }: MobileFABProps) {
  const pathname = usePathname();

  // Role-specific primary create actions (only shown on Dashboard and respective primary list pages)
  const configs: Partial<Record<UserRole, FABConfig>> = {
    "role-requester": {
      href: "/dashboard/requester/post-task",
      label: "Add Task",
      tooltipText: "Post a new task gig for local youth",
      allowedPaths: ["/dashboard/requester", "/dashboard/requester/tasks"],
    },
    "role-employer": {
      href: "/dashboard/employer/post-opportunity",
      label: "Post Job",
      tooltipText: "Post a job or learnership opportunity",
      allowedPaths: ["/dashboard/employer", "/dashboard/employer/candidates"],
    },
    "role-mentor": {
      href: "/dashboard/mentor/create-mentorship",
      label: "Add Mentorship / Workshop",
      tooltipText: "Create a mentorship session or workshop",
      allowedPaths: ["/dashboard/mentor", "/dashboard/mentor/mentees"],
    },
  };

  const action = configs[role];
  if (!action) return null;

  // Only render on allowed paths (e.g. dashboard & task/mentees/candidates)
  const isAllowedPath = action.allowedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isAllowedPath) return null;

  // Don't show the FAB if user is currently on the creation form itself
  if (pathname === action.href) return null;

  return (
    <div className="md:hidden fixed bottom-24 right-4 z-40">
      <TooltipProvider delay={100}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={action.href}
                aria-label={action.label}
                className="size-14 rounded-full bg-brand-deep text-white shadow-lift border-2 border-white/20 flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Plus className="size-6 text-white" />
              </Link>
            }
          />
          <TooltipContent side="left" sideOffset={10}>
            <div className="font-semibold text-xs">{action.label}</div>
            <div className="text-[11px] text-muted-foreground">
              {action.tooltipText}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
