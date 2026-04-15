import { init } from "@airwallex/components-sdk";

export async function initPayments(locale: "zh" | "en" | "ru") {
  await init({
    enabledElements: ["payments"],
    env: "demo",
    locale,
  });
}
