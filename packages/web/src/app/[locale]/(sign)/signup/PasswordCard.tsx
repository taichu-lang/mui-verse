"use client";

import { useAuth } from "@/auth/auth";
import { DefaultPasswordField } from "@/components/blocks/signin/PasswordField";
import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { updatePassword } from "@/lib/apis/profile";
import { InputControlRef } from "@mui-verse/ui/components/inputs";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export function PasswordCard({ email }: { email: string }) {
  const t = useTranslations();
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const [password, setPassword] = useState<string | null>(null);
  const passwordRef = useRef<InputControlRef>(null);

  if (!session) {
    return null;
  }

  const getStarted = async () => {
    if (!passwordRef.current?.check()) {
      return;
    }

    if (!password) {
      return;
    }

    try {
      await updatePassword(password, session.token);
      router.replace("/chat");
    } catch {
      toast.error(t("error.network"));
    }
  };

  return (
    <SignCard>
      <Title>{email}</Title>
      <DefaultPasswordField
        className="mt-5 mb-3.5"
        onChange={setPassword}
        ref={passwordRef}
      />
      <Button onClick={getStarted} disabled={!password}>
        {t("sign.signup.submit")}
      </Button>
    </SignCard>
  );
}
