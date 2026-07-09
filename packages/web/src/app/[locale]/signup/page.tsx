"use client";

import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const search = useSearchParams();
  const email = search.get("email");
  if (!email) {
    return null;
  }

  return (
    <VerificationCode
      email={email}
      onLogin={() => {
        router.replace("/");
      }}
    />
  );
}
