"use client";

import { useAuth } from "@/auth/auth";
import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { updateUser } from "@/lib/apis/profile";
import { Input } from "@mui-verse/ui/components/inputs";
import { Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function NameCard({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const { session } = useAuth();
  const [name, setName] = useState<string | null>(null);

  if (!session) {
    return null;
  }

  const getStarted = async () => {
    if (!name) {
      return;
    }

    try {
      await updateUser(session.id, { name });
    } catch {
      toast.error("network error");
      return;
    }

    router.replace("/chat");
  };

  const createPassword = async () => {
    if (!name) {
      return;
    }

    try {
      await updateUser(session.id, { name });
    } catch {
      toast.error("network error");
      return;
    }

    onSwitch();
  };

  return (
    <SignCard>
      <Title>Your email has been verified</Title>
      <span className="mt-7.5 text-start text-base">User name</span>
      <Input
        placeholder="Enter your name"
        className="mt-2.5"
        size="medium"
        onValueChange={setName}
      />
      <Button className="mt-4" onClick={getStarted} disabled={!name}>
        Get started
      </Button>
      <Divider flexItem className="py-3.5">
        Or
      </Divider>
      <Button variant="outlined" onClick={createPassword} disabled={!name}>
        Create password
      </Button>
    </SignCard>
  );
}
