"use client";

import { useAuth } from "@/auth/auth";
import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const { email, setValue } = useChangePassword();
  const hasAuthorization = useAuth.useHasAuthorization();

  // This page is only opened from user profile page.
  if (!hasAuthorization) {
    return null;
  }

  if (!email) {
    return null;
  }

  const handleCodeVerified = (t: string) => {
    setValue({ token: t });
    router.replace("/reset-password");
  };

  return <VerificationCode email={email} onCodeChecked={handleCodeVerified} />;
}
