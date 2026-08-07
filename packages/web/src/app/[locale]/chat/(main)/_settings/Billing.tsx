import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { getOrders } from "@/lib/apis/order";
import { stringifyDate } from "@/lib/time";
import { stringifyPrice } from "@/lib/types/currency";
import { Order } from "@/lib/types/order";
import { Subscription } from "@/lib/types/profile";
import { InfiniteScrollView } from "@mui-verse/ui/components/data";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { cn } from "@mui-verse/ui/utils/cn";
import { useLocale, useTranslations } from "next-intl";
import { DataSeparator } from "./DataList";

function ProPlan({ subscription }: { subscription: Subscription }) {
  const t = useTranslations();
  const locale = useLocale();

  const duration =
    subscription.period === "monthly"
      ? t("duration.oneMonth")
      : t("duration.oneYear");

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <span className="text-lg">{t(`plans.pro.plan`)}</span>
        <span className="text-xs">{duration}</span>
        <span className="text-text-secondary text-xs">
          {t("duration.expires")}
          {": "}
          {stringifyDate(subscription.expires_at, locale)}
        </span>
      </div>
      <div className="flex-1" />
      <Button size="small" className="py-2" href="/checkout">
        {t("plans.pro.upgrade")}
      </Button>
    </>
  );
}

function FreePlan() {
  const t = useTranslations();

  return (
    <>
      <span className="text-lg">{t("plans.free.plan")}</span>
      <div className="flex-1" />
      <Button size="small" className="py-2" href="/checkout">
        {t("plans.free.upgrade")}
      </Button>
    </>
  );
}

function OrderListView() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="mt-5">
      <InfiniteScrollView<Order>
        limit={10}
        className="max-h-80"
        sections={[
          {
            key: "order",
            getItemKey: (item) => item.id.toString(),
            fetch: async ({ after, limit, signal }) => {
              const from = after ? Number(after) : 0;
              return await getOrders(from, limit, signal);
            },
          },
        ]}
        renderItem={(item) => {
          return (
            <div className="mb-3.5 grid grid-cols-7">
              <span className="col-span-3 text-start text-sm">
                {stringifyDate(item.created_at, locale)}
              </span>
              <span className="text-text-secondary col-span-2 text-start text-sm">
                {stringifyPrice(item.amount, item.currency)}
              </span>
              <div className="col-span-2 flex justify-end">
                <span
                  className={cn("w-fit rounded-md px-2.5 py-px text-xs", {
                    "shadow-(--mui-shadow-border)":
                      item.status === "success" || item.status === "pending",
                    "bg-action-hover": item.status === "failed",
                  })}
                >
                  {t(`payment.billing.${item.status}`)}
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export function Billing() {
  const t = useTranslations();
  const { session } = useAuth();
  if (!session) {
    return null;
  }

  const subscription = session.subscription;

  return (
    <TabMenuPanel value="billing">
      <div className="my-1.75 flex items-center">
        {subscription.plan_code === "pro" ? (
          <ProPlan subscription={subscription} />
        ) : (
          <FreePlan />
        )}
      </div>
      <DataSeparator />
      <p className="mt-1.75 text-lg">{t("settings.billing.history")}</p>
      <OrderListView />
    </TabMenuPanel>
  );
}
