"use client";

import { useAuth } from "@/auth/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { Menu } from "@mui-verse/ui/layout/Menu";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { Avatar, Button } from "@mui/material";
import {
  CircleUserRoundIcon,
  LogOutIcon,
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
    <div className="px-2">
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
    </div>
  );
}

export function UserProfileMenu() {
  const { hasAuthorization, session } = useAuth();

  if (hasAuthorization()) {
    return (
      <div className="p-1.5">
        <DropdownMenu side="top" align="start">
          <DropdownMenuTrigger>
            <div className="flex h-16.5 items-center pr-2.5 pl-4">
              <Avatar className="h-8.5 w-8.5">S</Avatar>
              <div className="ml-2.5 flex flex-col gap-1.5">
                <span className="anna-text-tag">Someone</span>
                <span className="anna-text-tag text-text-secondary">
                  Free plan
                </span>
              </div>
              <div className="flex-1" />
              <Button
                variant="outlined"
                className="anna-group-title text-text-primary h-7 w-18"
                onClick={(e) => e.stopPropagation()}
              >
                Upgrade
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sx={{ width: "260px", px: "16px" }}>
            <div className="flex items-center">
              <Avatar className="h-8.5 w-8.5">S</Avatar>
              <span className="anna-text-tag ml-2.5">Someone</span>
              <div className="flex-1" />
              <span className="anna-text-tag text-text-secondary">
                Free plan
              </span>
            </div>
            <DropdownMenuSeparator />
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
            <DropdownMenuSeparator />
            <MenuButton
              icon={<LogOutIcon className="h-4 w-4" />}
              title="Sign out"
              className="text-error-500"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return <SigninPanel />;
}
