"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { DesktopMenu, MenuProps, MobileMenu } from "./Menu";

export function MenuIntl({
  locale,
  href = "/",
  ...props
}: MenuProps & { locale: string }) {
  const isMobile = useMobile();
  const _href = href === "/" ? `/${locale}` : `/${locale}${href}`;

  if (isMobile) {
    return <MobileMenu {...props} href={_href} />;
  } else {
    return <DesktopMenu {...props} href={_href} />;
  }
}
