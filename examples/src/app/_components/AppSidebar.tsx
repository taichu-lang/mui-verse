import { Menu } from "@mui-verse/ui/layout/Menu";
import {
  MenuList,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
} from "@mui-verse/ui/layout/Sidebar";
import { ThemeToggle } from "@mui-verse/ui/theme/ThemeToggle";
import { Typography } from "@mui/material";
import { Biohazard, Home } from "lucide-react";

export default function AppSidebar() {
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
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
