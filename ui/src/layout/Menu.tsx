"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  Box,
  CardActionArea,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  icon: React.ReactNode;
  href: string;
}

export interface MenuData extends MenuProps {
  path: string;
}

export function DesktopMenu({ title, icon, href, path }: MenuData) {
  const router = useRouter();
  const isActive = path === href || path.startsWith(`${href}/`);

  const { collapsed } = useSidebar();

  return (
    <Tooltip title={title} placement="right">
      <CardActionArea
        className={cn(
          isActive ? "bg-gray-200" : "hover:bg-gray-200",
          collapsed ? "aspect-square rounded-lg" : "w-full rounded-lg py-1.25",
        )}
        onClick={() => {
          router.push(href);
        }}
      >
        {collapsed ? (
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            {icon}
            <Typography variant="caption" textAlign={"center"}>
              {title}
            </Typography>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"} gap={1.5} px={2}>
            {icon}
            <Typography variant="body1">{title}</Typography>
          </Box>
        )}
      </CardActionArea>
    </Tooltip>
  );
}

export function MobileMenu({ title, icon, href, path }: MenuData) {
  const router = useRouter();
  const isActive = path === href || path.startsWith(`${href}/`);
  const { setCollapsed } = useSidebar();

  return (
    <CardActionArea
      className={cn("w-full rounded-lg py-1.25", isActive && "bg-gray-200")}
      onClick={() => {
        router.push(href);
        setCollapsed(true);
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} px={2}>
        {icon}
        <Typography variant="body1">{title}</Typography>
      </Box>
    </CardActionArea>
  );
}

export function Menu(props: MenuProps) {
  const isMobile = useMobile();
  const path = usePathname();
  if (isMobile) {
    return <MobileMenu {...props} path={path} />;
  }

  return <DesktopMenu {...props} path={path} />;
}
