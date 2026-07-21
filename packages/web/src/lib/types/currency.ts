export type CurrencyCode = "RUB" | "USD";

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  RUB: "₽",
};

export function priceStringify(price: string, currency: CurrencyCode): string {
  switch (currency) {
    case "RUB":
      return `${price} ₽`;

    case "USD":
      return `$${price}`;

    default:
      return "";
  }
}
