"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { getAuthMethods } from "@/lib/apis/profile";
import { apiCodeUserNotFound, AuthMethod } from "@/lib/types/api";
import { Input } from "@mui-verse/ui/components/inputs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { OtpCard } from "./OtpCard";
import { PasswordCard } from "./PasswordCard";
import { Button } from "@/components/ui/Button";

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
    return <OtpCard email={email || ""} />;
  }

  if (method === "password") {
    return (
      <PasswordCard email={email || ""} onSwitch={() => setMethod("otp")} />
    );
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
        className="mt-4"
        disabled={!email}
        onClick={verifyEmail}
        loading={loading}
      >
        Next
      </Button>
    </SignCard>
  );
}
