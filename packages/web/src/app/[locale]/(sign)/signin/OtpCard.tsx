"use client";

import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { useRouter } from "next/navigation";

export function OtpCard({ email }: { email: string }) {
  const router = useRouter();

  return (
    <VerificationCode email={email} onLogin={() => router.replace("/chat")} />
  );
}
