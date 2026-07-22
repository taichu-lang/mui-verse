export function stringifyDate(timestamp: number, locale: string): string {
  return new Date(timestamp * 1000).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
