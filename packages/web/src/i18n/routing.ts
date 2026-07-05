import { defineRouting } from "next-intl/routing";

export const locales = [
  "en", // en-US
  "ru", // ru-RU
] as const;

export type AvailableLocale = (typeof locales)[number];

export const languageSymbolMap: {
  [key: string]: {
    locale: string;
    name: string;
    flag: string;
  };
} = {
  en: { locale: "en", name: "English", flag: "🇬🇧" },
  ru: { locale: "ru", name: "Русский", flag: "🇷🇺" },
  zh: { locale: "zh", name: "中文", flag: "🇨🇳" },
  ar: { locale: "ar", name: "العربية", flag: "🇸🇦" },
  es: { locale: "es", name: "Español", flag: "🇪🇸" },
  pt: { locale: "pt", name: "Português", flag: "🇵🇹" },
  tr: { locale: "tr", name: "Türkçe", flag: "🇹🇷" },
  id: { locale: "id", name: "Indonesia", flag: "🇮🇩" },
  ja: { locale: "ja", name: "日本語", flag: "🇯🇵" },
  ko: { locale: "ko", name: "한국어", flag: "🇰🇷" },
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",
});
