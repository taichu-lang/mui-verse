"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { useSetPasswordContext } from "@/hooks/useSetPassword";
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
  const {
    value: { token, action, email },
  } = useSetPasswordContext();
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmed, setConfirmed] = useState<string>("");
  const [mismatch, setMismatch] = useState<boolean>(false);
  const passwordRef = useRef<InputControlRef>(null);
  const t = useTranslations();

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setMismatch(false);
  };

  const handleSubmit = async () => {
    if (!passwordRef.current?.check()) {
      return;
    }

    try {
      const res = await updatePassword(email, password, token);
      if (res) {
        if (action === "reset") {
          // TODO(Leo): logout
          router.replace("/signin");
        } else {
          router.replace("/chat");
        }
      } else {
        toast.error("system error");
      }
    } catch {
      toast.error("network error");
    }
  };

  return (
    <SignCard>
      <Title>{action === "add" ? "Add password" : "Reset password"}</Title>
      <InputControl
        className={"mt-7.5"}
        onValueChange={handlePasswordChange}
        ref={passwordRef}
      >
        <InputLabel>{"New Password"}</InputLabel>
        <FormInput
          type="password"
          size="medium"
          placeholder="Enter your password"
        />
        <InputRule
          fn={(value) => checkPassword(value) !== "lengthRule"}
          visible="always"
          className="mt-3"
        >
          {t(`sign.password.lengthRule`)}
        </InputRule>
        <InputRule
          fn={(value) => checkPassword(value) !== "charRule"}
          visible="always"
        >
          {t(`sign.password.charRule`)}
        </InputRule>
      </InputControl>
      <InputLabel className="mt-3.5">Confirm password</InputLabel>
      <Input
        size="medium"
        placeholder="Enter your password"
        type="password"
        onValueChange={setConfirmed}
        onBlur={() => {
          setMismatch(password !== confirmed);
        }}
        error={mismatch}
      />
      <FormError className="mt-3">
        {mismatch ? "Passwords do not match" : ""}
      </FormError>
      <Button
        className="mt-4"
        disabled={!password || password !== confirmed}
        onClick={handleSubmit}
      >
        Continue
      </Button>
    </SignCard>
  );
}
