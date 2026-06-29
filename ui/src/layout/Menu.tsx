"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { cn } from "@mui-verse/ui/utils/cn";
import { Box, CardActionArea, Divider, Stack, Typography } from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { MenuButton } from "./MenuButton";
import { useSidebar } from "./useSidebar";

export type MenuGroupProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export const MenuGroup = (props: MenuGroupProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <CardActionArea
        onClick={() => setCollapsed(!collapsed)}
        className="hover:text-secondary-500 rounded-lg p-2"
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          pl={2}
        >
          <Box display={"flex"} gap={1} alignItems={"center"}>
            {props.icon}
            <Typography variant={"subtitle2"}>{props.title}</Typography>
          </Box>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Box>
      </CardActionArea>
      {!collapsed && (
        <Box display={"flex"} gap={0.5} pl={5}>
          <Divider orientation="vertical" flexItem />
          <Stack flex={1} spacing={1}>
            {props.children}
          </Stack>
        </Box>
      )}
    </>
  );
};

export interface MenuProps {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  controlled?: {
    onClick?: () => void;
    active: boolean;
  };
  actions?: React.ReactNode;
}

export function DesktopMenu({
  title,
  icon,
  href,
  controlled,
  actions,
}: MenuProps) {
  const router = useRouter();
  const path = usePathname();

  const isActive = controlled ? controlled.active : path === href;
  const handleClick = () => {
    if (controlled) {
      controlled.onClick?.();
      return;
    }

    if (href) {
      router.push(href);
    }
  };

  return (
    <MenuButton
      title={title}
      icon={icon}
      actions={actions}
      isActive={isActive}
      onClick={handleClick}
    />
  );
}

export function MobileMenu({ title, icon, href, controlled }: MenuProps) {
  const router = useRouter();
  const path = usePathname();
  const { setCollapsed } = useSidebar();

  const isActive = controlled ? controlled.active : path === href;
  const handleClick = () => {
    if (controlled) {
      controlled.onClick?.();
      return;
    }

    if (href) {
      router.push(href);
    }
    setCollapsed(true);
  };

  return (
    <CardActionArea
      data-active={isActive || undefined}
      className={cn(
        "flex h-8 w-full justify-start gap-2.5 rounded-lg px-2",
        "data-active:bg-action-hover",
      )}
      onClick={handleClick}
    >
      {icon}
      <Typography variant="body2" className="leading-4.5">
        {title}
      </Typography>
    </CardActionArea>
  );
}

export function Menu(props: MenuProps) {
  const isMobile = useMobile();
  if (isMobile) {
    return <MobileMenu {...props} />;
  }

  return <DesktopMenu {...props} />;
}
