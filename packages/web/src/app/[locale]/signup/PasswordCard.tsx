"use client";

import { useAuth } from "@/auth/auth";
import {
  PasswordField,
  type PasswordFieldRef,
} from "@/components/blocks/signin/PasswordField";
import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { updateUser } from "@/lib/apis/profile";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export function PasswordCard({ email }: { email: string }) {
  const router = useRouter();
  const { session } = useAuth();
  const [password, setPassword] = useState<string | null>(null);
  const passwordRef = useRef<PasswordFieldRef>(null);

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
      await updateUser(session.id, { password });
      router.replace("/chat");
    } catch {
      toast.error("network error");
    }
  };

  return (
    <SignCard>
      <Title>{email}</Title>
      <PasswordField
        label="Password"
        enableRules
        className="mt-5 mb-3.5"
        onChange={setPassword}
        ref={passwordRef}
      />
      <Button
        className="py-2.5 text-base"
        onClick={getStarted}
        disabled={!password}
      >
        Get started
      </Button>
    </SignCard>
  );
}
