"use client";

import {
  OtpChannel,
  PasswordChannel,
} from "@/components/blocks/signin/channels";
import { SignCard } from "@/components/blocks/signin/SignCard";
import { getAuthMethods } from "@/lib/apis/profile";
import { apiCodeUserNotFound, AuthMethod } from "@/lib/types/api";
import { Input } from "@mui-verse/ui/components/inputs";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<AuthMethod | null>(null);

  const verifyEmail = async () => {
    if (!email || loading) {
      return;
    }

    setLoading(true);
    try {
      const response = await getAuthMethods(email);
      if (response.code === apiCodeUserNotFound) {
        router.replace(`/signup?email=${email}`);
        return;
      }

      const methods = response.data;
      if (methods.includes("password")) {
        setMethod("password");
      } else {
        setMethod("otp");
      }
    } catch {
      toast.error("network error");
    } finally {
      setLoading(false);
    }
  };

  if (method === "otp") {
    return <OtpChannel email={email || ""} />;
  }

  if (method === "password") {
    return <PasswordChannel email={email || ""} />;
  }

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
