"use client";

import { CardActionArea, Tooltip, Typography } from "@mui/material";
import { cn } from "../utils/cn";
import { useSidebar } from "./useSidebar";

export function MenuButton({
  title,
  icon,
  actions,
  isActive = false,
  onClick,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex w-full justify-center">
      <Tooltip title={title} placement="right">
        <CardActionArea
          data-active={isActive || undefined}
          data-collapsed={collapsed || undefined}
          className={cn(
            "flex h-8 rounded-lg px-2",
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
              <Typography variant="body2" className="truncate leading-4.5">
                {title}
              </Typography>
              <div className="flex-1"></div>
              {actions}
            </>
          )}
        </CardActionArea>
      </Tooltip>
    </div>
  );
}
