"use client";

import { useAuth } from "@/auth/auth";
import {
  QuestionIcon,
  SettingsIcon,
  SignOutIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";
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

function SigninPanel() {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return (
      <MenuButton
        title="Sign in"
        icon={
          <Avatar className="h-5 w-5">
            <UserIcon />
          </Avatar>
        }
        className="mb-4"
      />
    );
  }

  return (
    <div className="px-2">
      <Menu title={"See plans and pricing"} icon={<SparklesIcon />} />
      <Menu title={"Settings"} icon={<SettingsIcon />} />
      <Menu title={"Help"} icon={<QuestionIcon />} />
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
                <span className="text-sm">Someone</span>
                <span className="text-text-secondary text-sm">Free plan</span>
              </div>
              <div className="flex-1" />
              <Button
                variant="outlined"
                className="text-text-primary h-7 w-18 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Upgrade
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sx={{ width: "260px", px: "16px" }}>
            <div className="flex items-center">
              <Avatar className="h-8.5 w-8.5">S</Avatar>
              <span className="ml-2.5 text-sm">Someone</span>
              <div className="flex-1" />
              <span className="text-text-secondary text-sm">Free plan</span>
            </div>
            <DropdownMenuSeparator />
            <Menu title={"See plans and pricing"} icon={<SparklesIcon />} />
            <Menu title={"Settings"} icon={<SettingsIcon />} />
            <Menu title={"Help"} icon={<QuestionIcon />} />
            <DropdownMenuSeparator />
            <MenuButton
              icon={<SignOutIcon />}
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
