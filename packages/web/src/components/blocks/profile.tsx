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
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { Avatar, Button } from "@mui/material";
import Link from "next/link";

function SigninPanel() {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  if (collapsed) {
    return (
      <Link className="mb-4 flex items-center justify-center" href={"/signin"}>
        <Avatar className="h-5 w-5 cursor-pointer">
          <UserIcon />
        </Avatar>
      </Link>
    );
  }

  return (
    <div className="px-2">
      <Menu title={"See plans and pricing"} icon={<SparklesIcon />} />
      <MenuItem component={Link} href={`${pathname}?modal=settings`}>
        <SettingsIcon />
        Settings
      </MenuItem>
      <MenuItem component={Link} href={`${pathname}?modal=settings/help`}>
        <QuestionIcon />
        Help
      </MenuItem>
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

function UserProfile() {
  const { collapsed } = useSidebar();
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  const firstLetter = session.name ? session.name[0].toUpperCase() : "";

  const Content = () => {
    return (
      <DropdownMenuContent sx={{ width: "260px", py: "6px" }}>
        <div className="flex h-13.5 items-center">
          <Avatar className="h-8.5 w-8.5">{firstLetter}</Avatar>
          <span className="text-text-primary ml-2.5 text-sm">
            {session.name}
          </span>
          <div className="flex-1" />
          <span className="text-text-secondary text-sm">Free plan</span>
        </div>
        <DropdownMenuSeparator className="my-1.5" />
        <MenuItem>
          <SparklesIcon />
          {"See plans and pricing"}
        </MenuItem>
        <DropdownMenuItem component={Link} href="/chat?modal=settings">
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <MenuItem>
          <QuestionIcon />
          {"Help"}
        </MenuItem>
        <DropdownMenuSeparator className="my-1.5" />
        <MenuItem className="text-error-500 hover:bg-error-200">
          <SignOutIcon />
          Sign out
        </MenuItem>
      </DropdownMenuContent>
    );
  };

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="end">
        <div className="mb-4 flex items-center justify-center">
          <DropdownMenuTrigger>
            <Avatar className="h-5 w-5 cursor-pointer text-xs">
              {firstLetter}
            </Avatar>
          </DropdownMenuTrigger>
        </div>
        {Content()}
      </DropdownMenu>
    );
  }

  return (
    <div className="p-1.5">
      <DropdownMenu side="top" align="start">
        <DropdownMenuTrigger>
          <div className="flex h-16.5 cursor-pointer items-center pr-2.5 pl-4">
            <Avatar className="h-8.5 w-8.5">{firstLetter}</Avatar>
            <div className="ml-2.5 flex flex-col gap-1.5">
              <span className="text-text-primary text-sm">{session.name}</span>
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
        {Content()}
      </DropdownMenu>
    </div>
  );
}

export function UserProfileMenu() {
  const hasAuthorization = useAuth.useHasAuthorization();

  if (hasAuthorization) {
    return <UserProfile />;
  }

  return <SigninPanel />;
}
