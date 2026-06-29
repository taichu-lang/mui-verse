"use client";

import { useAuth } from "@/auth/auth";
import { Menu } from "@mui-verse/ui/layout/Menu";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { Avatar, Button } from "@mui/material";
import {
  CircleUserRoundIcon,
  MessageCircleQuestionMarkIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";

function SigninPanel() {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return (
      <MenuButton
        title="Sign in"
        icon={
          <Avatar className="h-5 w-5">
            <CircleUserRoundIcon className="h-3 w-3" />
          </Avatar>
        }
        className="mb-4"
      />
    );
  }

  return (
    <>
      <Menu
        title={"See plans and pricing"}
        icon={<SparklesIcon className="h-4.5 w-4.5" />}
      />
      <Menu
        title={"Settings"}
        icon={<SettingsIcon className="h-4.5 w-4.5" />}
      />
      <Menu
        title={"Help"}
        icon={<MessageCircleQuestionMarkIcon className="h-4.5 w-4.5" />}
      />
      <div className="flex px-1.25 py-5">
        <Button
          className="text-text-primary rounded-2xl"
          variant="outlined"
          fullWidth
        >
          Sign in
        </Button>
      </div>
    </>
  );
}

export function UserProfileMenu() {
  const { hasAuthorization } = useAuth();

  if (hasAuthorization()) {
    return null;
  }

  return <SigninPanel />;
}
