"use client";

import { VerificationCode } from "@/components/blocks/signin/VerificationCode";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { NameCard } from "./NameCard";
import { PasswordCard } from "./PasswordCard";

type Step = "name" | "password";

export default function SignupPage() {
  const search = useSearchParams();
  const email = search.get("email");
  const [step, setStep] = useState<Step | null>(null);

  if (!email) {
    return null;
  }

  if (step === "name") {
    return <NameCard onSwitch={() => setStep("password")} />;
  }

  if (step === "password") {
    return <PasswordCard email={email} />;
  }

  return (
    <VerificationCode
      email={email}
      onLogin={() => {
        setStep("name");
      }}
    />
  );
}
