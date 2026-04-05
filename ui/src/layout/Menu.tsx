"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { useTheme } from "@mui-verse/ui/theme/useTheme";
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

export type MenuData = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

function DesktopMenu({ title, icon, href }: MenuData) {
  const path = usePathname();
  const router = useRouter();
  const isActive = path === href || path.startsWith(`${href}/`);

  const { isDark } = useTheme();

  const classes = {
    active: isDark ? "bg-gray-50" : "bg-gray-950 text-gray-50",
    inactive: "hover:bg-gray-A700 hover:text-gray-50",
  };

  return (
    <Tooltip title={title} placement="right">
      <CardActionArea
        className={`${isActive ? classes.active : classes.inactive} aspect-square rounded-lg`}
        onClick={() => {
          router.push(href);
        }}
      >
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          {icon}
          <Typography variant="caption" textAlign={"center"}>
            {title}
          </Typography>
        </Box>
      </CardActionArea>
    </Tooltip>
  );
}

function MobileMenu({ title, icon, href }: MenuData) {
  const path = usePathname();
  const router = useRouter();
  const isActive = path === href || path.startsWith(`${href}/`);
  const { setCollapsed } = useSidebar();

  return (
    <CardActionArea
      className={`${isActive && "bg-gray-950 text-white"} w-full rounded-lg px-3 py-2`}
      onClick={() => {
        router.push(href);
        setCollapsed(true);
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        {icon}
        <Typography variant="body2">{title}</Typography>
      </Box>
    </CardActionArea>
  );
}

export function Menu(props: MenuData) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileMenu {...props} />;
  }

  return <DesktopMenu {...props} />;
}
