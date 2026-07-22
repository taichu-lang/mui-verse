import { LOCALE_HEADER } from "@/lib/types/api";
import { Order, OrderRequest, OrderResponse } from "@/lib/types/order";

export async function createOrder(
  request: OrderRequest,
  locale: string,
): Promise<Order | null> {
  const client = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", [LOCALE_HEADER]: locale },
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as OrderResponse;
  // if (response.code !== 0) {
  //   return null;
  // }

  // const order = response.data;
  // if (!order.external) {
  //   return null;
  // }

  return {
    order_id: "001",
    payment_id: "001",
    type: "external",
    external: {
      checkout_url: "https://example.com/checkout",
    },
    period_start: Date.now() / 1000,
    period_end: Date.now() / 1000 + 3600000,
    status: "pending",
  };
}

export async function getOrder(orderID: string): Promise<Order | null> {
  return {
    order_id: "001",
    payment_id: "001",
    type: "external",
    external: {
      checkout_url: "https://example.com/checkout",
    },
    period_start: Date.now() / 1000,
    period_end: Date.now() / 1000 + 3600,
    status: "pending",
  };
}

export async function checkOrder(
  orderID: string,
  abort: AbortController,
): Promise<Order | null> {
  if (abort.signal.aborted) {
    alert("abort");
    return null;
  }

  console.log("check order >>>>");

  const order = await getOrder(orderID);
  if (order && order.status !== "pending") {
    return order;
  }

  const interval = order ? 2000 : 5000;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, interval);
    abort.signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });

  return checkOrder(orderID, abort);
}
