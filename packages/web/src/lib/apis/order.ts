import { LOCALE_HEADER } from "@/lib/types/api";
import {
  Checkout,
  CheckoutRequest,
  CheckoutResponse,
  Order,
  OrderPageResponse,
  OrderStatusEnum,
  OrderStatusResponse,
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
  if (response.code !== 0) {
    return null;
  }

  const order = response.data;
  if (!order.external) {
    return null;
  }

  return order;
}

async function getOrderStatus(
  orderID: string,
): Promise<OrderStatusEnum | null> {
  try {
    const client = await fetch(`/api/orders/status?order_id=${orderID}`, {
      method: "GET",
    });
    const response = (await client.json()) as OrderStatusResponse;
    if (response.code === 0) {
      return response.data.status;
    }

    return null;
  } catch {
    return null;
  }
}

export async function checkOrder(
  orderID: string,
  abort: AbortController,
): Promise<OrderStatusEnum | null> {
  if (abort.signal.aborted) {
    alert("abort");
    return null;
  }

  const status = await getOrderStatus(orderID);
  if (status !== "pending") {
    return status;
  }

  const interval = status ? 2000 : 5000;
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
  try {
    const client = await fetch(`/api/orders?from=${from}&limit=${limit}`, {
      method: "GET",
      signal,
    });
    const response = (await client.json()) as OrderPageResponse;
    if (response.code === 0) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}
