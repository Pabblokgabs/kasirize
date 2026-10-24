export type UserRole =
  | "role-user" // Youth
  | "role-requester" // Task Requester
  | "role-employer" // Employer
  | "role-mentor" // Skill Mentor
  | "role-admin"; // Admin

export interface NavItem {
  label: string;
  href: string;
  iconName: string;
  hideOnBottomNav?: boolean;
}

export const ROLE_STORAGE_KEY = "kasirize_role";
export const DEMO_DATA_STORAGE_KEY = "kasirize_demo_profile";

export const ROLE_CONFIGS: Record<
  UserRole,
  {
    name: string;
    dashboardUrl: string;
    description: string;
    navItems: NavItem[];
  }
> = {
  "role-user": {
    name: "Youth",
    dashboardUrl: "/dashboard/user",
    description:
      "Turn informal experience into credible skills and nearby opportunities.",
    navItems: [
      { label: "Home", href: "/dashboard/user", iconName: "Home" },
      {
        label: "Tasks",
        href: "/dashboard/user/tasks",
        iconName: "CheckSquare",
      },
      {
        label: "Opportunities",
        href: "/dashboard/user/opportunities",
        iconName: "Briefcase",
      },
      {
        label: "Messages",
        href: "/dashboard/user/chat",
        iconName: "MessageSquare",
      },
      { label: "Profile", href: "/dashboard/user/profile", iconName: "User" },
    ],
  },
  "role-requester": {
    name: "Task Requester",
    dashboardUrl: "/dashboard/requester",
    description: "Post short tasks and get verified help from local youth.",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard/requester",
        iconName: "LayoutDashboard",
      },
      {
        label: "Tasks",
        href: "/dashboard/requester/tasks",
        iconName: "CheckSquare",
      },
      {
        label: "My Place",
        href: "/dashboard/requester/place",
        iconName: "Store",
      },
      {
        label: "Add Task",
        href: "/dashboard/requester/post-task",
        iconName: "PlusCircle",
        hideOnBottomNav: true,
      },
      {
        label: "Messages",
        href: "/dashboard/requester/chat",
        iconName: "MessageSquare",
      },
      {
        label: "Profile",
        href: "/dashboard/requester/profile",
        iconName: "User",
      },
    ],
  },
  "role-employer": {
    name: "Employer",
    dashboardUrl: "/dashboard/employer",
    description:
      "Discover candidates with evidence-backed skills and confirmed ratings.",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard/employer",
        iconName: "LayoutDashboard",
      },
      {
        label: "Workplace",
        href: "/dashboard/employer/place",
        iconName: "Building2",
      },
      {
        label: "Candidates",
        href: "/dashboard/employer/candidates",
        iconName: "Users",
      },
      {
        label: "Add Job",
        href: "/dashboard/employer/post-opportunity",
        iconName: "PlusCircle",
        hideOnBottomNav: true,
      },
      {
        label: "Messages",
        href: "/dashboard/employer/chat",
        iconName: "MessageSquare",
      },
      {
        label: "Profile",
        href: "/dashboard/employer/profile",
        iconName: "User",
      },
    ],
  },
  "role-mentor": {
    name: "Skill Mentor",
    dashboardUrl: "/dashboard/mentor",
    description: "Coach youth, track learning progress, and confirm skills.",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard/mentor",
        iconName: "LayoutDashboard",
      },
      {
        label: "Mentees",
        href: "/dashboard/mentor/mentees",
        iconName: "Users",
      },
      {
        label: "Add Mentorship",
        href: "/dashboard/mentor/create-mentorship",
        iconName: "PlusCircle",
        hideOnBottomNav: true,
      },
      {
        label: "Messages",
        href: "/dashboard/mentor/chat",
        iconName: "MessageSquare",
      },
      { label: "Profile", href: "/dashboard/mentor/profile", iconName: "User" },
    ],
  },
  "role-admin": {
    name: "Admin",
    dashboardUrl: "/dashboard/admin",
    description:
      "Platform health, reports, dispute resolution, and audit logs.",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard/admin",
        iconName: "LayoutDashboard",
      },
      {
        label: "Reports",
        href: "/dashboard/admin/reports",
        iconName: "AlertTriangle",
      },
      { label: "Users", href: "/dashboard/admin/users", iconName: "Users" },
      {
        label: "Tasks",
        href: "/dashboard/admin/tasks",
        iconName: "CheckSquare",
      },
      {
        label: "Profile",
        href: "/dashboard/admin/audit-logs",
        iconName: "Shield",
      },
    ],
  },
};
