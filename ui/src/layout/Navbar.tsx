"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useState } from "react";

// Using to share the scroll target element.
const NavbarScrollContext = createContext<HTMLDivElement | null>(null);

export interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Navbar({ children, className }: NavbarProps) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setScrollEl}
      className={cn("h-full w-full overflow-y-auto", className)}
    >
      <NavbarScrollContext.Provider value={scrollEl}>
        {children}
      </NavbarScrollContext.Provider>
    </div>
  );
}

export interface NavbarContentProps {
  /**
   * Whether the NavbarContent is used in a landing page. If so, the NavbarContent
   * has a default `max-width` constraint. Otherwise, it has a full width.
   */
  landing?: boolean;

  /**
   * Customized style of NavbarContent, ex: setting the max width.
   */
  className?: string;

  children: React.ReactNode;
}

export function NavbarContent({
  landing = false,
  className,
  children,
}: NavbarContentProps) {
  const theme = useTheme();
  const scrollEl = useContext(NavbarScrollContext);
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 8,
    target: scrollEl ?? undefined,
  });

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        color: "text.primary",
        backgroundImage: "none",
        transition: theme.transitions.create(
          ["background-color", "border-color", "backdrop-filter"],
          { duration: theme.transitions.duration.shorter },
        ),
      }}
      className={
        scrolled ? "bg-background-paper/50 backdrop-blur-md" : "bg-transparent"
      }
    >
      <Toolbar
        disableGutters
        className={cn(
          "w-full px-4 md:px-6",
          landing && "mx-auto max-w-screen-lg",
          className,
        )}
        sx={{
          minHeight: { xs: 56, md: 64 },
          gap: 2,
        }}
      >
        {children}
      </Toolbar>
    </AppBar>
  );
}

export interface NavbarLinkProps {
  href?: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function NavbarLink({
  href = "",
  active,
  onClick,
  children,
}: NavbarLinkProps) {
  return (
    <Link href={href} className="no-underline">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "cursor-pointer rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-500/10",
          active
            ? "text-primary-500 font-semibold"
            : "font-medium opacity-70 hover:opacity-100",
        )}
      >
        {children}
      </button>
    </Link>
  );
}

export interface NavbarMobileMenuProps {
  children: React.ReactNode;
}

export function NavbarMobileMenu({ children }: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu side="bottom" align="end" onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <IconButton
          sx={{ color: "text.primary" }}
          aria-label="toggle navigation"
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sx={{
          width: "100vw",
          maxWidth: "100vw",
          left: "0 !important",
          right: 0,
        }}
      >
        <Stack spacing={1} className="px-4 py-2">
          {children}
        </Stack>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
