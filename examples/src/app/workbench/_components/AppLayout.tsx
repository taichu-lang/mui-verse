"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { Navbar, NavbarContent } from "@mui-verse/ui/layout/Navbar";
import { SidebarToggle } from "@mui-verse/ui/layout/Sidebar";
import { SidebarMobileFab } from "@mui-verse/ui/layout/SidebarMobileFab";
import AppSidebar from "./AppSidebar";

function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <Navbar>
        <NavbarContent>
          <SidebarToggle />
        </NavbarContent>
        <div className="bg-background-paper">{children}</div>
      </Navbar>
      <SidebarMobileFab />
    </>
  );
}

function DesktopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <Navbar className="pr-2">
          <NavbarContent>
            <SidebarToggle />
          </NavbarContent>
          <div className="bg-background-paper mt-2 h-full rounded-t-xl shadow">
            {children}
          </div>
        </Navbar>
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
