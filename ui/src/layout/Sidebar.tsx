"use client";

import { IconTextButton } from "@mui-verse/ui/components/buttons";
import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { cn } from "@mui-verse/ui/utils/cn";
import { Drawer, IconButton, useTheme } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useInitSidebar, useSidebar } from "./useSidebar";

export function Sidebar({
  children,
  inline = false,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  useInitSidebar();

  const { collapsed, toggleCollapsed } = useSidebar();
  const isMobile = useMobile();
  const theme = useTheme();

  const paperWidth = isMobile ? "80vw" : "14rem";
  const width = isMobile ? 0 : collapsed ? 0 : "14rem";
  const useInline = inline && !isMobile;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={!collapsed}
      onClose={toggleCollapsed}
      sx={{
        width,
        flexShrink: 0,
        ...(useInline && { height: "100%" }),
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: collapsed
            ? theme.transitions.duration.leavingScreen
            : theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: paperWidth,
          boxSizing: "border-box",
          border: 0,
          background: isMobile ? theme.palette.background.paper : "transparent",
          ...(useInline && { position: "relative", height: "100%" }),
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
