"use client";

import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { Button } from "@/components/ui/Button";
import { useChangePassword } from "@/hooks/useChangePassword";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email");
  const { setValue } = useChangePassword();

  if (!email) {
    return null;
  }

  const handleCodeVerified = (t: string) => {
    setValue({ token: t, email, action: "reset" });
    router.replace("/reset-password");
  };

  return (
    <VerificationCode email={email} onCodeChecked={handleCodeVerified}>
      <Divider flexItem className="my-3.5">
        {t("sign.or")}
      </Divider>
      <Button variant="outlined" onClick={() => router.replace("/signin")}>
        {t("sign.forgot.cancel")}
      </Button>
    </VerificationCode>
  );
}
