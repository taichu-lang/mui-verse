import { init } from "@airwallex/components-sdk";

export type AirwallexLocale = "zh" | "en" | "ru";

export async function initPayments(locale: AirwallexLocale) {
  await init({
    enabledElements: ["payments"],
    env: "demo",
    locale,
  });
}
