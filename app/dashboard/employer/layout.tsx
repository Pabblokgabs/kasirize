import { BottomNavBar } from "@/components/shared/bottom-nav-bar";
import { MobileRoleFAB } from "@/components/shared/mobile-role-fab";
import { RoleSidebar } from "@/components/shared/role-sidebar";
import { TabletNavDrawer } from "@/components/shared/tablet-nav-drawer";

export default function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row font-body pb-16 md:pb-0">
      <RoleSidebar role="role-employer" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TabletNavDrawer role="role-employer" />
        <main className="flex-1">{children}</main>
      </div>
      <MobileRoleFAB role="role-employer" />
      <BottomNavBar role="role-employer" />
    </div>
  );
}
