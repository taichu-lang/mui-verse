"use client";

import { useAuth } from "@/auth/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { Menu } from "@mui-verse/ui/layout/Menu";
import {
  MenuList,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "@mui-verse/ui/layout/Sidebar";
import { ThemeToggle } from "@mui-verse/ui/theme";
import { Avatar, Typography } from "@mui/material";
import { Biohazard, Home, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Biohazard className="h-5 w-5" />
        <Typography variant="subtitle2">MuiVerse</Typography>
      </SidebarHeader>
      <MenuList>
        <Menu href="/" icon={<Home className="h-4 w-4" />} title="Home" />
      </MenuList>
      <SidebarFooter className="justify-center">
        <div className="flex flex-col items-center gap-2">
          <ThemeToggle />
          <DropdownMenu side="top" align="start">
            <DropdownMenuTrigger>
              <Avatar variant="rounded">M</Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="h-4 w-4" />
                <Typography>Profile</Typography>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="text-error-500 h-4 w-4" />
                <Typography>Logout</Typography>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
