"use client";

import { useAuth } from "@/auth/auth";
import { checkOrder } from "@/lib/apis/order";
import { getUserProfile } from "@/lib/apis/profile";
import { OrderStatusEnum } from "@/lib/types/order";
import { SuccessPage, WaitPage } from "@mui-verse/payment/result";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutResultPage() {
  const router = useRouter();
  const search = useSearchParams();
  const orderID = search.get("order_id");
  const [orderStatus, setOrderStatus] = useState<OrderStatusEnum>("pending");

  useEffect(() => {
    if (!orderID) {
      return;
    }

    const abort = new AbortController();
    checkOrder(orderID, abort).then((status) => {
      if (status) {
        setOrderStatus(status);
      }
    });

    return () => {
      abort.abort();
    };
  }, [orderID]);

  if (!orderID) {
    return null;
  }

  const onPaymentSuccess = async () => {
    const { session } = useAuth.getState();
    if (session) {
      await getUserProfile();
    }

    router.replace("/chat");
  };

  switch (orderStatus) {
    case "pending":
      return <WaitPage />;

    case "failed":
      return null;

    case "success":
      return <SuccessPage onClick={onPaymentSuccess} />;
  }
}
