"use client";

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
        <CardActionArea
          data-active={isActive || undefined}
          data-collapsed={collapsed || undefined}
          className={cn(
            "group flex h-8 rounded-lg px-2",
            "data-active:bg-action-hover",
            "data-collapsed:w-8",
            "not-data-collapsed:justify-start not-data-collapsed:gap-2.5",
            className,
          )}
          onClick={onClick}
        >
          {icon}
          {collapsed || (
            <>
              <Typography
                variant="body2"
                className="overflow-hidden leading-4.5 text-clip whitespace-nowrap"
              >
                {title}
              </Typography>
              <div className="flex-1" />
              {actions}
            </>
          )}
        </CardActionArea>
      </Slot>
    </div>
  );
}
