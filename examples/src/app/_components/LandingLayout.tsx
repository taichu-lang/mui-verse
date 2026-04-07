"use client";

import { DropdownMenuItem } from "@mui-verse/ui/components/DropdownMenu";
import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import {
  Navbar,
  NavbarContent,
  NavbarLink,
  NavbarMobileMenu,
} from "@mui-verse/ui/layout/Navbar";
import { Typography } from "@mui/material";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMobile();

  return (
    <Navbar>
      <NavbarContent landing>
        <Typography>Logo</Typography>
        <div className="flex-1"></div>
        <NavbarLink
          href="/workbench"
          onClick={() => console.log("jump to workbench")}
        >
          Workbench
        </NavbarLink>
        {isMobile && (
          <NavbarMobileMenu>
            <DropdownMenuItem>
              <Typography>Profile</Typography>
            </DropdownMenuItem>
          </NavbarMobileMenu>
        )}
      </NavbarContent>
      {children}
    </Navbar>
  );
}
