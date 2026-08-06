"use client";

import { ChevronLeftIcon } from "@/components/icons";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function CheckoutLayout({
  plan,
  children,
}: {
  plan: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="h-full w-full">
      <div className="mx-auto mt-15 flex w-219.5 flex-col">
        <div
          className="flex cursor-pointer items-center gap-5"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
          <span className="text-2xl">{t("payment.checkout.title")}</span>
        </div>
        <div className="mt-10 flex w-full gap-10">
          <div className="flex-1">{children}</div>
          <div className="w-84.25">{plan}</div>
        </div>
      </div>
    </div>
  );
}
