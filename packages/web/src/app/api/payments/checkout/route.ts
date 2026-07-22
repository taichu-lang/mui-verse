"server-only";

import { getAuthSession, getDomain } from "@/lib/cookie";
import { logger } from "@/lib/logger";
import { LOCALE_HEADER } from "@/lib/types/api";
import { OrderRequest } from "@/lib/types/order";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const domain = await getDomain();
  if (!domain) {
    return NextResponse.error();
  }

  // We can not get locale using `getLocale()` from next-intl/server package,
  // as the `/api` router has been excluded in proxy.ts.
  const locale = request.headers.get(LOCALE_HEADER) ?? "en";
  const return_url = `https://${domain}/${locale}/checkout/result`;
  const body = (await request.json()) as OrderRequest;
  logger.debug({ return: return_url, body: body }, "create order");

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({
      ...body,
      return_url,
    }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    logger.error({ error: text }, "failed to create order.");
    return NextResponse.error();
  }

  return NextResponse.json(await response.json());
}
