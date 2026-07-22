"use client";

import { checkOrder } from "@/lib/apis/order";
import { OrderStatus } from "@/lib/types/order";
import { SuccessPage, WaitPage } from "@mui-verse/payment/result";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutResultPage() {
  const search = useSearchParams();
  const orderID = search.get("order_id");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (!orderID) {
      return;
    }

    const abort = new AbortController();
    checkOrder(orderID, abort).then((order) => {
      if (order) {
        setOrderStatus(order.status);
      }
    });

    return () => {
      abort.abort();
    };
  }, [orderID]);

  if (!orderID) {
    return null;
  }

  switch (orderStatus) {
    case "pending":
      return <WaitPage />;

    case "failed":
      return null;

    case "success":
      return <SuccessPage />;
  }
}
