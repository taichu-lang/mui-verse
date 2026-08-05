"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function ResetPassCard({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const t = useTranslations();
  const router = useRouter();

  const redirect = () => {
    router.push(`/forgot-password?email=${email}`);
  };

  return (
    <SignCard>
      <Title>{t("sign.forgot.title")}</Title>
      <span className="mt-9 text-center text-sm">
        {t("sign.forgot.tips", { email })}
      </span>
      <Button className="mt-7.5" onClick={redirect}>
        {t("sign.forgot.submit")}
      </Button>
      <div
        className="mt-7.5 cursor-pointer text-center text-sm underline"
        onClick={onBack}
      >
        {t("sign.forgot.back")}
      </div>
    </SignCard>
  );
}
