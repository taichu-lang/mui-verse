"use client";

import { useRouter } from "next/navigation";
import { PasswordField } from "./PasswordField";
import { SignCard } from "./SignCard";
import { Title } from "./Title";
import { VerificationCode } from "./VerificationCode";

export function PasswordChannel({ email }: { email: string }) {
  return (
    <SignCard>
      <Title>{email}</Title>
      <PasswordField label="Password" className="mt-7.5" onChange={() => {}} />
    </SignCard>
  );
}

export function OtpChannel({ email }: { email: string }) {
  const router = useRouter();

  return (
    <VerificationCode email={email} onLogin={() => router.replace("/chat")} />
  );
}
