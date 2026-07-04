"use client";

import { useAuth } from "@/auth/auth";
import {
  QuestionIcon,
  SettingsIcon,
  SignOutIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";
import { usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MenuItem,
} from "@mui-verse/ui/components/navigation";
import { Menu } from "@mui-verse/ui/layout/Menu";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { Avatar, Button } from "@mui/material";
import Link from "next/link";

function SigninPanel() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

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
      <MenuItem component={Link} href={`${pathname}?modal=settings`}>
        <SettingsIcon />
        Settings
      </MenuItem>
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
            <div className="flex h-16.5 cursor-pointer items-center pr-2.5 pl-4">
              <Avatar className="h-8.5 w-8.5">S</Avatar>
              <div className="ml-2.5 flex flex-col gap-1.5">
                <span className="text-text-primary text-sm">Someone</span>
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
          <DropdownMenuContent sx={{ width: "260px", py: "6px" }}>
            <div className="flex h-13.5 items-center">
              <Avatar className="h-8.5 w-8.5">S</Avatar>
              <span className="text-text-primary ml-2.5 text-sm">Someone</span>
              <div className="flex-1" />
              <span className="text-text-secondary text-sm">Free plan</span>
            </div>
            <DropdownMenuSeparator className="my-1.5" />
            <Menu title={"See plans and pricing"} icon={<SparklesIcon />} />
            <DropdownMenuItem component={Link} href="/chat/settings">
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <Menu title={"Help"} icon={<QuestionIcon />} />
            <DropdownMenuSeparator className="my-1.5" />
            <MenuItem className="text-error-500 hover:bg-error-200">
              <SignOutIcon />
              Sign out
            </MenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return <SigninPanel />;
}
