import { BottomNavBar } from "@/components/shared/bottom-nav-bar";
import { RoleGuard } from "@/components/shared/role-guard";
import { RoleSidebar } from "@/components/shared/role-sidebar";
import { TabletNavDrawer } from "@/components/shared/tablet-nav-drawer";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole="role-admin">
      <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-body pb-16 md:pb-0">
        <RoleSidebar role="role-admin" />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TabletNavDrawer role="role-admin" />
          <main className="flex-1">{children}</main>
        </div>
        <BottomNavBar role="role-admin" />
      </div>
    </RoleGuard>
  );
}

