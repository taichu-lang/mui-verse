"use client";

import { ChevronDownIcon } from "@/components/icons";
import { usePathname } from "@/i18n/navigation";
import { languageSymbolMap, locales } from "@/i18n/routing";
import {
  DropdownSelect,
  DropdownSelectOption,
} from "@mui-verse/ui/components/inputs";
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
