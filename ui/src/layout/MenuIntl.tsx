"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { usePathname, useRouter } from "next/navigation";
import { DesktopMenu, MenuProps, MobileMenu } from "./Menu";

export function MenuIntl({
  locale,
  href = "/",
  ...props
}: MenuProps & { locale: string }) {
  const isMobile = useMobile();
  const router = useRouter();

  // with locale.
  let path = usePathname();
  // if current path is /en, then path is "".
  path = path.replace(`/${locale}`, "");

  const active =
    href === "/" ? href === path || path === "" : path.startsWith(href);
  const handleClick = () => {
    const target = href === "/" ? `/${locale}` : `/${locale}/${href}`;
    router.push(target);
  };

  if (isMobile) {
    return (
      <MobileMenu {...props} controlled={{ active, onClick: handleClick }} />
    );
  } else {
    return (
      <DesktopMenu {...props} controlled={{ active, onClick: handleClick }} />
    );
  }
}
