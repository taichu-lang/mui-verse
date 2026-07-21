"use client";

import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { LanguageSwitchRounded } from "@/components/ui/LanguageSwitch";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { useEffect, useState } from "react";

function NavbarItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      className={cn(
        "hover:bg-action-hover rounded-full px-3 py-1.5 text-base",
        {
          "bg-action-hover": active,
        },
      )}
      href={href}
    >
      {children}
    </a>
  );
}

export function Navbar() {
  const { session } = useAuth();
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const section = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);
  const sectionActive = (id: string) => pathname === "/" && hash === `#${id}`;

  return (
    <div className="w-landing-width mx-auto flex h-full items-center">
      <p className="text-base font-medium">Anna</p>
      <div className="flex flex-1 justify-center gap-11.5">
        <NavbarItem href={section("product")} active={sectionActive("product")}>
          Product
        </NavbarItem>
        <NavbarItem
          href={section("capabilities")}
          active={sectionActive("capabilities")}
        >
          Capabilities
        </NavbarItem>
        <NavbarItem href="/pricing" active={pathname === "/pricing"}>
          Pricing
        </NavbarItem>
        <NavbarItem href={section("support")} active={sectionActive("support")}>
          Support
        </NavbarItem>
      </div>
      <div className="flex gap-5.25">
        <LanguageSwitchRounded />
        <Button
          className="px-3 py-1.5"
          color="dark"
          href={session ? "/chat?modal=settings/account" : "/signin"}
        >
          {session ? session.name : "Get started"}
        </Button>
      </div>
    </div>
  );
}
