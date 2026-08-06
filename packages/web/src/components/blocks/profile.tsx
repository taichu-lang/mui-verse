"use client";

import { getUserName, useAuth } from "@/auth/auth";
import {
  QuestionIcon,
  SettingsIcon,
  SignOutIcon,
  SparkleIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";
import { useSettingsLink } from "@/hooks/useSettingsLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MenuItem,
} from "@mui-verse/ui/components/navigation";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { Avatar, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

function SigninPanel() {
  const t = useTranslations();
  const { collapsed } = useSidebar();
  const { navigateLink } = useSettingsLink();

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
      <MenuItem component={Link} href={`/pricing#features`}>
        <SparklesIcon />
        {t("chat.sidebar.planLink")}
      </MenuItem>
      <MenuItem component={Link} href={navigateLink("settings")}>
        <SettingsIcon />
        {t("chat.sidebar.settings")}
      </MenuItem>
      <MenuItem component={Link} href={navigateLink("settings/help")}>
        <QuestionIcon />
        {t("chat.sidebar.help")}
      </MenuItem>
      <div className="flex px-1.25 py-5">
        <Button
          className="text-text-primary rounded-2xl"
          variant="outlined"
          fullWidth
          href="/signin"
        >
          {t("chat.sidebar.signin")}
        </Button>
      </div>
    </div>
  );
}

function UserProfile() {
  const t = useTranslations();
  const { collapsed } = useSidebar();
  const { session } = useAuth();
  const { navigateLink } = useSettingsLink();

  if (!session) {
    return null;
  }

  const userName = getUserName(session);
  const firstLetter = userName[0].toUpperCase();
  const plan = session.subscription.plan_code;

  const handleLogout = async () => {
    const { logout } = useAuth.getState();
    await logout();
  };

  const Content = () => {
    return (
      <DropdownMenuContent sx={{ width: "260px", py: "6px" }}>
        <div className="flex h-13.5 items-center px-2">
          <Avatar className="h-8.5 w-8.5">{firstLetter}</Avatar>
          <span className="text-text-primary ml-2.5 text-sm">{userName}</span>
          <div className="flex-1" />
          <span className="text-text-secondary text-sm">
            {t(`plans.${plan}.plan`)}
          </span>
        </div>
        <DropdownMenuSeparator className="my-1.5" />
        <DropdownMenuItem component={Link} href={"/checkout"}>
          <SparkleIcon />
          {t(`plans.${plan}.upgradePlan`)}
        </DropdownMenuItem>
        <DropdownMenuItem component={Link} href={navigateLink("settings")}>
          <SettingsIcon />
          {t("chat.sidebar.settings")}
        </DropdownMenuItem>
        <DropdownMenuItem component={Link} href={navigateLink("settings/help")}>
          <QuestionIcon />
          {t("chat.sidebar.help")}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1.5" />
        <MenuItem
          className="text-error-500 hover:bg-error-200"
          onClick={handleLogout}
        >
          <SignOutIcon />
          {t("chat.sidebar.signout")}
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
              <span className="text-text-primary text-sm">{userName}</span>
              <span className="text-text-secondary text-sm">
                {t(`plans.${plan}.plan`)}
              </span>
            </div>
            <div className="flex-1" />
            <Button
              variant="outlined"
              className="text-text-primary h-7 w-18 text-xs"
              onClick={(e) => e.stopPropagation()}
              href="/checkout"
            >
              {t(`plans.${plan}.upgrade`)}
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
