import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { Divider } from "@mui/material";
import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnchorLink } from "./AnchorLink";

export function Footer() {
  const t = useTranslations();
  const hasAuthorization = useAuth.useHasAuthorization();

  return (
    <div className="w-full bg-white">
      <div className="w-landing-width mx-auto flex h-35 items-center">
        <Divider flexItem orientation="vertical" />
        <p className="ml-12.5 text-4xl font-medium">{t("footer.cta.title")}</p>
        <div className="flex-1" />
        <Button
          color="dark"
          className="mr-12.5 px-3 py-1.5"
          href={hasAuthorization ? "/chat" : "/signin"}
        >
          {t("footer.cta.action")}
        </Button>
        <Divider flexItem orientation="vertical" />
      </div>
      <Divider flexItem />
      <div className="w-landing-width mx-auto mt-15 mb-10 grid grid-cols-[5fr_3.5fr_3.5fr]">
        <div className="flex flex-col">
          <p className="text-base font-medium">Anna</p>
          <div className="mt-7.5 flex items-center gap-2">
            <MailIcon className="h-4 w-4" strokeWidth={"1.2"} />
            <span className="text-sm">developer@platomaster.com</span>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <AnchorLink href="/#product" className="text-sm">
            {t("nav.product")}
          </AnchorLink>
          <AnchorLink href="/#capabilities" className="text-sm">
            {t("nav.capabilities")}
          </AnchorLink>
          <AnchorLink href="/#faq" className="text-sm">
            {t("nav.faq")}
          </AnchorLink>
          <AnchorLink href="/pricing" className="text-sm">
            {t("nav.pricing")}
          </AnchorLink>
        </div>
        <div className="flex flex-col gap-5">
          <AnchorLink href="/privacy" className="text-sm">
            {t("footer.privacy")}
          </AnchorLink>
          <AnchorLink href="/tos" className="text-sm">
            {t("footer.tos")}
          </AnchorLink>
          <AnchorLink href="/refund" className="text-sm">
            {t("footer.refund")}
          </AnchorLink>
        </div>
      </div>
      <div className="w-landing-width mx-auto pb-7.5">
        <Divider flexItem />
        <p className="mt-5 text-sm">
          © 2026 Plato Master Technology Inc. All rights reserved
        </p>
      </div>
    </div>
  );
}
