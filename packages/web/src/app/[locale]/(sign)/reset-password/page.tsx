"use client";

import { useAuth } from "@/auth/auth";
import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { useChangePassword } from "@/hooks/useChangePassword";
import { updatePassword } from "@/lib/apis/profile";
import { checkPassword } from "@/lib/schema";
import {
  FormError,
  FormInput,
  Input,
  InputControl,
  InputControlRef,
  InputLabel,
  InputRule,
} from "@mui-verse/ui/components/inputs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const t = useTranslations();
  const router = useRouter();
  const { token, action } = useChangePassword();

  const [password, setPassword] = useState<string>("");
  const [confirmed, setConfirmed] = useState<string>("");
  const [mismatch, setMismatch] = useState<boolean>(false);
  const passwordRef = useRef<InputControlRef>(null);

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setMismatch(false);
  };

  const handleSubmit = async () => {
    if (!passwordRef.current?.check()) {
      return;
    }

    const { logout } = useAuth.getState();

    try {
      const res = await updatePassword(password, token);
      if (res) {
        if (action === "reset") {
          await logout();
          router.replace("/signin");
        } else {
          router.replace("/chat");
        }
      } else {
        toast.error(t("error.system"));
      }
    } catch {
      toast.error(t("error.network"));
    }
  };

  return (
    <SignCard>
      <Title>
        {action === "add" ? t("sign.reset.add") : t("sign.reset.reset")}
      </Title>
      <InputControl
        className={"mt-7.5"}
        onValueChange={handlePasswordChange}
        ref={passwordRef}
      >
        <InputLabel>{t("sign.reset.label")}</InputLabel>
        <FormInput
          type="password"
          size="medium"
          placeholder={t("sign.reset.placeholder")}
        />
        <InputRule
          fn={(value) => checkPassword(value) !== "lengthRule"}
          visible="always"
          className="mt-3"
        >
          {t("sign.password.ruleLength")}
        </InputRule>
        <InputRule
          fn={(value) => checkPassword(value) !== "charRule"}
          visible="always"
        >
          {t("sign.password.ruleChar")}
        </InputRule>
      </InputControl>
      <InputLabel className="mt-3.5">{t("sign.reset.confirmLabel")}</InputLabel>
      <Input
        size="medium"
        placeholder={t("sign.reset.confirmPlaceholder")}
        type="password"
        onValueChange={setConfirmed}
        onBlur={() => {
          setMismatch(password !== confirmed);
        }}
        error={mismatch}
      />
      <FormError className="mt-3">
        {mismatch ? t("sign.reset.mismatch") : ""}
      </FormError>
      <Button
        className="mt-4"
        disabled={!password || password !== confirmed}
        onClick={handleSubmit}
      >
        {t("sign.reset.submit")}
      </Button>
    </SignCard>
  );
}
