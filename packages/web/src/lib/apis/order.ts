import { LOCALE_HEADER } from "@/lib/types/api";
import {
  Checkout,
  CheckoutRequest,
  CheckoutResponse,
  Order,
} from "@/lib/types/order";

export async function createOrder(
  request: CheckoutRequest,
  locale: string,
): Promise<Checkout | null> {
  const client = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", [LOCALE_HEADER]: locale },
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as CheckoutResponse;
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
    id: 1,
    order_id: "001",
    payment_id: "001",
    status: "pending",
    plan_code: "pro",
    plan_duration: "monthly",
    created_at: Date.now() / 1000,
    currency: "RUB",
    amount: 123,
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

export async function getOrders(
  from: number,
  limit: number,
  signal?: AbortSignal,
): Promise<Order[]> {
  const orders: Order[] = [];
  orders.push({
    id: from + 1,
    order_id: "001",
    plan_code: "pro",
    plan_duration: "monthly",
    currency: "RUB",
    amount: 123,
    status: "pending",
    created_at: Date.now() / 1000,
    payment_id: "001",
  });
  orders.push({
    id: from + 2,
    order_id: "001",
    plan_code: "pro",
    plan_duration: "monthly",
    currency: "RUB",
    amount: 233,
    status: "success",
    created_at: Date.now() / 1000,
    payment_id: "001",
  });
  orders.push({
    id: from + 3,
    order_id: "001",
    plan_code: "pro",
    plan_duration: "monthly",
    currency: "USD",
    amount: 12,
    status: "failed",
    created_at: Date.now() / 1000,
    payment_id: "001",
  });

  return orders;
}
