"use client";

import { Fab } from "@mui/material";
import { PanelRightOpen } from "lucide-react";
import { useSidebar } from "./useSidebar";

export function SidebarMobileFab() {
  const { toggleCollapsed } = useSidebar();

  return (
    <Fab
      onClick={toggleCollapsed}
      className="bg-secondary-500 fixed top-1/3 right-0 rounded-r-none text-gray-50 shadow-lg"
    >
      <PanelRightOpen size={20} />
    </Fab>
  );
}
