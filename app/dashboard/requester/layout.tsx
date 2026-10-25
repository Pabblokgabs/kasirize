import { BottomNavBar } from "@/components/shared/bottom-nav-bar";
import { MobileRoleFAB } from "@/components/shared/mobile-role-fab";
import { RoleGuard } from "@/components/shared/role-guard";
import { RoleSidebar } from "@/components/shared/role-sidebar";
import { TabletNavDrawer } from "@/components/shared/tablet-nav-drawer";

export default function RequesterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard requiredRole="role-requester">
      <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-body pb-16 md:pb-0">
        <RoleSidebar role="role-requester" />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TabletNavDrawer role="role-requester" />
          <main className="flex-1">{children}</main>
        </div>
        <MobileRoleFAB role="role-requester" />
        <BottomNavBar role="role-requester" />
      </div>
    </RoleGuard>
  );
}
