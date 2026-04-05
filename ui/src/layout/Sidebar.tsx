"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect } from "react";
import { useSidebar } from "./useSidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed, toggleCollapsed, setCollapsed } = useSidebar();
  const isMobile = useMobile();
  const theme = useTheme();

  const width = isMobile ? "80vw" : theme.spacing(8);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile, setCollapsed]);

  if (collapsed) {
    return <></>;
  }

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={!collapsed}
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

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto flex pb-2">{children}</div>;
}
