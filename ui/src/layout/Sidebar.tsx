"use client";

import { IconTextButton } from "@mui-verse/ui/components/buttons";
import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { cn } from "@mui-verse/ui/utils/cn";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useInitSidebar, useSidebar } from "./useSidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
  useInitSidebar();

  const { collapsed, toggleCollapsed } = useSidebar();
  const isMobile = useMobile();
  const theme = useTheme();

  const width = isMobile ? "80vw" : collapsed ? theme.spacing(8) : "14rem";

  if (collapsed) {
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

export function SidebarToggle({
  className,
  variant = "text",
}: {
  className?: string;
  variant?: "contained" | "text";
}) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const Comp = variant === "text" ? IconTextButton : IconButton;

  return (
    <Comp onClick={toggleCollapsed} className={className}>
      {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
    </Comp>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-14 items-center justify-center", className)}>
      {children}
    </div>
  );
}

export function MenuList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 overflow-x-hidden overflow-y-auto">
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
