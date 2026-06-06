"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./useTheme";
import { IconTextButton } from "../components/buttons";
import { cn } from "../utils/cn";

const FALLBACK_LABELS = {
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
} as const;

export function ThemeToggle({
  className,
  variant = "text",
}: {
  className?: string;
  variant?: "contained" | "text";
}) {
  const { isDark, toggleTheme } = useTheme();
  const Comp = variant === "text" ? IconTextButton : IconButton;

  let label: string;
  try {
    const tokens = useTranslations("verse.theme");
    label = isDark ? tokens("switchToLight") : tokens("switchToDark");
  } catch {
    label = isDark
      ? FALLBACK_LABELS.switchToLight
      : FALLBACK_LABELS.switchToDark;
  }

  return (
    <Tooltip title={label}>
      <Comp
        onClick={toggleTheme}
        sx={{ color: "text.primary" }}
        aria-label={label}
        className={cn(className)}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Comp>
    </Tooltip>
  );
}
