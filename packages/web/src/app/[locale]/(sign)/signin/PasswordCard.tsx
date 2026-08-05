"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { signinWithPassword } from "@/lib/apis/profile";
import { checkPassword } from "@/lib/schema";
import { apiCodeCredentialError } from "@/lib/types/api";
import {
  FormInput,
  InputControl,
  InputControlRef,
  InputLabel,
  InputRule,
} from "@mui-verse/ui/components/inputs";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ResetPassCard } from "./ResetPassCard";

export function PasswordCard({
  email,
  onSwitch,
}: {
  email: string;
  onSwitch: () => void;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [forgot, setForgot] = useState<boolean>(false);
  const passwordRef = useRef<InputControlRef>(null);

  const handleChange = (v: string) => {
    setPassword(v);
    if (error) {
      setError(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await signinWithPassword(email, password);
      switch (response.code) {
        case 0:
          router.replace("/chat");
          break;

        case apiCodeCredentialError:
          setError(true);
          passwordRef.current?.setError();
          break;

        default:
          toast.error(t("error.system"));
          break;
      }
    } catch {
      toast.error(t("error.network"));
    }
  };

  if (forgot) {
    return (
      <ResetPassCard email={email || ""} onBack={() => setForgot(false)} />
    );
  }

  return (
    <SignCard>
      <Title>{email}</Title>
      <InputControl
        ref={passwordRef}
        onValueChange={handleChange}
        className="mt-7.5"
      >
        <InputLabel>{t("sign.password.label")}</InputLabel>
        <FormInput size="medium" type="password" />
        <div className="mt-3 flex">
          <InputRule fn={(v) => !error && checkPassword(v) === null}>
            {t("sign.password.wrong")}
          </InputRule>
          <div className="flex-1" />
          <div
            className="cursor-pointer text-sm underline"
            onClick={() => setForgot(true)}
          >
            {t("sign.forgot.link")}
          </div>
        </div>
      </InputControl>
      <Button className="mt-3.5" disabled={!password} onClick={handleSubmit}>
        {t("sign.password.submit")}
      </Button>
      <Divider flexItem className="my-3.5">
        {t("sign.or")}
      </Divider>
      <Button variant="outlined" onClick={onSwitch}>
        {t("sign.password.otp")}
      </Button>
    </SignCard>
  );
}
