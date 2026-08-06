export type CurrencyCode = "RUB" | "USD";

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: "$",
  RUB: "₽",
};

function toFixedPricy(price: number): string {
  if (Number.isInteger(price)) {
    return price.toString();
  }

  // TODO(Leo): Number of digits should be based on currency.
  return price.toFixed(2);
}

export function stringifyPrice(price: number, currency: CurrencyCode): string {
  return `${currency} ${toFixedPricy(price)}`;
}

// stringifyPriceSymbol returns currency symbol with price formatted, e.g. "123 ₽".
// This function should only be used when a CurrencySelector is present in the
// viewport, which means that user understands which currency the symbol represents.
export function stringifyPriceSymbol(
  price: number,
  currency: CurrencyCode,
): string {
  const p = toFixedPricy(price);

  switch (currency) {
    case "RUB":
      return `${p} ₽`;

    case "USD":
      return `$${p}`;

    default:
      return "";
  }
}
