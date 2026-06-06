"use client";

import { useMobile } from "../hooks/useMobile";
import { DesktopMenu, MenuProps, MobileMenu } from "./Menu";

export function MenuIntl({
  usePath,
  ...props
}: MenuProps & { usePath: () => string }) {
  const isMobile = useMobile();
  const path = usePath();

  if (isMobile) {
    return <MobileMenu {...props} path={path} />;
  } else {
    return <DesktopMenu {...props} path={path} />;
  }
}
