"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { cn } from "@mui-verse/ui/utils/cn";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "./useSidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const isMobile = useMobile();
  const theme = useTheme();

  const width = isMobile ? "80vw" : collapsed ? theme.spacing(8) : "16rem";

  if (isMobile && collapsed) {
    return <></>;
  }

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={isMobile ? !collapsed : true}
      onClose={toggleCollapsed}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          border: 0,
          background: isMobile ? theme.palette.background.paper : "transparent",
        },
      }}
      anchor={isMobile ? "right" : "left"}
    >
      <div className="flex h-full flex-col gap-4 overflow-hidden px-2">
        {children}
      </div>
    </Drawer>
  );
}

export function SidebarToggle() {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <IconButton onClick={toggleCollapsed} sx={{ color: "text.primary" }}>
      {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
    </IconButton>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 flex-col items-center justify-center">
      {children}
    </div>
  );
}

export function MenuList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-auto flex pb-2", className)}>{children}</div>;
}
