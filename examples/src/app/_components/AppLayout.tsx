"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import AppSidebar from "./AppSidebar";
import { SidebarMobileFab } from "@mui-verse/ui/layout/SidebarMobileFab";

function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="bg-background-paper">{children}</div>
      <SidebarMobileFab />
    </>
  );
}

function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="bg-background-paper mt-2 mr-2 flex-1 rounded-t-xl shadow">
        {children}
      </div>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMobile();

  const Main = <main className="p-2">{children}</main>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isMobile ? (
        <MobileLayout>{Main}</MobileLayout>
      ) : (
        <DesktopLayout>{Main}</DesktopLayout>
      )}
    </div>
  );
}
