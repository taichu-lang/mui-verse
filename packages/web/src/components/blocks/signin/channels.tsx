"use client";

import { getAuthMethods } from "@/lib/apis/profile";
import { Input } from "@mui-verse/ui/components/inputs";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignCard } from "./SignCard";

export function SigninChannels() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const verifyEmail = async () => {
    if (!email || loading) {
      return;
    }

    setLoading(true);
    const methods = await getAuthMethods(email, () => {
      router.replace(`/signup?email=${email}`);
    });
    console.log(methods);
    setLoading(false);
  };

  return (
    <SignCard>
      <span className="mt-9 text-start text-base">
        Sign in or signup with email
      </span>
      <Input
        placeholder="Email address"
        size="medium"
        type="email"
        className="mt-2.5"
        onValueChange={setEmail}
      />
      <Button
        className="mt-4 py-2.5 text-base shadow-none"
        disabled={!email}
        onClick={verifyEmail}
        loading={loading}
      >
        Next
      </Button>
    </SignCard>
  );
}
