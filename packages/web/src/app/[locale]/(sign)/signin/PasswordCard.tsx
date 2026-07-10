"use client";

import { SignCard } from "@/components/blocks/signin/SignCard";
import { Title } from "@/components/blocks/signin/Title";
import { Button } from "@/components/ui/Button";
import { signinWithPassword } from "@/lib/apis/profile";
import { checkPassword } from "@/lib/schema";
import { apiCodeCredentialError } from "@/lib/types/api";
import {
  FormInput,
  InputControl,
  InputControlRef,
  InputLabel,
  InputRule,
} from "@mui-verse/ui/components/inputs";
import { Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ResetPassCard } from "./ResetPassCard";

export function PasswordCard({
  email,
  onSwitch,
}: {
  email: string;
  onSwitch: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [forgot, setForgot] = useState<boolean>(false);
  const passwordRef = useRef<InputControlRef>(null);

  const handleChange = (v: string) => {
    setPassword(v);
    if (error) {
      setError(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await signinWithPassword(email, password);
      switch (response.code) {
        case 0:
          router.replace("/chat");
          break;

        case apiCodeCredentialError:
          setError(true);
          passwordRef.current?.setError();
          break;

        default:
          toast.error("network error");
          break;
      }
    } catch {
      toast.error("network error");
    }
  };

  if (forgot) {
    return (
      <ResetPassCard email={email || ""} onBack={() => setForgot(false)} />
    );
  }

  return (
    <SignCard>
      <Title>{email}</Title>
      <InputControl
        ref={passwordRef}
        onValueChange={handleChange}
        className="mt-7.5"
      >
        <InputLabel>Password</InputLabel>
        <FormInput size="medium" type="password" />
        <div className="mt-3 flex">
          <InputRule fn={(v) => !error && checkPassword(v) === null}>
            Wrong password
          </InputRule>
          <div className="flex-1" />
          <div
            className="cursor-pointer text-sm underline"
            onClick={() => setForgot(true)}
          >
            Forgot password
          </div>
        </div>
      </InputControl>
      <Button className="mt-3.5" disabled={!password} onClick={handleSubmit}>
        Continue
      </Button>
      <Divider flexItem className="my-3.5">
        Or
      </Divider>
      <Button variant="outlined" onClick={onSwitch}>
        Sign in with a one-time code
      </Button>
    </SignCard>
  );
}
