"use client";

import { usePathname } from "@/i18n/navigation";
import { languageSymbolMap, locales } from "@/i18n/routing";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import {
  DropdownSelect,
  DropdownSelectOption,
} from "@mui-verse/ui/components/inputs";
import { GlobeIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export function LanguageSwitch() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (locale: string) => {
    let hash = "";
    if (window) {
      hash = window.location.hash;
    }

    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    router.push(`/${locale}${pathname}${search}${hash}`);
  };

  return (
    <DropdownSelect
      side="cover"
      align="end"
      defaultValue={locale}
      IconComponent={ChevronDownIcon}
      onChange={handleSwitch}
    >
      {locales.map((locale) => (
        <DropdownSelectOption
          key={locale}
          value={locale}
          className="px-2.5 py-2"
        >
          {languageSymbolMap[locale].name}
        </DropdownSelectOption>
      ))}
    </DropdownSelect>
  );
}

export function LanguageSwitchRounded() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (locale: string) => {
    let hash = "";
    if (window) {
      hash = window.location.hash;
    }

    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    router.push(`/${locale}${pathname}${search}${hash}`);
  };

  return (
    <DropdownSelect
      side="bottom"
      align="center"
      defaultValue={locale}
      IconComponent={() => (
        <GlobeIcon className="h-4.5 w-4.5" strokeWidth={1.2} />
      )}
      onChange={handleSwitch}
      className="flex-row-reverse gap-1.5 rounded-full px-3 py-1.5 text-base shadow-(--mui-shadow-border)"
    >
      {locales.map((locale) => (
        <DropdownSelectOption
          key={locale}
          value={locale}
          className="px-2.5 py-2"
        >
          {languageSymbolMap[locale].name}
        </DropdownSelectOption>
      ))}
    </DropdownSelect>
  );
}
