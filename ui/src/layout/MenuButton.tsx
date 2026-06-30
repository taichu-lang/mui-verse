"use client";

import { MenuItem } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { Slot } from "@mui-verse/ui/utils/slot";
import { CardActionArea, Tooltip, Typography } from "@mui/material";
import { useSidebar } from "./useSidebar";

export function MenuButton({
  title,
  icon,
  actions,
  isActive = false,
  onClick,
  className,
  showTips = true,
}: {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  showTips?: boolean;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex w-full justify-center">
      <Slot
        asChild={!showTips}
        wrap={(c: React.ReactElement) => (
          <Tooltip title={title} placement="right">
            {c}
          </Tooltip>
        )}
      >
        {/* `group` is used to bind state to icon and actions. */}
        {collapsed ? (
          <CardActionArea
            className={cn("group flex h-8 w-8 rounded-[10px]", className)}
            data-active={isActive || undefined}
            onClick={onClick}
          >
            {icon}
          </CardActionArea>
        ) : (
          <MenuItem
            className={cn("group w-full gap-2.5", className)}
            onClick={onClick}
          >
            {icon}
            <Typography
              variant="body2"
              className="overflow-hidden leading-4.5 text-clip whitespace-nowrap"
            >
              {title}
            </Typography>
            <div className="flex-1" />
            {actions}
          </MenuItem>
        )}
      </Slot>
    </div>
  );
}
