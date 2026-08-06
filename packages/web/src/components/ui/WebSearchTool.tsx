import { useAuth } from "@/auth/auth";
import { CheckIcon, QuestionCircleIcon } from "@/components/icons";
import { useBenefit } from "@/hooks/useBenefit";
import { stringifyPrice } from "@/lib/types/currency";
import {
  Dialog,
  DialogProvider,
  DialogTrigger,
} from "@mui-verse/ui/components/feedback";
import { Switch } from "@mui-verse/ui/components/inputs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { DialogContent } from "@mui/material";
import { GlobeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "./Button";

function WhyWebSearch() {
  const t = useTranslations();

  return (
    <Popover align="center" side="top">
      <PopoverTrigger>
        <div className="mt-2.5 flex items-center gap-2 text-sm">
          {t("landing.faq.search.q")}
          <QuestionCircleIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent sx={{ maxWidth: "sm", px: "18px", py: "20px" }}>
        <span className="text-sm whitespace-pre-line">
          {t("landing.faq.search.a")}
        </span>
      </PopoverContent>
    </Popover>
  );
}

function UpgradeCard() {
  const currency = "RUB";
  const t = useTranslations();
  const { discountPercent, monthPrice, yearPrice } = useBenefit();
  const discount = discountPercent(currency);
  const month = monthPrice(currency);
  const year = yearPrice(currency);

  const benefits: string[] = ["realtime", "accuracy", "source", "knowledge"];

  return (
    <div className="flex w-fit flex-col items-center bg-linear-to-b from-[#F2FFFB] to-white px-7.5 pt-9.5 pb-5">
      {/* The width of Card would be same as the benefits, not the title. Use `w-0` to ensure */}
      {/*`w-fit` worked in the Card.*/}
      <p className="w-0 min-w-full text-center text-xl font-medium wrap-break-word">
        {t("chat.search.title")}
      </p>
      <p className="mt-6 text-base">
        {t("chat.textarea.upgradeTip", { discount })}
      </p>
      <div className="mt-3 flex items-baseline gap-4.5">
        <p className="text-primary-500">
          <span className="text-2xl font-semibold">
            {stringifyPrice(year / 12, currency)}
          </span>
          <span className="text-sm">/{t("duration.month")}</span>
        </p>
        <p className="text-text-secondary text-sm font-semibold line-through">
          {stringifyPrice(month, currency)}/{t("duration.month")}
        </p>
      </div>
      <div className="mt-3.5 flex flex-col gap-3 rounded-[18px] bg-[#E6FCF4] px-7.5 py-4.5">
        {benefits.map((benefit) => (
          <div className="flex items-center" key={benefit}>
            {<CheckIcon className="text-primary-500" />}
            <span className="ml-2.5 text-sm">
              {t(`chat.search.${benefit}`)}
            </span>
          </div>
        ))}
      </div>
      <WhyWebSearch />
      <Button
        variant="contained"
        size="small"
        className="mt-3.5 font-semibold"
        fullWidth
      >
        {t("chat.textarea.upgradeBtn")}
      </Button>
      <Link
        href={"/pricing#features"}
        className="text-primary-500 mt-3.5 font-semibold"
      >
        {t("chat.textarea.planLink")}
      </Link>
    </div>
  );
}

export function WebSearchTool({
  defaultChecked = false,
  onSwitch,
}: {
  defaultChecked?: boolean;
  onSwitch: (checked: boolean) => void;
}) {
  const t = useTranslations();
  const { session } = useAuth();
  const freePlan = session?.subscription.plan_code === "free";

  return (
    <div className="flex items-center">
      <GlobeIcon className="text-primary-500 h-4 w-4" />
      <span className="text-text-secondary mr-2 ml-1.5 text-sm">
        {t("chat.textarea.search")}
      </span>
      {freePlan ? (
        <DialogProvider>
          <DialogTrigger>
            <Switch variant="inset" />
          </DialogTrigger>
          <Dialog maxWidth="md" fullWidth={false} sx={{ width: "fit-content" }}>
            <DialogContent className="p-0">
              <UpgradeCard />
            </DialogContent>
          </Dialog>
        </DialogProvider>
      ) : (
        <Switch variant="inset" onChange={onSwitch} checked={defaultChecked} />
      )}
    </div>
  );
}
