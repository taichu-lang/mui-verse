import { init } from "@airwallex/components-sdk";

export async function initPayments() {
  await init({
    enabledElements: ["payments"],
    env: "demo",
    locale: "zh",
  });
}
