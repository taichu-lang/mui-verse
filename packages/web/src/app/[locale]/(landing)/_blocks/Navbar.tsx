"use client";

import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { LanguageSwitchRounded } from "@/components/ui/LanguageSwitch";
import { useSettingsLink } from "@/hooks/useSettingsLink";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnchorLink } from "./AnchorLink";

export function Navbar() {
  const t = useTranslations();
  const { session } = useAuth();
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const { navigateLink } = useSettingsLink();

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const section = (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`);
  const sectionActive = (id: string) => pathname === "/" && hash === `#${id}`;

  return (
    <div className="w-landing-width relative mx-auto flex h-full items-center justify-between">
      <Link href="/" className="text-base font-medium">
        Anna
      </Link>
      <div className="absolute left-1/2 flex -translate-x-1/2 gap-11.5">
        <AnchorLink href={section("product")} active={sectionActive("product")}>
          {t("nav.product")}
        </AnchorLink>
        <AnchorLink
          href={section("capabilities")}
          active={sectionActive("capabilities")}
        >
          {t("nav.capabilities")}
        </AnchorLink>
        <AnchorLink href={section("faq")} active={sectionActive("faq")}>
          {t("nav.faq")}
        </AnchorLink>
        <AnchorLink href="/pricing" active={pathname === "/pricing"}>
          {t("nav.pricing")}
        </AnchorLink>
      </div>
      <div className="flex gap-5.25">
        <LanguageSwitchRounded />
        <Button
          className="px-3 py-1.5"
          color="dark"
          href={session ? navigateLink("settings/account") : "/signin"}
        >
          {session ? session.name : t("nav.getStarted")}
        </Button>
      </div>
    </div>
  );
}
